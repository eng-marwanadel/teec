import React, { useState } from 'react';
import { ContentItem, ContentStatus, User, UserRole } from '../types';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XOctagon, 
  RefreshCw, 
  Inbox, 
  UserCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ApprovalWorkflowProps {
  contentItems: ContentItem[];
  currentUser: User;
  onUpdateStatus: (
    id: string, 
    newStatus: ContentStatus, 
    comment: string, 
    approvedBy: string,
    rejectionReason?: string
  ) => void;
  darkMode: boolean;
}

export default function ApprovalWorkflow({ contentItems, currentUser, onUpdateStatus, darkMode }: ApprovalWorkflowProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestChangesComment, setRequestChangesComment] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [showChangesBox, setShowChangesBox] = useState(false);

  const pendingItems = contentItems.filter(item => item.status === 'Submitted' || item.status === 'Under Review');
  const pastItems = contentItems.filter(item => item.status !== 'Submitted' && item.status !== 'Under Review');

  const canApprove = currentUser.role === UserRole.GENERAL_MANAGER;

  const handleApprove = (item: ContentItem) => {
    onUpdateStatus(
      item.id,
      'Approved',
      'تمت الموافقة والمصادقة على المنشور للتوافق التام مع هوية TEEC وعروضها.',
      currentUser.name
    );
    setSelectedItem(null);
  };

  const handleRejectSubmit = (e: React.FormEvent, item: ContentItem) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('يجب تقديم مبرر أو سبب واضح للرفض الفني لتقييم صانعي المحتوى.');
      return;
    }
    onUpdateStatus(
      item.id,
      'Rejected',
      `مرفوض: ${rejectionReason}`,
      currentUser.name,
      rejectionReason // save rejection reason
    );
    setRejectionReason('');
    setShowRejectBox(false);
    setSelectedItem(null);
  };

  const handleRequestChangesSubmit = (e: React.FormEvent, item: ContentItem) => {
    e.preventDefault();
    if (!requestChangesComment.trim()) {
      alert('يرجى تحديد للتعديلات المطلوبة.');
      return;
    }
    onUpdateStatus(
      item.id,
      'Draft', // send back to draft
      `طلب مراجعة وتعديلات: ${requestChangesComment}`,
      currentUser.name
    );
    setRequestChangesComment('');
    setShowChangesBox(false);
    setSelectedItem(null);
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Under Review':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
    }
  };

  return (
    <div id="approval_workflow" className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            مركز اعتمادات ومراجعات الإدارة التحريرية
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            صلاحيات الموافقة الفورية، صياغة التعديلات، أو رفض المحشورات لضمان معايير TEEC الهندسية الرصينة.
          </p>
        </div>

        {!canApprove && (
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-xs text-amber-500 flex items-center space-x-2 space-x-reverse self-start md:self-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>تنبيه: أنت في وضع المشاهدة لقائمة الموافقات (الصلاحية الكاملة تقتصر على المدير العام فقط).</span>
          </div>
        )}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Pending Content Queue */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className={`text-sm font-bold flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Inbox className="w-4 h-4 text-orange-500" />
            <span>المنشورات بانتظار الاعتماد ({pendingItems.length})</span>
          </h3>

          {pendingItems.length === 0 ? (
            <div className={`p-8 rounded-2xl text-center border ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>لا توجد منشورات قيد المراجعة حالياً!</p>
              <p className="text-xs text-slate-500 mt-1">تمت تصفية وأرشفة جميع محتويات التسويق المودعة بنجاح.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowRejectBox(false);
                    setShowChangesBox(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-right ${
                    selectedItem?.id === item.id 
                      ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20' 
                      : darkMode 
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                      بانتظار الاعتماد
                    </span>
                    <span className="text-[10px] text-slate-400">{item.submittedAt}</span>
                  </div>
                  <h4 className={`text-xs font-bold mt-2 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.contentCopy}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 border-t border-slate-150 dark:border-slate-800 pt-2.5">
                    <span>صاحب الطلب: <strong className="text-slate-300">{item.submittedBy}</strong></span>
                    <span className="text-blue-400">ميزانية الإعلان: ${item.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past items audit log */}
          <div className="pt-4">
            <h3 className={`text-sm font-bold mb-3 flex items-center space-x-2 space-x-reverse ${darkMode ? 'text-slate-200' : 'text-slate-950'}`}>
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              <span>أرشيف القرارات السابقة ومراجعات المخططين ({pastItems.length})</span>
            </h3>

            <div className={`p-4 rounded-xl border max-h-72 overflow-y-auto space-y-3 ${
              darkMode ? 'bg-slate-900/10 border-slate-800' : 'bg-slate-100/50 border-slate-200'
            }`}>
              {pastItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedItem(item);
                    setShowRejectBox(false);
                    setShowChangesBox(false);
                  }}
                  className={`text-xs p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedItem?.id === item.id 
                      ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20' 
                      : darkMode 
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className={`font-bold text-[11px] truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap ${getStatusBadge(item.status)}`}>
                      {item.status === 'Approved' ? 'تم اعتماده وبثه' : item.status === 'Rejected' ? 'تم رفضه' : item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mb-1.5">{item.contentCopy}</p>
                  
                  <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-1.5 mt-1.5">
                    {item.isOrganic ? (
                      <span className="text-amber-500 font-semibold">📝 بوست عادي (عضوي)</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">💰 ممول بقيمة ${item.budget}</span>
                    )}

                    {item.approvedAt && (
                      <span className="opacity-80">
                        القرار بواسطة: {item.approvedBy}
                      </span>
                    )}
                  </div>

                  {item.rejectionReason && (
                    <p className="text-[9px] text-red-500 mt-1 font-semibold border-t border-red-500/10 pt-1">
                      سبب الرفض: {item.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Expanded Preview & GM Actions */}
        <div className="lg:col-span-5">
          {selectedItem ? (
            <div className={`p-5 rounded-2xl border sticky top-4 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-250 shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
                <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  تفاصيل مراجعة: {selectedItem.title}
                </h3>
              </div>

              {/* Overriding power/decision warning banner if already resolved */}
              {pastItems.some(x => x.id === selectedItem.id) && (
                <div className="mt-3 p-3 bg-blue-105 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl text-[10.5px] text-blue-900 dark:text-blue-400 font-extrabold text-right leading-relaxed">
                  📢 قرار محفوظ سابقاً: ({selectedItem.status === 'Approved' ? 'تم اعتماده' : 'مرفوض كلياً'}).
                  <p className="font-bold text-[9.5px] mt-0.5 opacity-90 text-slate-600 dark:text-slate-400">
                    بصفتك المدير العام، يمكنك تعديل أو نقض القرار في أي وقت وصياغته مجدداً بالأسفل (سيتم تحديث سجل الأنشطة فوراً).
                  </p>
                </div>
              )}

              {/* Graphic preview mockup */}
              <div className={`my-4 rounded-xl overflow-hidden border relative h-40 ${
                darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'
              }`}>
                <img 
                  src={selectedItem.mediaUrl} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent p-4 flex flex-col justify-end">
                  <span className="bg-slate-900/80 text-[10px] text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800 self-start mb-2 font-black">
                    {selectedItem.type}
                  </span>
                  <p className="text-white text-xs font-black leading-tight">{selectedItem.title}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <strong className={`block mb-1 text-[10.5px] font-black ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                    النص التسويقي (Copywriting):
                  </strong>
                  <div className={`p-4 rounded-xl border font-bold text-[11px] leading-relaxed transition-all ${
                    darkMode 
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-205' 
                      : 'bg-slate-50 border-slate-250 text-slate-950 shadow-inner'
                  }`}>
                    {selectedItem.contentCopy}
                  </div>
                </div>

                {/* Sub-grid of rich parameters */}
                <div className={`grid grid-cols-2 gap-3 text-[10px] p-3.5 rounded-xl border ${
                  darkMode 
                    ? 'bg-slate-955/40 border-slate-800 text-slate-300' 
                    : 'bg-slate-50 border-slate-250 text-slate-900'
                }`}>
                  <div>
                    <span className="text-slate-500 block font-bold">الجمهور المستهدف:</span>
                    <span className={`font-black ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedItem.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">العمر والجنس:</span>
                    <span className={`font-black ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedItem.targetAge} | {selectedItem.targetGender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">الميزانية المقررة:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10.5px]">
                      {selectedItem.isOrganic ? 'بدون ميزانية (بوست عادي)' : `$${selectedItem.budget}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">الإجراء والهدف (CTA):</span>
                    <span className="text-blue-700 dark:text-blue-400 font-black truncate block">{selectedItem.cta}</span>
                  </div>
                </div>

                {/* Interactive Action Forms for GM */}
                <div className={`border-t pt-4 mt-4 ${darkMode ? 'border-slate-800' : 'border-slate-250'}`}>
                  {canApprove ? (
                    <div className="space-y-3">
                      {!showRejectBox && !showChangesBox ? (
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleApprove(selectedItem)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 px-3 font-black text-xs flex items-center justify-center space-x-1.5 space-x-reverse transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>اعتماد وموافقة القرار</span>
                          </button>
                          <button
                            onClick={() => { setShowRejectBox(true); setShowChangesBox(false); }}
                            className={`rounded-xl py-3 px-3 font-black text-xs transition-all border cursor-pointer ${
                              darkMode 
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30' 
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                            }`}
                          >
                            رفض للتعديل
                          </button>
                          <button
                            onClick={() => { setShowChangesBox(true); setShowRejectBox(false); }}
                            className={`rounded-xl py-3 px-3 font-black text-xs transition-all border cursor-pointer ${
                              darkMode 
                                ? 'bg-slate-800 hover:bg-slate-705 text-white border-slate-700' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                            }`}
                          >
                            طلب تغيير ومسودة
                          </button>
                        </div>
                      ) : null}

                      {/* Reject Input Block */}
                      {showRejectBox && (
                        <form onSubmit={(e) => handleRejectSubmit(e, selectedItem)} className="space-y-2">
                          <label className="block text-[11px] font-black text-rose-600 dark:text-rose-400">
                            أدخل سبب الرفض لتوجيه المخططين وصانعي المحتوى: <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="مثال: يرجى كتابة عروض التكييف بشكل أوضح وتثبيت شعار TEEC المعتمد لعام 2026..."
                            className={`w-full rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-rose-500 font-bold ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 text-white' 
                                : 'bg-slate-50 border-slate-300 text-slate-955'
                            }`}
                          />
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              type="submit"
                              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2 px-4 font-black text-[10.5px] cursor-pointer"
                            >
                              تأكيد وفرض الرفض الكلي
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRejectBox(false)}
                              className={`rounded-xl py-2 px-4 text-[10.5px] font-bold cursor-pointer ${
                                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              إلغاء
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Request Changes block */}
                      {showChangesBox && (
                        <form onSubmit={(e) => handleRequestChangesSubmit(e, selectedItem)} className="space-y-2">
                          <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300">
                            حدد التعديلات المطلوبة لإعادة المسودة للمصممين: <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={requestChangesComment}
                            onChange={(e) => setRequestChangesComment(e.target.value)}
                            placeholder="مثال: نقترح تخفيض الميزانية المعروضة إلى 1500$ لمكيفات الكونسيلد والتركيز على مكيفات جري كأولوية."
                            className={`w-full rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-500 font-bold ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 text-white' 
                                : 'bg-slate-50 border-slate-300 text-slate-955'
                            }`}
                          />
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2 px-4 font-black text-[10.5px] cursor-pointer"
                            >
                              إرسال للتعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowChangesBox(false)}
                              className={`rounded-xl py-2 px-4 text-[10.5px] font-bold cursor-pointer ${
                                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              إلغاء
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-100 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 p-3.5 rounded-xl text-center text-[10px] text-slate-500 dark:text-slate-500 font-bold">
                      * يقتصر اتخاذ القرارات وحيازة التعديل والنقض والاعتماد على حساب المدير العام فقط.
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center border-dashed ${
              darkMode ? 'bg-slate-900/10 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <ClipboardCheck className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className={`text-xs font-black ${darkMode ? 'text-slate-400' : 'text-slate-800'}`}>
                يرجى تحديد منشور من القائمة المعلقة أو الأرشيف لمراجعة تفاصيل التقييم والاعتمادات.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
