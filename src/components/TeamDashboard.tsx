import React, { useState } from 'react';
import { TeamMemberStats, User, UserRole, DirectMessage } from '../types';
import { 
  Users, 
  CheckCircle, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  MessageSquare, 
  ChevronLeft,
  Shield,
  Plus,
  UserPlus,
  Trash2,
  Camera,
  Check,
  Edit2,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

interface TeamDashboardProps {
  teamStats: TeamMemberStats[];
  currentUser: User;
  darkMode: boolean;
  usersList: User[];
  onAddUser: (name: string, username: string, role: UserRole, customTitle: string, avatarUrl: string) => void;
  onUpdateUser: (id: string, updatedFields: Partial<User & { customTitle?: string }>) => void;
  onDeleteUser: (id: string) => void;
}

export default function TeamDashboard({ 
  teamStats, 
  currentUser, 
  darkMode,
  usersList = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: TeamDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'management' | 'chat'>('stats');

  // Direct Messenger (Talk to Employee) States
  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: 'm-1',
      senderId: 'u-1',
      senderName: 'أ. طارق عبد العزيز',
      receiverId: 'u-3',
      receiverName: 'م. تامر الشافعي',
      content: 'مرحباً تامر، هل تم مراجعة إحصائيات بكسل الفيس بوك لحملة مكيفات السبلت الجديدة؟',
      timestamp: 'اليوم، 10:15 ص'
    },
    {
      id: 'm-2',
      senderId: 'u-3',
      senderName: 'م. تامر الشافعي',
      receiverId: 'u-1',
      receiverName: 'أ. طارق عبد العزيز',
      content: 'أهلاً بك يا فندم! نعم، تم ربط بكسل المبيعات ويتم تحديث كلفة العميل المحتمل (Lead) تلقائياً لتصبح 45 ج.م للعميل الواحد.',
      timestamp: 'اليوم، 10:20 ص'
    },
    {
      id: 'm-3',
      senderId: 'u-1',
      senderName: 'أ. طارق عبد العزيز',
      receiverId: 'u-4',
      receiverName: 'أ. دينا الشربيني',
      content: 'دينا، يرجى تجهيز صياغة إعلانية لخصومات تكييف كونسيلد (مخفي) للتجمع الخامس والشيخ زايد.',
      timestamp: 'أمس، 09:12 م'
    },
    {
      id: 'm-4',
      senderId: 'u-4',
      senderName: 'أ. دينا الشربيني',
      receiverId: 'u-1',
      receiverName: 'أ. طارق عبد العزيز',
      content: 'حاضر أستاذ طارق، سأرسل المسودة إلى جدول المحتويات تمهيداً للتصديق والاعتماد ليلة اليوم.',
      timestamp: 'أمس، 09:18 م'
    }
  ]);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [typedMessage, setTypedMessage] = useState('');

  const sendPrivateMessage = () => {
    if (!selectedChatUser) return;
    if (!typedMessage.trim()) return;

    const newMessage: DirectMessage = {
      id: `m-custom-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: selectedChatUser.id,
      receiverName: selectedChatUser.name,
      content: typedMessage.trim(),
      timestamp: 'الآن'
    };

    setMessages([...messages, newMessage]);
    setTypedMessage('');

    // Trigger standard simulated automated reply to look smart & responsive
    setTimeout(() => {
      const autoReply: DirectMessage = {
        id: `m-reply-${Date.now()}`,
        senderId: selectedChatUser.id,
        senderName: selectedChatUser.name,
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        content: `تم استلام رسالتك الإدارية وتنبيهك الإداري يا فندم بخصوص "${typedMessage.trim()}"، جاري المراجعة وتطبيق التوجيه الفوري.`,
        timestamp: 'الآن'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1500);
  };

  // Management tab states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState<UserRole>(UserRole.CONTENT_CREATOR);
  const [editTitle, setEditTitle] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  
  // Custom Permissions editing
  const [canApprove, setCanApprove] = useState(false);
  const [canEditBudget, setCanEditBudget] = useState(false);
  const [canSyncSheets, setCanSyncSheets] = useState(false);
  const [canExportReports, setCanExportReports] = useState(false);
  const [canViewLogs, setCanViewLogs] = useState(false);

  // New User Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.MEDIA_BUYER);
  const [newTitle, setNewTitle] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isGM = currentUser.role === UserRole.GENERAL_MANAGER;

  const handleSelectUserToEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditRole(user.role);
    
    // Find custom job title in teamStats
    const currentStat = teamStats.find(t => t.id === user.id);
    setEditTitle(currentStat ? currentStat.role : getRoleArabicName(user.role));
    setEditAvatar(user.avatar);

    // Load custom permissions or fall back to defaults
    setCanApprove(user.permissions?.canApprove ?? (user.role === UserRole.GENERAL_MANAGER || user.role === UserRole.MARKETING_MANAGER));
    setCanEditBudget(user.permissions?.canEditBudget ?? (user.role === UserRole.GENERAL_MANAGER || user.role === UserRole.MEDIA_BUYER));
    setCanSyncSheets(user.permissions?.canSyncSheets ?? (user.role === UserRole.GENERAL_MANAGER || user.role === UserRole.MARKETING_MANAGER));
    setCanExportReports(user.permissions?.canExportReports ?? true);
    setCanViewLogs(user.permissions?.canViewLogs ?? (user.role === UserRole.GENERAL_MANAGER));
    
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSaveChanges = () => {
    if (!editingUserId) return;
    if (!editName.trim() || !editUsername.trim()) {
      setErrorMsg('فضلاً املاً اسم الموظف واسم المستخدم');
      return;
    }

    onUpdateUser(editingUserId, {
      name: editName.trim(),
      username: editUsername.trim(),
      role: editRole,
      avatar: editAvatar.trim(),
      customTitle: editTitle.trim(),
      permissions: {
        canApprove,
        canEditBudget,
        canSyncSheets,
        canExportReports,
        canViewLogs
      }
    });

    setSuccessMsg('تم حفظ وتحديث التعديلات والصلاحيات بنجاح!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateNewEmployee = () => {
    if (!newName.trim() || !newUsername.trim()) {
      setErrorMsg('يرجى ملء الاسم واسم المستخدم للموظف الجديد');
      return;
    }

    // Check if user name already exists
    const exists = usersList.some(u => u.username.toLowerCase() === newUsername.toLowerCase().trim());
    if (exists) {
      setErrorMsg('اسم المستخدم هذا مسجل مسبقاً لموظف آخر!');
      return;
    }

    const finalAvatar = newAvatar.trim() || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150&h=150&fit=crop&crop=face`;

    onAddUser(
      newName.trim(),
      newUsername.trim().toLowerCase(),
      newRole,
      newTitle.trim() || getRoleArabicName(newRole),
      finalAvatar
    );

    setSuccessMsg('تم إضافة العضو الجديد وإصدار صلاحياته الفريدة!');
    setNewName('');
    setNewUsername('');
    setNewTitle('');
    setNewAvatar('');
    setShowAddForm(false);
    setErrorMsg('');

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTriggerDelete = (id: string) => {
    if (id === currentUser.id) {
      alert('لا يمكنك حذف حسابك الحالي الناشط!');
      return;
    }
    if (confirm('هل أنت متأكد من رغبتك في الاستغناء عن هذا الموظف وحذف كافة صلاحياته من النظام؟')) {
      onDeleteUser(id);
      if (editingUserId === id) {
        setEditingUserId(null);
      }
      setSuccessMsg('تم إزالة العضو وصلاحياته بنجاح من سجلات TEEC.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const getRandomSampleAvatar = () => {
    const samples = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face'
    ];
    return samples[Math.floor(Math.random() * samples.length)];
  };

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

  const getRankBadgeColor = (idx: number) => {
    switch (idx) {
      case 0:
        return 'bg-amber-100 text-amber-700 border border-amber-200'; // Gold
      case 1:
        return 'bg-slate-100 text-slate-600 border border-slate-200'; // Silver
      default:
        return 'bg-orange-100 text-orange-700 border border-orange-200'; // Bronze
    }
  };

  return (
    <div id="team_dashboard" className="space-y-6 font-sans">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200">
        <div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <h2 className="text-2xl font-black text-slate-900">
              طاقم العمل والصلاحيات التنظيمية ❄️
            </h2>
            <span className="bg-blue-100 text-blue-850 text-xs font-black px-3 py-1 rounded-full border border-blue-200">
              {usersList.length} موظفين وإداريين نشطين
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            موارد فريق التسويق وإدارة الصلاحيات، الصور، والمسؤوليات تحت السقف الكامل للمدير العام.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto shadow-sm gap-1">
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 space-x-reverse ${
              activeSubTab === 'stats'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>لوحة الأداء والإنتاج</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('management')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 space-x-reverse ${
              activeSubTab === 'management'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>التحكم بالطاقم وصلاحيات الإداريين</span>
            {!isGM && <Lock className="w-3 h-3 text-slate-400" />}
          </button>

          <button
            onClick={() => {
              setActiveSubTab('chat');
              if (usersList.length > 0 && !selectedChatUser) {
                // Pre-select first non-GM user
                const nonGM = usersList.find(u => u.role !== UserRole.GENERAL_MANAGER) || usersList[0];
                setSelectedChatUser(nonGM);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 space-x-reverse ${
              activeSubTab === 'chat'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>التحدث إلى موظف / إرسال رسالة 💬</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl p-4 flex items-center space-x-2 space-x-reverse shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl p-4 flex items-center space-x-2 space-x-reverse shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* RENDER VIEW 1: STATS LEADERBOARD */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Side: Employee Cards list */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold flex items-center space-x-2 space-x-reverse text-slate-950">
              <Users className="w-4 h-4 text-blue-600" />
              <span>لوحة أداء الموظفين التفصيلية</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamStats.map((stats, idx) => (
                <div 
                  key={stats.id}
                  className="p-5 rounded-2xl border bg-white border-slate-200/80 shadow-sm hover:border-slate-350 transition-all hover:shadow-md"
                >
                  {/* Employee Info Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img 
                        src={stats.avatar} 
                        alt={stats.name} 
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{stats.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{stats.role}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getRankBadgeColor(idx)}`}>
                      المرتبة {idx + 1}
                    </span>
                  </div>

                  {/* Counter metrics list */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] font-bold">المنشورات المعتمدة:</span>
                      <span className="text-slate-800 font-extrabold text-xs">{stats.approvedCount} منشور</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] font-bold">بانتظار الإجراء:</span>
                      <span className="text-amber-600 font-extrabold text-xs">{(stats.submittedCount - stats.approvedCount)} معلق</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] font-bold">الحملات النشطة:</span>
                      <span className="text-emerald-600 font-bold text-xs">{stats.activeCampaigns} حملة</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] font-bold">المنشورات المنشورة:</span>
                      <span className="text-slate-600 font-bold text-xs">{stats.publishedCount} منشور</span>
                    </div>
                  </div>

                  {/* Progress bars layout with safety thresholds */}
                  <div className="space-y-3 mt-4 text-[10px]">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1 font-bold">
                        <span>معدل الالتزام بخط النشر الحاد:</span>
                        <span className="font-extrabold text-blue-600">95%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-1 font-bold">
                        <span>دقة المخططات الفنية (TEEC Accuracy):</span>
                        <span className="font-extrabold text-emerald-600">98%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
            <div className="p-5 rounded-2xl border bg-white border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-black pb-2.5 border-b border-slate-100 text-slate-800">
                سجل نشاط العمل الأخير
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-800 font-bold">مراجعة كلفة النقرة (CPC) لجميع الإعلانات</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">بواسطة: مشتري الإعلانات - منذ ساعتين</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-800 font-bold">تقديم تصميم لخصومات التكييف الكونسيلد لفيسبوك</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">بواسطة: المصمم الفني - منذ 5 ساعات</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-800 font-bold">تقديم طلب منشور الـ VRF صانع المحتوى الجديد</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">بواسطة: مدير التسويق - منذ يوم واحد</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-800 font-bold">المصادقة على ميزانية حملات يونيو الإعلانية</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">بواسطة: المدير العام - منذ يومين</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER VIEW 2: STAFF & PERMISSIONS DIRECT CONTROL PANEL (GENERAL MANAGER EXCLUSIVE) */}
      {activeSubTab === 'management' && (
        <div className="animate-fade-in space-y-6">
          {!isGM ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-205 shadow-sm max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-200">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">قفل الحماية الأمنية للمدير العام 🔒</h3>
              <p className="text-slate-500 text-xs">
                نعتذر منك، لا يمتلك دور العمل الخاص بك ({getRoleArabicName(currentUser.role)}) الصلاحية الكافية لتعديل أو إضافة الموظفين أو سحب الإداريين. يرجى تسجيل الدخول باسم المالك / المدير العام (أ. طارق عبد العزيز).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Staff Directory */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 space-x-reverse">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>دليل الطاقم والإداريين ({usersList.length})</span>
                  </h3>
                  
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingUserId(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 space-x-reverse shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>إضافة موظف</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {usersList.map((user) => {
                    const isSelected = editingUserId === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUserToEdit(user)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-800 truncate">{user.name}</h4>
                            <p className="text-[9px] text-slate-400 font-mono">@{user.username}</p>
                            <span className="inline-block text-[8px] bg-slate-100 text-slate-600 font-bold px-1.5 rounded mt-0.5">
                              {getRoleArabicName(user.role)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 space-x-reverse">
                          <ChevronLeft className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-500 translate-x-[-2px]' : 'text-slate-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Editor Workspace / Add New Form */}
              <div className="lg:col-span-8">
                
                {/* 1. Add Employee Form */}
                {showAddForm && (
                  <div className="bg-white border border-blue-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fade-in">
                    <div className="border-b pb-3 border-blue-100 flex justify-between items-center">
                      <h4 className="text-sm font-black text-blue-900 flex items-center space-x-2 space-x-reverse">
                        <UserPlus className="w-4 h-4" />
                        <span>تعيين وإضافة موظف ترويجي جديد</span>
                      </h4>
                      <button 
                        onClick={() => setShowAddForm(false)}
                        className="text-slate-400 hover:text-slate-650 text-xs font-bold"
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">الاسم الكامل للموظف:</label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="مثال: م. أحمد المليجي"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم المستخدم (لتسجيل الدخول):</label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="ahmed_teec"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs font-mono"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">الدور الوظيفي الأساسي:</label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as UserRole)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-905 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs font-sans"
                        >
                          <option value={UserRole.MEDIA_BUYER}>مشتري إعلانات (Media Buyer)</option>
                          <option value={UserRole.MARKETING_MANAGER}>مدير تسويق (Marketing Manager)</option>
                          <option value={UserRole.CONTENT_CREATOR}>صانع محتوى (Content Creator)</option>
                          <option value={UserRole.DESIGNER}>مصمم جرافيك (Designer)</option>
                          <option value={UserRole.GENERAL_MANAGER}>مدير إداري عام أو شريك (General Manager)</option>
                          <option value={UserRole.VIEWER}>مشاهد عادي (Viewer)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">المسمى الوظيفي والوظيفة المخصصة:</label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="مثال: أخصائي مبيعات مكيفات VRF"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-950 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">صورة الملف الشخصي:</label>
                        <div className="flex items-center space-x-3 space-x-reverse bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <img
                            src={newAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                            className="w-12 h-12 rounded-full object-cover border border-slate-300"
                            alt="Avatar sample"
                          />
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={newAvatar}
                              onChange={(e) => setNewAvatar(e.target.value)}
                              placeholder="رابط الصورة المباشر أو اتركه فارغاً لإنشاء صورة تلقائية"
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg py-1 px-2.5 text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => setNewAvatar(getRandomSampleAvatar())}
                              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 space-x-reverse"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>اختر صورة عشوائية ترويجيّة</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateNewEmployee}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة الموظف وتسجيله فورياً بصلاحيات افتراضية</span>
                    </button>
                  </div>
                )}

                {/* 2. Editing existing user permissions */}
                {editingUserId ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="border-b pb-3 border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2 space-x-reverse">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                        <span>تعديل الصلاحيات الفردية والمسمى لـ: <span className="text-blue-600">"{editName}"</span></span>
                      </h4>
                      <button 
                        onClick={() => handleTriggerDelete(editingUserId)}
                        className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center space-x-1 space-x-reverse"
                        title="طرد أو حذف الموظف"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف المصدقية</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم الموظف كلياً:</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">اسم المستخدم الحصري:</label>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs font-mono"
                          dir="ltr"
                          disabled // Username shouldn't be altered easily
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">المسمى الوظيفي المخصص بالشركة:</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 font-sans">صلاحية الدور الافتراضي:</label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as UserRole)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 text-xs font-sans"
                        >
                          <option value={UserRole.MEDIA_BUYER}>مشتري إعلانات (Media Buyer)</option>
                          <option value={UserRole.MARKETING_MANAGER}>مدير تسويق (Marketing Manager)</option>
                          <option value={UserRole.CONTENT_CREATOR}>صانع محتوى (Content Creator)</option>
                          <option value={UserRole.DESIGNER}>مصمم جرافيك (Designer)</option>
                          <option value={UserRole.GENERAL_MANAGER}>مدير إداري عام أو شريك (General Manager)</option>
                          <option value={UserRole.VIEWER}>مشاهد عادي (Viewer)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-2">تحديث الصورة الشخصية:</label>
                        <div className="flex items-center space-x-3 space-x-reverse bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                          <img
                            src={editAvatar}
                            className="w-12 h-12 rounded-full object-cover border border-slate-350 shadow-sm"
                            alt="avatar"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editAvatar}
                              onChange={(e) => setEditAvatar(e.target.value)}
                              className="w-full bg-white border border-slate-250 text-slate-900 rounded-lg py-1 px-2 text-[10px] font-mono"
                            />
                            <div className="flex space-x-1.5 space-x-reverse">
                              <button
                                type="button"
                                onClick={() => setEditAvatar(getRandomSampleAvatar())}
                                className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded-lg"
                              >
                                جلب صورة تلوينية جديدة
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions checklist controls */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200/80">
                      <div className="flex items-center space-x-2 space-x-reverse pb-2 border-b border-slate-200">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <h5 className="text-xs font-bold text-slate-800">تخصيص الصلاحيات الدقيقة للموظف:</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <label className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl transition-all">
                          <input
                            type="checkbox"
                            checked={canApprove}
                            onChange={(e) => setCanApprove(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">صلاحية اعتماد ورفض المنشورات</span>
                            <span className="text-[9px] text-slate-400">حق إقرار النشر أو طلب تعديلات من كتاب المحتوى</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl transition-all">
                          <input
                            type="checkbox"
                            checked={canEditBudget}
                            onChange={(e) => setCanEditBudget(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">صلاحية تعديل الميزانيات</span>
                            <span className="text-[9px] text-slate-400">حق زيادة أو تخفيض سقف النفقات المالية اليومية والشهرية</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl transition-all">
                          <input
                            type="checkbox"
                            checked={canSyncSheets}
                            onChange={(e) => setCanSyncSheets(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">صلاحية ربط ومزامنة Google Sheets</span>
                            <span className="text-[9px] text-slate-400">حق التحكم بالجداول السحابية والمزامنة الكلية المتبادلة</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl transition-all">
                          <input
                            type="checkbox"
                            checked={canExportReports}
                            onChange={(e) => setCanExportReports(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">تخريج واستخراج التقارير والتحليلات</span>
                            <span className="text-[9px] text-slate-400">حق تحميل الإحصائيات كملفات PDF/Excel والبيانات</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl transition-all sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={canViewLogs}
                            onChange={(e) => setCanViewLogs(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">مراجعة سجلات الأمان والعمليات الشاملة</span>
                            <span className="text-[9px] text-slate-400">حق تدقيق جلسات الدخول للموظفين وعناوين الـ IP الخاصة بالفريق</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveChanges}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 space-x-reverse shadow-md shadow-blue-500/10"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>حفظ تعديلات صلاحيات {editName} فورياً والمزامنة</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-400 text-xs flex flex-col justify-center items-center space-y-2 h-full min-h-[300px]">
                    <Shield className="w-10 h-10 text-slate-300" />
                    <p className="font-bold text-slate-500">مرحباً بك في وحدة تحكم الأمن والصلاحيات 🔒</p>
                    <p className="text-[11px] max-w-sm">
                      يرجى تحديد أي من الموظفين من لوحة التحكم الجانبية اليمنى للبدء في ترقية صلاحياته، تفعيل أدواره، أو تغيير صورته أو لتبديل المجموعات الأمنية.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW 3: DIRECT MESSAGING (TALK TO EMPLOYEE) */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Column: Choose Employee to chat with */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2 space-x-reverse">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>قنوات المراسلة والتحدث مع الموظفين 💬</span>
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {usersList.map((user) => {
                const isSelected = selectedChatUser?.id === user.id;
                const lastMsg = messages
                  .filter(m => (m.senderId === user.id && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === user.id))
                  .slice(-1)[0];

                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedChatUser(user)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="min-w-0 text-right">
                        <h4 className="text-xs font-black text-slate-800 truncate">{user.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{getRoleArabicName(user.role)}</p>
                        {lastMsg && (
                          <p className="text-[10px] text-slate-500 truncate mt-1 max-w-[200px]">
                            {lastMsg.content}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Chat Feed Area */}
          <div className="lg:col-span-8">
            {selectedChatUser ? (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-[550px] shadow-sm">
                
                {/* Chat Partner Header bar */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <img
                      src={selectedChatUser.avatar}
                      alt={selectedChatUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-850">{selectedChatUser.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>نشط حالياً (متصل ومستعد للتلقي)</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg font-bold">
                    معرف الحساب: {selectedChatUser.username}
                  </span>
                </div>

                {/* Messages Panel Container */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4 flex flex-col justify-end">
                  {messages
                    .filter(
                      m =>
                        (m.senderId === currentUser.id && m.receiverId === selectedChatUser.id) ||
                        (m.senderId === selectedChatUser.id && m.receiverId === currentUser.id)
                    )
                    .map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-start' : 'justify-end'} text-xs`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-3.5 space-y-1 shadow-sm ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-tr-none text-right'
                                : 'bg-slate-200 text-slate-800 rounded-tl-none text-right'
                            }`}
                          >
                            <p className="font-bold text-[10px] opacity-75">{msg.senderName}</p>
                            <p className="leading-relaxed font-bold">{msg.content}</p>
                            <p className="text-[8px] text-left opacity-60 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Input action bar */}
                <div className="p-4 bg-white border-t border-slate-250 flex items-center gap-3">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendPrivateMessage();
                    }}
                    placeholder={`اكتب رسالتك الإدارية وتوجيهك إلى ${selectedChatUser.name} هنا...`}
                    className="flex-1 bg-slate-50 border border-slate-250 text-slate-900 text-xs py-3 px-4 rounded-xl focus:outline-none focus:border-blue-500 font-bold"
                  />
                  <button
                    onClick={sendPrivateMessage}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-xs font-black transition-all shadow-md flex items-center space-x-1.5 space-x-reverse"
                  >
                    <span>إرسال وتنبيه 🚀</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-350 rounded-3xl p-12 text-center text-slate-400 text-xs flex flex-col justify-center items-center space-y-2 h-full min-h-[300px]">
                <MessageSquare className="w-10 h-10 text-slate-300" />
                <p className="font-bold text-slate-600">لم يتم اختيار أي موظف للمحادثة 💬</p>
                <p className="text-[11px] max-w-sm">
                  يرجى تحديد موظف أو إداري من القائمة الجانبية اليمنى لبدء التحدث وبث التوجيهات والرسائل الفورية له لمراجعة الحملات والنشاطات.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
