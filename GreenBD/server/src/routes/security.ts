import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireSecurity } from '../middleware/roleGuard';
import { prisma } from '../utils/prisma';
import { updateUserPoints } from '../services/points';

const router = Router();

router.use(authenticate);
router.use(requireSecurity);

router.get('/review-queue', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { assignedArea: true },
    });

    const where: any = {
      OR: [
        { aiStatus: 'FLAGGED' },
        { aiStatus: 'PENDING' },
      ],
    };

    if (user?.assignedArea) {
      where.address = { contains: user.assignedArea };
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, phone: true, district: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
});

router.put('/review/:id', async (req: AuthRequest, res) => {
  try {
    const { manualStatus, manualReason, points, bonusPoints } = req.body;

    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const updated = await prisma.submission.update({
      where: { id: req.params.id },
      data: {
        manualStatus,
        manualReason,
        manualReviewerId: req.user!.id,
        manualReviewedAt: new Date(),
        points: points || submission.points,
        bonusPoints: bonusPoints || submission.bonusPoints,
      },
    });

    if (manualStatus === 'VERIFIED') {
      const totalPoints = (points || submission.points) + (bonusPoints || submission.bonusPoints);
      await updateUserPoints(
        submission.userId,
        totalPoints,
        `Manual verification: ${submission.category}`,
        submission.id
      );
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

router.get('/users', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { assignedArea: true },
    });

    const where: any = { role: 'USER' };

    if (user?.assignedArea) {
      where.district = user.assignedArea;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        district: true,
        totalPoints: true,
        grade: true,
        redMarked: true,
        createdAt: true,
      },
      orderBy: { totalPoints: 'desc' },
      take: 100,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/messages', async (req: AuthRequest, res) => {
  try {
    const { subject, body, type, linkedSubmissionId } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        subject,
        body,
        type,
        linkedSubmissionId,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.get('/messages', async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { senderId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/tasks', async (req: AuthRequest, res) => {
  try {
    res.json({ message: 'Task creation not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
