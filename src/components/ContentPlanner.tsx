import React, { useState } from 'react';
import { ContentItem, PostType, ContentStatus, UserRole, User } from '../types';
import { 
  Calendar, 
  Plus, 
  FileText, 
  Video, 
  Layers, 
  Bookmark, 
  TrendingUp, 
  CheckCircle, 
  XOctagon, 
  Clock, 
  AlertCircle,
  Eye,
  Settings,
  Link,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ContentPlannerProps {
  contentItems: ContentItem[];
  currentUser: User;
  onAddContentItem: (item: Omit<ContentItem, 'id' | 'submittedBy' | 'submittedAt' | 'history'>) => void;
  darkMode: boolean;
}

export default function ContentPlanner({ contentItems, currentUser, onAddContentItem, darkMode }: ContentPlannerProps) {
  const [activeTab, setActiveTab] = useState<'scheduler' | 'newRequest'>('scheduler');
  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  
  // Submission form fields state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PostType>('Image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [contentCopy, setContentCopy] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('جمع بيانات العملاء المحتملين (Lead Generation)');
  const [marketingGoal, setMarketingGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [targetAge, setTargetAge] = useState('25-45');
  const [targetGender, setTargetGender] = useState<'الجميع' | 'ذكور' | 'إناث'>('الجميع');
  const [targetLocation, setTargetLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState(1500);
  const [expectedResults, setExpectedResults] = useState('');
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [cta, setCta] = useState('احجز الآن (Book Now)');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Simulating calendar navigation date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 15)); // June 15, 2026

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contentCopy || !targetAudience || !marketingGoal) {
      alert('يرجى ملء الحقول الإلزامية لتأكيد تسجيل المخطط');
      return;
    }

    onAddContentItem({
      title,
      type,
      mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&fit=crop',
      contentCopy,
      campaignObjective,
      marketingGoal,
      targetAudience,
      targetAge,
      targetGender,
      targetLocation,
      interests,
      budget,
      expectedResults,
      landingPageUrl: landingPageUrl || 'https://teec-eg.com',
      cta,
      notes,
      status: 'Submitted' // Defaults to Submitted workflow on creation
    });

    setFormSuccess('تم تقديم طلب المحتوى وتمريره لإدارة الموافقات والمراجعة لدى المدير العام بنجاح!');
    
    // reset form
    setTitle('');
    setContentCopy('');
    setMarketingGoal('');
    setTargetAudience('');
    setActiveTab('scheduler');
    
    setTimeout(() => {
      setFormSuccess('');
      setActiveTab('scheduler');
    }, 2500);
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      case 'Submitted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Under Review':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Scheduled':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Published':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    }
  };

  const getStatusArabic = (status: ContentStatus) => {
    const map: Record<ContentStatus, string> = {
      Draft: 'مسودة جارية',
      Submitted: 'بانتظار الاعتماد',
      'Under Review': 'قيد المراجعة الفنية',
      Approved: 'معتمد ومقبول',
      Rejected: 'مرفوض للتعديل',
      Scheduled: 'مجدول النشر',
      Published: 'منشور وحي'
    };
    return map[status];
  };

  const getPostTypeIcon = (pType: PostType) => {
    switch (pType) {
      case 'Video':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'Reel':
        return <TrendingUp className="w-4 h-4 text-pink-400" />;
      case 'Carousel':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'Story':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  // Calendar dates mock grid
  const getCalendarDays = () => {
    // June 2026 Grid starting Sunday May 31 to Sat July 4
    const days = [];
    // Just mock June 1 to June 30
    for (let i = 1; i <= 30; i++) {
      days.push(new Date(2026, 5, i));
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const currentMonthYearName = 'يونيو 2026';

  const filteredItems = statusFilter === 'ALL' 
    ? contentItems 
    : contentItems.filter(item => item.status === statusFilter);

  return (
    <div id="content_planner" className="space-y-6">
      {/* Tab bar header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            تخطيط المحتوى والتقويم الإعلاني المنظم
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            صياغة وجدولة المحتوى الرقمي المتكامل لـ TEEC تبريد وتمريره في مسارات الاعتماد الأمنية والمراجعة.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scheduler' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            روزنامة تخطيط المحتوى
          </button>
          {currentUser.role === UserRole.MARKETING_MANAGER || currentUser.role === UserRole.GENERAL_MANAGER ? (
            <button
              onClick={() => setActiveTab('newRequest')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 space-x-reverse ${
                activeTab === 'newRequest' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تقديم طلب محتوى جديد (15 حقل)</span>
            </button>
          ) : (
            <div className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-500 flex items-center">
              * طلب المحتوى متاح لمدير التسويق فقط
            </div>
          )}
        </div>
      </div>

      {formSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2 space-x-reverse">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {activeTab === 'scheduler' ? (
        <div className="space-y-6">
          {/* Calendar Views & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-100 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* View selectors */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xs text-slate-400 font-bold ml-1">الدورة الزمنية:</span>
              {(['daily', 'weekly', 'monthly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase ${
                    calendarView === view 
                      ? 'bg-slate-950 text-white shadow' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {view === 'daily' ? 'يومي' : view === 'weekly' ? 'أسبوعي' : 'شهري'}
                </button>
              ))}
            </div>

            {/* Status filters */}
            <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-2">
              <span className="text-xs text-slate-400 font-bold ml-1">تصفية الحالة:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
                  statusFilter === 'ALL' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                الكل ({contentItems.length})
              </button>
              {(['Submitted', 'Approved', 'Rejected', 'Scheduled', 'Published'] as ContentStatus[]).map((st) => {
                const count = contentItems.filter(item => item.status === st).length;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
                      statusFilter === st ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {getStatusArabic(st)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Calendar / List according to view */}
          {calendarView === 'monthly' ? (
            <div className={`p-4 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-100 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-205 dark:border-slate-800">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    مخطط الشهر: {currentMonthYearName}
                  </span>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid Week headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-805">
                <div>الأحد</div>
                <div>الاثنين</div>
                <div>الثلاثاء</div>
                <div>الأربعاء</div>
                <div>الخميس</div>
                <div>الجمعة</div>
                <div>السبت</div>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-2 mt-2">
                {/* Simulated June 2026 starts on Monday June 1. Sunday May 31 represents 1 empty day */}
                <div className="h-20 bg-slate-950/20 border border-transparent opacity-30 rounded-xl" />
                {calendarDays.map((day, idx) => {
                  const dayNum = day.getDate();
                  // Sample posts scheduled for days:
                  // June 12: post c-101 (Approved)
                  // June 15: post c-102 (Scheduled)
                  // June 16: post c-103 (Under Review)
                  // June 13: post c-104 (Rejected)
                  const dayItems = filteredItems.filter(item => {
                    const submittedDay = parseInt(item.submittedAt.split(' ')[0].split('-')[2]);
                    return submittedDay === dayNum || (dayNum === 15 && item.status === 'Scheduled');
                  });

                  return (
                    <div 
                      key={idx} 
                      className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between text-right transition-all group ${
                        dayNum === 15 
                          ? 'bg-blue-600/10 border-blue-500/40 shadow-sm' 
                          : darkMode 
                            ? 'bg-slate-950/40 border-slate-850 hover:border-slate-700' 
                            : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400">{dayNum}</span>
                      
                      {/* Scheduled content blocks inside the cell */}
                      <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                        {dayItems.map((item) => (
                          <div 
                            key={item.id} 
                            className={`p-1 text-[9px] rounded border truncate flex items-center space-x-1 space-x-reverse ${getStatusBadge(item.status)}`}
                            title={item.title}
                          >
                            {getPostTypeIcon(item.type)}
                            <span className="truncate">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Daily / Weekly list layout
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-2xl border flex flex-col justify-between relative group overflow-hidden ${
                    darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="p-2 w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                        {getPostTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                          {getStatusArabic(item.status)}
                        </span>
                        <h4 className={`text-xs font-bold leading-tight mt-1 truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          بواسطة: {item.submittedBy} | {item.submittedAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className={`text-[11px] leading-relaxed mt-3 line-clamp-3 p-3 rounded-xl ${
                    darkMode ? 'bg-slate-950/50 text-slate-300' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {item.contentCopy}
                  </p>

                  {/* Metadata labels */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-400 border-t border-slate-150 dark:border-slate-800 pt-3">
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 font-bold">الجمهور:</span>
                      <span className="truncate block font-semibold">{item.targetAudience}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 font-bold">الهدف والموقع:</span>
                      <span className="truncate block font-semibold">{item.targetLocation} | {item.campaignObjective}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 font-bold">الميزانية المقدرة:</span>
                      <span className="font-extrabold text-blue-400">${item.budget}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500 font-bold">المنصة والإجراء (CTA):</span>
                      <span className="truncate block font-semibold text-rose-400">{item.cta}</span>
                    </div>
                  </div>

                  {item.rejectionReason && (
                    <div className="mt-3 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-[10px] text-rose-400">
                      <strong className="block text-[9px] mb-0.5 font-bold">سبب رفض الإدارة:</strong>
                      {item.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Form content item request submission */
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="mb-6 flex items-center space-x-2 space-x-reverse text-blue-500">
            <Bookmark className="w-5 h-5" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              استمارة تقديم وتخطيط إعلان محتوى متكامل (15 حقل معزز لـ TEEC)
            </h3>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Field 1: Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  عنوان المنشور / الإشعار الإعلاني <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خصومات VRF لتبريد الفيلات"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 2: Post Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">نوع تنسيق المحتوى</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PostType)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="Image">صورة مفردة (Image)</option>
                  <option value="Video">فيديو فني (Video)</option>
                  <option value="Reel">مقطع ريلز سريع (Reel)</option>
                  <option value="Carousel">كاروسيل صور متعدد (Carousel)</option>
                  <option value="Story">قصة يومية (Story)</option>
                </select>
              </div>

              {/* Field 3: Upload Media (Simulated URL Link) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">الملف الإبداعي / رابط التصميم (من درايف)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="أدخل رابط صورة أو فيديو للتصميم من Unsplash أو Drive"
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none focus:border-blue-500 text-white"
                  />
                  <Link className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Field 4: Marketing Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الهدف التسويقي للمنشور <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={marketingGoal}
                  onChange={(e) => setMarketingGoal(e.target.value)}
                  placeholder="مثال: زيادة الثقة بـ VRF لشركة TEEC"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 5: Campaign Objective */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الهدف الإعلاني (Meta Objective)</label>
                <select
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                >
                  <option>جمع بيانات جهات اتصال (Lead Gen)</option>
                  <option>توليد وزيادة تفاعل صفحة (Engagement)</option>
                  <option>التفاعل المباشر ومبيعات (Conversions)</option>
                  <option>الوعي بالعلامة النشر (Brand Awareness)</option>
                </select>
              </div>

              {/* Field 6: Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الجمهور المستهدف بدقة <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="مثال: ملاك الفلل السكنية الفاخرة بالتجمع"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 7: Target Age Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الفئات العمرية المستهدفة</label>
                <input
                  type="text"
                  value={targetAge}
                  onChange={(e) => setTargetAge(e.target.value)}
                  placeholder="مثال: 30 - 55"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 8: Target Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الجنس المستهدف</label>
                <select
                  value={targetGender}
                  onChange={(e) => setTargetGender(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="الجميع">الجميع (ذكور وإناث)</option>
                  <option value="ذكور">رجال فقط (ذكور)</option>
                  <option value="إناث">سيدات فقط (إناث)</option>
                </select>
              </div>

              {/* Field 9: Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">النطاق الجغرافي / المدن</label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  placeholder="مثال: القاهرة الجديدة، أكتوبر، الساحل"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 10: Interests */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الاهتمامات التفصيلية</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="مثال: فلل راقية، تشطيب معمار HVAC"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 11: Budget */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">الميزانية التقديرية المقررة ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 12: Expected Results */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">النتائج الفورية المتوقعة</label>
                <input
                  type="text"
                  value={expectedResults}
                  onChange={(e) => setExpectedResults(e.target.value)}
                  placeholder="مثال: 50 طلب حجز صيفي مؤكد كعميل"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 13: Landing Page */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">رابط صفحة الهبوط (Landing Page URL)</label>
                <input
                  type="url"
                  value={landingPageUrl}
                  onChange={(e) => setLandingPageUrl(e.target.value)}
                  placeholder="https://teec-eg.com/hvac"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 14: CTA */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">عبارة اتخاذ الإجراء (CTA)</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="مثال: اتصل الآن (Call Now)"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Field 15: Post Copy */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  نص المنشور الإبداعي المصاغ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={contentCopy}
                  onChange={(e) => setContentCopy(e.target.value)}
                  placeholder="اكتب المحتوى التسويقي الجذاب هنا بالتفصيل مضافاً إليه الإيموجيز المناسبة..."
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">ملاحظات وتوجيهات أخرى</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات تشطيب فني، مواعيد معينة مفضلة..."
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow shadow-blue-500/15 flex items-center space-x-1.5 space-x-reverse"
              >
                <CheckCircle className="w-5 h-5" />
                <span>ترحيل واعتماد للمدير العام لدراسة المنشور</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
