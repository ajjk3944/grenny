import { SecurityUser, User, AdminMessage, Notice, AppConfig, DashboardStats, Activity } from '../types';
import {
  mockSecurityUsers,
  mockGeneralUsers,
  mockAdminMessages,
  mockNotices,
  mockAppConfig,
  mockDashboardStats,
  mockSubmissions,
} from './mockData';

// Security Users
export const getSecurityUsers = async (): Promise<SecurityUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSecurityUsers;
};

export const createSecurityUser = async (data: {
  name: string;
  phone: string;
  email?: string;
  assignedArea: string;
  district: string;
}): Promise<{ user: SecurityUser; password: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const generatedId = `SEC-${String(mockSecurityUsers.length + 10001).padStart(5, '0')}`;
  const password = Math.random().toString(36).slice(-8);
  
  const newUser: SecurityUser = {
    id: `sec-${Date.now()}`,
    generatedId,
    role: 'security',
    name: data.name,
    phone: data.phone,
    email: data.email,
    assignedArea: data.assignedArea,
    district: data.district,
    nidLinked: false,
    createdAt: new Date().toISOString(),
    banned: false,
    redMarked: false,
  };
  
  mockSecurityUsers.push(newUser);
  return { user: newUser, password };
};

export const updateSecurityUser = async (
  userId: string,
  updates: Partial<SecurityUser>
): Promise<SecurityUser> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockSecurityUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    mockSecurityUsers[index] = { ...mockSecurityUsers[index], ...updates };
    return mockSecurityUsers[index];
  }
  throw new Error('User not found');
};

export const deleteSecurityUser = async (userId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockSecurityUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    mockSecurityUsers.splice(index, 1);
  }
};

export const banSecurityUser = async (
  userId: string,
  days?: number
): Promise<SecurityUser> => {
  const banExpiry = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : undefined;
  return updateSecurityUser(userId, { banned: true, banExpiry });
};

export const unbanSecurityUser = async (userId: string): Promise<SecurityUser> => {
  return updateSecurityUser(userId, { banned: false, banExpiry: undefined });
};

export const redMarkSecurityUser = async (userId: string): Promise<SecurityUser> => {
  return updateSecurityUser(userId, { redMarked: true });
};

export const removeRedMarkSecurityUser = async (userId: string): Promise<SecurityUser> => {
  return updateSecurityUser(userId, { redMarked: false });
};

// General Users
export const getGeneralUsers = async (filters?: {
  district?: string;
  grade?: string;
  status?: string;
}): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let users = [...mockGeneralUsers];
  
  if (filters?.district) {
    users = users.filter(u => u.district === filters.district);
  }
  if (filters?.grade) {
    users = users.filter(u => u.grade === filters.grade);
  }
  if (filters?.status) {
    if (filters.status === 'banned') {
      users = users.filter(u => u.banned);
    } else if (filters.status === 'red-marked') {
      users = users.filter(u => u.redMarked);
    } else if (filters.status === 'active') {
      users = users.filter(u => !u.banned && !u.redMarked);
    }
  }
  
  return users;
};

export const getUserById = async (userId: string): Promise<User | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockGeneralUsers.find(u => u.id === userId);
};

export const banUser = async (userId: string, days?: number): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockGeneralUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.banned = true;
  user.banExpiry = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : undefined;
  return user;
};

export const unbanUser = async (userId: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockGeneralUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.banned = false;
  user.banExpiry = undefined;
  return user;
};

export const redMarkUser = async (userId: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockGeneralUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.redMarked = true;
  return user;
};

export const removeRedMarkUser = async (userId: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockGeneralUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.redMarked = false;
  return user;
};

// Messages
export const getAdminMessages = async (filter?: 'all' | 'unread' | 'resolved'): Promise<AdminMessage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (filter === 'unread') {
    return mockAdminMessages.filter(m => m.status === 'unread');
  }
  if (filter === 'resolved') {
    return mockAdminMessages.filter(m => m.status === 'resolved');
  }
  return mockAdminMessages;
};

export const markMessageAsRead = async (messageId: string): Promise<AdminMessage> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const message = mockAdminMessages.find(m => m.id === messageId);
  if (!message) throw new Error('Message not found');
  
  message.status = 'read';
  return message;
};

export const resolveMessage = async (
  messageId: string,
  reply: string
): Promise<AdminMessage> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const message = mockAdminMessages.find(m => m.id === messageId);
  if (!message) throw new Error('Message not found');
  
  message.status = 'resolved';
  message.resolvedAt = new Date().toISOString();
  message.adminReply = reply;
  return message;
};

export const approveDeleteRequest = async (messageId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const message = mockAdminMessages.find(m => m.id === messageId);
  if (!message || !message.linkedSubmissionId) {
    throw new Error('Invalid delete request');
  }
  
  // In real app, would delete the submission and deduct points
  message.status = 'resolved';
  message.resolvedAt = new Date().toISOString();
  message.adminReply = 'অনুরোধ অনুমোদিত। কার্যক্রম মুছে ফেলা হয়েছে।';
};

export const getSubmissionById = async (submissionId: string): Promise<Activity | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockSubmissions.find(s => s.id === submissionId);
};

// Notices
export const getNotices = async (): Promise<Notice[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockNotices;
};

export const createNotice = async (notice: Omit<Notice, 'id' | 'sentAt' | 'readCount'>): Promise<Notice> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newNotice: Notice = {
    ...notice,
    id: `notice-${Date.now()}`,
    sentAt: new Date().toISOString(),
    readCount: 0,
  };
  
  mockNotices.unshift(newNotice);
  return newNotice;
};

// App Config
export const getAppConfig = async (): Promise<AppConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAppConfig;
};

export const updateAppConfig = async (config: Partial<AppConfig>): Promise<AppConfig> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  Object.assign(mockAppConfig, config);
  return mockAppConfig;
};

// Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDashboardStats;
};

export const getSubmissionsChartData = async (): Promise<{ date: string; count: number }[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate last 30 days data
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 30) + 10,
    });
  }
  return data;
};
