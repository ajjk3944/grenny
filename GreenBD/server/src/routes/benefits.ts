import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { totalPoints: true, grade: true },
    });

    const benefits = await prisma.benefit.findMany({
      where: { active: true },
      orderBy: { points: 'asc' },
    });

    const enrichedBenefits = benefits.map(benefit => ({
      ...benefit,
      canRedeem: (user?.totalPoints || 0) >= benefit.points && isGradeEligible(user?.grade || 'D', benefit.minGrade),
    }));

    res.json(enrichedBenefits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch benefits' });
  }
});

router.post('/redeem/:id', async (req: AuthRequest, res) => {
  try {
    const benefit = await prisma.benefit.findUnique({
      where: { id: req.params.id },
    });

    if (!benefit || !benefit.active) {
      return res.status(404).json({ error: 'Benefit not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { totalPoints: true, grade: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.totalPoints < benefit.points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    if (!isGradeEligible(user.grade, benefit.minGrade)) {
      return res.status(400).json({ error: 'Grade requirement not met' });
    }

    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: {
          userId: req.user!.id,
          benefitId: benefit.id,
          status: 'PENDING',
        },
      }),
      prisma.user.update({
        where: { id: req.user!.id },
        data: { totalPoints: { decrement: benefit.points } },
      }),
      prisma.pointsHistory.create({
        data: {
          userId: req.user!.id,
          points: -benefit.points,
          reason: `Redeemed: ${benefit.titleEn}`,
        },
      }),
    ]);

    res.json({ redemption, message: 'Benefit redeemed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to redeem benefit' });
  }
});

const isGradeEligible = (userGrade: string, minGrade: string): boolean => {
  const grades = ['D', 'C', 'B', 'A', 'A+'];
  const userIndex = grades.indexOf(userGrade);
  const minIndex = grades.indexOf(minGrade);
  return userIndex >= minIndex;
};

export default router;
