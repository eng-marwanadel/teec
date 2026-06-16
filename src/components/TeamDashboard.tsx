import React from 'react';
import { TeamMemberStats, User } from '../types';
import { 
  Users, 
  CheckCircle, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  MessageSquare, 
  ChevronLeft 
} from 'lucide-react';

interface TeamDashboardProps {
  teamStats: TeamMemberStats[];
  currentUser: User;
  darkMode: boolean;
}

export default function TeamDashboard({ teamStats, currentUser, darkMode }: TeamDashboardProps) {

  const getRankBadgeColor = (idx: number) => {
    switch (idx) {
      case 0:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'; // Gold
      case 1:
        return 'bg-slate-300/10 text-slate-300 border border-slate-300/20'; // Silver
      default:
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20'; // Bronze
    }
  };

  return (
    <div id="team_dashboard" className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            أداء وإنتاجية فريق العمل التسويقي
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة فورية ومستمرة لنشاط المصممين، كتاب المحتوى، ومشتري الإعلانات لـ TEEC لضمان كفاءة الإنتاج.
          </p>
        </div>
      </div>

      {/* Leaderboard layout / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Employee Cards list */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className={`text-sm font-bold flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-950'}`}>
            <Users className="w-4 h-4 text-blue-500" />
            <span>لوحة أداء الموظفين التفصيلية</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamStats.map((stats, idx) => (
              <div 
                key={stats.id}
                className={`p-5 rounded-2xl border ${
                  darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                {/* Employee Info Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <img 
                      src={stats.avatar} 
                      alt={stats.name} 
                      className="w-11 h-11 rounded-full object-cover border border-blue-500/10"
                    />
                    <div>
                      <h4 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{stats.role}</p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getRankBadgeColor(idx)}`}>
                    المرتبة {idx + 1}
                  </span>
                </div>

                {/* Counter metrics list */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] bg-slate-950/20 p-3 rounded-xl border border-slate-850">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold">المنشورات المعتمدة:</span>
                    <span className="text-white font-extrabold text-xs">{stats.approvedCount} منشور</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold">بانتظار الإجراء:</span>
                    <span className="text-amber-500 font-extrabold text-xs">{(stats.submittedCount - stats.approvedCount)} معلق</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold">الحملات النشطة:</span>
                    <span className="text-emerald-400 font-bold text-xs">{stats.activeCampaigns} حملة</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold">المنشورات المنشورة:</span>
                    <span className="text-slate-400 font-bold text-xs">{stats.publishedCount} منشور</span>
                  </div>
                </div>

                {/* Progress bars layout with safety thresholds */}
                <div className="space-y-2 mt-4 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>معدل الالتزام بخط النشر الحاد:</span>
                      <span className="font-bold text-blue-400">95%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>دقة المخططات الفنية (TEEC Accuracy):</span>
                      <span className="font-bold text-emerald-400">98%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick activities logs per roles */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-md'
          }`}>
            <h3 className={`text-sm font-bold pb-2.5 border-b border-slate-800 dark:border-slate-800 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              سجل نشاط العمل الأخير
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-white font-bold">مراجعة كلفة النقرة (CPC) لجميع الإعلانات</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">بواسطة: مشتري الإعلانات - منذ ساعتين</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-white font-bold">تقديم تصميم لخصومات التكييف الكونسيلد لفيسبوك</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">بواسطة: المصمم الفني - منذ 5 ساعات</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-white font-bold">تقديم طلب منشور الـ VRF صانع المحتوى الجديد</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">بواسطة: مدير التسويق - منذ يوم واحد</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-white font-bold">المصادقة على ميزانية حملات يونيو الإعلانية</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">بواسطة: المدير العام - منذ يومين</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
