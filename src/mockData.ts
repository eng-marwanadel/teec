import { User, UserRole, ContentItem, CampaignData, PageAnalytics, TeamMemberStats, LoginHistory, ActivityLog, BudgetControl } from './types';

export const SYSTEM_USERS: User[] = [
  {
    id: 'u1',
    username: 'manager_teec',
    name: 'أ. طارق عبد العزيز',
    role: UserRole.GENERAL_MANAGER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u2',
    username: 'marketing_teec',
    name: 'سارة الشافعي',
    role: UserRole.MARKETING_MANAGER,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u3',
    username: 'buyer_teec',
    name: 'محمود الصاوي',
    role: UserRole.MEDIA_BUYER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u4',
    username: 'creator_teec',
    name: 'هاني رمزي',
    role: UserRole.CONTENT_CREATOR,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u5',
    username: 'designer_teec',
    name: 'ندى سليم',
    role: UserRole.DESIGNER,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u6',
    username: 'viewer_teec',
    name: 'أحمد عبد الله',
    role: UserRole.VIEWER,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
  }
];

export const INITIAL_LOGIN_HISTORY: LoginHistory[] = [
  {
    id: 'l1',
    username: 'manager_teec',
    role: UserRole.GENERAL_MANAGER,
    timestamp: '2026-06-15 16:30',
    ipAddress: '197.34.112.5',
    device: 'MacBook Pro - Chrome (Cairo, EG)',
    status: 'نجاح'
  },
  {
    id: 'l2',
    username: 'marketing_teec',
    role: UserRole.MARKETING_MANAGER,
    timestamp: '2026-06-15 15:12',
    ipAddress: '197.34.120.14',
    device: 'Windows PC - Firefox (Alexandria, EG)',
    status: 'نجاح'
  },
  {
    id: 'l3',
    username: 'buyer_teec',
    role: UserRole.MEDIA_BUYER,
    timestamp: '2026-06-15 14:05',
    ipAddress: '197.34.118.89',
    device: 'iPhone 15 Pro - Safari',
    status: 'نجاح'
  },
  {
    id: 'l4',
    username: 'creator_teec',
    role: UserRole.CONTENT_CREATOR,
    timestamp: '2026-06-15 11:30',
    ipAddress: '196.221.43.12',
    device: 'Samsung Galaxy S24 - Chrome',
    status: 'نجاح'
  },
  {
    id: 'l5',
    username: 'designer_teec',
    role: UserRole.DESIGNER,
    timestamp: '2026-06-15 10:20',
    ipAddress: '196.221.50.67',
    device: 'iPad Pro - Chrome',
    status: 'نجاح'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'a1',
    username: 'marketing_teec',
    role: UserRole.MARKETING_MANAGER,
    action: 'إنشاء طلب محتوى جديد',
    timestamp: '2026-06-15 15:45',
    details: 'حملة الصيف لشركة TEEC - عرض الخصم 25%'
  },
  {
    id: 'a2',
    username: 'buyer_teec',
    role: UserRole.MEDIA_BUYER,
    action: 'تحديث ميزانية إعلانات فيسبوك',
    timestamp: '2026-06-15 14:30',
    details: 'زيادة ميزانية حملة "تحويل المبيعات الكبرى" إلى 500$ يومياً'
  },
  {
    id: 'a3',
    username: 'manager_teec',
    role: UserRole.GENERAL_MANAGER,
    action: 'موافقة على منشور',
    timestamp: '2026-06-15 17:00',
    details: 'موافقة على منشور الفيديو (خريطة طريق التبريد والتكييف 2026)'
  }
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'c-101',
    title: 'تكييفات TEEC الذكية للشركات والمصانع',
    type: 'Video',
    mediaUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=800&fit=crop',
    contentCopy: 'نقدم في TEEC أقوى حلول التبريد والتهوية المركزية للمصانع والمنشآت التجارية الكبرى بدقة متناهية وضمان شامل لـ 5 سنوات. اتصل بنا الآن للحصول على استشارة فنية مجانية ❄️🏢',
    campaignObjective: 'جمع بيانات العملاء المحتملين (Lead Generation)',
    marketingGoal: 'زيادة عدد العملاء B2B بنسبة 30%',
    targetAudience: 'أصحاب المصانع، مدراء الصيانة، المهندسين المعماريين المقاولين',
    targetAge: '28 - 55',
    targetGender: 'الجميع',
    targetLocation: 'القاهرة، الجيزة، العاشر من رمضان، أكتوبر',
    interests: 'هندسة التبريد والتحكم، مقاولات عامة، HVAC، تبريد مركزي',
    budget: 6500,
    expectedResults: 'الحصول على 150 عميل محتمل B2B عالي الجودة',
    landingPageUrl: 'https://teec-eg.com/hvac-systems',
    cta: 'احصل على عرض أسعار (Apply Now)',
    notes: 'الفيديو يحتوي على لقطات لمشروعاتنا القائمة في العاشر من رمضان والقرية الذكية.',
    status: 'Approved',
    submittedBy: 'سارة الشافعي',
    submittedAt: '2026-06-12 11:20',
    approvedBy: 'طارق عبد العزيز',
    approvedAt: '2026-06-13 14:15',
    history: [
      { status: 'Draft', changedBy: 'سارة الشافعي', changedAt: '2026-06-11 09:00', comment: 'تجهيز المسودة للمراجعة' },
      { status: 'Submitted', changedBy: 'سارة الشافعي', changedAt: '2026-06-12 11:20', comment: 'تم الإرسال للمدير العام' },
      { status: 'Approved', changedBy: 'طارق عبد العزيز', changedAt: '2026-06-13 14:15', comment: 'تصميم رائع وإدخال البيانات دقيق ومطابق لهوية TEEC.' }
    ]
  },
  {
    id: 'c-102',
    title: 'عرض الصيف الاستثنائي - خصم 20% على تكييفات الفيلات',
    type: 'Image',
    mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&fit=crop',
    contentCopy: 'هواء منعش، نقاء يعزل الصيف في الخارج! عروض TEEC الكبرى للفيلات والقصور بدأت الآن ☀️. استمتع بخصم فوري يصل إلى 20% على باقات التكييف المخفي الكونسيلد والـ VRF الرائدة عالمياً.',
    campaignObjective: 'مبيعات مباشرة (Conversions)',
    marketingGoal: 'حجز 45 مشروع فيلا سكنية خلال شهر يونيو',
    targetAudience: 'أصحاب الفيلات في التجمع الخامس، زايد، الشروق، الساحل الشمالي',
    targetAge: '32 - 60',
    targetGender: 'الجميع',
    targetLocation: 'التجمع، أكتوبر، الساحل الشمالي، الجونة',
    interests: 'ديكورات داخلية، فيلات راقية، هندسة معمارية، عقارات فاخرة',
    budget: 4000,
    expectedResults: '40-50 عميل ومقايسة منتهية بالتعاقد',
    landingPageUrl: 'https://teec-eg.com/summer-offers',
    cta: 'اتصل الآن (Call Now)',
    notes: 'الرجاء استخدام الألوان الهادئة لإظهار الفخامة ومستوى التبريد المتميز.',
    status: 'Scheduled',
    submittedBy: 'سارة الشافعي',
    submittedAt: '2026-06-14 10:30',
    approvedBy: 'طارق عبد العزيز',
    approvedAt: '2026-06-15 09:20',
    history: [
      { status: 'Draft', changedBy: 'سارة الشافعي', changedAt: '2026-06-13 15:00', comment: 'تنسيق المحتوى الإبداعي' },
      { status: 'Submitted', changedBy: 'سارة الشافعي', changedAt: '2026-06-14 10:30', comment: 'تم الإرسال لطلب الموافقة والجدولة' },
      { status: 'Approved', changedBy: 'طارق عبد العزيز', changedAt: '2026-06-15 09:20', comment: 'العرض استثنائي ومناسب جداً لموسم الساحل والصيف.' }
    ]
  },
  {
    id: 'c-103',
    title: 'لقطات كواليس تركيب أنظمة VRF في مصنع فاركو للأدوية',
    type: 'Reel',
    mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&fit=crop',
    contentCopy: 'الأمان الدوائي يبدأ من ضبط الحرارة والرطوبة بأعلى المعايير الصارمة! شاهدوا معنا كواليس تصميم وتركيب شبكة التكييف المركزي VRF العملاقة بواسطة طاقم مهندسي TEEC المخضرم 👷🔩🌬️.',
    campaignObjective: 'زيادة الوعي بالعلامة التجارية وتفاعل الصفحة (Awareness & Engagement)',
    marketingGoal: 'تعزيز مصداقية TEEC في القطاع الطبي والصناعي المعقد',
    targetAudience: 'الوسط الهندسي والصناعي، مسؤولي الجودة في شركات الأدوية والغذائيات',
    targetAge: '25 - 55',
    targetGender: 'الجميع',
    targetLocation: 'الإسكندرية، برج العرب، السادات، العاشر من رمضان',
    interests: 'تصنيع أدوية، ممارسات الجودة GMP، غرف نظيفة Clean Rooms، كواليس هندسية',
    budget: 1500,
    expectedResults: 'الوصول لـ 50 ألف مهتم ومعدل تفاعل لا يقل عن 8%',
    landingPageUrl: 'https://teec-eg.com/our-projects/pharco',
    cta: 'تعرف على المزيد (Learn More)',
    notes: 'الفيديو ريلز سريع مدته 45 ثانية ومتبوع بموسيقى تشويقية سريعة.',
    status: 'Under Review',
    submittedBy: 'هاني رمزي',
    submittedAt: '2026-06-15 15:30',
    history: [
      { status: 'Draft', changedBy: 'هاني رمزي', changedAt: '2026-06-15 12:00', comment: 'إنشاء ريلز الكواليس' },
      { status: 'Submitted', changedBy: 'هاني رمزي', changedAt: '2026-06-15 15:30', comment: 'تم التقديم للمراجعة والجدولة' }
    ]
  },
  {
    id: 'c-104',
    title: 'تصميم تكييف السقف المخفي الكونسيلد - دقة التوزيع وجمال الديكور',
    type: 'Carousel',
    mediaUrl: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&fit=crop',
    contentCopy: 'الديكور الأنيق يستحق تكييفاً مخفياً يُبرز جماله وتفاصيله ولا يزاحم المساحة! إليك في هذا الكاروسيل دليلك لاختيار فتحات التكييف (Grilles) وتنسيقها مع الأسقف الجبسية المعلقة لراحة تامة.',
    campaignObjective: 'تفاعل ووصول وعرض خبرات',
    marketingGoal: 'تثقيف العميل المستهدف وزيادة رغبة الطلب للتكييف المخفي بالاتفاق مع مهندسي الديكور',
    targetAudience: 'المهتمون بالتشطيبات والديكور الحديث، المقبلين على بناء منازلهم',
    targetAge: '25 - 45',
    targetGender: 'الجميع',
    targetLocation: 'جمهورية مصر العربية بصفة عامة والمدن الجديدة خاصة',
    interests: 'تصميم داخلي، تشطيبات فاخرة، معمار معاصر، جبس بورد',
    budget: 2000,
    expectedResults: 'ألف تفاعل وحفظ للمنشور لمراجعته لاحقاً',
    landingPageUrl: 'https://teec-eg.com/concealed-split-design',
    cta: 'المزيد من الديكورات (Explore Catalog)',
    notes: 'كاروسيل مكون من 5 صور تعرض تفاصيل دقيقة للغاية مخفية بجمالية.',
    status: 'Rejected',
    submittedBy: 'سارة الشافعي',
    submittedAt: '2026-06-13 16:40',
    rejectionReason: 'الرجاء تحديث الصور باللوجو الجديد لـ TEEC 2026 وتعديل الخط العربي المستخدم ليتطابق مع خط الهوية الأنيق.',
    approvedBy: 'طارق عبد العزيز',
    history: [
      { status: 'Draft', changedBy: 'سارة الشافعي', changedAt: '2026-06-13 14:00', comment: 'مسودة تثقيفية' },
      { status: 'Submitted', changedBy: 'سارة الشافعي', changedAt: '2026-06-13 16:40', comment: 'قيد الطلب' },
      { status: 'Rejected', changedBy: 'طارق عبد العزيز', changedAt: '2026-06-14 11:10', comment: 'الرجاء تحديث الصور باللوجو الجديد لـ TEEC 2026 وتعديل الخط العربي المستخدم ليتطابق مع خط الهوية الأنيق.' }
    ]
  }
];

export const INITIAL_CAMPAIGNS: CampaignData[] = [
  {
    id: 'cmp-201',
    name: 'حملة تكييفات الفيلا والقصور الكبرى VRF مصر',
    objective: 'Conversions (Sales)',
    status: 'نشط',
    budget: 15000,
    spend: 12450,
    audience: 'ملاك الفيلات والقصور والمجمعات السكنية الفاخرة',
    placements: ['Facebook Feed', 'Instagram Feed', 'Instagram Stories'],
    ageRange: '32 - 55',
    gender: 'الجميع',
    interests: ['عقارات فاخرة', 'فلل', 'ديكور راقي', 'تشطيب كونسيلد'],
    reach: 345000,
    impressions: 689000,
    leads: 480,
    messages: 710,
    purchases: 32,
    revenue: 540000,
    ads: [
      {
        id: 'ad-201-1',
        name: 'فيديو الواجهة المعمارية والتركيبات',
        creativeType: 'فيديو',
        spend: 5200,
        reach: 145000,
        impressions: 290000,
        leads: 210,
        messages: 320,
        purchases: 15,
        revenue: 260000,
        cpc: 0.45,
        cpm: 4.80,
        ctr: 2.1,
        score: 95,
        grade: 'A+'
      },
      {
        id: 'ad-201-2',
        name: 'صورة العرض الصيفي الاستثنائي (20% خصم)',
        creativeType: 'صورة',
        spend: 4800,
        reach: 130000,
        impressions: 265000,
        leads: 180,
        messages: 280,
        purchases: 12,
        revenue: 198000,
        cpc: 0.52,
        cpm: 5.10,
        ctr: 1.8,
        score: 88,
        grade: 'A'
      },
      {
        id: 'ad-201-3',
        name: 'كاروسيل مقارنة تكييف كونسيلد ضد VRF',
        creativeType: 'كاروسيل',
        spend: 2450,
        reach: 70000,
        impressions: 134000,
        leads: 90,
        messages: 110,
        purchases: 5,
        revenue: 82000,
        cpc: 0.65,
        cpm: 6.20,
        ctr: 1.2,
        score: 72,
        grade: 'B'
      }
    ]
  },
  {
    id: 'cmp-202',
    name: 'حملة توليد عملاء قطاع الأعمال B2B للمصانع والمنشآت',
    objective: 'Lead Generation',
    status: 'نشط',
    budget: 10000,
    spend: 7200,
    audience: 'أصحاب المصانع، الشركات الكبرى، مدراء المشتريات والصيانة الهندسيين',
    placements: ['Facebook Feed', 'Facebook Instant Articles'],
    ageRange: '28 - 60',
    gender: 'ذكور',
    interests: ['مصانع وأعمال', 'صيانة المنشآت', 'تبريد وتكييف مركزي', 'عقارات صناعية'],
    reach: 180000,
    impressions: 390000,
    leads: 290,
    messages: 180,
    purchases: 18,
    revenue: 380000,
    ads: [
      {
        id: 'ad-202-1',
        name: 'فيديو كواليس التنفيذ الميداني للمصانع',
        creativeType: 'فيديو',
        spend: 4200,
        reach: 105000,
        impressions: 220000,
        leads: 180,
        messages: 110,
        purchases: 11,
        revenue: 230000,
        cpc: 0.78,
        cpm: 8.40,
        ctr: 1.6,
        score: 91,
        grade: 'A'
      },
      {
        id: 'ad-202-2',
        name: 'صورة الإستشارة الفنية الهندسية المجانية',
        creativeType: 'صورة',
        spend: 3000,
        reach: 75000,
        impressions: 170000,
        leads: 110,
        messages: 70,
        purchases: 7,
        revenue: 150000,
        cpc: 0.92,
        cpm: 9.10,
        ctr: 1.1,
        score: 78,
        grade: 'B'
      }
    ]
  },
  {
    id: 'cmp-203',
    name: 'حملة التفاعل والوعي للمجتمعات الجديدة والتجمع وسيتس',
    objective: 'Engagement',
    status: 'متوقف',
    budget: 4000,
    spend: 4000,
    audience: 'المقبلون على السكن والتشطيب الفاخر بالمدن الجديدة',
    placements: ['Facebook Feed', 'Instagram Explore', 'Reels'],
    ageRange: '24 - 48',
    gender: 'الجميع',
    interests: ['مهندسي ديكور مصر', 'تفاصيل السكن الراقي', 'تشطيب شقق التجمع'],
    reach: 120000,
    impressions: 210000,
    leads: 60,
    messages: 340,
    purchases: 2,
    revenue: 35000,
    ads: [
      {
        id: 'ad-203-1',
        name: 'ريل كيف يبدو التكييف المركزي داخل السقف؟',
        creativeType: 'فيديو',
        spend: 2500,
        reach: 80000,
        impressions: 140000,
        leads: 45,
        messages: 230,
        purchases: 2,
        revenue: 35000,
        cpc: 0.22,
        cpm: 3.50,
        ctr: 3.1,
        score: 96,
        grade: 'A+'
      },
      {
        id: 'ad-203-2',
        name: 'كاروسيل ميزات التوزيع خماسي الاتجاهات',
        creativeType: 'كاروسيل',
        spend: 1500,
        reach: 40000,
        impressions: 70000,
        leads: 15,
        messages: 110,
        purchases: 0,
        revenue: 0,
        cpc: 0.38,
        cpm: 4.80,
        ctr: 0.9,
        score: 54,
        grade: 'D'
      }
    ]
  }
];

export const INITIAL_PAGE_ANALYTICS: PageAnalytics = {
  followers: 48500,
  newFollowers: 3240,
  reach: 980000,
  engagement: 76500,
  impressions: 1650000,
  likes: 21400,
  comments: 3890,
  shares: 1240,
  saves: 950,
  growthHistory: [
    { date: 'يناير', followers: 41000, reach: 780000, engagement: 58000 },
    { date: 'فبراير', followers: 42300, reach: 810000, engagement: 61000 },
    { date: 'مارس', followers: 43900, reach: 850000, engagement: 66000 },
    { date: 'أبريل', followers: 45200, reach: 900000, engagement: 71000 },
    { date: 'مايو', followers: 46800, reach: 940000, engagement: 74000 },
    { date: 'يونيو', followers: 48500, reach: 980000, engagement: 76500 }
  ]
};

export const INITIAL_BUDGET_CONTROLS: BudgetControl = {
  dailyLimit: 1200,
  monthlyLimit: 36000,
  currentSpend: 23650,
  alerts: [
    {
      id: 'alert-1',
      type: 'warning',
      message: 'اقترب الإنفاق لشهر يونيو (23,650$) من 65% من السقف الإجمالي للميزانية المقررة للمبيعات البصرية (36,000$).',
      timestamp: '2026-06-15 10:00'
    },
    {
      id: 'alert-2',
      type: 'info',
      message: 'معدل CPM لحملة B2B للمصانع يشهد استقراراً ملحوظاً تحت قيمة 9.5$. فرصة للتوسع (Scaling).',
      timestamp: '2026-06-14 17:35'
    },
    {
      id: 'alert-3',
      type: 'danger',
      message: 'انخفاض معدل ROAS الإعلاني للإعلان "كاروسيل ميزات التوزيع" إلى 0.0x خلال الـ 48 ساعة السابقة. قمنا بوقف الإعلان لتقنين التكلفة.',
      timestamp: '2026-06-13 11:15'
    }
  ]
};

export const INITIAL_TEAM_STATS: TeamMemberStats[] = [
  {
    id: 't1',
    name: 'سارة الشافعي',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    role: 'مدير التسويق (Marketing Manager)',
    submittedCount: 22,
    approvedCount: 19,
    rejectedCount: 2,
    publishedCount: 15,
    activeCampaigns: 2
  },
  {
    id: 't2',
    name: 'محمود الصاوي',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'مشتري إعلانات ومحلل (Media Buyer)',
    submittedCount: 12,
    approvedCount: 11,
    rejectedCount: 1,
    publishedCount: 11,
    activeCampaigns: 3
  },
  {
    id: 't3',
    name: 'هاني رمزي',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'صانع محتوى (Content Creator)',
    submittedCount: 35,
    approvedCount: 30,
    rejectedCount: 3,
    publishedCount: 27,
    activeCampaigns: 0
  },
  {
    id: 't4',
    name: 'ندى سليم',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'مصممة جرافيكس وهويات (Designer)',
    submittedCount: 28,
    approvedCount: 25,
    rejectedCount: 2,
    publishedCount: 22,
    activeCampaigns: 0
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script - نظام إدارة تسويق TEEC المتكامل
 * المزامنة المباشرة مع لوحة التحكم السحابية المتقدمة لشركة TEEC للتبريد والتكييف
 * 
 * طريقة الاستخدام:
 * 1. افتح جدول بيانات Google (Google Sheet).
 * 2. اضغط على "الامتدادات" (Extensions) ثم "Google Apps Script".
 * 3. امسح الكود القديم والصق هذا الكود بالكامل.
 * 4. اضغط على زر الحفظ ثم زر النشر > "تطبيق ويب" (Web App).
 * 5. اضبط الصلاحيات ليكون الوصول متاحاً لـ "أي شخص" (Anyone).
 * 6. انسخ رابط تطبيق الويب (Deployment URL) والصقه في لوحة التحكم في تبويب مستندات Google Sheets لتفعيل الربط التلقائي والحي.
 */

const SHEET_NAMES = {
  CAMPAIGNS: 'Campaigns_DB',
  CONTENT: 'Content_DB',
  BUDGETS: 'Budgets_DB',
  LOGS: 'Activity_Logs_DB'
};

// إنشاء أوراق العمل والترويسات تلقائياً في أول تشغيل
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ لوحة إدارة تسويق TEEC')
    .addItem('🟢 تهيئة قواعد البيانات بالكامل', 'setupDatabaseSheets')
    .addItem('📊 تحديث إحصائيات المبيعات الإعلانية', 'updateAdStats')
    .addToUi();
}

/**
 * تهيئة الجداول وحقول البيانات الأساسية
 */
function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ورقة الحملات الإعلانية
  let campSheet = ss.getSheetByName(SHEET_NAMES.CAMPAIGNS);
  if (!campSheet) {
    campSheet = ss.insertSheet(SHEET_NAMES.CAMPAIGNS);
    campSheet.appendRow([
      'معرف الحملة', 'اسم الحملة', 'الهدف الإعلاني', 'الحالة', 'الميزانية', 'الإنفاق الحالي',
      'الجمهور المستهدف', 'الوصول Reach', 'الظهور Impressions', 'العملاء Leads', 'الرسائل Messages',
      'المبيعات Purchases', 'العوائد Revenue', 'تحديث الأخير'
    ]);
    campSheet.getRange("A1:N1").setBackground("#1D4ED8").setFontColor("#FFFFFF").setFontWeight("bold");
    // إدراج بيانات تجريبية أولية
    campSheet.appendRow([
      'cmp-201', 'حملة تكييفات الفيلا والقصور الكبرى VRF مصر', 'Conversions', 'نشط', 15000, 12450,
      'ملاك الفيلات والقصور والتجمع الخامس', 345000, 689000, 480, 710, 32, 540000, new Date().toLocaleString('ar-EG')
    ]);
  }
  
  // 2. ورقة المحتوى والمخطط الزمني
  let contentSheet = ss.getSheetByName(SHEET_NAMES.CONTENT);
  if (!contentSheet) {
    contentSheet = ss.insertSheet(SHEET_NAMES.CONTENT);
    contentSheet.appendRow([
      'معرف المنشور', 'العنوان', 'النوع', 'رابط الصورة/الفيديو', 'نص المنشور', 'الجمهور', 'الفئة العمرية',
      'الجنس المستهدف', 'الموقع الجغرافي', 'الميزانية المخصصة', 'الحالة الحالية', 'صاحب الإدخال',
      'تاريخ التقديم', 'تاريخ الموافقة', 'سبب الرفض إن وجد'
    ]);
    contentSheet.getRange("A1:O1").setBackground("#047857").setFontColor("#FFFFFF").setFontWeight("bold");
    contentSheet.appendRow([
      'c-101', 'تكييفات TEEC الذكية للشركات والمصانع', 'Video', 'https://images.unsplash.com/...',
      'نقدم في TEEC أقوى حلول التبريد والتهوية للمصانع والمنشآت التجارية...', 'أصحاب المصانع ومدراء الصيانة',
      '28-55', 'الجميع', 'القاهرة والمناصل الصناعية', 6500, 'Approved', 'سارة الشافعي', '2026-06-12', '2026-06-13', ''
    ]);
  }
  
  // 3. ورقة الميزانيات والتحكم بالإنفاق
  let budgetSheet = ss.getSheetByName(SHEET_NAMES.BUDGETS);
  if (!budgetSheet) {
    budgetSheet = ss.insertSheet(SHEET_NAMES.BUDGETS);
    budgetSheet.appendRow(['سقف الميزانية الشهري', 'الحد اليومي', 'الإنفاق الإجمالي للآن', 'نسبة الاستهلاك', 'عدد الحملات الجارية']);
    budgetSheet.getRange("A1:E1").setBackground("#B45309").setFontColor("#FFFFFF").setFontWeight("bold");
    budgetSheet.appendRow([36000, 1200, 23650, '=C2/A2', 2]);
  }
  
  // 4. سجل العمليات والشفافية
  let logSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAMES.LOGS);
    logSheet.appendRow(['التسلسل الزمني', 'المستخدم', 'الصلاحية الدور', 'العملية المنجزة', 'التفاصيل الدقيقة']);
    logSheet.getRange("A1:E1").setBackground("#4B5563").setFontColor("#FFFFFF").setFontWeight("bold");
    logSheet.appendRow([new Date().toLocaleString('ar-EG'), 'marketing_teec', 'MARKETING_MANAGER', 'إنشاء قاعدة البيانات', 'تثبيت الأوراق لجدول TEEC للتسويق الرقمي']);
  }
  
  SpreadsheetApp.getUi().alert('🟢 تم تهيئة وإنشاء قواعد بيانات TEEC في جدول البيانات الحالي بنجاح عارم!');
}

/**
 * التعامل مع طلبات GET وتحديث واجهة قراءة البيانات
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    campaigns: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.CAMPAIGNS)),
    content: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.CONTENT)),
    budgets: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.BUDGETS)),
    logs: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.LOGS))
  };
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
                       .setMimeType(ContentService.MimeType.JSON);
}

/**
 * تحويل أسطر جدول البيانات تلقائياً لحزم تواصل وسجلات JSON
 */
function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const jsonArray = [];
  
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    const row = rows[i];
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    jsonArray.push(obj);
  }
  return jsonArray;
}

/**
 * استقبال البيانات وتعديلهامن لوحة تحكم React عبر بروتوكول POST
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = postData.action;
    
    // تسجيل العملية في النشاطات تلقائياً
    const logSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
    if (logSheet) {
      logSheet.appendRow([
        new Date().toLocaleString('ar-EG'),
        postData.username || 'أوبن آب',
        postData.role || 'GUEST',
        action,
        JSON.stringify(postData.details || {})
      ]);
    }
    
    if (action === 'submitContent') {
      const sheet = ss.getSheetByName(SHEET_NAMES.CONTENT);
      if (sheet) {
        const item = postData.item;
        sheet.appendRow([
          item.id, item.title, item.type, item.mediaUrl, item.contentCopy,
          item.targetAudience, item.targetAge, item.targetGender, item.targetLocation,
          item.budget, item.status, item.submittedBy, item.submittedAt, '', ''
        ]);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Content Submitted successfully.' }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (action === 'updateContentStatus') {
      const sheet = ss.getSheetByName(SHEET_NAMES.CONTENT);
      if (sheet) {
        const rows = sheet.getDataRange().getValues();
        const contentId = postData.contentId;
        const newStatus = postData.status;
        const comment = postData.comment || '';
        const approvedBy = postData.approvedBy || '';
        
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][0] === contentId) {
            sheet.getCell(i + 1, 11).setValue(newStatus); // Update Status
            if (newStatus === 'Approved') {
              sheet.getCell(i + 1, 14).setValue(new Date().toLocaleDateString('ar-EG')); // Approval Date
              sheet.getCell(i + 1, 15).setValue(approvedBy); // Approved By
            } else if (newStatus === 'Rejected') {
              sheet.getCell(i + 1, 15).setValue(comment); // Rejection reason
            }
            break;
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Status updated.' }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: 'Action not supported: ' + action }))
                         .setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;
