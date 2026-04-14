export interface Activity {
  id: string;
  userId: string;
  category: string;
  categoryName: string;
  categoryNameBn: string;
  categoryIcon: string;
  mediaUris: string[];
  mediaType: 'photo' | 'video';
  summary: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'pending' | 'uploading' | 'verified' | 'rejected';
  points: number;
  basePoints: number;
  bonusPoints: number;
  aiConfidence: number;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  grade: string;
  rank: number;
}

export interface Benefit {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: 'education' | 'employment' | 'healthcare' | 'transport' | 'financial' | 'utilities';
  requiredPoints: number;
  requiredGrade: string;
  icon: string;
  available: boolean;
}

export interface RedeemedBenefit extends Benefit {
  redeemedAt: string;
  redemptionCode: string;
  qrCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  nidLinked: boolean;
  memberSince: string;
  district: string;
  division: string;
  totalPoints: number;
  grade: string;
  totalActivities: number;
}

export interface Notification {
  id: string;
  type: 'verification_complete' | 'points_earned' | 'grade_upgrade' | 'new_challenge' | 'streak_reminder' | 'government_announcement' | 'warning' | 'submission_rejected';
  title: string;
  titleBn: string;
  body: string;
  bodyBn: string;
  read: boolean;
  createdAt: string;
  data?: {
    submissionId?: string;
    challengeId?: string;
    points?: number;
    grade?: string;
  };
}

export interface Challenge {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  category: string;
  targetCount: number;
  currentCount: number;
  pointMultiplier: number;
  startDate: string;
  endDate: string;
  participantCount: number;
  participantAvatars: string[];
  area?: string;
  active: boolean;
  userProgress?: number;
  userJoined?: boolean;
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  category: string;
  categoryIcon: string;
  thumbnail: string;
  userName: string;
  points: number;
  submittedAt: string;
}

export interface EducationalContent {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  type: 'article' | 'video' | 'quiz';
  category: string;
  thumbnail: string;
  duration?: number;
  readTime?: number;
  content?: string;
  videoUrl?: string;
  quizData?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  questionBn: string;
  questionEn: string;
  options: string[];
  correctAnswer: number;
}

export interface SubmissionDraft {
  id: string;
  category: string;
  mediaUris: string[];
  mediaType: 'photo' | 'video';
  summary: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string;
  synced: boolean;
}
