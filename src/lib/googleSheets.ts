import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import { ContentItem, CampaignData, BudgetControl, ActivityLog } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Google Sheets & Drive scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Listen to Auth State Changes
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might have expired or wasn't cached in this session yet
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error during Google Sign-In:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get the current token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout from Google API Session
export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Creates a brand new Google Sheet in the user's Drive and pre-populates it
 */
export const createTEECSpreadsheet = async (
  accessToken: string,
  contentItems: ContentItem[],
  campaigns: CampaignData[],
  budget: BudgetControl,
  logs: ActivityLog[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  
  const payload = {
    properties: {
      title: `قاعدة بيانات تسويق TEEC [${new Date().toLocaleDateString('ar-EG')}] ❄️`
    },
    sheets: [
      {
        properties: {
          title: 'منشورات_المحتوى',
          gridProperties: { rowCount: 100, columnCount: 15 }
        }
      },
      {
        properties: {
          title: 'حملات_المبيعات',
          gridProperties: { rowCount: 100, columnCount: 14 }
        }
      },
      {
        properties: {
          title: 'أرشيف_الموافقات',
          gridProperties: { rowCount: 100, columnCount: 5 }
        }
      },
      {
        properties: {
          title: 'سجل_الأنشطة_الآمن',
          gridProperties: { rowCount: 200, columnCount: 5 }
        }
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create spreadsheet: ${errText}`);
  }

  const sheetData = await response.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Now, populate headers and current state
  await syncAllDataToSpreadsheet(accessToken, spreadsheetId, contentItems, campaigns, budget, logs);

  return { spreadsheetId, spreadsheetUrl };
};

interface SheetProperties {
  sheetId: number;
  title: string;
}

interface SpreadsheetMetadata {
  sheets: Array<{
    properties: SheetProperties;
  }>;
}

/**
 * Ensures that all required sheets exist in the spreadsheet; creates any missing ones dynamically.
 * Returns the final sheet properties (including sheetIds) mapped by sheet title.
 */
export const ensureTeeCSheetsExist = async (
  accessToken: string,
  spreadsheetId: string
): Promise<SheetProperties[]> => {
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  
  const response = await fetch(getUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    // Special handlings for common error situations
    if (response.status === 403) {
      throw new Error('صلاحيات حساب Google غير كافية للوصول لهذا الجدول. يرجى التأكد من أن حسابك يمتلك صلاحية التعديل (Editor) أو أن الملف ليس للقراءة فقط.');
    } else if (response.status === 404) {
      throw new Error('لم يتم العثور على ملف جدول البيانات هذا في Google Drive. يرجى التحقق من المعرّف (ID) المدخل.');
    }
    throw new Error(`تعذر جلب تفاصيل الجدول من Google: ${errText}`);
  }

  const metadata: SpreadsheetMetadata = await response.json();
  const existingSheets = metadata.sheets.map((s: any) => s.properties);
  const existingTitles = existingSheets.map((s: any) => s.title);

  const requiredSheets = [
    { title: 'منشورات_المحتوى', rowCount: 100, columnCount: 15 },
    { title: 'حملات_المبيعات', rowCount: 100, columnCount: 14 },
    { title: 'أرشيف_الموافقات', rowCount: 100, columnCount: 5 },
    { title: 'سجل_الأنشطة_الآمن', rowCount: 200, columnCount: 5 }
  ];

  const missing = requiredSheets.filter(req => !existingTitles.includes(req.title));

  if (missing.length > 0) {
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    const requests = missing.map(m => ({
      addSheet: {
        properties: {
          title: m.title,
          gridProperties: {
            rowCount: m.rowCount,
            columnCount: m.columnCount
          }
        }
      }
    }));

    const updateRes = await fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`فشل إنشاء الجداول الفرعية المطلوبة [${missing.map(m => m.title).join(', ')}] تلقائياً: ${errText}`);
    }

    // Refresh and fetch the updated spreadsheet metadata to capture the official assigned sheetId numbers
    const finalResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (finalResponse.ok) {
      const finalMetadata: SpreadsheetMetadata = await finalResponse.json();
      return finalMetadata.sheets.map((s: any) => s.properties);
    }
  }

  return existingSheets;
};

/**
 * Synchronizes all state to Google Sheets
 */
export const syncAllDataToSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string,
  contentItems: ContentItem[],
  campaigns: CampaignData[],
  budget: BudgetControl,
  logs: ActivityLog[]
): Promise<boolean> => {
  // 0. Ensure the required sub-sheets exist dynamically and get their properties
  const sheetsMeta = await ensureTeeCSheetsExist(accessToken, spreadsheetId);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;

  // 1. Content sheet rows
  const contentHeaders = [
    'معرف المنشور', 'العنوان', 'النوع', 'نص المنشور', 'الهدف الإعلاني', 
    'الجمهور المستهدف', 'الفئة العمرية', 'الجنس المستهدف', 'الموقع الجغرافي', 
    'الميزانية المخصصة ($)', 'الحالة الحالية', 'صاحب الإدخال', 'تاريخ التقديم', 'تاريخ الاعتماد/المراجعة', 'سبب الرفض'
  ];
  const contentValues = [
    contentHeaders,
    ...contentItems.map(item => [
      item.id,
      item.title,
      item.type,
      item.contentCopy,
      item.campaignObjective,
      item.targetAudience,
      item.targetAge,
      item.targetGender,
      item.targetLocation,
      item.budget,
      item.status,
      item.submittedBy,
      item.submittedAt,
      item.approvedAt || '',
      item.rejectionReason || ''
    ])
  ];

  // 2. Campaigns sheet rows
  const campaignHeaders = [
    'معرف الحملة', 'اسم الحملة', 'الهدف الإعلاني', 'الحالة', 'الميزانية ($)', 'الإنفاق الحالي ($)',
    'الجمهور المستهدف', 'الوصول Reach', 'الظهور Impressions', 'العملاء Leads', 'الرسائل Messages',
    'المبيعات Purchases', 'العوائد Revenue ($)', 'معدل العائد ROAS'
  ];
  const campaignValues = [
    campaignHeaders,
    ...campaigns.map(c => [
      c.id,
      c.name,
      c.objective,
      c.status,
      c.budget,
      c.spend,
      c.audience,
      c.reach,
      c.impressions,
      c.leads,
      c.messages,
      c.purchases,
      c.revenue,
      c.spend > 0 ? (c.revenue / c.spend).toFixed(2) : '0'
    ])
  ];

  // 3. Approvals sheet rows
  const approvalHeaders = [
    'الرقم المرجعي', 'العنوان', 'تاريخ اتخاذ القرار', 'صاحب القرار', 'الحالة والقرارات'
  ];
  const approvedItem = contentItems.filter(item => item.status === 'Approved' || item.status === 'Rejected');
  const approvalValues = [
    approvalHeaders,
    ...approvedItem.map((item, idx) => [
      `APR-${101 + idx}`,
      item.title,
      item.approvedAt || item.submittedAt || '',
      item.approvedBy || 'أ. طارق عبد العزيز',
      item.rejectionReason ? `مرفوض: ${item.rejectionReason}` : 'تم الاعتماد للترويج الكثيف ✅'
    ])
  ];

  // 4. Logs sheet rows
  const logHeaders = [
    'التاريخ والتوقيت', 'اسم المستخدم', 'الدور الوظيفي', 'العملية المنجزة', 'تفاصيل العملية'
  ];
  const logValues = [
    logHeaders,
    ...logs.map(log => [
      log.timestamp,
      log.username,
      log.role,
      log.action,
      log.details
    ])
  ];

  const dataPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'منشورات_المحتوى!A1:O100',
        values: contentValues
      },
      {
        range: 'حملات_المبيعات!A1:N100',
        values: campaignValues
      },
      {
        range: 'أرشيف_الموافقات!A1:E100',
        values: approvalValues
      },
      {
        range: 'سجل_الأنشطة_الآمن!A1:E200',
        values: logValues
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataPayload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`فشل تحديث خلايا البيانات: ${errText}`);
  }

  // Also style the sheets with some beautiful background colors for the headers using the real, official sheetIds
  try {
    await styleSheetHeaders(accessToken, spreadsheetId, sheetsMeta);
  } catch (e) {
    console.error('Logging non-blocking style headers issue:', e);
  }

  return true;
};

// Helper to style spreadsheet headers nicely in blue/green and grey using actual sheet metadata
const styleSheetHeaders = async (accessToken: string, spreadsheetId: string, sheetsMeta: SheetProperties[]) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  
  // Sheet indices mapped to colors matching the application design: [R, G, B]
  const colorMap: Record<string, { r: number; g: number; b: number }> = {
    'منشورات_المحتوى': { r: 0.11, g: 0.46, b: 0.92 }, // Content (Blue)
    'حملات_المبيعات': { r: 0.85, g: 0.35, b: 0.05 }, // Campaigns (Orange)
    'أرشيف_الموافقات': { r: 0.01, g: 0.65, b: 0.44 }, // Approvals (Green)
    'سجل_الأنشطة_الآمن': { r: 0.35, g: 0.43, b: 0.53 }  // Logs (Grey)
  };

  const requests = sheetsMeta
    .filter(sheet => colorMap[sheet.title] !== undefined)
    .map(sheet => {
      const color = colorMap[sheet.title];
      return {
        repeatCell: {
          range: {
            sheetId: sheet.sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 15
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: color.r,
                green: color.g,
                blue: color.b
              },
              textFormat: {
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                bold: true,
                fontSize: 10
              },
              horizontalAlignment: 'RIGHT'
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
        }
      };
    });

  if (requests.length === 0) return;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });
};
