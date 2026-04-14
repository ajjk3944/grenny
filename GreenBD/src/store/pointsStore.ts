import { create } from 'zustand';
import { Activity } from '../types';

export interface PointsHistory {
  date: string;
  points: number;
}

export interface UserStats {
  treesPlanted: number;
  cleanups: number;
  totalActivities: number;
}

export interface UserRank {
  district: number;
  national: number;
}

interface PointsStore {
  activities: Activity[];
  totalPoints: number;
  todayPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  yearlyPoints: number;
  grade: string;
  gradeProgress: number;
  streak: number;
  rank: UserRank;
  stats: UserStats;
  pointsHistory: PointsHistory[];
  loading: boolean;
  
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  setActivities: (activities: Activity[]) => void;
  fetchPoints: () => Promise<void>;
  setPointsData: (data: Partial<PointsStore>) => void;
}

const calculateGrade = (monthlyPoints: number): string => {
  if (monthlyPoints >= 500) return 'A+';
  if (monthlyPoints >= 350) return 'A';
  if (monthlyPoints >= 200) return 'B+';
  if (monthlyPoints >= 100) return 'B';
  if (monthlyPoints >= 50) return 'C';
  return 'D';
};

const calculateGradeProgress = (monthlyPoints: number): number => {
  const thresholds = [0, 50, 100, 200, 350, 500];
  const currentGradeIndex = thresholds.findIndex((t, i) => 
    monthlyPoints >= t && (i === thresholds.length - 1 || monthlyPoints < thresholds[i + 1])
  );
  
  if (currentGradeIndex === thresholds.length - 1) return 100;
  
  const currentThreshold = thresholds[currentGradeIndex];
  const nextThreshold = thresholds[currentGradeIndex + 1];
  const progress = ((monthlyPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
  return Math.min(100, Math.max(0, progress));
};

export const usePointsStore = create<PointsStore>((set) => ({
  activities: [],
  totalPoints: 0,
  todayPoints: 0,
  weeklyPoints: 0,
  monthlyPoints: 0,
  yearlyPoints: 0,
  grade: 'D',
  gradeProgress: 0,
  streak: 0,
  rank: { district: 0, national: 0 },
  stats: { treesPlanted: 0, cleanups: 0, totalActivities: 0 },
  pointsHistory: [],
  loading: false,

  addActivity: (activity: Activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
      totalPoints: state.totalPoints + activity.points,
    })),

  updateActivity: (id: string, updates: Partial<Activity>) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  setActivities: (activities: Activity[]) =>
    set({
      activities,
      totalPoints: activities.reduce((sum, a) => sum + a.points, 0),
    }),

  fetchPoints: async () => {
    set({ loading: true });
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const monthlyPoints = 450;
      const grade = calculateGrade(monthlyPoints);
      const gradeProgress = calculateGradeProgress(monthlyPoints);
      
      set({
        totalPoints: 2450,
        todayPoints: 45,
        weeklyPoints: 320,
        monthlyPoints,
        yearlyPoints: 2450,
        grade,
        gradeProgress,
        streak: 15,
        rank: { district: 12, national: 245 },
        stats: { treesPlanted: 23, cleanups: 18, totalActivities: 47 },
        pointsHistory: generateMockHistory(),
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  setPointsData: (data) => set(data),
}));

const generateMockHistory = (): PointsHistory[] => {
  const history: PointsHistory[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      points: Math.floor(Math.random() * 100) + 20,
    });
  }
  
  return history;
};
