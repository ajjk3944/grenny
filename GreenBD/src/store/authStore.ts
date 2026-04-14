import { create } from 'zustand';
import { User, AuthResponse } from '../types';
import { storage } from '../utils/storage';
import { secureStorage } from '../utils/secureStorage';
import * as authService from '../services/auth';

const AUTH_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username?: string; userId?: string; password: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      let response: AuthResponse;
      if (credentials.username) {
        response = await authService.loginAdmin(credentials.username, credentials.password);
      } else if (credentials.userId) {
        response = await authService.loginSecurity(credentials.userId, credentials.password);
      } else {
        throw new Error('Invalid credentials');
      }
      await storage.set(AUTH_KEY, response.user);
      await secureStorage.setItem(TOKEN_KEY, response.token);
      set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.loginWithGoogle();
      await storage.set(AUTH_KEY, response.user);
      await secureStorage.setItem(TOKEN_KEY, response.token);
      set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithFacebook: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.loginWithFacebook();
      await storage.set(AUTH_KEY, response.user);
      await secureStorage.setItem(TOKEN_KEY, response.token);
      set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithPhone: async (phone, otp) => {
    set({ isLoading: true });
    try {
      const response = await authService.loginWithPhone(phone, otp);
      await storage.set(AUTH_KEY, response.user);
      await secureStorage.setItem(TOKEN_KEY, response.token);
      set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  requestOtp: async (phone) => {
    set({ isLoading: true });
    try {
      await authService.requestOtp(phone);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await storage.remove(AUTH_KEY);
    await secureStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: async () => {
    const user = await storage.get<User>(AUTH_KEY);
    const token = await secureStorage.getItem(TOKEN_KEY);
    if (user && token) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
