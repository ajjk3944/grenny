import NetInfo from '@react-native-community/netinfo';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { storage } from '../utils/storage';
import { SubmissionDraft } from '../types';
import api from './api';

const SYNC_TASK_NAME = 'background-sync';
const PENDING_UPLOADS_KEY = 'pending_uploads';
const OFFLINE_DATA_KEY = 'offline_data';

interface SyncService {
  isOnline: boolean;
  pendingUploads: number;
  syncAll(): Promise<void>;
  queueSubmission(submission: SubmissionDraft): Promise<void>;
  startBackgroundSync(): Promise<void>;
  getPendingUploads(): Promise<SubmissionDraft[]>;
  removePendingUpload(id: string): Promise<void>;
}

class SyncServiceImpl implements SyncService {
  isOnline: boolean = true;
  pendingUploads: number = 0;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.initNetworkListener();
  }

  private initNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // Notify listeners
      this.listeners.forEach((listener) => listener(this.isOnline));

      // Auto-sync when coming back online
      if (wasOffline && this.isOnline) {
        this.syncAll();
      }
    });
  }

  addListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async queueSubmission(submission: SubmissionDraft): Promise<void> {
    try {
      const pending = await this.getPendingUploads();
      pending.push(submission);
      await storage.set(PENDING_UPLOADS_KEY, pending);
      this.pendingUploads = pending.length;
    } catch (error) {
      console.error('Failed to queue submission:', error);
      throw error;
    }
  }

  async getPendingUploads(): Promise<SubmissionDraft[]> {
    try {
      const pending = await storage.get<SubmissionDraft[]>(PENDING_UPLOADS_KEY);
      return pending || [];
    } catch (error) {
      console.error('Failed to get pending uploads:', error);
      return [];
    }
  }

  async removePendingUpload(id: string): Promise<void> {
    try {
      const pending = await this.getPendingUploads();
      const filtered = pending.filter((item) => item.id !== id);
      await storage.set(PENDING_UPLOADS_KEY, filtered);
      this.pendingUploads = filtered.length;
    } catch (error) {
      console.error('Failed to remove pending upload:', error);
    }
  }

  async syncAll(): Promise<void> {
    if (!this.isOnline) {
      console.log('Cannot sync: offline');
      return;
    }

    try {
      const pending = await this.getPendingUploads();
      console.log(`Syncing ${pending.length} pending submissions`);

      for (const submission of pending) {
        try {
          // Upload submission
          const formData = new FormData();
          formData.append('category', submission.category);
          formData.append('summary', submission.summary);
          formData.append('location', JSON.stringify(submission.location));

          // Upload media files
          for (let i = 0; i < submission.mediaUris.length; i++) {
            const uri = submission.mediaUris[i];
            const filename = uri.split('/').pop() || `media_${i}`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `${submission.mediaType}/${match[1]}` : submission.mediaType;

            formData.append('media', {
              uri,
              name: filename,
              type,
            } as any);
          }

          await api.post('/submissions', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Remove from queue on success
          await this.removePendingUpload(submission.id);
          console.log(`Successfully synced submission ${submission.id}`);
        } catch (error) {
          console.error(`Failed to sync submission ${submission.id}:`, error);
          // Continue with next submission
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async startBackgroundSync(): Promise<void> {
    try {
      await BackgroundFetch.registerTaskAsync(SYNC_TASK_NAME, {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background sync registered');
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }

  async cacheData(key: string, data: any): Promise<void> {
    try {
      const cache = await storage.get<Record<string, any>>(OFFLINE_DATA_KEY) || {};
      cache[key] = {
        data,
        timestamp: Date.now(),
      };
      await storage.set(OFFLINE_DATA_KEY, cache);
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  async getCachedData<T>(key: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<T | null> {
    try {
      const cache = await storage.get<Record<string, any>>(OFFLINE_DATA_KEY) || {};
      const cached = cache[key];

      if (!cached) return null;

      const age = Date.now() - cached.timestamp;
      if (age > maxAge) {
        return null;
      }

      return cached.data as T;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }
}

// Define background task
TaskManager.defineTask(SYNC_TASK_NAME, async () => {
  try {
    await syncService.syncAll();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background sync task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const syncService = new SyncServiceImpl();
