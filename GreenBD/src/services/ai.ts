import api from './api';

export const aiService = {
  async verifyImage(imageUri: string, category: string) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'activity.jpg',
    } as any);
    formData.append('category', category);

    const response = await api.post('/ai/verify-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async verifyVideo(videoUri: string, category: string) {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'activity.mp4',
    } as any);
    formData.append('category', category);

    const response = await api.post('/ai/verify-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
