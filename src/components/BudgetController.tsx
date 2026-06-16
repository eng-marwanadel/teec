import React, { useState } from 'react';
import { BudgetControl, CampaignData, User, UserRole } from '../types';
import { 
  DollarSign, 
  AlertTriangle, 
  Bell, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Coins
} from 'lucide-react';

interface BudgetControllerProps {
  campaigns: CampaignData[];
  budgetControls: BudgetControl;
  currentUser: User;
  onUpdateLimits: (daily: number, monthly: number) => void;
  darkMode: boolean;
}

export default function BudgetController({ 
  campaigns, 
  budgetControls, 
  currentUser, 
  onUpdateLimits, 
  darkMode 
}: BudgetControllerProps) {
  
  const [dailyLimit, setDailyLimit] = useState(budgetControls.dailyLimit);
  const [monthlyLimit, setMonthlyLimit] = useState(budgetControls.monthlyLimit);
  const [saveSuccess, setSaveSuccess] = useState('');

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const remainingMonthly = monthlyLimit - totalSpend;
  const percentageMonthlyUsed = ((totalSpend / monthlyLimit) * 100).toFixed(1);

  const canEdit = currentUser.role === UserRole.MEDIA_BUYER || currentUser.role === UserRole.GENERAL_MANAGER || currentUser.role === UserRole.MARKETING_MANAGER;

  // Calculate platform spend distribution
  const fbSpend = Math.round(totalSpend * 0.65);
  const igSpend = Math.round(totalSpend * 0.35);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (dailyLimit <= 0 || monthlyLimit <= 0) {
      alert('يرجى تحديد قيم موجبة منطقية لسقوفات الميزانيات المقررة.');
      return;
    }
    onUpdateLimits(dailyLimit, monthlyLimit);
    setSaveSuccess('تم تحديث سقوفات الميزانية، وتحديث مركز التنبيهات المالي لشركة TEEC طبقاً لذلك!');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  // Group spends by Objective
  const objectives = campaigns.reduce((acc, c) => {
    acc[c.objective] = (acc[c.objective] || 0) + c.spend;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div id="budget_controller" className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            مركز إدارة الميزانيات والتحكم بالإنفاق المالي
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة الصرف اليومي والشهري وتحديد مستويات الأمان المالي لمنع تخطي الميزانية الإعلانية لـ TEEC.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2 space-x-reverse">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Grid: 3 summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Safe spend limit */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 text-blue-500">
            <span className="text-xs text-slate-400 font-bold">الإنفاق الإجمالي الحالي</span>
            <Coins className="w-5 h-5" />
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>${totalSpend.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
            <span>النسبة المستهلكة من الميزانية الكلية:</span>
            <span className="font-extrabold text-blue-500">{percentageMonthlyUsed}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${percentageMonthlyUsed}%` }} />
          </div>
        </div>

        {/* Card 2: Daily budget safe limit */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 text-emerald-500">
            <span className="text-xs text-slate-400 font-bold">سقف الميزانية اليومية للشركة</span>
            <Coins className="w-5 h-5" />
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>${budgetControls.dailyLimit.toLocaleString()}</p>
          <div className="text-[10px] text-slate-400 mt-3">
            معدل الصرف اليومي المتوقع للحملات النشطة: <strong className="text-blue-505 dark:text-slate-300">${(totalSpend / 30).toFixed(0)}/يومياً</strong>
          </div>
        </div>

        {/* Card 3: Remaining safe cushion */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 text-amber-500">
            <span className="text-xs text-slate-400 font-bold">الرصيد التسويقي المتبقي لـ TEEC</span>
            <Coins className="w-5 h-5" />
          </div>
          <p className={`text-2xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>${remainingMonthly.toLocaleString()}</p>
          <div className="text-[10px] text-slate-400 mt-3">
            سقف الميزانية المقررة للمبيعات: <strong className="text-blue-605 dark:text-slate-300">${monthlyLimit.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Grid Content split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Col: Alerts and Allocations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Allocations block */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
              توزيع الميزانية الإعلانية حسب المنصات والأهداف التسويقية
            </h3>

            <div className="space-y-4">
              {/* Platform block */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-semibold">التوزيع المالي حسب المنصة:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600 block ml-1.5" />
                      إعلانات فيسبوك (Facebook Ads)
                    </span>
                    <span className="text-sm font-extrabold text-white block mt-1">${fbSpend.toLocaleString()} (65%)</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center">
                      <span className="w-2.5 h-2.5 rounded bg-instagram block ml-1.5 bg-pink-500" />
                      إعلانات إنستغرام (Instagram Ads)
                    </span>
                    <span className="text-sm font-extrabold text-white block mt-1">${igSpend.toLocaleString()} (35%)</span>
                  </div>
                </div>
              </div>

              {/* Objectives block */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-semibold">موازنة الصرف حسب الأهداف التسويقية (Meta Campaign Objectives):</span>
                <div className="space-y-3">
                  {Object.entries(objectives).map(([objName, val]) => {
                    const percent = ((val / totalSpend) * 100).toFixed(0);
                    return (
                      <div key={objName}>
                        <div className="flex justify-between text-[11px] text-slate-300 font-medium mb-1">
                          <span>{objName === 'Conversions (Sales)' ? 'المبيعات المباشرة وزيادة العملاء (Conversions)' : objName}</span>
                          <span>${val.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active Alerts Logging */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold leading-none flex items-center space-x-1.5 space-x-reverse ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              <Bell className="w-4 h-4 text-rose-500" />
              <span>إشعارات الحماية وصمامات الأمان المالي ({budgetControls.alerts.length})</span>
            </h3>

            <div className="space-y-3">
              {budgetControls.alerts.map((al) => (
                <div 
                  key={al.id} 
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-3 space-x-reverse ${
                    al.type === 'danger' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : al.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold leading-relaxed">{al.message}</p>
                    <span className="block text-[9px] text-slate-500 mt-1">{al.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Col: Limits Config panel */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <h3 className={`text-sm font-bold pb-2.5 border-b border-slate-200 dark:border-slate-800 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              تعديل سقوفات الصرف الإعلاني
            </h3>

            {canEdit ? (
              <form onSubmit={handleSave} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">الميزانية الاستهلاكية اليومية القصوى ($)</label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[9px] text-slate-500 mt-1 block">تحديد حد التنبيه لأي ارتفاع غير مبرر في كلفة الـ CPM.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">الميزانية الاستهلاكية الشهرية القصوى ($)</label>
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[9px] text-slate-500 mt-1 block">سقف الميزانيات الكلي للتكييف والتهوية المعينة لشهر يونيو.</span>
                </div>

                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-500 flex items-start space-x-2 space-x-reverse">
                  <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>تعديل السقف المالي سيقوم بتغيير صمامات إنذار النظام الرقمي وأرشفة المخطط تلقائياً.</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow shadow-blue-500/10"
                >
                  حفظ السقوفات وتحديث التنبيهات
                </button>
              </form>
            ) : (
              <div className="mt-4 bg-slate-950/20 border border-slate-850 p-3 rounded-xl text-center text-[10px] text-slate-500">
                * غير مصرح بتغيير سقوفات الصرف. التعديل متاح فقط للمدير العام ومشتري الإعلانات لتأمين الأرصدة.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
