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

            <div className={`p-4 rounded-xl border max-h-64 overflow-y-auto space-y-3 ${
              darkMode ? 'bg-slate-900/10 border-slate-800/80' : 'bg-slate-50/50 border-slate-200'
            }`}>
              {pastItems.map((item) => (
                <div key={item.id} className="text-xs p-3 rounded-lg bg-slate-900/50 border border-slate-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-[11px]">{item.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                      {item.status === 'Approved' ? 'تم اعتماده وبثه' : item.status === 'Rejected' ? 'تم رفضه' : item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.contentCopy}</p>
                  {item.approvedAt && (
                    <p className="text-[9px] text-slate-500 mt-1">
                      تم الاعتماد بواسطة {item.approvedBy} في {item.approvedAt}
                    </p>
                  )}
                  {item.rejectionReason && (
                    <p className="text-[9px] text-red-400 mt-1 font-semibold">
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
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-150 shadow-md'
            }`}>
              <h3 className={`text-sm font-bold pb-3 border-b border-slate-150 dark:border-slate-800 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                تفاصيل مراجعة: {selectedItem.title}
              </h3>

              {/* Graphic preview mockup */}
              <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative h-40">
                <img 
                  src={selectedItem.mediaUrl} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent p-4 flex flex-col justify-end">
                  <span className="bg-slate-900/80 text-[10px] text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800 self-start mb-2">
                    {selectedItem.type}
                  </span>
                  <p className="text-white text-xs font-bold leading-tight">{selectedItem.title}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <strong className="text-slate-400 block mb-0.5 text-[10px]">النص التسويقي (Copywriting):</strong>
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-slate-300 text-[11px]">
                    {selectedItem.contentCopy}
                  </div>
                </div>

                {/* Sub-grid of rich parameters */}
                <div className="grid grid-cols-2 gap-3 text-[10px] bg-slate-950/20 p-3 rounded-lg border border-slate-800/40">
                  <div>
                    <span className="text-slate-500 block">الجمهور المستهدف:</span>
                    <span className="text-slate-300 font-semibold">{selectedItem.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">العمر والجنس:</span>
                    <span className="text-slate-300 font-semibold">{selectedItem.targetAge} | {selectedItem.targetGender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الميزانية:</span>
                    <span className="text-emerald-400 font-bold">${selectedItem.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الإجراء والهدف:</span>
                    <span className="text-rose-400 font-semibold truncate block">{selectedItem.cta}</span>
                  </div>
                </div>

                {/* Interactive Action Forms for GM */}
                <div className="border-t border-slate-850 pt-4 mt-4">
                  {canApprove ? (
                    <div className="space-y-3">
                      {!showRejectBox && !showChangesBox ? (
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleApprove(selectedItem)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 px-3 font-semibold text-xs flex items-center justify-center space-x-1 space-x-reverse transition-all shadow shadow-emerald-500/10"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>اعتماد وموافقة فورية</span>
                          </button>
                          <button
                            onClick={() => { setShowRejectBox(true); setShowChangesBox(false); }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl py-2.5 px-3 font-semibold text-xs transition-all border border-rose-500/30"
                          >
                            رفض للتعديل
                          </button>
                          <button
                            onClick={() => { setShowChangesBox(true); setShowRejectBox(false); }}
                            className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 px-3 font-semibold text-xs transition-all border border-slate-700"
                          >
                            طلب تعديل
                          </button>
                        </div>
                      ) : null}

                      {/* Reject Input Block */}
                      {showRejectBox && (
                        <form onSubmit={(e) => handleRejectSubmit(e, selectedItem)} className="space-y-2">
                          <label className="block text-[11px] font-semibold text-rose-400">
                            أدخل سبب الرفض لتوجيه صانع المحتوى: <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="مثال: يرجى استبدال الشعار بآخر ذو دقة عالية، وتخفيف لغة التسويق لتناسب B2B..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-rose-500 text-white"
                          />
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              type="submit"
                              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-1.5 px-3 font-semibold text-[10px]"
                            >
                              تأكيد الرفض الكلي
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRejectBox(false)}
                              className="bg-slate-800 text-slate-300 rounded-xl py-1.5 px-3 text-[10px]"
                            >
                              إلغاء
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Request Changes block */}
                      {showChangesBox && (
                        <form onSubmit={(e) => handleRequestChangesSubmit(e, selectedItem)} className="space-y-2">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            حدد التعديلات المطلوبة (سيتحول لمسودة جارية): <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={requestChangesComment}
                            onChange={(e) => setRequestChangesComment(e.target.value)}
                            placeholder="مثال: نقترح تخفيض الميزانية المعروضة إلى 3000$ وزيادة الفئات العمرية المستهدفة."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                          />
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-1.5 px-3 font-semibold text-[10px]"
                            >
                              إرسال للتعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowChangesBox(false)}
                              className="bg-slate-800 text-slate-300 rounded-xl py-1.5 px-3 text-[10px]"
                            >
                              إلغاء
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-xl text-center text-[10px] text-slate-500">
                      * يقتصر اتخاذ القرارات على حساب المدير العام فقط.
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center border-dashed ${
              darkMode ? 'bg-slate-900/10 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <ClipboardCheck className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-60" />
              <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                يرجى تحديد منشور من القائمة المعلقة لمراجعة تفاصل التقييم والاعتمادات.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
