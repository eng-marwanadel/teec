import React, { useState } from 'react';
import { CampaignData, PageAnalytics } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Facebook, 
  Instagram, 
  Share2, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Cpu, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface MetaAnalyticsProps {
  campaigns: CampaignData[];
  pageStats: PageAnalytics;
  darkMode: boolean;
}

interface AIInsight {
  type: string;
  title: string;
  text: string;
}

export default function MetaAnalytics({ campaigns, pageStats, darkMode }: MetaAnalyticsProps) {
  const [metaConnected, setMetaConnected] = useState(true);
  const [selectedCmp, setSelectedCmp] = useState<CampaignData>(campaigns[0]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // Call server-side /api/ai/insights
  const generateAIRecommendations = async (cmp: CampaignData) => {
    setLoadingAI(true);
    setAiInsights([]);
    setAiMessage('');
    try {
      // Calculate spend and ROAS
      const spend = cmp.spend;
      const ROAS = spend > 0 ? (cmp.revenue / spend).toFixed(2) : '0';
      const cpc = spend > 0 ? (spend / (cmp.reach * 0.04)).toFixed(2) : '0';
      const cpm = cmp.impressions > 0 ? ((spend / cmp.impressions) * 1000).toFixed(2) : '0';
      
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: cmp.name,
          ctr: 1.85,
          cpm: parseFloat(cpm),
          cpc: parseFloat(cpc),
          spend: spend,
          ROAS: `${ROAS}x`,
          purchases: cmp.purchases
        })
      });
      const result = await res.json();
      if (result.insights) {
        setAiInsights(result.insights);
        if (result.message) {
          setAiMessage(result.message);
        }
      } else {
        throw new Error('No insights returned');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback local simulated Insights
      setAiInsights([
        {
          type: "success",
          title: "محاكاة: زيادة ميزانية الاستحواذ",
          text: `حملة "${cmp.name}" تسجل عائداً مميزاً. نقترح زيادة الميزانية بنسبة 20% بضم جمهور موازي لتعظيم المبيعات.`
        }
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/25';
    if (score >= 75) return 'text-blue-500 border-blue-500/25';
    if (score >= 60) return 'text-amber-500 border-amber-500/25';
    return 'text-rose-500 border-rose-500/25';
  };

  const getPostGrade = (score: number) => {
    if (score >= 90) return { label: 'ممتاز جداً (A+)', rating: 'Excellent' };
    if (score >= 75) return { label: 'جيد جداً (A)', rating: 'Good' };
    if (score >= 60) return { label: 'متوسط (B)', rating: 'Average' };
    return { label: 'ضعيف الأداء (D)', rating: 'Poor' };
  };

  // Mock post performance ranking list
  const mockPostsPerformance = [
    { id: 'p1', title: 'فيديو تبريد المصانع المركزية بـ TEEC', type: 'ريد فيديو', reach: '145K', clicks: '3.2K', rate: 'Excellent', score: 95 },
    { id: 'p2', title: 'صورة عروض فيلات الساحل الشتوية والصيفية', type: 'صورة', reach: '130K', clicks: '2.8K', rate: 'Good', score: 88 },
    { id: 'p3', title: 'كاروسيل الأسقف الجبسية وفتحات التكييف', type: 'كاروسيل', reach: '70K', clicks: '1.1K', rate: 'Average', score: 72 },
    { id: 'p4', title: 'شور تكييف السقف المخفي المفتوح السعري', type: 'ستوري', reach: '40K', clicks: '340', rate: 'Poor', score: 54 }
  ];

  return (
    <div id="meta_analytics" className="space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            تكامل وتحليلات منصات Meta الإعلانية
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            سحب تلقائي ومزامنة بيانات الصفحات وحسابات الإعلانات لفيسبوك وإنستغرام (FB Pages & Business Meta integration).
          </p>
        </div>

        {/* Integration Status toggle */}
        <button
          onClick={() => setMetaConnected(!metaConnected)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 space-x-reverse ${
            metaConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${metaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{metaConnected ? 'متصل وحي ببيانات Meta APIs' : 'اضغط للربط ببوابة Meta'}</span>
        </button>
      </div>

      {metaConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Col Left: Facebook Page & Growth */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Page Summary and Graph */}
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-blue-500">
                  <Facebook className="w-5 h-5" />
                  <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    تحليلات صفحة فيسبوك ومجتمع المتابعين (TEEC Online Page)
                  </h3>
                </div>
              </div>

              {/* FB Mini metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-right">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500">المتابعين الحاليين</p>
                  <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pageStats.followers.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-500 flex items-center mt-1 font-bold">
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    +{pageStats.newFollowers.toLocaleString()} متابع
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500">معدل الوصول (Reach)</p>
                  <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pageStats.reach.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500">التفاعل الكلي (Engagement)</p>
                  <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pageStats.engagement.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500">معدل التنويه النموذجي</p>
                  <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>4.85%</p>
                </div>
              </div>

              {/* Growth Line chart */}
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageStats.growthHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                        fontSize: 11
                      }} 
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Line name="نمو المتابعين" type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line name="الوصول" type="monotone" dataKey="reach" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Post Performance Auto Ranking table */}
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                تقييم وترتيب أداء المنشورات السابقة (Post Performance Ranking)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-400">
                      <th className="pb-2 text-slate-500 font-bold">المنشور والتنسيق</th>
                      <th className="pb-2 text-slate-500 font-bold">مرات الوصول (Reach)</th>
                      <th className="pb-2 text-slate-500 font-bold">نقرات الرابط (Clicks)</th>
                      <th className="pb-2 text-slate-500 font-bold">نقاط التقييم</th>
                      <th className="pb-2 text-slate-500 font-bold">المرتبة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPostsPerformance.map((post) => {
                      const gradeInfo = getPostGrade(post.score);
                      return (
                        <tr key={post.id} className="border-b border-slate-100 dark:border-slate-800/40 py-2">
                          <td className="py-3">
                            <span className={`font-extrabold block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{post.title}</span>
                            <span className="text-[10px] text-slate-500">{post.type}</span>
                          </td>
                          <td className={`py-3 font-bold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{post.reach}</td>
                          <td className={`py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{post.clicks}</td>
                          <td className={`py-3 font-black ${getScoreColor(post.score)}`}>{post.score} / 100</td>
                          <td className="py-3">
                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded ${
                              post.rate === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                              post.rate === 'Good' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                              post.rate === 'Average' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}>
                              {gradeInfo.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Col Right: Facebook Ads & Gemini AI Insights */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Ad Sets & Grade */}
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-sm font-bold pb-2 border-b border-slate-200 dark:border-slate-800 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                نقاط تقييم مجموعات إعلانات Meta
              </h3>

              <div className="mt-4 space-y-4">
                {campaigns.map((cmp) => {
                  const spend = cmp.spend;
                  const ROAS = spend > 0 ? (cmp.revenue / spend).toFixed(1) : '0.0';
                  // Scoring calculations
                  const bestAd = cmp.ads.reduce((best, current) => (current.score > best.score ? current : best), cmp.ads[0]);

                  return (
                    <div key={cmp.id} className={`p-3.5 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-extrabold text-xs block truncate max-w-[200px] ${darkMode ? 'text-white' : 'text-slate-800'}`}>{cmp.name}</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded border ${
                          bestAd.score >= 90 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {bestAd.grade}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex justify-between">
                        <span>الإنفاق: ${spend}</span>
                        <span>ROAS: {ROAS}x</span>
                        <span className="text-emerald-500">إعلان رابح: {bestAd.name.substring(0, 15)}...</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Gemini AI Insights Board */}
            <div className={`p-5 rounded-wxl border bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/5`}>
              <div className="flex items-center space-x-2 space-x-reverse text-blue-400 mb-3">
                <Cpu className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-sm font-bold text-white">توليد توصيات تسويقية تفصيلية (Gemini API)</h3>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                يقوم الذكاء الاصطناعي بدراسة مؤشرات CPC, CPM, CTR و ROAS الفورية للحملة المحددة وينشئ توصية صياغة تسويقية هادفة.
              </p>

              {/* Selector */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-300 font-semibold mb-1">حدد الحملة الإعلانية للتحليل:</label>
                  <select
                    value={selectedCmp.id}
                    onChange={(e) => {
                      const matched = campaigns.find(c => c.id === e.target.value);
                      if (matched) setSelectedCmp(matched);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-[11px] focus:outline-none focus:border-blue-500"
                  >
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => generateAIRecommendations(selectedCmp)}
                  disabled={loadingAI}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-white py-2.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {loadingAI ? (
                    <>
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                      <span>قيد المعالجة واستخراج الحسابات...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>توليد توصية Gemini الذكية</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Message Alert */}
              {aiMessage && (
                <div className="mt-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl p-2.5 text-[9px] leading-relaxed">
                  {aiMessage}
                </div>
              )}

              {/* Insights outputs */}
              <div className="mt-4 space-y-3">
                {aiInsights.map((ins, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 leading-relaxed">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-lg mb-1.5 ${
                      ins.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                      ins.type === 'warning' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-sky-500/10 text-sky-400'
                    }`}>
                      {ins.title}
                    </span>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                      {ins.text}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-3 opacity-60" />
          <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>أنت غير متصل ببوابات Meta الإعلانية حالياً</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            لربط وتتبع إعلانات فيسبوك بصفحة هبوط TEEC، يرجى الضغط على زر الربط بالأعلى للموافقة، وتوليد مفاتيح Meta Access Tokens تلقائياً.
          </p>
        </div>
      )}
    </div>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}
