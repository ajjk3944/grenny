import api from './api';
import { EducationalContent } from '../types';

export const getEducationalContent = async (category?: string): Promise<EducationalContent[]> => {
  try {
    const response = await api.get('/educational', {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch educational content:', error);
    // Return mock data for MVP
    return getMockEducationalContent();
  }
};

export const getContentDetail = async (id: string): Promise<EducationalContent | null> => {
  try {
    const response = await api.get(`/educational/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch content detail:', error);
    return null;
  }
};

export const submitQuiz = async (contentId: string, answers: number[]): Promise<{
  score: number;
  points: number;
  correct: number;
  total: number;
}> => {
  try {
    const response = await api.post(`/educational/${contentId}/quiz`, { answers });
    return response.data;
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    throw error;
  }
};

// Mock data for MVP
const getMockEducationalContent = (): EducationalContent[] => {
  return [
    {
      id: '1',
      titleBn: 'গাছ রোপণের সঠিক পদ্ধতি',
      titleEn: 'Proper Tree Planting Methods',
      descriptionBn: 'কীভাবে সঠিকভাবে গাছ রোপণ করবেন এবং যত্ন নেবেন',
      descriptionEn: 'Learn how to properly plant and care for trees',
      type: 'article',
      category: 'tree_planting',
      thumbnail: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
      readTime: 5,
    },
    {
      id: '2',
      titleBn: 'বর্জ্য ব্যবস্থাপনা টিপস',
      titleEn: 'Waste Management Tips',
      descriptionBn: 'ঘরে এবং সম্প্রদায়ে বর্জ্য কীভাবে পরিচালনা করবেন',
      descriptionEn: 'How to manage waste at home and in your community',
      type: 'article',
      category: 'waste_management',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
      readTime: 7,
    },
    {
      id: '3',
      titleBn: 'জলবায়ু পরিবর্তন বোঝা',
      titleEn: 'Understanding Climate Change',
      descriptionBn: 'জলবায়ু পরিবর্তন এবং এর প্রভাব সম্পর্কে জানুন',
      descriptionEn: 'Learn about climate change and its impacts',
      type: 'video',
      category: 'climate_change',
      thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6',
      duration: 10,
    },
    {
      id: '4',
      titleBn: 'পরিবেশ কুইজ',
      titleEn: 'Environment Quiz',
      descriptionBn: 'আপনার পরিবেশ জ্ঞান পরীক্ষা করুন এবং পয়েন্ট জিতুন',
      descriptionEn: 'Test your environmental knowledge and earn points',
      type: 'quiz',
      category: 'general',
      thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
      quizData: [
        {
          id: 'q1',
          questionBn: 'একটি প্লাস্টিক বোতল পচতে কত সময় লাগে?',
          questionEn: 'How long does it take for a plastic bottle to decompose?',
          options: ['১ বছর', '১০ বছর', '১০০ বছর', '৪৫০ বছর'],
          correctAnswer: 3,
        },
        {
          id: 'q2',
          questionBn: 'বাংলাদেশের সবচেয়ে বড় ম্যানগ্রোভ বন কোনটি?',
          questionEn: 'What is the largest mangrove forest in Bangladesh?',
          options: ['সুন্দরবন', 'লাউয়াছড়া', 'রাতারগুল', 'মধুপুর'],
          correctAnswer: 0,
        },
      ],
    },
  ];
};
