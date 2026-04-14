import api from './api';

export interface CreateSubmissionData {
  category: string;
  summary: string;
  latitude: number;
  longitude: number;
  address?: string;
  mediaType: 'PHOTO' | 'VIDEO';
  media: {
    uri: string;
    type: string;
    name: string;
  }[];
}

export const createSubmission = async (data: CreateSubmissionData) => {
  const formData = new FormData();
  
  formData.append('category', data.category);
  formData.append('summary', data.summary);
  formData.append('latitude', data.latitude.toString());
  formData.append('longitude', data.longitude.toString());
  formData.append('mediaType', data.mediaType);
  
  if (data.address) {
    formData.append('address', data.address);
  }

  data.media.forEach((file, index) => {
    formData.append('media', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
  });

  const response = await api.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getSubmissions = async (page = 1, limit = 20) => {
  const response = await api.get('/submissions', {
    params: { page, limit },
  });
  return response.data;
};

export const getSubmissionById = async (id: string) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};
