import api from './api';
import { AuthResponse } from '../types';
import { storage } from '../utils/storage';

export const loginAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login-admin', { email, password });
  await storage.set('auth_token', response.data.token);
  await storage.set('auth_user', response.data.user);
  return response.data;
};

export const loginSecurity = async (securityId: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login-security', { securityId, password });
  await storage.set('auth_token', response.data.token);
  await storage.set('auth_user', response.data.user);
  return response.data;
};

export const requestOtp = async (phone: string): Promise<{ userId: string }> => {
  const response = await api.post('/auth/login-phone', { phone });
  return response.data;
};

export const loginWithPhone = async (userId: string, otp: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/verify-otp', { userId, otp });
  await storage.set('auth_token', response.data.token);
  await storage.set('auth_user', response.data.user);
  return response.data;
};

export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login-google', { idToken });
  await storage.set('auth_token', response.data.token);
  await storage.set('auth_user', response.data.user);
  return response.data;
};

export const loginWithFacebook = async (accessToken: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login-facebook', { accessToken });
  await storage.set('auth_token', response.data.token);
  await storage.set('auth_user', response.data.user);
  return response.data;
};

export const mockLogin = async (role: 'admin' | 'security' | 'user', credentials: { email?: string; password?: string; securityId?: string; phone?: string; otp?: string }): Promise<AuthResponse> => {
  let response;
  if (role === 'admin') {
    response = {
      token: 'mock-admin-token',
      user: { id: 'admin', name: 'Admin User', role: 'admin' },
    };
  } else if (role === 'security') {
    response = {
      token: 'mock-security-token',
      user: { id: 'sec001', name: 'Security User', role: 'security' },
    };
  } else if (role === 'user') {
    response = {
      token: 'mock-user-token',
      user: { id: 'user001', name: 'General User', role: 'user' },
    };
  } else {
    throw new Error('Invalid role');
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Store mock token and user data
  await storage.set('auth_token', response.token);
  await storage.set('auth_user', response.user);

  return response;
};
