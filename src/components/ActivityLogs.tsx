import React from 'react';
import { LoginHistory, ActivityLog, User } from '../types';
import { 
  History, 
  UserCheck, 
  ShieldAlert, 
  Terminal, 
  HelpCircle, 
  Clock, 
  Lock 
} from 'lucide-react';

interface ActivityLogsProps {
  loginHistory: LoginHistory[];
  activityLogs: ActivityLog[];
  currentUser: User;
  darkMode: boolean;
}

export default function ActivityLogs({ loginHistory, activityLogs, currentUser, darkMode }: ActivityLogsProps) {
  
  const getStatusBadge = (status: 'نجاح' | 'فشل') => {
    return status === 'نجاح' 
      ? darkMode 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : darkMode 
        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' 
        : 'bg-rose-50 text-rose-700 border border-rose-200';
  };

  return (
    <div id="activity_logs_panel" className="space-y-6 text-right">
      
      {/* Header Panel */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 ${
        darkMode ? 'border-slate-800' : 'border-slate-205'
      }`}>
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            سجل العمليات التاريخية والأمان الآمن
          </h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
            متابعة فورية ومسجلة لجميع نشاطات تسجيل الدخول، ومحاولات الاستخدام لأعضاء فريق عمل TEEC لضمان الأمان والتدقيق المستمر.
          </p>
        </div>
      </div>

      {/* Split into Logins vs. Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Col Left: Security logins logging */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className={`text-sm font-black flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>سجل تسجيل الدخول ومراجعة الجلسات الآمنة</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {loginHistory.map((rec) => (
              <div 
                key={rec.id} 
                className={`p-4 rounded-xl border text-xs transition-all ${
                  darkMode 
                    ? 'border-slate-800 bg-slate-900/40 text-slate-300' 
                    : 'border-slate-300 bg-white text-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-black text-[11.5px] ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                    {rec.username}
                  </span>
                  <span className={`text-[9.5px] px-2 py-0.5 rounded font-black ${getStatusBadge(rec.status)}`}>
                    محاولة دخول {rec.status}
                  </span>
                </div>
                <div className="text-[10px] space-y-1">
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-600 font-bold'}>
                    الدور الوظيفي: <strong className={darkMode ? 'text-slate-250' : 'text-slate-900 font-black'}>{rec.role}</strong>
                  </p>
                  <p className={`truncate ${darkMode ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
                    جهاز الارتباط الحاسم: {rec.device}
                  </p>
                  <p className={`text-[10px] flex items-center font-bold ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Clock className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    {rec.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col Right: Activity Logging actions */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className={`text-sm font-black flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <span>سجل تعديلات وإجراءات قاعدة البيانات</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                  darkMode 
                    ? 'border-slate-800 bg-slate-900/40 text-slate-300' 
                    : 'border-slate-300 bg-white text-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-black text-[11px] ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                    {log.username} ({log.role})
                  </span>
                  <span className={`text-[9.5px] font-mono font-bold ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {log.timestamp}
                  </span>
                </div>
                <p className={`font-black text-[11px] leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  الإجراء: {log.action}
                </p>
                {log.details && (
                  <p className={`text-[10.5px] p-2.5 rounded-lg mt-2 font-mono font-bold ${
                    darkMode 
                      ? 'bg-slate-950/60 border border-slate-800 text-teal-400' 
                      : 'bg-slate-50 border border-slate-200 text-blue-900'
                  }`}>
                    {log.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
