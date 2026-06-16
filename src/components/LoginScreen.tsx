import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { SYSTEM_USERS } from '../mockData';
import { Key, ShieldAlert, UserCheck, Lock, ChevronRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onAddLoginHistory: (record: { username: string; role: UserRole; status: 'نجاح' | 'فشل'; device: string }) => void;
}

export default function LoginScreen({ onLoginSuccess, onAddLoginHistory }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [error, setError] = useState('');

  const handleQuickLogin = (payload: User) => {
    setSelectedUser(payload);
    setPassword('••••••••'); // Autofill dummy for quick test
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManual) {
      if (!selectedUser) {
        setError('يرجى تحديد مستخدم لتسجيل الدخول السريع');
        return;
      }
      // Log Success
      onAddLoginHistory({
         username: selectedUser.username,
         role: selectedUser.role,
         status: 'نجاح',
         device: navigator.userAgent.includes('Mobi') ? 'هاتف محمول - متصفح سفاري' : 'جهاز كمبيوتر - متصفح كروم'
      });
      onLoginSuccess(selectedUser);
    } else {
      if (!customUsername.trim() || !password.trim()) {
        setError('يرجى ملء جميع حقول تسجيل الدخول');
        return;
      }
      // Check if user exists in pre-defined list
      const matched = SYSTEM_USERS.find(u => u.username === customUsername.trim());
      if (matched && password === '123456') {
        onAddLoginHistory({
          username: customUsername,
          role: matched.role,
          status: 'نجاح',
          device: 'جهاز كمبيوتر - متصفح فايرفوكس'
        });
        onLoginSuccess(matched);
      } else {
        onAddLoginHistory({
          username: customUsername || 'مستخدم_غير_معروف',
          role: matched ? matched.role : UserRole.VIEWER,
          status: 'فشل',
          device: 'محاولة اختراق محتملة - جهاز مجهول'
        });
        setError('خطأ في اسم المستخدم أو كلمة المرور (للتجربة الرمز هو: 123456 للمستخدمين المسجلين)');
      }
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case UserRole.MARKETING_MANAGER:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case UserRole.MEDIA_BUYER:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case UserRole.CONTENT_CREATOR:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case UserRole.DESIGNER:
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getRoleArabicName = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'المدير العام (GM)';
      case UserRole.MARKETING_MANAGER:
        return 'مدير التسويق (Marketing Manager)';
      case UserRole.MEDIA_BUYER:
        return 'مشتري الإعلانات (Media Buyer)';
      case UserRole.CONTENT_CREATOR:
        return 'صانع المحتوى (Content Creator)';
      case UserRole.DESIGNER:
        return 'المصمم (Designer)';
      default:
        return 'مشاهد (Viewer)';
    }
  };

  return (
    <div id="login_card_wrapper" className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-500/30">
            <span className="text-white font-black text-2xl tracking-widest">TEEC</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-sans">
          مركز السيطرة والتحكم التسويقي
        </h2>
        <p className="text-sm text-slate-400 max-w">
          بوابة الإدارة الشاملة وربط Meta ومزامنة Google Sheets لشركاء النجاح
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <div className="flex justify-center space-x-4 space-x-reverse mb-6 border-b border-slate-800 pb-4">
            <button
              onClick={() => { setIsManual(false); setError(''); }}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-all ${
                !isManual ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              دخول سريع للأدوار التجريبية
            </button>
            <button
              onClick={() => { setIsManual(true); setError(''); }}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-all ${
                isManual ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              تسجيل دخول مخصص (آمن)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center space-x-3 space-x-reverse text-red-400 text-xs">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isManual ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-400">
                  اختر من أعضاء الفريق للتقمص الفوري واختبار الصلاحيات:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {SYSTEM_USERS.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickLogin(user)}
                      className={`flex items-center space-x-3 space-x-reverse p-3 rounded-xl border transition-all text-right ${
                        selectedUser?.id === user.id
                          ? 'bg-blue-600/10 border-blue-500/80 shadow-md shadow-blue-500/5'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
                        <span className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>
                          {getRoleArabicName(user.role)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-medium text-slate-300 mb-1">
                    اسم المستخدم (مثال: manager_teec)
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      dir="ltr"
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value)}
                      placeholder="manager_teec"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
                    كلمة المرور المشفرة (التجريبية: 123456)
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              id="login_submit_btn"
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 space-x-reverse hover:translate-y-[-1px] text-sm"
            >
              <UserCheck className="w-5 h-5" />
              <span>دخول آمن إلى لوحة التحكم</span>
            </button>
          </form>

          <div className="mt-6 flex flex-col space-y-2 text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4">
            <span className="flex items-center justify-center space-x-1 space-x-reverse">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>تشفير 256-bit نشط لمزامنة Meta و Google Sheets</span>
            </span>
            <span>بوابة موحدة ومحمية لشركة TEEC للتكييف والتوريدات الهندسية © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
