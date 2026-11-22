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
}

declare global {
  // eslint-disable-next-line no-var
  var __prepora_master_store: ServerStoreData | undefined;
}

function getStoreFilePath(): string {
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

export function loadServerStore(): ServerStoreData {
  if (global.__prepora_master_store) {
    return global.__prepora_master_store;
  }

  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const cleanedData: ServerStoreData = {
        users: Array.isArray(parsed.users)
          ? parsed.users.filter((u: UserAccount) => !u.id.startsWith('usr_') || u.id.length > 8)
          : [],
        transactions: Array.isArray(parsed.transactions)
          ? parsed.transactions.filter((t: PaymentTransaction) => !t.id.startsWith('tx_10'))
          : [],
      };
      global.__prepora_master_store = cleanedData;
      return cleanedData;
    }
  } catch (err) {
    console.warn('Could not read master store file:', err);
  }

  const emptyData: ServerStoreData = {
    users: [],
    transactions: [],
  };
  global.__prepora_master_store = emptyData;
  return emptyData;
}

export function saveServerStore(data: ServerStoreData): void {
  global.__prepora_master_store = data;
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write master store file (using in-memory):', err);
  }
}

export function getServerUsers(): UserAccount[] {
  return loadServerStore().users;
}

export function addOrUpdateServerUser(user: Partial<UserAccount> & { fullName: string; email: string }): UserAccount {
  const store = loadServerStore();
  const emailLower = user.email.toLowerCase().trim();
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
  }

  saveServerStore(store);
  return updatedUser;
}

export function deleteServerUser(userId: string): UserAccount[] {
  const store = loadServerStore();
  store.users = store.users.filter(u => u.id !== userId);
  saveServerStore(store);
  return store.users;
}

export function toggleServerUserPro(userId: string): { users: UserAccount[]; isProNow: boolean; user?: UserAccount } {
  const store = loadServerStore();
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

  if (isProNow && targetUser) {
    // Record real 50,000 UZS transaction into master ledger
    store.transactions.unshift({
      id: `tx_${Date.now().toString().slice(-6)}`,
      userName: targetUser.fullName,
      userEmail: targetUser.email,
      amount: 50000,
      paymentMethod: 'ADMIN_MANUAL',
      date: new Date().toISOString(),
      status: 'COMPLETED'
    });
  }

  saveServerStore(store);
  return { users: store.users, isProNow, user: targetUser };
}

export function getServerTransactions(): PaymentTransaction[] {
  return loadServerStore().transactions;
}

export function addServerTransaction(tx: Omit<PaymentTransaction, 'id' | 'date' | 'status'>): PaymentTransaction {
  const store = loadServerStore();
  const newTx: PaymentTransaction = {
    ...tx,
    id: `tx_${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    status: 'COMPLETED'
  };
  store.transactions.unshift(newTx);
  saveServerStore(store);
  return newTx;
}
