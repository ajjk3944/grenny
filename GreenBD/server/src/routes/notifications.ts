import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { recipientType: 'ALL_USERS' },
          { recipientIds: { has: req.user!.id } },
        ],
      },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
