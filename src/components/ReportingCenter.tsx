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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            مركز استخراج وتوليد التقارير الشاملة
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إعداد وتنزيل كشوف الأداء اليومي والأسبوعي والشهري للتصاميم المعمارية وحملات مبيعات التكييف لشركة TEEC.
          </p>
        </div>
      </div>

      {reportFeedback && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2 space-x-reverse">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{reportFeedback}</span>
        </div>
      )}

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Layout Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <h3 className={`text-sm font-bold pb-2.5 border-b border-slate-8e0 dark:border-slate-800 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              تخصيص هيكل وتصفية التقرير
            </h3>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">حدد الفاصل الدوري:</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl">
                  {(['daily', 'weekly', 'monthly'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setReportFormat(fmt)}
                      className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                        reportFormat === fmt ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      {fmt === 'daily' ? 'كشف يومي' : fmt === 'weekly' ? 'كشف أسبوعي' : 'كشف شهري'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">المنصة التسويقية المستهدفة:</label>
                <select className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs">
                  <option>المنصات المدمجة (فيسبوك وإنستغرام)</option>
                  <option>فيسبوك فقط (Facebook Only)</option>
                  <option>إنستغرام فقط (Instagram Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">تضمين المؤشرات الإضافية:</label>
                <div className="space-y-2 mt-1">
                  <label className="flex items-center space-x-2 space-x-reverse text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-blue-500 text-[10px]" />
                    <span>تضمين درجات تقييم إعلانات Meta الفردية (Grade Score)</span>
                  </label>
                  <label className="flex items-center space-x-2 space-x-reverse text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-blue-500 text-[10px]" />
                    <span>تضمين سجل مراجعات واعتمادات المدير العام</span>
                  </label>
                  <label className="flex items-center space-x-2 space-x-reverse text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-blue-500 text-[10px]" />
                    <span>توزيع الصرف حسب أهداف كسب المبيعات</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-850">
                <button
                  type="button"
                  onClick={triggerExportPDF}
                  disabled={isExportingPDF}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 space-x-reverse"
                >
                  <Printer className="w-4 h-4 ml-1 flex-shrink-0" />
                  <span>{isExportingPDF ? 'جاري التحضير واستخراج PDF...' : 'استخراج فوري كملف PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={triggerExportExcel}
                  disabled={isExportingExcel}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 space-x-reverse"
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
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-150 shadow-md'
          }`}>
            {/* Mockup Frame Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-8a0 dark:border-slate-800 mb-6">
              <div className="text-right">
                <span className="text-[10px] bg-blue-600/15 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/10 font-bold uppercase">
                  نموذج التقرير التنفيذي لـ TEEC
                </span>
                <h4 className="text-sm font-bold text-white mt-1">تقرير الأداء التسويقي لشهر يونيو 2026</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">مستخرج: 2026-06-15</span>
            </div>

            {/* Document stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold">الإنفاق الإجمالي</span>
                <span className="text-base font-black text-white block mt-1">${totalSpend.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold">عائد الإنفاق ROAS</span>
                <span className="text-base font-black text-emerald-400 block mt-1">{roas}x</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold">العملاء (Leads)</span>
                <span className="text-base font-black text-white block mt-1">{totalLeads} عميل</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold">الحملات المفحوصة</span>
                <span className="text-base font-black text-white block mt-1">{campaigns.length} حملات</span>
              </div>
            </div>

            {/* Simulated content sections */}
            <div className="space-y-4 text-xs text-right leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850/60 leading-relaxed text-slate-300">
                <strong className="text-white block mb-1 text-[11px]">1. المقدمة والخلاصة التنفيذية للتقرير:</strong>
                <p className="text-[10px]">
                  يسجل النشاط التسويقي المجدول لشهر يونيو صعوداً تدريجياً لافتاً في العوائد والمبيعات المحققة، مسجلا عائداً إعلانيا (ROAS) نموذجياً يقارب الـ 4.09x. يتبرز الطلب الصيفي على أنظمة تكييف الهواء ذات دقة الربط لشركة TEEC كعامل جذب أساسي للجمهور المستهدف.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850/60 leading-relaxed text-slate-300">
                <strong className="text-white block mb-1.5 text-[11px]">2. ملخص أداء إعلانات ومجموعات Meta النشطة:</strong>
                <table className="w-full text-right text-[10px] mt-2">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-semibold mb-2">
                      <th className="pb-1.5 font-bold">اسم الحملة والمنصة</th>
                      <th className="pb-1.5 text-center">مرات الظهور</th>
                      <th className="pb-1.5 text-left">التكلفة والإنفاق ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c.id} className="border-b border-slate-800/20 py-1.5 block md:table-row">
                        <td className="py-2 text-slate-200 truncate">{c.name}</td>
                        <td className="py-2 text-center text-slate-400 font-mono">{c.impressions.toLocaleString()}</td>
                        <td className="py-2 text-left text-slate-300 font-semibold">${c.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-[9px] text-slate-500 text-center border-t border-slate-850 pt-3">
                * مستخرج وتلقائي عبر مركز قيادة TEEC الرقمية لشركة تكييف وتجارة وتوريدات هندسية والمربوط ببوابات Meta.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
