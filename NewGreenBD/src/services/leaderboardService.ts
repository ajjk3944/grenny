import { LeaderboardUser } from '../types';

const bangladeshiNames = [
  'আব্দুল করিম', 'ফাতিমা খাতুন', 'মোহাম্মদ রহিম', 'সালমা বেগম', 'রফিকুল ইসলাম',
  'নাসরিন আক্তার', 'কামাল হোসেন', 'রোকেয়া সুলতানা', 'জাহিদ হাসান', 'শাহনাজ পারভীন',
  'আমিনুল ইসলাম', 'তাসলিমা নাসরিন', 'মাহমুদুল হক', 'রুমানা আহমেদ', 'সাইফুল ইসলাম',
  'নাজমা খাতুন', 'রাশেদুল করিম', 'সুমাইয়া আক্তার', 'তানভীর আহমেদ', 'শিরিন সুলতানা',
];

const grades = ['A+', 'A', 'B+', 'B', 'C', 'D'];

const generateMockLeaderboard = (count: number): LeaderboardUser[] => {
  const users: LeaderboardUser[] = [];
  
  for (let i = 0; i < count; i++) {
    const points = Math.floor(Math.random() * 5000) + 500 - (i * 50);
    const gradeIndex = Math.min(Math.floor(points / 500), grades.length - 1);
    
    users.push({
      id: `user_${i}`,
      name: bangladeshiNames[i % bangladeshiNames.length],
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      points: Math.max(100, points),
      grade: grades[gradeIndex],
      rank: i + 1,
    });
  }
  
  return users.sort((a, b) => b.points - a.points).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

const mockLeaderboard = generateMockLeaderboard(50);

export const leaderboardService = {
  getLeaderboard: async (
    scope: 'ward' | 'upazila' | 'district' | 'division' | 'national',
    timeFilter: 'weekly' | 'monthly' | 'all_time'
  ): Promise<LeaderboardUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockLeaderboard;
  },

  getCurrentUserRank: async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 42;
  },
};
