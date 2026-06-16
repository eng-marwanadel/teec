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
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
      : 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
  };

  return (
    <div id="activity_logs_panel" className="space-y-6 text-right">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            سجل العمليات التاريخية والأمان الآمن
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة فورية ومسجلة لجميع نشاطات تسجيل الدخول، ومحاولات الاستخدام لأعضاء فريق عمل TEEC لضمان الأمان والتدقيق المستمر.
          </p>
        </div>
      </div>

      {/* Split into Logins vs. Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Col Left: Security logins logging */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className={`text-sm font-bold flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-950'}`}>
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>سجل تسجيل الدخول ومراجعة الجلسات الآمنة</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {loginHistory.map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-white text-[11px]">{rec.username}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${getStatusBadge(rec.status)}`}>
                    محاولة دمج {rec.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <p>الدور الوظيفي: <strong className="text-slate-300">{rec.role}</strong></p>
                  <p className="truncate">جهاز الارتباط الحاسم: {rec.device}</p>
                  <p className="text-[9.5px] text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 ml-1" />
                    {rec.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col Right: Activity Logging actions */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className={`text-sm font-bold flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-950'}`}>
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>سجل تعديلات وإجراءات قاعدة البيانات</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl border border-slate-805 bg-slate-900/20 text-xs leading-relaxed">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-[10.5px]">{log.username} ({log.role})</span>
                  <span className="text-[9px] font-mono text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-semibold text-[11px] leading-relaxed">
                  الإجراء: {log.action}
                </p>
                {log.details && (
                  <p className="text-[10px] text-slate-500 bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg mt-2 font-mono">
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
