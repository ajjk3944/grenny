import { Benefit, RedeemedBenefit } from '../types';

const mockBenefits: Benefit[] = [
  {
    id: 'benefit_1',
    title: 'University Admission Priority',
    titleBn: 'বিশ্ববিদ্যালয় ভর্তি অগ্রাধিকার',
    description: 'Get priority consideration in university admissions',
    descriptionBn: 'বিশ্ববিদ্যালয় ভর্তিতে অগ্রাধিকার পান',
    category: 'education',
    requiredPoints: 500,
    requiredGrade: 'A',
    icon: 'school',
    available: true,
  },
  {
    id: 'benefit_2',
    title: 'Govt Job Application Bonus',
    titleBn: 'সরকারি চাকরি আবেদনে বোনাস',
    description: 'Bonus points in government job applications',
    descriptionBn: 'সরকারি চাকরি আবেদনে বোনাস পয়েন্ট',
    category: 'employment',
    requiredPoints: 1000,
    requiredGrade: 'A+',
    icon: 'briefcase',
    available: true,
  },
  {
    id: 'benefit_3',
    title: 'Free Health Checkup',
    titleBn: 'বিনামূল্যে স্বাস্থ্য পরীক্ষা',
    description: 'Comprehensive health checkup at partner hospitals',
    descriptionBn: 'পার্টনার হাসপাতালে সম্পূর্ণ স্বাস্থ্য পরীক্ষা',
    category: 'healthcare',
    requiredPoints: 200,
    requiredGrade: 'B+',
    icon: 'medical',
    available: true,
  },
  {
    id: 'benefit_4',
    title: 'Bus Pass Discount',
    titleBn: 'বাস পাস ছাড়',
    description: '20% discount on monthly bus passes',
    descriptionBn: 'মাসিক বাস পাসে ২০% ছাড়',
    category: 'transport',
    requiredPoints: 150,
    requiredGrade: 'B',
    icon: 'bus',
    available: true,
  },
  {
    id: 'benefit_5',
    title: 'Electricity Bill Discount',
    titleBn: 'বিদ্যুৎ বিল ছাড়',
    description: '10% discount on electricity bills for 3 months',
    descriptionBn: '৩ মাসের জন্য বিদ্যুৎ বিলে ১০% ছাড়',
    category: 'utilities',
    requiredPoints: 300,
    requiredGrade: 'A',
    icon: 'flash',
    available: true,
  },
  {
    id: 'benefit_6',
    title: 'Free Internet Pack',
    titleBn: 'ফ্রি ইন্টারনেট প্যাক',
    description: '5GB free internet data',
    descriptionBn: '৫জিবি ফ্রি ইন্টারনেট ডেটা',
    category: 'utilities',
    requiredPoints: 100,
    requiredGrade: 'C',
    icon: 'wifi',
    available: true,
  },
  {
    id: 'benefit_7',
    title: 'Scholarship Application Bonus',
    titleBn: 'বৃত্তি আবেদনে বোনাস',
    description: 'Additional consideration for scholarship applications',
    descriptionBn: 'বৃত্তি আবেদনে অতিরিক্ত বিবেচনা',
    category: 'education',
    requiredPoints: 400,
    requiredGrade: 'A',
    icon: 'trophy',
    available: true,
  },
  {
    id: 'benefit_8',
    title: 'Micro Loan Priority',
    titleBn: 'ক্ষুদ্র ঋণ অগ্রাধিকার',
    description: 'Priority access to government micro-loans',
    descriptionBn: 'সরকারি ক্ষুদ্র ঋণে অগ্রাধিকার',
    category: 'financial',
    requiredPoints: 600,
    requiredGrade: 'A',
    icon: 'cash',
    available: true,
  },
];

let redeemedBenefits: RedeemedBenefit[] = [];

export const benefitsService = {
  getBenefits: async (category?: string): Promise<Benefit[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (category && category !== 'all') {
      return mockBenefits.filter(b => b.category === category);
    }
    
    return mockBenefits;
  },

  redeemBenefit: async (benefitId: string, userPoints: number, userGrade: string): Promise<{ success: boolean; message?: string; redemptionCode?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const benefit = mockBenefits.find(b => b.id === benefitId);
    
    if (!benefit) {
      return { success: false, message: 'Benefit not found' };
    }
    
    if (userPoints < benefit.requiredPoints) {
      return { success: false, message: `You need ${benefit.requiredPoints - userPoints} more points` };
    }
    
    const gradeOrder = ['D', 'C', 'B', 'B+', 'A', 'A+'];
    const userGradeIndex = gradeOrder.indexOf(userGrade);
    const requiredGradeIndex = gradeOrder.indexOf(benefit.requiredGrade);
    
    if (userGradeIndex < requiredGradeIndex) {
      return { success: false, message: `Grade ${benefit.requiredGrade} required` };
    }
    
    const redemptionCode = `GBD${Date.now().toString(36).toUpperCase()}`;
    
    redeemedBenefits.push({
      ...benefit,
      redeemedAt: new Date().toISOString(),
      redemptionCode,
    });
    
    return { success: true, redemptionCode };
  },

  getRedeemedBenefits: async (): Promise<RedeemedBenefit[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return redeemedBenefits;
  },
};
