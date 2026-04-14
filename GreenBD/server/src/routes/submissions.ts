import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { submissionRateLimit } from '../middleware/rateLimit';
import { prisma } from '../utils/prisma';
import { uploadImage, uploadVideo } from '../services/media';
import { addReviewJob } from '../jobs/reviewWorker';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.submission.count({
      where: { userId: req.user!.id },
    });

    res.json({
      submissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.post('/', submissionRateLimit, upload.array('media', 5), async (req: AuthRequest, res) => {
  try {
    const { category, summary, latitude, longitude, address, mediaType } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No media files provided' });
    }

    const uploadPromises = files.map(file =>
      mediaType === 'VIDEO' ? uploadVideo(file.buffer, req.user!.id) : uploadImage(file.buffer, req.user!.id)
    );

    const uploadResults = await Promise.all(uploadPromises);

    const mediaUrls = uploadResults.map(r => r.originalUrl);
    const thumbnailUrls = uploadResults.map(r => r.thumbnailUrl);

    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.id,
        mediaUrls,
        thumbnailUrls,
        mediaType,
        category,
        summary,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        metadata: JSON.stringify({
          dimensions: uploadResults.map(r => ({ width: r.width, height: r.height })),
          formats: uploadResults.map(r => r.format),
          sizes: uploadResults.map(r => r.size),
        }),
      },
    });

    await addReviewJob({
      submissionId: submission.id,
      imageUrl: mediaUrls[0],
      category,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      userId: req.user!.id,
    });

    res.status(201).json({
      submission,
      message: 'Submission created and queued for review',
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.userId !== req.user!.id && req.user!.role === 'USER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

export default router;
