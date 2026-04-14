import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { scope = 'national', period = 'monthly', district } = req.query;

    let startDate = new Date();
    if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const whereClause: any = {};
    if (scope === 'district' && district) {
      whereClause.district = district;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        avatar: true,
        totalPoints: true,
        grade: true,
        district: true,
        pointsHistory: {
          where: { createdAt: { gte: startDate } },
          select: { points: true },
        },
      },
      orderBy: { totalPoints: 'desc' },
      take: 100,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      points: user.pointsHistory.reduce((sum, h) => sum + h.points, 0),
      totalPoints: user.totalPoints,
      grade: user.grade,
      district: user.district,
      isCurrentUser: user.id === req.user!.id,
    }));

    const currentUserRank = leaderboard.findIndex(u => u.isCurrentUser) + 1;

    res.json({
      leaderboard,
      currentUserRank: currentUserRank || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
