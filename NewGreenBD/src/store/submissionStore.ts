import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export interface SubmissionDraft {
  mediaUris: string[];
  mediaType: 'photo' | 'video';
  category: string;
  summary: string;
  groupMembers: string[];
  location: { lat: number; lng: number } | null;
  timestamp: string;
}

export interface Submission extends SubmissionDraft {
  id: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  retryCount: number;
  userId: string;
}

interface SubmissionStore {
  draft: SubmissionDraft | null;
  pendingUploads: Submission[];
  isSubmitting: boolean;
  lastSubmissionTime: number | null;
  dailySubmissionCount: number;
  
  setDraft: (draft: Partial<SubmissionDraft>) => void;
  clearDraft: () => void;
  submit: (userId: string) => Promise<{ success: boolean; message?: string }>;
  retryUpload: (id: string) => Promise<void>;
  loadPendingUploads: () => Promise<void>;
  checkSubmissionLimits: () => { canSubmit: boolean; message?: string; cooldownSeconds?: number };
  resetDailyCount: () => void;
}

const STORAGE_KEY = 'pending_submissions';
const LAST_SUBMISSION_KEY = 'last_submission_time';
const DAILY_COUNT_KEY = 'daily_submission_count';
const MAX_DAILY_SUBMISSIONS = 5;
const COOLDOWN_MINUTES = 30;

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  draft: null,
  pendingUploads: [],
  isSubmitting: false,
  lastSubmissionTime: null,
  dailySubmissionCount: 0,

  setDraft: (draftUpdate) => {
    set((state) => ({
      draft: state.draft ? { ...state.draft, ...draftUpdate } : {
        mediaUris: [],
        mediaType: 'photo',
        category: '',
        summary: '',
        groupMembers: [],
        location: null,
        timestamp: new Date().toISOString(),
        ...draftUpdate,
      },
    }));
  },

  clearDraft: () => {
    set({ draft: null });
  },

  checkSubmissionLimits: () => {
    const { lastSubmissionTime, dailySubmissionCount } = get();
    const now = Date.now();

    // Check daily limit
    if (dailySubmissionCount >= MAX_DAILY_SUBMISSIONS) {
      return {
        canSubmit: false,
        message: `আজকের জন্য সর্বোচ্চ ${MAX_DAILY_SUBMISSIONS}টি জমা দেওয়া হয়েছে`,
      };
    }

    // Check cooldown
    if (lastSubmissionTime) {
      const timeSinceLastSubmission = now - lastSubmissionTime;
      const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
      
      if (timeSinceLastSubmission < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSubmission) / 1000);
        return {
          canSubmit: false,
          message: 'পরবর্তী জমা দিতে অপেক্ষা করুন',
          cooldownSeconds: remainingSeconds,
        };
      }
    }

    return { canSubmit: true };
  },

  submit: async (userId: string) => {
    const { draft, pendingUploads, checkSubmissionLimits, dailySubmissionCount } = get();
    
    if (!draft) {
      return { success: false, message: 'কোনো ড্রাফট নেই' };
    }

    // Validate
    if (draft.mediaUris.length === 0) {
      return { success: false, message: 'অন্তত একটি ছবি বা ভিডিও প্রয়োজন' };
    }

    if (!draft.category) {
      return { success: false, message: 'ক্যাটাগরি নির্বাচন করুন' };
    }

    if (draft.summary.length < 10) {
      return { success: false, message: 'সারসংক্ষেপ কমপক্ষে ১০ অক্ষর হতে হবে' };
    }

    if (!draft.location) {
      return { success: false, message: 'লোকেশন সার্ভিস চালু করুন' };
    }

    // Check limits
    const limitCheck = checkSubmissionLimits();
    if (!limitCheck.canSubmit) {
      return { success: false, message: limitCheck.message };
    }

    set({ isSubmitting: true });

    try {
      const submission: Submission = {
        ...draft,
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        retryCount: 0,
        userId,
      };

      // Save locally first
      const newPendingUploads = [...pendingUploads, submission];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPendingUploads));
      
      // Update submission tracking
      const now = Date.now();
      await AsyncStorage.setItem(LAST_SUBMISSION_KEY, now.toString());
      await AsyncStorage.setItem(DAILY_COUNT_KEY, (dailySubmissionCount + 1).toString());

      set({
        pendingUploads: newPendingUploads,
        lastSubmissionTime: now,
        dailySubmissionCount: dailySubmissionCount + 1,
        isSubmitting: false,
      });

      // Start background upload
      get().retryUpload(submission.id);

      return { success: true };
    } catch (error) {
      console.error('Submission error:', error);
      set({ isSubmitting: false });
      return { success: false, message: 'জমা দিতে ব্যর্থ হয়েছে' };
    }
  },

  retryUpload: async (id: string) => {
    const { pendingUploads } = get();
    const submission = pendingUploads.find((s) => s.id === id);
    
    if (!submission || submission.status === 'uploading') {
      return;
    }

    // Update status to uploading
    const updatedUploads = pendingUploads.map((s) =>
      s.id === id ? { ...s, status: 'uploading' as const } : s
    );
    set({ pendingUploads: updatedUploads });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUploads));

    try {
      // TODO: Implement actual API upload
      // For now, simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mark as uploaded
      const finalUploads = get().pendingUploads.filter((s) => s.id !== id);
      set({ pendingUploads: finalUploads });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalUploads));
    } catch (error) {
      console.error('Upload error:', error);
      
      // Mark as failed
      const failedUploads = get().pendingUploads.map((s) =>
        s.id === id ? { ...s, status: 'failed' as const, retryCount: s.retryCount + 1 } : s
      );
      set({ pendingUploads: failedUploads });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(failedUploads));
    }
  },

  loadPendingUploads: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const lastSubmission = await AsyncStorage.getItem(LAST_SUBMISSION_KEY);
      const dailyCount = await AsyncStorage.getItem(DAILY_COUNT_KEY);
      
      if (stored) {
        set({ pendingUploads: JSON.parse(stored) });
      }
      
      if (lastSubmission) {
        set({ lastSubmissionTime: parseInt(lastSubmission, 10) });
      }
      
      if (dailyCount) {
        set({ dailySubmissionCount: parseInt(dailyCount, 10) });
      }
    } catch (error) {
      console.error('Failed to load pending uploads:', error);
    }
  },

  resetDailyCount: async () => {
    set({ dailySubmissionCount: 0 });
    await AsyncStorage.setItem(DAILY_COUNT_KEY, '0');
  },
}));
