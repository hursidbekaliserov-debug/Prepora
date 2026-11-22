import fs from 'fs';
import path from 'path';
import os from 'os';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt: string;
  targetExam?: 'IELTS' | 'SAT' | 'BOTH';
  isPro?: boolean;
  xp?: number;
  lastActive?: string;
}

export interface PaymentTransaction {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'UZCARD' | 'HUMO' | 'PAYME' | 'CLICK' | 'ADMIN_MANUAL';
  date: string;
  status: 'COMPLETED' | 'REFUNDED';
}

interface ServerStoreData {
  users: UserAccount[];
  transactions: PaymentTransaction[];
  deletedUserIds: string[];
}

declare global {
  // eslint-disable-next-line no-var
  var __prepora_master_store: ServerStoreData | undefined;
  // eslint-disable-next-line no-var
  var __prepora_last_cloud_fetch: number | undefined;
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8858599978:AAERP8DmBetwSkSSelxq5uAwhs7mtH4MHlQ';
const ADMIN_CHAT_ID = '8902348376';
const PINNED_MSG_ID = 6;

function getLocalStoreFilePath(): string {
  try {
    const localDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'prepora_master_store.json');
  } catch {
    return path.join(os.tmpdir(), 'prepora_master_store.json');
  }
}

// Fetch master store from Telegram Pinned Message Cloud DB
async function fetchFromTelegramCloud(): Promise<ServerStoreData | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${ADMIN_CHAT_ID}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.ok && data.result?.pinned_message?.text) {
      const text = data.result.pinned_message.text;
      const parsed = JSON.parse(text);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        deletedUserIds: Array.isArray(parsed.deletedUserIds) ? parsed.deletedUserIds : []
      };
    }
  } catch (err) {
    console.warn('Telegram Cloud DB fetch error:', err);
  }
  return null;
}

// Save master store to Telegram Pinned Message Cloud DB
async function syncToTelegramCloud(data: ServerStoreData): Promise<void> {
  try {
    const payload = JSON.stringify(data);
    const chatRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${ADMIN_CHAT_ID}`, {
      cache: 'no-store'
    });
    const chatData = await chatRes.json();
    const msgId = chatData.ok && chatData.result?.pinned_message?.message_id ? chatData.result.pinned_message.message_id : PINNED_MSG_ID;

    const editRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        message_id: msgId,
        text: payload
      })
    });
    const editData = await editRes.json();
    if (!editData.ok && editData.description && !editData.description.includes('not modified')) {
      // If editing failed, send a new message and pin it automatically
      const sendRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: payload
        })
      });
      const sendData = await sendRes.json();
      if (sendData.ok && sendData.result?.message_id) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            message_id: sendData.result.message_id
          })
        });
      }
    }
  } catch (err) {
    console.warn('Telegram Cloud DB save error:', err);
  }
}

// Send live registration / admin alert to Telegram
export async function sendTelegramAdminAlert(message: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch {}
}

export async function loadServerStoreAsync(): Promise<ServerStoreData> {
  const now = Date.now();
  // Cache in-memory for 1.5 seconds before re-fetching from cloud
  if (global.__prepora_master_store && global.__prepora_last_cloud_fetch && now - global.__prepora_last_cloud_fetch < 1500) {
    return global.__prepora_master_store;
  }

  // 1. Try Telegram Cloud DB
  const cloudData = await fetchFromTelegramCloud();
  if (cloudData) {
    global.__prepora_master_store = cloudData;
    global.__prepora_last_cloud_fetch = now;
    // Update local cache file
    try {
      fs.writeFileSync(getLocalStoreFilePath(), JSON.stringify(cloudData), 'utf-8');
    } catch {}
    return cloudData;
  }

  // 2. Fallback to local file or in-memory
  if (global.__prepora_master_store) {
    return global.__prepora_master_store;
  }

  try {
    const filePath = getLocalStoreFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const data: ServerStoreData = {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        deletedUserIds: Array.isArray(parsed.deletedUserIds) ? parsed.deletedUserIds : []
      };
      global.__prepora_master_store = data;
      global.__prepora_last_cloud_fetch = now;
      return data;
    }
  } catch {}

  const emptyData: ServerStoreData = {
    users: [],
    transactions: [],
    deletedUserIds: []
  };
  global.__prepora_master_store = emptyData;
  global.__prepora_last_cloud_fetch = now;
  return emptyData;
}

export async function saveServerStoreAsync(data: ServerStoreData): Promise<void> {
  global.__prepora_master_store = data;
  global.__prepora_last_cloud_fetch = Date.now();

  try {
    fs.writeFileSync(getLocalStoreFilePath(), JSON.stringify(data, null, 2), 'utf-8');
  } catch {}

  // Sync to Telegram Cloud DB in background
  syncToTelegramCloud(data).catch(() => {});
}

export async function getServerUsers(): Promise<UserAccount[]> {
  const store = await loadServerStoreAsync();
  const deletedSet = new Set(store.deletedUserIds.map(d => d.toLowerCase()));
  return store.users.filter(u => !deletedSet.has(u.id.toLowerCase()) && !deletedSet.has(u.email.toLowerCase()));
}

export async function addOrUpdateServerUser(user: Partial<UserAccount> & { fullName: string; email: string }): Promise<UserAccount> {
  const store = await loadServerStoreAsync();
  const emailLower = user.email.toLowerCase().trim();
  
  // Exclude from deletedUserIds if re-registering
  store.deletedUserIds = store.deletedUserIds.filter(d => d.toLowerCase() !== emailLower);

  const existingIdx = store.users.findIndex(u => u.email.toLowerCase().trim() === emailLower);
  let updatedUser: UserAccount;

  if (existingIdx >= 0) {
    updatedUser = {
      ...store.users[existingIdx],
      ...user,
      fullName: user.fullName || store.users[existingIdx].fullName,
      email: emailLower,
      lastActive: 'Hozirgina'
    };
    store.users[existingIdx] = updatedUser;
  } else {
    updatedUser = {
      id: user.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      fullName: user.fullName.trim(),
      email: emailLower,
      password: user.password,
      createdAt: user.createdAt || new Date().toISOString(),
      targetExam: user.targetExam || 'IELTS',
      isPro: !!user.isPro,
      xp: user.xp || 500,
      lastActive: 'Hozirgina'
    };
    store.users.unshift(updatedUser);

    // Send instant alert to admin Telegram
    sendTelegramAdminAlert(
      `🔔 <b>YANGI NINE16 TALABASI RO'YXATDAN O'TDI!</b>\n\n` +
      `👤 <b>Ism:</b> ${updatedUser.fullName}\n` +
      `📧 <b>Email:</b> <code>${updatedUser.email}</code>\n` +
      `🎯 <b>Yo'nalish:</b> ${updatedUser.targetExam}\n` +
      `⏰ <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}`
    );
  }

  await saveServerStoreAsync(store);
  return updatedUser;
}

export async function deleteServerUser(userId: string, userEmail?: string): Promise<{ users: UserAccount[]; minusedAmount: number }> {
  const store = await loadServerStoreAsync();
  const emailLower = (userEmail || '').toLowerCase().trim();

  // Find user to get exact email and name
  const targetUser = store.users.find(u => u.id === userId || (emailLower && u.email.toLowerCase() === emailLower));
  const exactEmail = targetUser ? targetUser.email.toLowerCase() : emailLower;
  const exactName = targetUser ? targetUser.fullName.toLowerCase() : '';

  // Add to blacklist so user cannot access and gets evicted from site
  if (userId) store.deletedUserIds.push(userId);
  if (exactEmail) store.deletedUserIds.push(exactEmail);

  // Filter out user from list
  store.users = store.users.filter(u => u.id !== userId && (!exactEmail || u.email.toLowerCase() !== exactEmail));

  // Subtract/remove any cash transactions this user made from cash register
  let minusedAmount = 0;
  store.transactions = store.transactions.filter(tx => {
    const isThisUser = (exactEmail && tx.userEmail.toLowerCase() === exactEmail) ||
                       (exactName && tx.userName.toLowerCase() === exactName);
    if (isThisUser) {
      minusedAmount += tx.amount || 50000;
      return false; // Remove transaction
    }
    return true;
  });

  await saveServerStoreAsync(store);

  // Send admin notification
  sendTelegramAdminAlert(
    `🗑️ <b>FOYDALANUVCHI BAZADAN O'CHIRILDI:</b>\n\n` +
    `👤 <b>Ism:</b> ${targetUser?.fullName || 'Noma\'lum'}\n` +
    `📧 <b>Email:</b> <code>${exactEmail}</code>\n` +
    `💸 <b>Kassadan ayirildi:</b> -${minusedAmount.toLocaleString()} UZS\n` +
    `⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`
  );

  return { users: store.users, minusedAmount };
}

export async function toggleServerUserPro(userId: string): Promise<{ users: UserAccount[]; isProNow: boolean; user?: UserAccount; transactions: PaymentTransaction[] }> {
  const store = await loadServerStoreAsync();
  let isProNow = false;
  let targetUser: UserAccount | undefined;

  store.users = store.users.map(u => {
    if (u.id === userId) {
      const nextPro = !u.isPro;
      isProNow = nextPro;
      targetUser = { ...u, isPro: nextPro };
      return targetUser;
    }
    return u;
  });

  if (targetUser) {
    if (isProNow) {
      // PRO BERILGANDA: Kassaga +50 000 UZS qo'shish
      const newTx: PaymentTransaction = {
        id: `tx_${Date.now().toString().slice(-6)}`,
        userName: targetUser.fullName,
        userEmail: targetUser.email,
        amount: 50000,
        paymentMethod: 'ADMIN_MANUAL',
        date: new Date().toISOString(),
        status: 'COMPLETED'
      };
      store.transactions.unshift(newTx);
    } else {
      // PRO BEKOR QILINGANDA: Shu foydalanuvchining to'lovini kassadan olib tashlash (minus qilish)
      store.transactions = store.transactions.filter(
        tx => tx.userEmail.toLowerCase() !== targetUser!.email.toLowerCase()
      );
    }
  }

  await saveServerStoreAsync(store);
  return { users: store.users, isProNow, user: targetUser, transactions: store.transactions };
}

export async function getServerTransactions(): Promise<PaymentTransaction[]> {
  const store = await loadServerStoreAsync();
  return store.transactions;
}

export async function addServerTransaction(tx: Omit<PaymentTransaction, 'id' | 'date' | 'status'>): Promise<PaymentTransaction> {
  const store = await loadServerStoreAsync();
  const newTx: PaymentTransaction = {
    ...tx,
    id: `tx_${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    status: 'COMPLETED'
  };
  store.transactions.unshift(newTx);
  await saveServerStoreAsync(store);
  return newTx;
}

export async function resetServerCash(): Promise<void> {
  const store = await loadServerStoreAsync();
  store.transactions = [];
  await saveServerStoreAsync(store);
}

export async function isUserBlacklisted(emailOrId: string): Promise<boolean> {
  const store = await loadServerStoreAsync();
  const clean = emailOrId.toLowerCase().trim();
  return store.deletedUserIds.some(d => d.toLowerCase() === clean);
}
