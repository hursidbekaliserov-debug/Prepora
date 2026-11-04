import fs from 'fs';
import path from 'path';

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8858599978:AAERP8DmBetwSkSSelxq5uAwhs7mtH4MHlQ';
export const BOT_USERNAME = 'prepora_support_bot';

export interface ReceiptRequest {
  id: string;
  userName: string;
  userPhone: string;
  userAccountEmail?: string;
  transactionProof: string;
  photoBase64?: string;
  photoUrl?: string;
  amount: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  activationCode?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  telegramMessageIds?: { chatId: number | string; messageId: number }[];
}

export interface TelegramAdmin {
  chatId: number;
  username?: string;
  firstName?: string;
  addedAt: string;
}

interface TelegramStoreData {
  admins: TelegramAdmin[];
  requests: Record<string, ReceiptRequest>;
}

// In-memory fallback if file system is read-only (e.g. Vercel serverless)
let inMemoryStore: TelegramStoreData = {
  admins: [],
  requests: {},
};

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'telegram-store.json');

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn('Could not create data dir (serverless env?):', err);
    return false;
  }
}

export function loadTelegramStore(): TelegramStoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      inMemoryStore = {
        admins: Array.isArray(parsed.admins) ? parsed.admins : [],
        requests: parsed.requests && typeof parsed.requests === 'object' ? parsed.requests : {},
      };
      return inMemoryStore;
    }
  } catch (err) {
    console.warn('Error reading telegram-store.json:', err);
  }
  return inMemoryStore;
}

export function saveTelegramStore(data: TelegramStoreData) {
  inMemoryStore = data;
  try {
    if (ensureDataDir()) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Error saving telegram-store.json:', err);
  }
}

// --- Admin Management ---
export function getRegisteredAdmins(): TelegramAdmin[] {
  const store = loadTelegramStore();
  return store.admins;
}

export function registerAdmin(chatId: number, username?: string, firstName?: string): boolean {
  const store = loadTelegramStore();
  const exists = store.admins.some((a) => a.chatId === chatId);
  if (!exists) {
    store.admins.push({
      chatId,
      username,
      firstName,
      addedAt: new Date().toISOString(),
    });
    saveTelegramStore(store);
    return true;
  }
  return false;
}

// --- Receipt Request Management ---
export function createReceiptRequest(params: {
  userName: string;
  userPhone: string;
  userAccountEmail?: string;
  transactionProof: string;
  photoBase64?: string;
}): ReceiptRequest {
  const store = loadTelegramStore();
  const id = `REQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const request: ReceiptRequest = {
    id,
    userName: params.userName.trim(),
    userPhone: params.userPhone.trim(),
    userAccountEmail: params.userAccountEmail?.trim(),
    transactionProof: params.transactionProof.trim(),
    photoBase64: params.photoBase64,
    amount: "50 000 so'm",
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    telegramMessageIds: [],
  };

  store.requests[id] = request;
  saveTelegramStore(store);
  return request;
}

export function getReceiptRequest(id: string): ReceiptRequest | null {
  const store = loadTelegramStore();
  return store.requests[id] || null;
}

export function approveReceiptRequest(id: string, reviewedBy: string = 'Admin'): { success: boolean; request?: ReceiptRequest } {
  const store = loadTelegramStore();
  const request = store.requests[id];
  if (!request) return { success: false };

  // Generate unique activation code
  const code = `PREPORA-PRO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

  request.status = 'APPROVED';
  request.activationCode = code;
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = reviewedBy;

  store.requests[id] = request;
  saveTelegramStore(store);

  return { success: true, request };
}

export function rejectReceiptRequest(id: string, reviewedBy: string = 'Admin'): { success: boolean; request?: ReceiptRequest } {
  const store = loadTelegramStore();
  const request = store.requests[id];
  if (!request) return { success: false };

  request.status = 'REJECTED';
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = reviewedBy;

  store.requests[id] = request;
  saveTelegramStore(store);

  return { success: true, request };
}

// --- Telegram API Helpers ---
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: number | string, text: string, extra: Record<string, any> = {}) {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...extra,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to send telegram message:', err);
    return null;
  }
}

export async function editTelegramMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  extra: Record<string, any> = {}
) {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        ...extra,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to edit telegram message:', err);
    return null;
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert: boolean = false) {
  try {
    await fetch(`${TELEGRAM_API_BASE}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
  } catch (err) {
    console.error('Failed to answer callback query:', err);
  }
}

// Broadcast new receipt to all registered admins with Inline Action Buttons
export async function broadcastReceiptToAdmins(request: ReceiptRequest) {
  const store = loadTelegramStore();
  const admins = store.admins;

  const text = `🔔 <b>YANGI TO'LOV CHEKI KELDI!</b>

🆔 <b>So'rov ID:</b> <code>${request.id}</code>
👤 <b>Foydalanuvchi:</b> ${escapeHtml(request.userName)}
📞 <b>Telefon:</b> <code>${escapeHtml(request.userPhone)}</code>
${request.userAccountEmail ? `📧 <b>Email:</b> ${escapeHtml(request.userAccountEmail)}\n` : ''}💰 <b>Summa:</b> 50 000 so'm (Prepora Pro)
📅 <b>Vaqt:</b> ${new Date(request.createdAt).toLocaleString('uz-UZ')}

🧾 <b>Tranzaksiya / Chek izohi:</b>
<code>${escapeHtml(request.transactionProof)}</code>

⚠️ <i>Admin tekshiruvi: Iltimos, kartangizga 50 000 so'm tushganini tekshiring va quyidagi tugmalardan birini bosing:</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Tasdiqlash & Pro Berish',
          callback_data: `approve_${request.id}`,
        },
        {
          text: '❌ Rad Etish',
          callback_data: `reject_${request.id}`,
        },
      ],
    ],
  };

  const messageIds: { chatId: number | string; messageId: number }[] = [];

  for (const admin of admins) {
    try {
      const result = await sendTelegramMessage(admin.chatId, text, {
        reply_markup: inlineKeyboard,
      });
      if (result?.ok && result.result?.message_id) {
        messageIds.push({
          chatId: admin.chatId,
          messageId: result.result.message_id,
        });
      }
    } catch (err) {
      console.error(`Failed to send to admin ${admin.chatId}:`, err);
    }
  }

  // Update request with sent message IDs so we can update them when approved/rejected
  if (messageIds.length > 0) {
    request.telegramMessageIds = messageIds;
    store.requests[request.id] = request;
    saveTelegramStore(store);
  }

  return messageIds.length;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
