import { Activity } from '../types';
import { ACTIVITY_CATEGORIES } from '../constants/categories';

const generateMockActivities = (): Activity[] => {
  const activities: Activity[] = [];
  const statuses: Activity['status'][] = ['verified', 'pending', 'rejected', 'uploading'];
  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const category = ACTIVITY_CATEGORIES[Math.floor(Math.random() * ACTIVITY_CATEGORIES.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const basePoints = category.points;
    const bonusPoints = status === 'verified' ? Math.floor(Math.random() * 20) : 0;
    const submittedDate = new Date(now);
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 30));

    activities.push({
      id: `activity_${i}`,
      userId: 'user_1',
      category: category.id,
      categoryName: category.name,
      categoryNameBn: category.nameBn,
      categoryIcon: category.icon,
      mediaUris: [`https://picsum.photos/seed/${i}/400/400`],
      mediaType: Math.random() > 0.8 ? 'video' : 'photo',
      summary: `Sample activity description for ${category.name}. This is a detailed summary of the environmental action taken.`,
      location: {
        lat: 23.8103 + (Math.random() - 0.5) * 0.1,
        lng: 90.4125 + (Math.random() - 0.5) * 0.1,
        address: 'Dhaka, Bangladesh',
      },
      status,
      points: status === 'verified' ? basePoints + bonusPoints : 0,
      basePoints,
      bonusPoints,
      aiConfidence: Math.floor(Math.random() * 30) + 70,
      rejectionReason: status === 'rejected' ? 'Image quality too low' : undefined,
      submittedAt: submittedDate.toISOString(),
      reviewedAt: status !== 'pending' && status !== 'uploading' ? new Date(submittedDate.getTime() + 3600000).toISOString() : undefined,
      reviewedBy: status !== 'pending' && status !== 'uploading' ? 'AI System' : undefined,
    });
  }

  return activities.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
};

let mockActivities = generateMockActivities();

export const historyService = {
  getActivities: async (filter?: Activity['status']): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filter) {
      return mockActivities.filter(a => a.status === filter);
    }
    
    return mockActivities;
  },

  getActivityById: async (id: string): Promise<Activity | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockActivities.find(a => a.id === id) || null;
  },
};
