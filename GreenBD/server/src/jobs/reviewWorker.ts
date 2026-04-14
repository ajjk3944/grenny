import Queue from 'bull';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { analyzeImage } from '../services/aiReview';
import { calculatePoints, updateUserPoints } from '../services/points';
import { sendPushNotification } from '../services/notification';
import { imageHash } from 'imghash';

export const reviewQueue = new Queue('submission-review', config.redis.url);

interface ReviewJob {
  submissionId: string;
  imageUrl: string;
  category: string;
  latitude: number;
  longitude: number;
  userId: string;
}

reviewQueue.process(async (job) => {
  const { submissionId, imageUrl, category, latitude, longitude, userId } = job.data as ReviewJob;

  try {
    console.log(`Processing review for submission ${submissionId}`);

    const aiResult = await analyzeImage(imageUrl, category, latitude, longitude, userId);

    const hash = await imageHash(imageUrl, 16, 'hex');

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiStatus: aiResult.status,
        aiConfidence: aiResult.confidence,
        aiDetails: aiResult.details,
        aiReviewedAt: new Date(),
        imageHash: hash,
      },
    });

    if (aiResult.status === 'VERIFIED') {
      const pointsCalc = await calculatePoints(userId, category, latitude, longitude);

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          points: pointsCalc.basePoints,
          bonusPoints: pointsCalc.bonusPoints,
        },
      });

      await updateUserPoints(
        userId,
        pointsCalc.total,
        `Verified submission: ${category}`,
        submissionId
      );

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastActive: true, streak: true },
      });

      if (user) {
        const today = new Date();
        const lastActive = user.lastActive ? new Date(user.lastActive) : null;
        const daysSinceActive = lastActive
          ? Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        let newStreak = user.streak;
        if (daysSinceActive === 1) {
          newStreak += 1;
        } else if (daysSinceActive > 1) {
          newStreak = 1;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            lastActive: today,
            streak: newStreak,
          },
        });
      }

      console.log(`Submission ${submissionId} verified. Awarded ${pointsCalc.total} points.`);
    } else if (aiResult.status === 'REJECTED') {
      console.log(`Submission ${submissionId} rejected. Reason: ${aiResult.details}`);
    } else {
      console.log(`Submission ${submissionId} flagged for manual review.`);
    }

    return { success: true, status: aiResult.status };
  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error);
    
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiStatus: 'FLAGGED',
        aiDetails: 'Error during processing',
      },
    });

    throw error;
  }
});

reviewQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

reviewQueue.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export const addReviewJob = async (data: ReviewJob): Promise<void> => {
  await reviewQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
};
