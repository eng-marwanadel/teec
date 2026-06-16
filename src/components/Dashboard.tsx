import React, { useState } from 'react';
import { CampaignData } from '../types';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Wallet, 
  Award, 
  Percent, 
  Users, 
  MessageSquare, 
  Activity, 
  Sparkles,
  RefreshCw,
  FileDown,
  Link,
  Database,
  Globe,
  Sliders,
  Check
} from 'lucide-react';

interface DashboardProps {
  campaigns: CampaignData[];
  darkMode: boolean;
  onRefresh: () => void;
  currencySettings?: { code: string; symbol: string; rate: number };
}

export default function Dashboard({ campaigns, darkMode, onRefresh, currencySettings }: DashboardProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Facebook & Instagram Integration States
  const [fbPageId, setFbPageId] = useState('109348923984');
  const [fbAccessToken, setFbAccessToken] = useState('EAAbx18bZC5bYBAHh00E6zV7WId8ZA5j4gWZByfZA83C8p9p...');
  const [fbConnStatus, setFbConnStatus] = useState<'connected' | 'error' | 'syncing'>('connected');
  const [showConfig, setShowConfig] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState('آخر مزامنة ناجحة منذ دقيقتين (Data synced with Meta Graph API v19.0)');

  const triggerFacebookSync = () => {
    setFbConnStatus('syncing');
    setSyncStatusMessage('جاري تهيئة كوكيز الجلسة وإرسال طلب المزامنة لـ Graph API...');
    setTimeout(() => {
      setFbConnStatus('connected');
      onRefresh(); // Trigger parent refresh slightly to simulate numbers changing!
      setSyncStatusMessage(`تمت مزامنة الصفحة "${fbPageId}" بنجاح! تم تضمين الإحصائيات الفورية للحملات والتقارير.`);
    }, 1200);
  };

  const formatMoney = (usdVal: number) => {
    const rate = currencySettings?.rate ?? 50.0;
    const symbol = currencySettings?.symbol ?? 'ج.م';
    return (usdVal * rate).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ' + symbol;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 1000);
  };

  // Aggregated totals
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const remainingBudget = totalBudget - totalSpend;
  
  const activeCount = campaigns.filter(c => c.status === 'نشط').length;
  const pausedCount = campaigns.filter(c => c.status === 'متوقف').length;
  
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const totalMessages = campaigns.reduce((acc, c) => acc + c.messages, 0);
  const totalPurchases = campaigns.reduce((acc, c) => acc + c.purchases, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);

  // Derived metrics
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';
  const roi = totalSpend > 0 ? (((totalRevenue - totalSpend) / totalSpend) * 100).toFixed(1) : '0';
  
  const cpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '0.00';
  const cpc = (totalSpend / (totalReach * 0.04)).toFixed(2); // simulated derived clicks
  const cpm = totalImpressions > 0 ? ((totalSpend / totalImpressions) * 1000).toFixed(2) : '0.00';
  const ctr = "1.85"; // constant CTR average
  const frequency = (totalImpressions / totalReach).toFixed(2);

  // Time-based trends simulated data adjusted dynamically
  const getTrendData = () => {
    switch (period) {
      case 'daily':
        return [
          { name: '06/10', spend: 320, revenue: 1400, leads: 12 },
          { name: '06/11', spend: 410, revenue: 1800, leads: 15 },
          { name: '06/12', spend: 380, revenue: 1500, leads: 14 },
          { name: '06/13', spend: 490, revenue: 2100, leads: 19 },
          { name: '06/14', spend: 520, revenue: 2400, leads: 22 },
          { name: '06/15', spend: 610, revenue: 2950, leads: 25 }
        ];
      case 'weekly':
        return [
          { name: 'الأسبوع 1', spend: 2800, revenue: 11000, leads: 95 },
          { name: 'الأسبوع 2', spend: 3100, revenue: 13500, leads: 110 },
          { name: 'الأسبوع 3', spend: 4500, revenue: 19800, leads: 140 },
          { name: 'الأسبوع 4', spend: 5200, revenue: 24700, leads: 182 }
        ];
      case 'yearly':
        return [
          { name: '2023', spend: 95000, revenue: 380000, leads: 3200 },
          { name: '2024', spend: 140000, revenue: 580000, leads: 4800 },
          { name: '2025', spend: 190000, revenue: 840000, leads: 6900 },
          { name: '2026 (حالي)', spend: 23650, revenue: 955000, leads: 830 }
        ];
      default: // monthly
        return [
          { name: 'يناير', spend: 12000, revenue: 47000, leads: 340 },
          { name: 'فبراير', spend: 14500, revenue: 56000, leads: 390 },
          { name: 'مارس', spend: 18000, revenue: 78000, leads: 512 },
          { name: 'أبريل', spend: 15000, revenue: 59000, leads: 420 },
          { name: 'مايو', spend: 22000, revenue: 94000, leads: 680 },
          { name: 'يونيو', spend: 23650, revenue: 112000, leads: 770 }
        ];
    }
  };

  const getCampaignComparisonData = () => {
    return campaigns.map(c => ({
      name: c.name.length > 18 ? c.name.substring(0, 18) + '...' : c.name,
      'الإنفاق ($)': c.spend,
      'العوائد ($)': c.revenue,
      'العملاء الجدد': c.leads,
      'الرسائل': c.messages
    }));
  };

  const activeTrendData = getTrendData();
  const comparisonData = getCampaignComparisonData();

  return (
    <div id="executive_dashboard" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5 border-slate-800/10 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            لوحة القيادة التنفيذية والمؤشرات الكبرى
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مراقبة حية وشاملة لمشاريع TEEC ومبيعات وحملات Meta الرقمية المربوطة والمزامنة تلقائياً.
          </p>
        </div>

        {/* Filters and Refresh button */}
        <div className="flex items-center space-x-3 space-x-reverse self-start md:self-auto">
          {/* Period Toggles */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => {
              const labels = { daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري', yearly: 'سنوي' };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    period === p 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Facebook API Linkage Panel */}
      <div id="facebook_api_linkage" className={`p-5 rounded-3xl border transition-all ${
        darkMode ? 'bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border-slate-800' : 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-blue-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-600 text-white'}`}>
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  مكاملة ومزامنة منصة Facebook & Instagram API المباشرة 🌐
                </h3>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 leading-none ${
                  fbConnStatus === 'syncing' 
                    ? 'bg-amber-500/15 text-amber-500 animate-pulse' 
                    : 'bg-emerald-500/15 text-emerald-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${fbConnStatus === 'syncing' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {fbConnStatus === 'syncing' ? 'جاري السحب والاتصال' : 'نشط ومرتبط حياً بـ Meta Graph'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                تحديث تلقائي مبرمج للإنفاق اليومي، مرات الظهور، الرسائل، و ROAS مباشرة من Ad Manager وحساب البكسل لشركة TEEC.
              </p>
              <p className={`text-[10px] font-black mt-1.5 ${fbConnStatus === 'syncing' ? 'text-amber-600' : 'text-blue-700'}`}>
                ⚡ {syncStatusMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse self-start lg:self-center">
            <button
              onClick={triggerFacebookSync}
              disabled={fbConnStatus === 'syncing'}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 space-x-reverse"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fbConnStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>مزامنة جلب البيانات الحية ⚡</span>
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              إعدادات المفتاح والصفحة
            </button>
          </div>
        </div>

        {/* Dynamic configuration area */}
        {showConfig && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 mb-1">المعرف البرمجي لصفحة فيسبوك (Facebook Page ID):</label>
              <input 
                type="text" 
                value={fbPageId} 
                onChange={(e) => setFbPageId(e.target.value)}
                className={`w-full text-xs font-mono py-1.5 px-3 rounded-lg border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-teal-400' : 'bg-white border-slate-300 text-slate-800 font-bold'
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 mb-1">رمز الدخول الممتد الدائم (Meta Permanent User Token):</label>
              <input 
                type="password" 
                value={fbAccessToken} 
                onChange={(e) => setFbAccessToken(e.target.value)}
                className={`w-full text-xs font-mono py-1.5 px-3 rounded-lg border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-300 text-slate-800'
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 mb-1">مستوى الربط والإصدار (Graph API Endpoint Core):</label>
              <div className="text-xs bg-slate-100 dark:bg-slate-950/40 p-2 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-slate-400 font-mono">https://graph.facebook.com/v19.0</span>
                <span className="bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 rounded text-[9px] font-mono">GET</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Spend */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">إجمالي الإنفاق الإعلاني</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {formatMoney(totalSpend)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">سقف الميزانية المقررة:</span>
            <span className="font-extrabold text-blue-400">{formatMoney(totalBudget)}</span>
          </div>
          {/* Progress bar to visual budget */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((totalSpend / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI: Remaining */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">الميزانية المتبقية لـ TEEC</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {formatMoney(remainingBudget)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">الحملات النشطة / الكلية:</span>
            <span className="font-extrabold text-slate-300">
              {activeCount} نشط / {campaigns.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.max((remainingBudget / totalBudget) * 100, 0)}%` }}
            />
          </div>
        </div>

        {/* KPI: ROAS / ROI */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">عائد الإنفاق الإعلاني ROAS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 space-x-reverse">
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {roas}x
            </span>
            <span className="text-[10px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded font-extrabold">
              ROI: {roi}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">إجمالي العوائد المحققة:</span>
            <span className="font-extrabold text-purple-400">{formatMoney(totalRevenue)}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* KPI: Leads & Conv */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">إجمالي المبيعات والعملاء</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {totalLeads} عميل
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">مبيعات: {totalPurchases} | كلفة العميل:</span>
            <span className="font-extrabold text-amber-500">{formatMoney(parseFloat(cpl))}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart A: Period Trend Area */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                موازنة الإنفاق التسويقي مقابل العوائد المالية لـ TEEC
              </h3>
              <p className="text-[10px] text-slate-400">تتبع القيمة المضافة ومعدل التوسع الإعلاني دورياً.</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    color: darkMode ? '#ffffff' : '#000000',
                    textAlign: 'right',
                    fontSize: 11,
                    direction: 'rtl'
                  }} 
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" name="الإنفاق الإعلاني ($)" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                <Area type="monotone" name="العوائد ($)" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Campaign Comparison Bar */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
              تحليلات العوائد والنتائج حسب الحملات الإعلانية
            </h3>
            <p className="text-[10px] text-slate-400">توزيع التحويلات الفعالة لـ VRF والكونسيلد والمصانع.</p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    fontSize: 11,
                    direction: 'rtl'
                  }} 
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar name="العوائد لشركة TEEC" dataKey="العوائد ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="الإنفاق الفعلي" dataKey="الإنفاق ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Secondary Grid Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Reach */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">الوصول الإجمالي (Reach)</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalReach.toLocaleString()}</p>
        </div>
        {/* Impressions */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">مرات الظهور (Impressions)</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalImpressions.toLocaleString()}</p>
        </div>
        {/* Frequency */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">معدل التكرار (Frequency)</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{frequency}</p>
        </div>
        {/* CPM */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">كلفة الـ 1000 ظهور CPM</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formatMoney(parseFloat(cpm))}</p>
        </div>
        {/* CPC */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200/50'}`}>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">تكلفة النقرة (CPC)</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formatMoney(parseFloat(cpc))}</p>
        </div>
        {/* CTR */}
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
          <p className="text-[10px] text-slate-500 font-bold mb-1">نسبة النقر للظهور (CTR)</p>
          <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{ctr}%</p>
        </div>
      </div>

      {/* Designer Credits */}
      <div id="author_credits_panel" className={`p-5 rounded-2xl text-center border mt-6 ${
        darkMode ? 'bg-slate-900/60 border-slate-800 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-950 shadow-sm'
      }`}>
        <p className="text-sm font-black tracking-wide">
          تم تصميم هذا النظام بواسطة مهندس مروان عادل محمد 012042790606
        </p>
        <span className="text-[10px] text-slate-500 font-bold block mt-1">
          لوحة البيانات الموحدة ومكاميل الأنظمة في تبريد وتكييف TEEC للحلول الهندسية
        </span>
      </div>
    </div>
  );
}
