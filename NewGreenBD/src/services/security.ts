import { Submission, AreaTask, SecurityMessage, User } from '../types';

const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    userName: 'রহিম আহমেদ',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'],
    category: 'গাছ লাগানো',
    summary: 'পার্কে ৫টি গাছ লাগানো হয়েছে',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'flagged',
      confidence: 65,
      details: 'Image quality is low, manual review recommended',
      checkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    points: 20,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-2',
    userId: 'user-2',
    userName: 'সালমা খাতুন',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'],
    category: 'পরিষ্কার-পরিচ্ছন্নতা',
    summary: 'রাস্তা পরিষ্কার করা হয়েছে',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'verified',
      confidence: 92,
      details: 'Valid cleaning activity detected',
      checkedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    points: 15,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-3',
    userId: 'user-3',
    userName: 'করিম মিয়া',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400'],
    category: 'নদী পরিষ্কার',
    summary: 'নদী থেকে প্লাস্টিক সংগ্রহ',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'pending',
      confidence: 78,
      details: 'Waiting for manual review',
      checkedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    points: 25,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-4',
    userId: 'user-4',
    userName: 'নাজমা আক্তার',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    type: 'video',
    mediaUrls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'],
    category: 'বর্জ্য ব্যবস্থাপনা',
    summary: 'প্লাস্টিক বর্জ্য পৃথকীকরণ',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'flagged',
      confidence: 55,
      details: 'Suspicious activity pattern detected',
      checkedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    points: 10,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-5',
    userId: 'user-5',
    userName: 'আলী হোসেন',
    userAvatar: 'https://i.pravatar.cc/150?img=7',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400'],
    category: 'সচেতনতা কার্যক্রম',
    summary: 'স্কুলে পরিবেশ সচেতনতা কর্মশালা',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'pending',
      confidence: 88,
      details: 'Valid awareness campaign detected',
      checkedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    points: 15,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-6',
    userId: 'user-6',
    userName: 'রুমানা বেগম',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'],
    category: 'গাছ লাগানো',
    summary: 'বাড়ির সামনে ফলের গাছ রোপণ',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'verified',
      confidence: 95,
      details: 'Tree planting activity verified',
      checkedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    points: 20,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-7',
    userId: 'user-7',
    userName: 'জামাল উদ্দিন',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400'],
    category: 'নদী পরিষ্কার',
    summary: 'নদীর তীর পরিষ্কার কার্যক্রম',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'flagged',
      confidence: 60,
      details: 'Location verification needed',
      checkedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    points: 25,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-8',
    userId: 'user-8',
    userName: 'শাহানা পারভীন',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    type: 'photo',
    mediaUrls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'],
    category: 'বর্জ্য ব্যবস্থাপনা',
    summary: 'কমিউনিটি বর্জ্য সংগ্রহ',
    location: { lat: 23.8103, lng: 90.4125, address: 'মিরপুর, ঢাকা' },
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    aiReview: {
      status: 'verified',
      confidence: 90,
      details: 'Waste management activity verified',
      checkedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    },
    points: 10,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
];

const mockAreaTasks: AreaTask[] = [
  {
    id: 'task-1',
    createdBy: 'sec-1',
    titleBn: 'স্বাস্থ্য সেবা',
    titleEn: 'Health Service',
    description: 'স্থানীয় হাসপাতালে স্বাস্থ্য সচেতনতা কার্যক্রম',
    points: 200,
    proofType: 'photo',
    category: 'সচেতনতা কার্যক্রম',
    referenceMedia: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400'],
    active: true,
    area: 'মিরপুর, ঢাকা',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    createdBy: 'sec-1',
    titleBn: 'শিক্ষা সহায়তা',
    titleEn: 'Education Support',
    description: 'স্কুলে পরিবেশ শিক্ষা কর্মশালা',
    points: 150,
    proofType: 'both',
    category: 'সচেতনতা কার্যক্রম',
    active: true,
    area: 'মিরপুর, ঢাকা',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    createdBy: 'sec-1',
    titleBn: 'কমিউনিটি পরিষ্কার',
    titleEn: 'Community Cleanup',
    description: 'মাসিক কমিউনিটি পরিষ্কার কার্যক্রম',
    points: 100,
    proofType: 'photo',
    category: 'পরিষ্কার-পরিচ্ছন্নতা',
    active: true,
    area: 'মিরপুর, ঢাকা',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockSecurityMessages: SecurityMessage[] = [
  {
    id: 'msg-1',
    fromUserId: 'admin-1',
    fromUserName: 'Admin',
    subject: 'নতুন নির্দেশনা',
    body: 'আগামীকাল থেকে নতুন পয়েন্ট সিস্টেম কার্যকর হবে।',
    type: 'general',
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    adminReply: 'ধন্যবাদ। নির্দেশনা পেয়েছি।',
    direction: 'received',
  },
  {
    id: 'msg-2',
    toUserId: 'admin-1',
    subject: 'কার্যক্রম মুছে ফেলার অনুরোধ',
    body: 'একটি ভুল কার্যক্রম জমা দেওয়া হয়েছে। অনুগ্রহ করে এটি মুছে ফেলুন।',
    linkedSubmissionId: 'sub-1',
    type: 'delete_request',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    direction: 'sent',
  },
  {
    id: 'msg-3',
    fromUserId: 'admin-1',
    fromUserName: 'Admin',
    subject: 'প্রশিক্ষণ সেশন',
    body: 'আগামী শুক্রবার সকাল ১০টায় অনলাইন প্রশিক্ষণ সেশন অনুষ্ঠিত হবে।',
    type: 'general',
    status: 'resolved',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    direction: 'received',
  },
];

const mockAreaUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
  id: `user-${i + 1}`,
  role: 'user' as const,
  name: `ব্যবহারকারী ${i + 1}`,
  phone: `0171${String(i + 1).padStart(7, '0')}`,
  email: i % 3 === 0 ? `user${i + 1}@example.com` : undefined,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  district: 'ঢাকা',
  division: 'ঢাকা',
  nidLinked: i % 4 !== 0,
  createdAt: new Date(2024, 0, 1 + i).toISOString(),
  banned: i % 10 === 0,
  redMarked: i % 8 === 0,
  points: Math.floor(Math.random() * 600),
  level: Math.floor(Math.random() * 10) + 1,
  grade: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)],
}));

export const getSubmissions = async (filters?: {
  status?: string;
  category?: string;
}): Promise<Submission[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filtered = [...mockSubmissions];
  
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((s) => s.aiReview.status === filters.status);
  }
  
  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter((s) => s.category === filters.category);
  }
  
  return filtered;
};

export const getSubmissionById = async (id: string): Promise<Submission | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockSubmissions.find((s) => s.id === id) || null;
};

export const approveSubmission = async (
  id: string,
  reviewerId: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const submission = mockSubmissions.find((s) => s.id === id);
  if (submission) {
    submission.manualReview = {
      reviewerId,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    };
    submission.aiReview.status = 'verified';
  }
};

export const rejectSubmission = async (
  id: string,
  reviewerId: string,
  reason: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const submission = mockSubmissions.find((s) => s.id === id);
  if (submission) {
    submission.manualReview = {
      reviewerId,
      status: 'rejected',
      reason,
      reviewedAt: new Date().toISOString(),
    };
    submission.aiReview.status = 'rejected';
  }
};

export const getAreaUsers = async (area: string): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAreaUsers;
};

export const getAreaTasks = async (area: string): Promise<AreaTask[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAreaTasks;
};

export const createAreaTask = async (task: Omit<AreaTask, 'id' | 'createdAt'>): Promise<AreaTask> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newTask: AreaTask = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockAreaTasks.push(newTask);
  return newTask;
};

export const updateAreaTask = async (id: string, updates: Partial<AreaTask>): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockAreaTasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    mockAreaTasks[index] = { ...mockAreaTasks[index], ...updates };
  }
};

export const getMessages = async (): Promise<SecurityMessage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSecurityMessages;
};

export const sendMessage = async (
  message: Omit<SecurityMessage, 'id' | 'createdAt' | 'direction'>
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockSecurityMessages.push({
    ...message,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    direction: 'sent',
  });
};
