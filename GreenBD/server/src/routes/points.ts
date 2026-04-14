import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.use(authenticate);

router.get('/summary', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        totalPoints: true,
        grade: true,
        streak: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPoints = await prisma.pointsHistory.aggregate({
      where: {
        userId: req.user!.id,
        createdAt: { gte: today },
      },
      _sum: { points: true },
    });

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const weekPoints = await prisma.pointsHistory.aggregate({
      where: {
        userId: req.user!.id,
        createdAt: { gte: thisWeek },
      },
      _sum: { points: true },
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthPoints = await prisma.pointsHistory.aggregate({
      where: {
        userId: req.user!.id,
        createdAt: { gte: thisMonth },
      },
      _sum: { points: true },
    });

    res.json({
      total: user?.totalPoints || 0,
      grade: user?.grade || 'D',
      streak: user?.streak || 0,
      today: todayPoints._sum.points || 0,
      week: weekPoints._sum.points || 0,
      month: monthPoints._sum.points || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch points summary' });
  }
});

router.get('/history', async (req: AuthRequest, res) => {
  try {
    const { period = 'week' } = req.query;

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const history = await prisma.pointsHistory.findMany({
      where: {
        userId: req.user!.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, number> = {};

    history.forEach(entry => {
      const date = entry.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + entry.points;
    });

    const chartData = Object.entries(grouped).map(([date, points]) => ({
      date,
      points,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch points history' });
  }
});

export default router;
