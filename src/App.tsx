import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  ContentItem, 
  CampaignData, 
  BudgetControl, 
  TeamMemberStats, 
  LoginHistory, 
  ActivityLog, 
  ContentStatus,
  PageAnalytics
} from './types';
import { 
  SYSTEM_USERS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_CONTENT_ITEMS, 
  INITIAL_BUDGET_CONTROLS, 
  INITIAL_TEAM_STATS, 
  INITIAL_PAGE_ANALYTICS, 
  INITIAL_LOGIN_HISTORY, 
  INITIAL_ACTIVITY_LOGS 
} from './mockData';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContentPlanner from './components/ContentPlanner';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import MetaAnalytics from './components/MetaAnalytics';
import BudgetController from './components/BudgetController';
import TeamDashboard from './components/TeamDashboard';
import SheetsDBView from './components/SheetsDBView';
import ReportingCenter from './components/ReportingCenter';
import ActivityLogs from './components/ActivityLogs';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false); // Default to Light Mode as per user request

  // Core interactive states
  const [usersList, setUsersList] = useState<User[]>(SYSTEM_USERS);
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [campaigns, setCampaigns] = useState<CampaignData[]>(INITIAL_CAMPAIGNS);
  const [budgetControls, setBudgetControls] = useState<BudgetControl>(INITIAL_BUDGET_CONTROLS);
  const [teamStats, setTeamStats] = useState<TeamMemberStats[]>(INITIAL_TEAM_STATS);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>(INITIAL_LOGIN_HISTORY);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Currency selection state
  const [currencySettings, setCurrencySettings] = useState({
    code: 'EGP',
    symbol: 'ج.م',
    rate: 50.0 // Egyptian Pound is the default display preference of the user (1 USD = 50 EGP approximately)
  });

  const handleCurrencyChange = (code: string) => {
    let symbol = 'ج.م';
    let rate = 50.0;
    if (code === 'USD') {
      symbol = '$';
      rate = 1.0;
    } else if (code === 'SAR') {
      symbol = 'ر.س';
      rate = 3.75;
    } else if (code === 'AED') {
      symbol = 'د.إ';
      rate = 3.67;
    }
    setCurrencySettings({ code, symbol, rate });

    // Track in logs
    const logger: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'system',
      role: currentUser?.role || UserRole.VIEWER,
      action: 'تغيير العملة النشطة للتطبيق',
      details: `تم تبديل العملة العامة لـ: ${code} (معامل ضرب حركي: ${rate})`
    };
    setActivityLogs(prev => [logger, ...prev]);
  };

  // dynamic GM handlers
  const handleAddUser = (name: string, username: string, role: UserRole, customTitle: string, avatarUrl: string) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      username,
      role,
      avatar: avatarUrl,
      permissions: {
        canApprove: role === UserRole.GENERAL_MANAGER || role === UserRole.MARKETING_MANAGER,
        canEditBudget: role === UserRole.GENERAL_MANAGER || role === UserRole.MEDIA_BUYER,
        canSyncSheets: role === UserRole.GENERAL_MANAGER || role === UserRole.MARKETING_MANAGER,
        canExportReports: true,
        canViewLogs: role === UserRole.GENERAL_MANAGER,
      }
    };
    setUsersList(prev => [...prev, newUser]);

    const newStats: TeamMemberStats = {
      id: newUser.id,
      name: newUser.name,
      role: customTitle,
      avatar: newUser.avatar,
      approvedCount: 0,
      submittedCount: 0,
      publishedCount: 0,
      activeCampaigns: 0,
      rejectedCount: 0,
    };
    setTeamStats(prev => [...prev, newStats]);

    const logger: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'manager_teec',
      role: UserRole.GENERAL_MANAGER,
      action: 'إضافة موظف/إداري جديد',
      details: `تم تسجيل الموظف "${name}" بالدور "${customTitle}"`
    };
    setActivityLogs(prev => [logger, ...prev]);
  };

  const handleUpdateUser = (id: string, updatedFields: Partial<User & { customTitle?: string }>) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          name: updatedFields.name ?? u.name,
          username: updatedFields.username ?? u.username,
          role: updatedFields.role ?? u.role,
          avatar: updatedFields.avatar ?? u.avatar,
          permissions: updatedFields.permissions ?? u.permissions
        };
      }
      return u;
    }));

    setTeamStats(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          name: updatedFields.name ?? t.name,
          role: updatedFields.customTitle ?? t.role,
          avatar: updatedFields.avatar ?? t.avatar
        };
      }
      return t;
    }));

    if (currentUser?.id === id) {
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: updatedFields.name ?? prev.name,
          avatar: updatedFields.avatar ?? prev.avatar,
          role: updatedFields.role ?? prev.role,
          permissions: updatedFields.permissions ?? prev.permissions
        };
      });
    }

    const logger: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'manager_teec',
      role: UserRole.GENERAL_MANAGER,
      action: 'تعديل الصلاحيات الفردية للموظف',
      details: `تمت مزامنة صلاحيات الموظف ذو المعرف البنيوي ${updatedFields.name || id}`
    };
    setActivityLogs(prev => [logger, ...prev]);
  };

  const handleDeleteUser = (id: string) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
    setTeamStats(prev => prev.filter(t => t.id !== id));

    const logger: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'manager_teec',
      role: UserRole.GENERAL_MANAGER,
      action: 'حذف موظف ومصادرة صلاحياته الكلية',
      details: `تم مسح ملف الموظف ذو المعرف البنيوي ${id} نهائياً`
    };
    setActivityLogs(prev => [logger, ...prev]);
  };

  // Page stats
  const pageStats = INITIAL_PAGE_ANALYTICS;

  // Toggle dark mode class in outer shell
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#020617'; // slate-950
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // slate-50
    }
  }, [darkMode]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Add real logs
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: user.username,
      role: user.role,
      action: 'تسجيل دخول إلى مركز التحكم الرئيسي',
      details: `تم ترخيص جلسة العمل بنجاح للأعضاء.`
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    if (currentUser) {
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: currentUser.username,
        role: currentUser.role,
        action: 'تسجيل خروج آمن وسليم',
        details: `إنهاء الجلسة المصادق عليها بنجاح.`
      };
      setActivityLogs(prev => [newLog, ...prev]);
    }
    setCurrentUser(null);
    setSelectedTab('dashboard');
  };

  // Login history updates
  const handleAddLoginHistory = (record: { username: string; role: UserRole; status: 'نجاح' | 'فشل'; device: string }) => {
    const newRecord: LoginHistory = {
      id: `hist-${Date.now()}`,
      username: record.username,
      role: record.role,
      status: record.status,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '197.34.112.5',
      device: record.device
    };
    setLoginHistory(prev => [newRecord, ...prev]);
  };

  // Add customized content item request
  const handleAddContentItem = (newItem: Omit<ContentItem, 'id' | 'submittedBy' | 'submittedAt' | 'history'>) => {
    const userLabel = currentUser ? currentUser.name : 'مدير التسويق';
    const postRecord: ContentItem = {
      ...newItem,
      id: `c-${contentItems.length + 101}`,
      submittedBy: userLabel,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
      history: [
        {
          status: 'Submitted',
          changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          changedBy: userLabel,
          comment: 'تم ترحيل المنشور للتخطيط ومراجعة التوفيق الإداري.'
        }
      ]
    };

    setContentItems(prev => [postRecord, ...prev]);

    // Update Activity action logs
    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'marketing_teec',
      role: currentUser?.role || UserRole.MARKETING_MANAGER,
      action: 'تقديم مخطط إعلاني جديد معزز (15 حقل)',
      details: `عنوان المنشور: "${newItem.title}" | الميزانية الأولية: $${newItem.budget}`
    };
    setActivityLogs(prev => [activity, ...prev]);
  };

  // Update Item Status workflow (GM Approving or rejecting)
  const handleUpdateStatus = (
    id: string, 
    newStatus: ContentStatus, 
    comment: string, 
    approvedBy: string,
    rejectionReason?: string
  ) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          approvedBy: newStatus === 'Approved' ? approvedBy : undefined,
          approvedAt: newStatus === 'Approved' ? new Date().toISOString().substring(0, 10) : undefined,
          rejectionReason: rejectionReason,
          history: [
            {
              status: newStatus,
              changedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              changedBy: approvedBy,
              comment: comment
            },
            ...item.history
          ]
        };
      }
      return item;
    }));

    // Register active log action
    const item = contentItems.find(p => p.id === id);
    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'manager_teec',
      role: UserRole.GENERAL_MANAGER,
      action: newStatus === 'Approved' ? 'مصادقة وموافقة فنية من المدير العام' : 'رفض ترويجي صياغي للتعديل',
      details: `منشور: "${item?.title}" | التعليق: ${comment}`
    };
    setActivityLogs(prev => [activity, ...prev]);
  };

  // Manage Budget settings
  const handleUpdateLimits = (daily: number, monthly: number) => {
    const userLabel = currentUser ? currentUser.name : 'مشتري الإعلانات';
    setBudgetControls(prev => {
      const updatedAlerts = [...prev.alerts];
      // Check if threshold requires a warning trigger
      const currentSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
      if (currentSpend > daily * 12) {
        updatedAlerts.unshift({
          id: `al-${Date.now()}`,
          message: `تحذير عاجل: الصرف المتراكم لشهر يونيو تجاوز الحد الآمن المحدد بسقف الصرف اليومي الجديد.`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: 'danger'
        });
      }

      return {
        ...prev,
        dailyLimit: daily,
        monthlyLimit: monthly,
        alerts: updatedAlerts
      };
    });

    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: currentUser?.username || 'buyer_teec',
      role: currentUser?.role || UserRole.MEDIA_BUYER,
      action: 'تعديل سقوفات الميزانية الآمنة',
      details: `اليومي الجديد: $${daily} | الشهري الجديد: $${monthly}`
    };
    setActivityLogs(prev => [activity, ...prev]);
  };

  const pendingApprovalsCount = contentItems.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length;

  if (!currentUser) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLoginSuccess} 
        onAddLoginHistory={handleAddLoginHistory} 
        usersList={usersList}
      />
    );
  }

  // Active Screen Selector Switch
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <Dashboard 
            campaigns={campaigns} 
            darkMode={darkMode} 
            currencySettings={currencySettings}
            onRefresh={() => {
              // Simulate small stats adjustments on refresh
              setCampaigns(prev => prev.map(c => ({
                ...c,
                reach: c.reach + Math.floor(Math.random() * 150) + 10,
                spend: c.spend + Math.floor(Math.random() * 40) + 20,
                revenue: c.revenue + Math.floor(Math.random() * 200) + 50,
                leads: c.leads + (Math.random() > 0.65 ? 1 : 0)
              })));
            }} 
          />
        );
      case 'content':
        return (
          <ContentPlanner 
            contentItems={contentItems} 
            currentUser={currentUser} 
            onAddContentItem={handleAddContentItem} 
            darkMode={darkMode} 
          />
        );
      case 'approval':
        return (
          <ApprovalWorkflow 
            contentItems={contentItems} 
            currentUser={currentUser} 
            onUpdateStatus={handleUpdateStatus} 
            darkMode={darkMode} 
          />
        );
      case 'meta':
        return (
          <MetaAnalytics 
            campaigns={campaigns} 
            pageStats={pageStats} 
            darkMode={darkMode} 
          />
        );
      case 'budget':
        return (
          <BudgetController 
            campaigns={campaigns} 
            budgetControls={budgetControls} 
            currentUser={currentUser} 
            onUpdateLimits={handleUpdateLimits} 
            darkMode={darkMode} 
          />
        );
      case 'team':
        return (
          <TeamDashboard 
            teamStats={teamStats} 
            currentUser={currentUser} 
            darkMode={darkMode} 
            usersList={usersList}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'sheets':
        return (
          <SheetsDBView 
            contentItems={contentItems} 
            campaigns={campaigns} 
            currentUser={currentUser} 
            darkMode={darkMode} 
            activityLogs={activityLogs}
            budgetControls={budgetControls}
          />
        );
      case 'reports':
        return (
          <ReportingCenter 
            campaigns={campaigns} 
            contentItems={contentItems} 
            darkMode={darkMode} 
          />
        );
      case 'logs':
        return (
          <ActivityLogs 
            loginHistory={loginHistory} 
            activityLogs={activityLogs} 
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        );
      default:
        return <div className="text-white p-4">التبويب غير متوفر حالياً.</div>;
    }
  };

  return (
    <div dir="rtl" className={`min-h-screen flex ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar navigation */}
      <Sidebar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        pendingApprovalsCount={pendingApprovalsCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currencySettings={currencySettings}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Main Content Area */}
      <main id="main_content_wrapper" className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderTabContent()}
      </main>

    </div>
  );
}
