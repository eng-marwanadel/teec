import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API endpoint for AI Insights
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { campaignName, ctr, cpm, cpc, spend, ROAS, purchases } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        // Return realistic high-fidelity simulated recommendations
        const mockInsights = [
          {
            type: "success",
            title: "زيادة ميزانية الاستحواذ المقترحة",
            text: `حملة "${campaignName || "أنظمة VRF مصر"}" تسجل أداءً استثنائياً بمعدل عائد على الإنفاق الإعلاني يبلغ ${ROAS || "4.3x"}. نوصي برفع الميزانية التدريجي بنسبة 20% لتجنب تشتت وتداخل المبيعات مع ضمان توسيع نسبة الاستهداف لشركات المقاولات والديكور.`
          },
          {
            type: "warning",
            title: "تنبيه إرهاق إبداعي (Creative Fatigue)",
            text: `نسبة النقر للظهور (CTR) البالغة ${ctr || "1.8%"} تقترب من الحد الأدنى المقبول تسويقياً للقطاع الراقي. ننصح المدير الإبداعي بتبديل التصاميم الراكدة بإضافات مقاطع ريلز واقعية تبرمج كواليس حقيقية من مواقع مشاريع TEEC.`
          },
          {
            type: "info",
            title: "تحسين تكلفة النقرة وإشارة التوسع",
            text: `كلفة الألف ظهور (CPM) البالغة ${cpm || "4.8$"} مناسبة واقتصادية للغاية للمنافسة. يمكن التوسع باستهداف المهندسين الاستشاريين المشرفين بزيادة تركيزات مبيعات كونسيلد المخفي.`
          }
        ];
        return res.json({ 
          insights: mockInsights, 
          isSimulated: true,
          message: "تحذير: لم يتم تكوين مفتاح GEMINI_API_KEY حقيقي في Secrets. البيانات المعروضة تم توليدها تلقائياً بهيكل مرن ذكي."
        });
      }

      // Real Gemini API call
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `أنت خبير تسويق رقمي ومحلل إعلانات محترف تعمل لصالح شركة TEEC المتخصصة في التبريد والتكييف المركزي الفاخر في مصر.
بناءً على مقاييس أداء الحملة التالية:
اسم الحملة: ${campaignName}
الإنفاق الإجمالي الحالي: ${spend} دولار
نسبة النقر للظهور (CTR): ${ctr}%
كلفة الألف ظهور (CPM): ${cpm} دولار
تكلفة النقرة (CPC): ${cpc} دولار
تعداد المشتريات: ${purchases} عملية ناجحة
العائد على الإنفاق (ROAS): ${ROAS}

قم بجلب 3 توجيهات وتوصيات رئيسية تسويقية عميقة ومثمرة باللغة العربية بلهجة مهنية سديدة ومباشرة للارتقاء بالحملة.
يجب أن ترجع النتيجة بصيغة JSON تماماً مطابقة للهيكل التالي والترميز الصارم للاسترجاع (تجنب تكرار المفاتيح أو أي نص خارج كائن الـ JSON):
{
  "insights": [
    {
      "type": "success" | "warning" | "info",
      "title": "عنوان التوصية كجملة قصيرة رنانة",
      "text": "شرح التوصية الإستراتيجية وتقديم خطوات عملية ملموسة للتحسين"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text.trim());
      res.json({
        insights: parsed.insights || [],
        isSimulated: false
      });

    } catch (error: any) {
      console.error("AI Insights Error:", error);
      res.status(500).json({ 
        error: "فشل إنشاء التوصيات عبر الذكاء الاصطناعي", 
        details: error.message 
      });
    }
  });

  // Serve static assets in production, otherwise mount Vite as middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
