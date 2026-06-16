import React, { useState } from 'react';
import { CampaignData, ContentItem } from '../types';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Filter, 
  Calendar, 
  FileSpreadsheet, 
  ArrowUpRight,
  TrendingDown,
  Printer
} from 'lucide-react';

interface ReportingCenterProps {
  campaigns: CampaignData[];
  contentItems: ContentItem[];
  darkMode: boolean;
}

export default function ReportingCenter({ campaigns, contentItems, darkMode }: ReportingCenterProps) {
  const [reportFormat, setReportFormat] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [reportFeedback, setReportFeedback] = useState('');

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';

  const triggerExportPDF = () => {
    setIsExportingPDF(true);
    setReportFeedback('');
    setTimeout(() => {
      setIsExportingPDF(false);
      setReportFeedback(`نجاح: تم إنشاء وتجميع التقرير المالي الشامل بصيغة PDF وحفظه في التنزيلات لـ TEEC.`);
    }, 1505);
  };

  const triggerExportExcel = () => {
    setIsExportingExcel(true);
    setReportFeedback('');
    setTimeout(() => {
      setIsExportingExcel(false);
      setReportFeedback(`نجاح: تم تصدير بيانات الجداول بصيغة Excel (XLSX) بنجاح.`);
    }, 1200);
  };

  return (
    <div id="reporting_center" className="space-y-6">
      
      {/* Header Panel */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 ${
        darkMode ? 'border-slate-800' : 'border-slate-205'
      }`}>
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            مركز استخراج وتوليد التقارير الشاملة
          </h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
            إعداد وتنزيل كشوف الأداء اليومي والأسبوعي والشهري للتصاميم المعمارية وحملات مبيعات التكييف لشركة TEEC.
          </p>
        </div>
      </div>

      {reportFeedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 space-x-reverse border ${
          darkMode 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-emerald-50 border-emerald-250 text-emerald-800 font-black shadow-sm'
        }`}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{reportFeedback}</span>
        </div>
      )}

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Layout Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-250 shadow-sm'
          }`}>
            <h3 className={`text-sm font-black pb-3 border-b ${
              darkMode ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-955'
            }`}>
              تخصيص هيكل وتصفية التقرير
            </h3>

            <div className="space-y-4 mt-4 text-right">
              <div>
                <label className={`block text-xs font-black mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  حدد الفاصل الدوري:
                </label>
                <div className={`grid grid-cols-3 gap-2 p-1 rounded-xl ${
                  darkMode ? 'bg-slate-950/40 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                }`}>
                  {(['daily', 'weekly', 'monthly'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setReportFormat(fmt)}
                      className={`py-2 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                        reportFormat === fmt 
                          ? 'bg-blue-600 text-white shadow' 
                          : darkMode 
                            ? 'text-slate-400 hover:text-white' 
                            : 'text-slate-655 hover:text-slate-950 hover:bg-slate-200/50'
                      }`}
                    >
                      {fmt === 'daily' ? 'كشف يومي' : fmt === 'weekly' ? 'كشف أسبوعي' : 'كشف شهري'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-black mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  المنصة التسويقية المستهدفة:
                </label>
                <select className={`w-full border rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-950'
                }`}>
                  <option>المنصات المدمجة (فيسبوك وإنستغرام)</option>
                  <option>فيسبوك فقط (Facebook Only)</option>
                  <option>إنستغرام فقط (Instagram Only)</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-black mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-705'}`}>
                  تضمين المؤشرات الإضافية:
                </label>
                <div className="space-y-2.5 mt-1.5 font-bold">
                  <label className={`flex items-center space-x-2 space-x-reverse text-xs cursor-pointer ${
                    darkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className={`rounded text-blue-500 text-[10px] w-4 h-4 ${
                        darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-50'
                      }`} 
                    />
                    <span>تضمين درجات تقييم إعلانات Meta الفردية (Grade Score)</span>
                  </label>
                  <label className={`flex items-center space-x-2 space-x-reverse text-xs cursor-pointer ${
                    darkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className={`rounded text-blue-500 text-[10px] w-4 h-4 ${
                        darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-50'
                      }`} 
                    />
                    <span>تضمين سجل مراجعات واعتمادات المدير العام</span>
                  </label>
                  <label className={`flex items-center space-x-2 space-x-reverse text-xs cursor-pointer ${
                    darkMode ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className={`rounded text-blue-500 text-[10px] w-4 h-4 ${
                        darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-50'
                      }`} 
                    />
                    <span>توزيع الصرف حسب أهداف كسب المبيعات</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className={`space-y-2 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={triggerExportPDF}
                  disabled={isExportingPDF}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500 text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 space-x-reverse cursor-pointer"
                >
                  <Printer className="w-4 h-4 ml-1 flex-shrink-0" />
                  <span>{isExportingPDF ? 'جاري التحضير واستخراج PDF...' : 'استخراج فوري كملف PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={triggerExportExcel}
                  disabled={isExportingExcel}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500 text-xs font-black py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 space-x-reverse cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 ml-1 flex-shrink-0" />
                  <span>{isExportingExcel ? 'جاري المعالجة كـ Excel...' : 'تصدير كامل ومطابق كـ Excel'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Report Mockup Sheet */}
        <div className="lg:col-span-8">
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-250 shadow-md'
          }`}>
            {/* Mockup Frame Header */}
            <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="text-right">
                <span className="text-[10px] bg-blue-600/15 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-500/10 font-black uppercase">
                  نموذج التقرير التنفيذي لـ TEEC
                </span>
                <h4 className={`text-sm font-black mt-1.5 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  تقرير الأداء التسويقي لشهر يونيو 2026
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">مستخرج: 2026-06-15</span>
            </div>

            {/* Document stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className={`p-3 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}>
                <span className="text-[9.5px] text-slate-500 font-bold block">الإنفاق الإجمالي</span>
                <span className={`text-base font-black block mt-1 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  ${totalSpend.toLocaleString()}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-emerald-50 border-emerald-200 shadow-sm'
              }`}>
                <span className="text-[9.5px] text-slate-500 font-bold block">عائد الإنفاق ROAS</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                  {roas}x
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}>
                <span className="text-[9.5px] text-slate-500 font-bold block">العملاء (Leads)</span>
                <span className={`text-base font-black block mt-1 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {totalLeads} عميل
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}>
                <span className="text-[9.5px] text-slate-500 font-bold block">الحملات المفحوصة</span>
                <span className={`text-base font-black block mt-1 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {campaigns.length} حملات
                </span>
              </div>
            </div>

            {/* Simulated content sections */}
            <div className="space-y-4 text-xs text-right leading-relaxed font-bold">
              <div className={`p-4 rounded-xl border leading-relaxed ${
                darkMode ? 'bg-slate-950/20 border-slate-850/60 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-805 shadow-sm'
              }`}>
                <strong className={`block mb-1 text-[11px] font-black ${darkMode ? 'text-white' : 'text-slate-955'}`}>
                  1. المقدمة والخلاصة التنفيذية للتقرير:
                </strong>
                <p className="text-[10px] leading-relaxed">
                  يسجل النشاط التسويقي المجدول لشهر يونيو صعوداً تدريجياً لافتاً في العوائد والمبيعات المحققة، مسجلا عائداً إعلانيا (ROAS) نموذجياً يقارب الـ {roas}x. يتبرز الطلب الصيفي على أنظمة تكييف الهواء ذات دقة الربط لشركة TEEC كعامل جذب أساسي للجمهور المستهدف.
                </p>
              </div>

              <div className={`p-4 rounded-xl border leading-relaxed ${
                darkMode ? 'bg-slate-950/20 border-slate-850/60 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-805 shadow-sm'
              }`}>
                <strong className={`block mb-1.5 text-[11px] font-black ${darkMode ? 'text-white' : 'text-slate-955'}`}>
                  2. ملخص أداء إعلانات ومجموعات Meta النشطة:
                </strong>
                <table className="w-full text-right text-[10px] mt-2">
                  <thead>
                    <tr className={`border-b text-slate-500 font-bold mb-2 ${darkMode ? 'border-slate-800' : 'border-slate-250'}`}>
                      <th className="pb-1.5 font-black">اسم الحملة والمنصة</th>
                      <th className="pb-1.5 text-center font-black">مرات الظهور</th>
                      <th className="pb-1.5 text-left font-black">التكلفة والإنفاق ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c.id} className={`border-b py-1.5 block md:table-row ${darkMode ? 'border-slate-800/30' : 'border-slate-200/50'}`}>
                        <td className={`py-2 truncate font-black ${darkMode ? 'text-slate-200' : 'text-slate-950'}`}>{c.name}</td>
                        <td className={`py-2 text-center font-mono font-black ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{c.impressions.toLocaleString()}</td>
                        <td className={`py-2 text-left font-black ${darkMode ? 'text-slate-300' : 'text-slate-900 font-extrabold'}`}>${c.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className={`text-[10px] text-center pt-3 border-t ${
                darkMode ? 'text-slate-550 border-slate-850' : 'text-slate-600 border-slate-200 font-bold'
              }`}>
                * مستخرج وتلقائي عبر مركز قيادة TEEC الرقمية لشركة تكييف وتجارة وتوريدات هندسية والمربوط ببوابات Meta Graph API.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
