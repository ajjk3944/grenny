import { prisma } from '../utils/prisma';

export interface PointsCalculation {
  basePoints: number;
  bonusPoints: number;
  total: number;
  breakdown: string[];
}

export const calculatePoints = async (
  userId: string,
  categoryName: string,
  latitude: number,
  longitude: number
): Promise<PointsCalculation> => {
  const breakdown: string[] = [];

  const category = await prisma.activityCategory.findFirst({
    where: { nameEn: categoryName, active: true },
  });

  if (!category) {
    return { basePoints: 0, bonusPoints: 0, total: 0, breakdown: ['Invalid category'] };
  }

  let basePoints = category.basePoints;
  let bonusPoints = 0;

  breakdown.push(`Base points for ${categoryName}: ${basePoints}`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActive: true },
  });

  if (user) {
    const today = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const daysSinceActive = lastActive
      ? Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    let streakMultiplier = 1;

    if (daysSinceActive <= 1) {
      if (user.streak >= 30) {
        streakMultiplier = 2;
        breakdown.push('30-day streak bonus: 2x multiplier');
      } else if (user.streak >= 7) {
        streakMultiplier = 1.5;
        breakdown.push('7-day streak bonus: 1.5x multiplier');
      }
    }

    basePoints = Math.floor(basePoints * streakMultiplier);
  }

  const recentSubmissions = await prisma.submission.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      aiStatus: 'VERIFIED',
    },
  });

  if (recentSubmissions.length >= 3) {
    bonusPoints += 50;
    breakdown.push('Multiple submissions today: +50 bonus');
  }

  const isDesignatedZone = await checkDesignatedZone(latitude, longitude);
  if (isDesignatedZone) {
    bonusPoints += 30;
    breakdown.push('Designated environmental zone: +30 bonus');
  }

  const total = basePoints + bonusPoints;

  return { basePoints, bonusPoints, total, breakdown };
};

const checkDesignatedZone = async (
  latitude: number,
  longitude: number
): Promise<boolean> => {
  const designatedZones = [
    { lat: 23.8103, lon: 90.4125, radius: 5000 },
    { lat: 22.3569, lon: 91.7832, radius: 5000 },
  ];

  for (const zone of designatedZones) {
    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      zone.lat,
      zone.lon
    );
    if (distance <= zone.radius) {
      return true;
    }
  }

  return false;
};

const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const updateUserPoints = async (
  userId: string,
  points: number,
  reason: string,
  submissionId?: string
): Promise<void> => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: points },
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId,
        points,
        reason,
        submissionId,
      },
    }),
  ]);

  await updateUserGrade(userId);
};

const updateUserGrade = async (userId: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPoints: true },
  });

  if (!user) return;

  let grade = 'D';
  if (user.totalPoints >= 10000) grade = 'A+';
  else if (user.totalPoints >= 5000) grade = 'A';
  else if (user.totalPoints >= 2500) grade = 'B';
  else if (user.totalPoints >= 1000) grade = 'C';

  await prisma.user.update({
    where: { id: userId },
    data: { grade },
  });
};
