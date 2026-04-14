// Mock data for dashboard
export const mockLeaderboardUsers = [
  {
    id: '1',
    name: 'রহিম আহমেদ',
    avatar: undefined,
    points: 3250,
    grade: 'A+',
  },
  {
    id: '2',
    name: 'করিম হোসেন',
    avatar: undefined,
    points: 2890,
    grade: 'A',
  },
  {
    id: '3',
    name: 'ফাতিমা খাতুন',
    avatar: undefined,
    points: 2650,
    grade: 'A',
  },
];

export const mockBenefits = [
  {
    id: '1',
    titleBn: 'বিনামূল্যে গাছের চারা',
    titleEn: 'Free Tree Saplings',
    requiredPoints: 500,
    icon: 'leaf',
  },
  {
    id: '2',
    titleBn: 'পরিবেশ সার্টিফিকেট',
    titleEn: 'Environment Certificate',
    requiredPoints: 1000,
    icon: 'ribbon',
  },
  {
    id: '3',
    titleBn: 'ইকো-ব্যাগ',
    titleEn: 'Eco-Bag',
    requiredPoints: 300,
    icon: 'bag',
  },
  {
    id: '4',
    titleBn: 'সোলার ল্যাম্প',
    titleEn: 'Solar Lamp',
    requiredPoints: 2000,
    icon: 'bulb',
  },
];

export const mockRecentActivities = [
  {
    id: '1',
    thumbnail: undefined,
    category: 'গাছ রোপণ',
    status: 'approved' as const,
    points: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    thumbnail: undefined,
    category: 'পরিচ্ছন্নতা অভিযান',
    status: 'pending' as const,
    points: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    thumbnail: undefined,
    category: 'প্লাস্টিক সংগ্রহ',
    status: 'approved' as const,
    points: 30,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
