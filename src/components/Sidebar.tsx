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
}

export default function Sidebar({ 
  currentUser, 
  onLogout, 
  selectedTab, 
  setSelectedTab, 
  pendingApprovalsCount,
  darkMode,
  setDarkMode 
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
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case UserRole.MARKETING_MANAGER:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case UserRole.MEDIA_BUYER:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
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

  return (
    <aside id="sidebar_nav" className="w-72 flex-shrink-0 flex flex-col bg-slate-900 border-l border-slate-800 transition-all duration-200">
      {/* Top Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/85">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10 border border-blue-400/20">
            <span className="text-white font-extrabold text-sm tracking-widest">TEEC</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              TEEC Control Room
            </h1>
            <p className="text-[10px] text-slate-400">نظام إدارة التسويق الرقمي</p>
          </div>
        </div>

        {/* Dark Mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl transition-all ${
            darkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-800/80 text-slate-400'
          }`}
          title={darkMode ? 'الوضع المضيء' : 'الوضع المظلم'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* User Status Profile Card */}
      <div className="p-4 mx-4 mt-4 rounded-2xl flex items-center space-x-3 space-x-reverse bg-slate-950/60 border border-slate-800/60">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-11 h-11 rounded-full object-cover border border-blue-500/20 shadow-sm" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate text-white">
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
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                <IconComponent className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="text-xs truncate">{item.label}</span>
              </div>
              
              {item.badge !== undefined ? (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : (
                <ChevronLeft className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Log out */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 rounded-xl font-medium transition-all text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج آمن</span>
        </button>
        <p className="text-[9px] text-center text-slate-500 mt-2">
          إصدار النظام التسويقي v2.6.4 s-SaaS
        </p>
      </div>
    </aside>
  );
}
