export enum UserRole {
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  MEDIA_BUYER = 'MEDIA_BUYER',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  DESIGNER = 'DESIGNER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface LoginHistory {
  id: string;
  username: string;
  role: UserRole;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'نجاح' | 'فشل';
}

export interface ActivityLog {
  id: string;
  username: string;
  role: UserRole;
  action: string;
  timestamp: string;
  details: string;
}

export type ContentStatus =
  | 'Draft' // مسودة
  | 'Submitted' // تم التقديم
  | 'Under Review' // قيد المراجعة
  | 'Approved' // مقبول
  | 'Rejected' // مرفوض
  | 'Scheduled' // مجدول
  | 'Published'; // منشور

export type PostType = 'Image' | 'Video' | 'Reel' | 'Carousel' | 'Story';

export interface ContentItem {
  id: string;
  title: string;
  type: PostType;
  mediaUrl: string;
  contentCopy: string;
  campaignObjective: string;
  marketingGoal: string;
  targetAudience: string;
  targetAge: string;
  targetGender: 'الجميع' | 'ذكور' | 'إناث';
  targetLocation: string;
  interests: string;
  budget: number;
  expectedResults: string;
  landingPageUrl: string;
  cta: string;
  notes: string;
  status: ContentStatus;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  history: {
    status: ContentStatus;
    changedBy: string;
    changedAt: string;
    comment: string;
  }[];
}

export interface CampaignAd {
  id: string;
  name: string;
  creativeType: 'صورة' | 'فيديو' | 'كاروسيل' | 'قصة';
  spend: number;
  reach: number;
  impressions: number;
  leads: number;
  messages: number;
  purchases: number;
  revenue: number;
  cpc: number;
  cpm: number;
  ctr: number;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface CampaignData {
  id: string;
  name: string;
  objective: string;
  status: 'نشط' | 'متوقف';
  budget: number;
  spend: number;
  audience: string;
  placements: string[];
  ageRange: string;
  gender: string;
  interests: string[];
  reach: number;
  impressions: number;
  leads: number;
  messages: number;
  purchases: number;
  revenue: number;
  ads: CampaignAd[];
}

export interface PageAnalytics {
  followers: number;
  newFollowers: number;
  reach: number;
  engagement: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  growthHistory: {
    date: string;
    followers: number;
    reach: number;
    engagement: number;
  }[];
}

export interface BudgetControl {
  dailyLimit: number;
  monthlyLimit: number;
  currentSpend: number;
  alerts: {
    id: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    timestamp: string;
  }[];
}

export interface TeamMemberStats {
  id: string;
  name: string;
  avatar: string;
  role: string;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  publishedCount: number;
  activeCampaigns: number;
}
