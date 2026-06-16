import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ClipboardCheck, 
  Share2, 
  DollarSign, 
  Users, 
  Database, 
  FileSpreadsheet, 
  History, 
  LogOut, 
  ChevronLeft,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  pendingApprovalsCount: number;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currencySettings: { code: string; symbol: string; rate: number };
  onCurrencyChange: (code: string) => void;
}

export default function Sidebar({ 
  currentUser, 
  onLogout, 
  selectedTab, 
  setSelectedTab, 
  pendingApprovalsCount,
  darkMode,
  setDarkMode,
  currencySettings,
  onCurrencyChange
}: SidebarProps) {

  const getRoleArabicName = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'المدير العام';
      case UserRole.MARKETING_MANAGER:
        return 'مدير التسويق';
      case UserRole.MEDIA_BUYER:
        return 'مشتري الإعلانات';
      case UserRole.CONTENT_CREATOR:
        return 'صانع المحتوى';
      case UserRole.DESIGNER:
        return 'المصمم الفني';
      default:
        return 'مشاهد';
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case UserRole.MARKETING_MANAGER:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case UserRole.MEDIA_BUYER:
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard },
    { id: 'content', label: 'تخطيط المحتوى والتقويم', icon: CalendarDays },
    { 
      id: 'approval', 
      label: 'مراجعات واعتمادات الإدارة', 
      icon: ClipboardCheck,
      badge: currentUser.role === UserRole.GENERAL_MANAGER && pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { id: 'meta', label: 'تحليلات وإعلانات Meta', icon: Share2 },
    { id: 'budget', label: 'مركز التحكم بالميزانيات', icon: DollarSign },
    { id: 'team', label: 'أداء نشاطات فريق العمل', icon: Users },
    { id: 'sheets', label: 'قاعدة بيانات Google Sheets', icon: FileSpreadsheet },
    { id: 'reports', label: 'مركز استخراج التقارير', icon: Database },
    { id: 'logs', label: 'سجلات العمليات والأمان', icon: History }
  ];

  const currencyOptions = [
    { code: 'EGP', label: 'ج.م', name: 'جنيه مصري' },
    { code: 'USD', label: '$', name: 'دولار أمريكي' },
    { code: 'SAR', label: 'ر.س', name: 'ريال سعودي' },
    { code: 'AED', label: 'د.إ', name: 'درهم إماراتي' }
  ];

  return (
    <aside id="sidebar_nav" className="w-72 flex-shrink-0 flex flex-col bg-white border-l border-slate-200 shadow-sm transition-all duration-200">
      {/* Top Brand Header */}
      <div className="p-5 flex flex-col space-y-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/10 border border-blue-400/20">
              <span className="text-white font-extrabold text-sm tracking-widest">TEEC</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-800">
                TEEC Control Room
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">نظام إدارة التسويق الرقمي</p>
            </div>
          </div>
        </div>

        {/* Currency Quick Selector Selector */}
        <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200/50">
          <p className="text-[10px] text-slate-500 font-bold mb-1.5 px-1 flex items-center justify-between">
            <span>العملة المفضلة للتطبيق:</span>
            <span className="text-blue-600 font-semibold">{currencySettings.code} ({currencySettings.symbol})</span>
          </p>
          <div className="grid grid-cols-4 gap-1">
            {currencyOptions.map((opt) => (
              <button
                key={opt.code}
                onClick={() => onCurrencyChange(opt.code)}
                className={`py-1 rounded text-[11px] font-bold transition-all ${
                  currencySettings.code === opt.code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-205'
                }`}
                title={opt.name}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Status Profile Card */}
      <div className="p-4 mx-4 mt-4 rounded-2xl flex items-center space-x-3 space-x-reverse bg-slate-50 border border-slate-200/80">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate text-slate-800">
            {currentUser.name}
          </p>
          <span className={`inline-block text-[9px] font-medium mt-0.5 px-2 py-0.5 rounded-full ${getRoleBadgeClass(currentUser.role)}`}>
            {getRoleArabicName(currentUser.role)}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav id="nav_list" className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/10' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                <IconComponent className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
                <span className="text-xs truncate">{item.label}</span>
              </div>
              
              {item.badge !== undefined ? (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : (
                <ChevronLeft className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Log out */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 rounded-xl font-medium transition-all text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج آمن</span>
        </button>
        <p className="text-[9px] text-center text-slate-400 mt-2">
          إصدار النظام التسويقي v2.6.4 s-SaaS
        </p>
      </div>
    </aside>
  );
}
