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
    throw new Error(`Failed to batch sync values: ${errText}`);
  }

  // Also style the sheets with some beautiful background colors for the headers
  try {
    await styleSheetHeaders(accessToken, spreadsheetId, sheetDataFromBatch(spreadsheetId));
  } catch (e) {
    console.error('Logging non-blocking style headers issue:', e);
  }

  return true;
};

// Helper to style spreadsheet headers nicely in blue/green and grey
const styleSheetHeaders = async (accessToken: string, spreadsheetId: string, sheetIds: number[]) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  
  // Sheet indices mapped to colors matching the application design: [R, G, B]
  const colors = [
    { r: 0.11, g: 0.46, b: 0.92 }, // Content (Blue)
    { r: 0.85, g: 0.35, b: 0.05 }, // Campaigns (Orange)
    { r: 0.01, g: 0.65, b: 0.44 }, // Approvals (Green)
    { r: 0.35, g: 0.43, b: 0.53 }  // Logs (Grey)
  ];

  const requests = sheetIds.map((sheetId, idx) => {
    const color = colors[idx] || colors[0];
    return {
      repeatCell: {
        range: {
          sheetId: sheetId,
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

  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });
};

// Fallback lookup of sheet ids or metadata
const sheetDataFromBatch = (spreadsheetId: string): number[] => {
  // Creating spreadsheet usually results in 0, 1, 2, 3 as default Sheet IDs for sequentially added sheets in order
  return [0, 1, 2, 3];
};
