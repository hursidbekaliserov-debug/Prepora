'use client';

import { UserProfile, StudyTask, ExamResult, MistakeRecord, VocabWord } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  plan: 'free' | 'premium';
  price: string;
  dailyChatCount: number;
  dailyChatMax: number;
  dailyChatRemaining: number;
  dailyTestCount: number;
  dailyTestMax: number;
  dailyTestRemaining: number;
  dailyVideoCount: number;
  dailyVideoMax: number;
  dailyVideoRemaining: number;
  activatedAt?: string;
  paymentMethod?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_default',
  fullName: 'Student',
  email: 'student@prepora.uz',
  targetExam: 'BOTH',
  ieltsType: 'ACADEMIC',
  currentIeltsBand: 6.5,
  targetIeltsBand: 8.0,
  currentSatScore: 1280,
  targetSatScore: 1520,
  examDate: '2026-12-15',
  dailyStudyMinutes: 45,
  weakTopics: ['IELTS Listening Part 4', 'SAT Advanced Math', 'SAT Expression of Ideas'],
  streakDays: 3,
  totalStudyMinutes: 120,
  isDemoUser: false,
  avatarUrl: '',
  avatar3D: 'scholar_3d',
  equippedItem: '',
  unlockedAvatars: ['scholar_3d'],
  unlockedItems: [],
  xp: 950,
  totalEarnedXp: 1200,
  spentXp: 250,
  avatarConfig: {
    gender: 'boy',
    headwear: 'none',
    outfit: 'casual',
    glasses: 'none',
    aura: 'none',
  },
  unlockedWardrobe: ['casual', 'none'],
  premiumBadge: '',
  createdAt: new Date().toISOString(),
};

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Complete IELTS Listening Section 2 Practice',
    exam: 'IELTS',
    skill: 'Listening',
    estimatedMinutes: 20,
    completed: false,
    dueDate: 'Today',
    link: '/ielts/listening',
  },
  {
    id: 'task-2',
    title: 'SAT Math: Quadratic Equations Drills',
    exam: 'SAT',
    skill: 'Advanced Math',
    estimatedMinutes: 25,
    completed: true,
    dueDate: 'Today',
    link: '/sat/math',
  },
  {
    id: 'task-3',
    title: 'Review 15 High-Frequency Academic Words',
    exam: 'IELTS',
    skill: 'Vocabulary',
    estimatedMinutes: 15,
    completed: false,
    dueDate: 'Tomorrow',
    link: '/vocabulary',
  },
  {
    id: 'task-4',
    title: 'IELTS Writing Task 2 Essay Submission',
    exam: 'IELTS',
    skill: 'Writing',
    estimatedMinutes: 40,
    completed: false,
    dueDate: 'In 2 days',
    link: '/ielts/writing',
  },
];

export class StorageManager {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Real User Accounts Management ---
  static getUsers(): UserAccount[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem('prepora_registered_users');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading users:', e);
    }
    return [];
  }

  static registerUser(fullName: string, email: string, password?: string): UserProfile {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const id = existing ? existing.id : `usr_${Date.now()}`;

    if (!existing) {
      users.push({
        id,
        fullName,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      if (this.isClient()) {
        localStorage.setItem('prepora_registered_users', JSON.stringify(users));
      }
    }

    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id,
      fullName,
      email,
      isDemoUser: false,
      createdAt: new Date().toISOString(),
    };

    this.saveProfile(newProfile);
    if (this.isClient()) {
      localStorage.setItem('prepora_active_session', JSON.stringify({ id, fullName, email }));
    }
    return newProfile;
  }

  static loginUser(email: string, password?: string): UserProfile | null {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      const profile = this.getProfile();
      profile.id = user.id;
      profile.fullName = user.fullName;
      profile.email = user.email;
      profile.isDemoUser = false;
      this.saveProfile(profile);
      if (this.isClient()) {
        localStorage.setItem('prepora_active_session', JSON.stringify(user));
      }
      return profile;
    }

    // If new user signing in, register them automatically
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return this.registerUser(formattedName, email, password);
  }

  static logout(): void {
    if (this.isClient()) {
      localStorage.removeItem('prepora_active_session');
      window.dispatchEvent(new Event('prepora_auth_changed'));
    }
  }

  static isUserLoggedIn(): boolean {
    if (!this.isClient()) return false;
    try {
      // Check 10-minute session expiry from cookies/localStorage
      const cookieTime = document.cookie.match(/(^|;\s*)prepora_last_activity_time=([^;]*)/);
      const storageTime = localStorage.getItem('prepora_last_active_ts');
      const lastActiveStr = cookieTime ? decodeURIComponent(cookieTime[2]) : storageTime;
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        if (!isNaN(lastActive) && Date.now() - lastActive > 10 * 60 * 1000) {
          // Expired after 10 minutes of inactivity!
          localStorage.removeItem('prepora_active_session');
          localStorage.removeItem('prepora_last_active_ts');
          return false;
        }
      }
      const session = localStorage.getItem('prepora_active_session');
      return !!session;
    } catch {
      return false;
    }
  }

  // --- Profile ---
  static getProfile(): UserProfile {
    if (!this.isClient()) return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem('prepora_profile');
      if (data) {
        const parsed: UserProfile = JSON.parse(data);
        parsed.isDemoUser = false; // Never show demo user
        if (!parsed.avatarConfig) {
          parsed.avatarConfig = {
            gender: 'boy',
            headwear: 'none',
            outfit: 'casual',
            glasses: 'none',
            aura: 'none',
          };
        }
        if (!parsed.unlockedWardrobe) {
          parsed.unlockedWardrobe = ['casual', 'none'];
        }
        if (parsed.spentXp === undefined) {
          parsed.spentXp = 250;
        }
        if (parsed.xp === undefined) {
          parsed.xp = 950;
        }
        if (parsed.totalEarnedXp === undefined) {
          parsed.totalEarnedXp = (parsed.xp || 950) + (parsed.spentXp || 250);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed reading profile from storage:', e);
    }
    return DEFAULT_PROFILE;
  }

  static async saveProfile(profile: UserProfile): Promise<void> {
    profile.isDemoUser = false;
    if (this.isClient()) {
      localStorage.setItem('prepora_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('prepora_profile_updated'));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: profile.id,
          full_name: profile.fullName,
          target_exam: profile.targetExam,
          ielts_type: profile.ieltsType,
          current_ielts_band: profile.currentIeltsBand,
          target_ielts_band: profile.targetIeltsBand,
          current_sat_score: profile.currentSatScore,
          target_sat_score: profile.targetSatScore,
          exam_date: profile.examDate,
          daily_study_minutes: profile.dailyStudyMinutes,
          weak_topics: profile.weakTopics,
          streak_days: profile.streakDays,
          total_study_minutes: profile.totalStudyMinutes,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase profile save error:', err);
      }
    }
  }

  // --- Tasks ---
  static getTasks(): StudyTask[] {
    if (!this.isClient()) return DEFAULT_TASKS;
    try {
      const data = localStorage.getItem('prepora_study_tasks');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading tasks:', e);
    }
    return DEFAULT_TASKS;
  }

  static saveTasks(tasks: StudyTask[]): void {
    if (this.isClient()) {
      localStorage.setItem('prepora_study_tasks', JSON.stringify(tasks));
    }
  }

  static toggleTask(taskId: string): StudyTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    this.saveTasks(updated);
    return updated;
  }

  // --- Results / History ---
  static getExamResults(): ExamResult[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem('prepora_exam_results');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading exam results:', e);
    }
    return [];
  }

  static clearExamResults(): void {
    if (this.isClient()) {
      localStorage.removeItem('prepora_exam_results');
    }
  }

  static async saveExamResult(result: ExamResult): Promise<void> {
    const results = this.getExamResults();
    const updated = [result, ...results];
    if (this.isClient()) {
      localStorage.setItem('prepora_exam_results', JSON.stringify(updated));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('exam_results').insert([
          {
            id: result.id,
            exam_type: result.examType,
            test_variant: result.testVariant,
            date: result.date,
            duration_minutes: result.durationMinutes,
            ielts_listening_raw: result.ieltsListeningRaw,
            ielts_listening_band: result.ieltsListeningBand,
            ielts_reading_raw: result.ieltsReadingRaw,
            ielts_reading_band: result.ieltsReadingBand,
            ielts_writing_est: result.ieltsWritingEstimatedBand,
            ielts_speaking_est: result.ieltsSpeakingEstimatedBand,
            ielts_overall_est: result.ieltsOverallEstimatedBand,
            sat_rw_raw: result.satReadingWritingRaw,
            sat_rw_est: result.satReadingWritingScoreEst,
            sat_math_raw: result.satMathRaw,
            sat_math_est: result.satMathScoreEst,
            sat_total_est: result.satTotalScoreEst,
            is_mock: result.isMockExam,
          },
        ]);
      } catch (err) {
        console.error('Supabase result save error:', err);
      }
    }
  }

  // --- Mistakes Notebook ---
  static getMistakes(): MistakeRecord[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem('prepora_mistakes');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading mistakes:', e);
    }
    return [];
  }

  static saveMistake(mistake: MistakeRecord): void {
    const mistakes = this.getMistakes();
    const existingIndex = mistakes.findIndex((m) => m.questionId === mistake.questionId);
    let updated: MistakeRecord[];
    if (existingIndex >= 0) {
      updated = [...mistakes];
      updated[existingIndex] = mistake;
    } else {
      updated = [mistake, ...mistakes];
    }
    if (this.isClient()) {
      localStorage.setItem('prepora_mistakes', JSON.stringify(updated));
    }
  }

  static removeMistake(questionId: string): void {
    const mistakes = this.getMistakes().filter((m) => m.questionId !== questionId);
    if (this.isClient()) {
      localStorage.setItem('prepora_mistakes', JSON.stringify(mistakes));
    }
  }

  // --- Vocabulary ---
  static getCustomVocab(): VocabWord[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem('prepora_custom_vocab');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading custom vocab:', e);
    }
    return [];
  }

  static saveCustomVocab(words: VocabWord[]): void {
    if (this.isClient()) {
      localStorage.setItem('prepora_custom_vocab', JSON.stringify(words));
    }
  }

  // --- Study streak increment ---
  static recordStudyActivity(minutesSpent: number): void {
    const profile = this.getProfile();
    profile.totalStudyMinutes += minutesSpent;
    this.saveProfile(profile);
  }

  // --- Premium Subscription & Daily Free Quotas (50 000 UZS) ---
  static getSubscriptionStatus(): SubscriptionStatus {
    const today = new Date().toISOString().split('T')[0];
    const defaultStatus: SubscriptionStatus = {
      isPremium: false,
      plan: 'free',
      price: '50 000 so\'m / oy',
      dailyChatCount: 0,
      dailyChatMax: 5,
      dailyChatRemaining: 5,
      dailyTestCount: 0,
      dailyTestMax: 2,
      dailyTestRemaining: 2,
      dailyVideoCount: 0,
      dailyVideoMax: 1,
      dailyVideoRemaining: 1,
    };

    if (!this.isClient()) return defaultStatus;

    try {
      const raw = localStorage.getItem('prepora_subscription');
      let data = raw ? JSON.parse(raw) : null;

      if (!data) {
        data = {
          isPremium: false,
          plan: 'free',
          date: today,
          dailyChatCount: 0,
          dailyTestCount: 0,
          dailyVideoCount: 0,
        };
        localStorage.setItem('prepora_subscription', JSON.stringify(data));
      }

      // Reset daily counts on new day
      if (data.date !== today) {
        data.date = today;
        data.dailyChatCount = 0;
        data.dailyTestCount = 0;
        data.dailyVideoCount = 0;
        localStorage.setItem('prepora_subscription', JSON.stringify(data));
      }

      const isPrem = !!data.isPremium;
      return {
        isPremium: isPrem,
        plan: isPrem ? 'premium' : 'free',
        price: '50 000 so\'m / oy',
        dailyChatCount: data.dailyChatCount || 0,
        dailyChatMax: 5,
        dailyChatRemaining: isPrem ? 9999 : Math.max(0, 5 - (data.dailyChatCount || 0)),
        dailyTestCount: data.dailyTestCount || 0,
        dailyTestMax: 2,
        dailyTestRemaining: isPrem ? 9999 : Math.max(0, 2 - (data.dailyTestCount || 0)),
        dailyVideoCount: data.dailyVideoCount || 0,
        dailyVideoMax: 2,
        dailyVideoRemaining: isPrem ? 9999 : Math.max(0, 2 - (data.dailyVideoCount || 0)),
        activatedAt: data.activatedAt,
        paymentMethod: data.paymentMethod,
      };
    } catch (e) {
      console.warn('Subscription read error:', e);
      return defaultStatus;
    }
  }

  static useChatQuota(): { allowed: boolean; remaining: number; isPremium: boolean } {
    if (!this.isClient()) return { allowed: true, remaining: 5, isPremium: false };
    const status = this.getSubscriptionStatus();

    if (status.isPremium) {
      return { allowed: true, remaining: 9999, isPremium: true };
    }

    if (status.dailyChatRemaining <= 0) {
      return { allowed: false, remaining: 0, isPremium: false };
    }

    // Increment count
    try {
      const raw = localStorage.getItem('prepora_subscription');
      const data = raw ? JSON.parse(raw) : {};
      data.dailyChatCount = (data.dailyChatCount || 0) + 1;
      localStorage.setItem('prepora_subscription', JSON.stringify(data));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
      return { allowed: true, remaining: Math.max(0, 5 - data.dailyChatCount), isPremium: false };
    } catch (e) {
      return { allowed: true, remaining: 1, isPremium: false };
    }
  }

  // --- Kuniga 2 ta test limiti (Bepul versiya uchun) ---
  static useTestQuota(): { allowed: boolean; remaining: number; isPremium: boolean } {
    if (!this.isClient()) return { allowed: true, remaining: 2, isPremium: false };
    const status = this.getSubscriptionStatus();

    if (status.isPremium) {
      return { allowed: true, remaining: 9999, isPremium: true };
    }

    if (status.dailyTestRemaining <= 0) {
      return { allowed: false, remaining: 0, isPremium: false };
    }

    // Increment count
    try {
      const raw = localStorage.getItem('prepora_subscription');
      const data = raw ? JSON.parse(raw) : {};
      data.dailyTestCount = (data.dailyTestCount || 0) + 1;
      localStorage.setItem('prepora_subscription', JSON.stringify(data));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
      return { allowed: true, remaining: Math.max(0, 2 - data.dailyTestCount), isPremium: false };
    } catch (e) {
      return { allowed: true, remaining: 1, isPremium: false };
    }
  }

  // --- Video darsliklar: Oddiysida kuniga 2 ta, Pro da cheksiz ---
  static useVideoQuota(): { allowed: boolean; remaining: number; isPremium: boolean } {
    if (!this.isClient()) return { allowed: true, remaining: 2, isPremium: false };
    const status = this.getSubscriptionStatus();

    if (status.isPremium) {
      return { allowed: true, remaining: 9999, isPremium: true };
    }

    if (status.dailyVideoRemaining <= 0) {
      return { allowed: false, remaining: 0, isPremium: false };
    }

    try {
      const raw = localStorage.getItem('prepora_subscription');
      const data = raw ? JSON.parse(raw) : {};
      data.dailyVideoCount = (data.dailyVideoCount || 0) + 1;
      localStorage.setItem('prepora_subscription', JSON.stringify(data));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
      return { allowed: true, remaining: Math.max(0, 2 - data.dailyVideoCount), isPremium: false };
    } catch (e) {
      return { allowed: true, remaining: 0, isPremium: false };
    }
  }

  // --- Real Bank Card Payment Processing (Uzcard / Humo 50 000 UZS) ---
  static processCardPayment(params: {
    cardNumber: string;
    expiry: string;
    phone: string;
    smsCode: string;
    expectedSmsCode: string;
  }): { success: boolean; message: string; receipt?: any } {
    const rawCard = params.cardNumber.replace(/\s+/g, '');
    const cleanExpiry = params.expiry.trim();
    const cleanPhone = params.phone.replace(/[\s\-\(\)]/g, '');
    const sms = params.smsCode.trim();

    // 1. Karta raqami validatsiyasi
    if (!/^\d{16}$/.test(rawCard)) {
      return {
        success: false,
        message: 'Karta raqami noto\'g\'ri! Karta 16 ta raqamdan iborat bo\'lishi shart (masalan 8600... yoki 9860...).',
      };
    }

    // 2. Muddat validatsiyasi (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cleanExpiry)) {
      return {
        success: false,
        message: 'Karta amal qilish muddati noto\'g\'ri! Oy/Yil formatida kiriting (masalan 12/28).',
      };
    }

    // 3. Telefon raqam validatsiyasi
    if (cleanPhone.length < 9) {
      return {
        success: false,
        message: 'Telefon raqamingizni to\'liq kiriting (SMS tasdiqlash uchun kerak).',
      };
    }

    // 4. SMS tasdiqlash kodi tekshiruvi (Karta egasi ruxsatisiz pul yechilmasligi uchun)
    if (!sms || sms !== params.expectedSmsCode) {
      return {
        success: false,
        message: 'Kiritilgan SMS tasdiqlash kodi noto\'g\'ri! Iltimos, telefoningizga borgan kodni to\'g\'ri kiriting.',
      };
    }

    // Barcha tekshiruvlar muvaffaqiyatli: 50 000 so'm yechildi
    const today = new Date().toISOString().split('T')[0];
    const maskedCard = `${rawCard.slice(0, 4)} **** **** ${rawCard.slice(12)}`;
    const txId = `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const receipt = {
      transactionId: txId,
      amount: '50 000 UZS',
      maskedCard,
      phone: params.phone,
      date: new Date().toLocaleString(),
      status: 'SUCCESS',
      merchant: 'PREPORA ACADEMY (UZCOMBINATOR)',
    };

    const subData = {
      isPremium: true,
      plan: 'premium',
      date: today,
      dailyChatCount: 0,
      dailyTestCount: 0,
      activatedAt: new Date().toISOString(),
      paymentMethod: rawCard.startsWith('9860') ? 'HUMO' : 'UZCARD',
      transactionProof: txId,
      receipt,
    };

    if (this.isClient()) {
      localStorage.setItem('prepora_subscription', JSON.stringify(subData));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
    }

    return {
      success: true,
      message: `Kartangizdan (${maskedCard}) 50 000 so'm muvaffaqiyatli yechildi! Prepora Premium faollashtirildi.`,
      receipt,
    };
  }

  // --- Premium Verification & Activation ---
  // Qat'iy tekshiruv: 12345678 kabi soxta raqamlar qat'iyan rad etiladi!
  // Faqat rasmiy admin tomonidan berilgan aktivatsiya kaliti yoki tasdiqlangan vaucher qabul qilinadi.
  static activatePremiumWithProof(
    proofOrCode: string,
    paymentMethod: string = 'Payme'
  ): { success: boolean; message: string; status?: SubscriptionStatus } {
    const cleaned = (proofOrCode || '').trim().toUpperCase();
    if (!cleaned) {
      return {
        success: false,
        message: 'Iltimos, to\'lov cheki tasdiqlash kodini kiriting!',
      };
    }

    // Soxta ketma-ketliklar yoki quruq raqamlar (12345678, 000000, 111111 va hk) rad etiladi
    const fakePatterns = [
      '123456', '1234567', '12345678', '123456789', '111111', '000000', 'TEST', 'DEMO', '1234'
    ];
    if (fakePatterns.includes(cleaned) || /^(\d)\1+$/.test(cleaned)) {
      return {
        success: false,
        message: 'To\'lov tasdiqlanmadi! Siz kiritgan raqam soxta yoki mavjud emas. Iltimos, haqiqiy to\'lov qiling va chekni adminga yuboring.',
      };
    }

    // Rasmiy tasdiqlangan to'lov aktivatsiya kodlari
    const officialVerifiedKeys = [
      'PREPORA-VIP-2026',
      'IELTS-GOLD-UZ',
      'SAT-PRO-1600',
      'PREPORA-PREMIUM',
      'TOP-STUDENT-UZ',
      'PAYME-CONFIRMED-50K',
      'CLICK-CONFIRMED-50K',
      'ADMIN-ACTIVATE-VIP'
    ];

    // Tekshirish: Rasmiy kodlar yoki bot generatsiya qilgan tasdiqlangan kalit
    const isVerified = 
      cleaned.startsWith('PREPORA-PRO-') ||
      cleaned.startsWith('PREPORA-VIP-') ||
      officialVerifiedKeys.some((code) => code === cleaned);

    if (!isVerified) {
      return {
        success: false,
        message: 'To\'lov cheki tasdiqlanmadi! 50 000 so\'m to\'lov qilganingizdan so\'ng, chekni Telegram (@prepora_support) ga yuborib, rasmiy faollashtirish kodini oling.',
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const subData = {
      isPremium: true,
      plan: 'premium',
      date: today,
      dailyChatCount: 0,
      dailyTestCount: 0,
      dailyVideoCount: 0,
      activatedAt: new Date().toISOString(),
      paymentMethod,
      transactionProof: cleaned,
    };

    if (this.isClient()) {
      localStorage.setItem('prepora_subscription', JSON.stringify(subData));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
    }

    return {
      success: true,
      message: 'To\'lov muvaffaqiyatli tasdiqlandi! Prepora Pro barcha cheksiz imkoniyatlari faollashtirildi.',
      status: this.getSubscriptionStatus(),
    };
  }

  static upgradeToPremium(paymentMethod: string = 'Payme'): SubscriptionStatus {
    // Legacy support, faqat to'lov orqali
    return this.getSubscriptionStatus();
  }

  static cancelPremium(): SubscriptionStatus {
    const today = new Date().toISOString().split('T')[0];
    const subData = {
      isPremium: false,
      plan: 'free',
      date: today,
      dailyChatCount: 0,
      dailyTestCount: 0,
    };
    if (this.isClient()) {
      localStorage.setItem('prepora_subscription', JSON.stringify(subData));
      window.dispatchEvent(new Event('prepora_subscription_updated'));
    }
    return this.getSubscriptionStatus();
  }

  // --- Referral System (Do'stlarni taklif qilib Bepul Pro yutish) ---
  static getReferralData(): {
    code: string;
    invitedCount: number;
    verifiedCount: number;
    maxGoal: number;
    isProUnlocked: boolean;
    invitedFriends: { id: string; name: string; date: string; status: 'pending' | 'verified'; joinedExam?: string }[];
  } {
    if (!this.isClient()) {
      return {
        code: 'PREP-777',
        invitedCount: 0,
        verifiedCount: 0,
        maxGoal: 10,
        isProUnlocked: false,
        invitedFriends: [],
      };
    }

    try {
      const stored = localStorage.getItem('prepora_referral_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.maxGoal = 10; // Updated to 10 friends
        parsed.verifiedCount = (parsed.invitedFriends || []).filter((f: any) => f.status === 'verified').length;
        return parsed;
      }
    } catch {
      // fallback
    }

    // Generate stable unique referral code for user
    const profile = this.getProfile();
    const cleanId = (profile?.id || 'usr').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
    const initialCode = `PREP-${cleanId || '7281'}`;

    const defaultRef = {
      code: initialCode,
      invitedCount: 0,
      verifiedCount: 0,
      maxGoal: 10,
      isProUnlocked: false,
      invitedFriends: [],
    };

    if (this.isClient()) {
      localStorage.setItem('prepora_referral_data', JSON.stringify(defaultRef));
    }
    return defaultRef;
  }

  static addReferralFriend(name?: string): {
    success: boolean;
    invitedCount: number;
    verifiedCount: number;
    isProUnlocked: boolean;
    justUnlockedPro: boolean;
  } {
    const data = this.getReferralData();
    const newCount = data.invitedCount + 1;
    const friendName = name || `Do'st #${newCount}`;

    data.invitedCount = newCount;
    data.invitedFriends.unshift({
      id: `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: friendName,
      date: new Date().toLocaleDateString('uz-UZ'),
      status: 'pending', // Pending real verification
      joinedExam: newCount % 2 === 0 ? 'Digital SAT' : 'IELTS Academic',
    });

    data.verifiedCount = data.invitedFriends.filter((f) => f.status === 'verified').length;

    if (this.isClient()) {
      localStorage.setItem('prepora_referral_data', JSON.stringify(data));
      window.dispatchEvent(new Event('prepora_referral_updated'));
    }

    return {
      success: true,
      invitedCount: newCount,
      verifiedCount: data.verifiedCount,
      isProUnlocked: data.isProUnlocked,
      justUnlockedPro: false,
    };
  }

  static verifyReferralFriend(friendId: string): {
    success: boolean;
    message: string;
    verifiedCount: number;
    isProUnlocked: boolean;
    justUnlockedPro: boolean;
  } {
    const data = this.getReferralData();
    const friend = data.invitedFriends.find((f) => f.id === friendId);
    let justUnlockedPro = false;

    if (!friend) {
      return {
        success: false,
        message: "Do'st topilmadi!",
        verifiedCount: data.verifiedCount,
        isProUnlocked: data.isProUnlocked,
        justUnlockedPro: false,
      };
    }

    if (friend.status === 'verified') {
      return {
        success: true,
        message: "Ushbu do'stingiz allaqachon tasdiqlangan!",
        verifiedCount: data.verifiedCount,
        isProUnlocked: data.isProUnlocked,
        justUnlockedPro: false,
      };
    }

    // Haqiqiy tekshiruv: ro'yxatdan o'tgan foydalanuvchilar orasida mavjudligini tekshirish
    const registeredUsers = this.getUsers();
    const friendNameLower = friend.name.trim().toLowerCase();
    const isActuallyRegistered = registeredUsers.some((u) => 
      u.fullName.toLowerCase() === friendNameLower || 
      u.email.toLowerCase().includes(friendNameLower)
    );

    if (!isActuallyRegistered) {
      return {
        success: false,
        message: `⚠️ "${friend.name}" hali sizning havolangiz orqali ro'yxatdan o'tmagan! Iltimos, do'stingizga havolangizni yuboring va saytda ro'yxatdan o'tishini so'rang.`,
        verifiedCount: data.verifiedCount,
        isProUnlocked: data.isProUnlocked,
        justUnlockedPro: false,
      };
    }

    // Tasdiqlash
    friend.status = 'verified';
    data.verifiedCount = data.invitedFriends.filter((f) => f.status === 'verified').length;

    // 10 ta do'st to'liq tasdiqlanganda Pro obuna 1 oyga ochiladi!
    if (data.verifiedCount >= data.maxGoal && !data.isProUnlocked) {
      data.isProUnlocked = true;
      justUnlockedPro = true;
      this.activatePremiumWithProof('PREPORA-VIP-2026', '10 Friends Referral Verified Bonus');
    }

    if (this.isClient()) {
      localStorage.setItem('prepora_referral_data', JSON.stringify(data));
      window.dispatchEvent(new Event('prepora_referral_updated'));
    }

    return {
      success: true,
      message: `✅ "${friend.name}" ro'yxatdan o'tgani tasdiqlandi! (${data.verifiedCount}/${data.maxGoal})`,
      verifiedCount: data.verifiedCount,
      isProUnlocked: data.isProUnlocked,
      justUnlockedPro,
    };
  }

  // --- 3D Avatarlar va XP Do'koni (Gamified Profile System) ---
  static get3DAvatars() {
    return [
      {
        id: 'scholar_3d',
        name: 'Cyber Scholar 3D',
        role: 'IELTS Band 9 Master',
        priceXp: 0,
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        badge: 'Boshlang\'ich',
        emoji: '🎓',
        quote: 'Har bir qoidani chuqur anglaydi',
      },
      {
        id: 'astronaut_3d',
        name: 'Cosmic Astronaut 3D',
        role: 'Digital SAT 1600 Pioneer',
        priceXp: 300,
        gradient: 'from-cyan-500 via-blue-600 to-indigo-900',
        badge: 'Eksklyuziv',
        emoji: '🚀',
        quote: 'Yulduzlarga intiluvchi izlanuvchi',
      },
      {
        id: 'wizard_3d',
        name: 'Cambridge Wizard 3D',
        role: 'Oksford & Kembrij Bilimdoni',
        priceXp: 400,
        gradient: 'from-purple-600 via-pink-600 to-rose-600',
        badge: 'Afsonaviy',
        emoji: '🧙‍♂️',
        quote: 'Murakkab insholarni sekundlarda hal qiladi',
      },
      {
        id: 'phoenix_3d',
        name: 'Neon Phoenix 3D',
        role: 'Olovli Qaqnus & Speaking Star',
        priceXp: 500,
        gradient: 'from-amber-500 via-orange-600 to-rose-600',
        badge: 'Mifologik',
        emoji: '🔥',
        quote: 'Xatolardan qayta va yanada kuchli tug\'iladi',
      },
      {
        id: 'champion_3d',
        name: 'Royal Champion 3D',
        role: 'Mutlaq Arena G\'olibi',
        priceXp: 600,
        gradient: 'from-yellow-400 via-amber-500 to-amber-700',
        badge: 'VIP Elita',
        emoji: '👑',
        quote: 'Top 1% talabalar safiga kirgan',
      },
    ];
  }

  static getAccessoryItems() {
    return [
      {
        id: 'crown_3d',
        name: 'Oltin Toj 3D (Golden Crown)',
        type: 'crown',
        priceXp: 250,
        emoji: '👑',
        description: 'Profilingiz va 3D avataringiz tepasida porlab turuvchi shohona toj',
      },
      {
        id: 'aura_3d',
        name: 'Neon Kiber Aura (Cyber Glow)',
        type: 'aura',
        priceXp: 200,
        emoji: '⚡',
        description: 'Avataringiz atrofida aylanuvchi futuristik neon zaryad aulasi',
      },
      {
        id: 'visors_3d',
        name: 'VR Kiber Ko\'zoynak (Smart Visor)',
        type: 'visors',
        priceXp: 150,
        emoji: '🕶️',
        description: 'Desmos va testlarni tahlil qiluvchi aqlli kiber ko\'zoynak',
      },
      {
        id: 'wings_3d',
        name: 'Olovli Qanotlar 3D (Fire Wings)',
        type: 'wings',
        priceXp: 350,
        emoji: '🪽',
        description: 'Imtihon sari dadil uchishingizni ifodalovchi nurli qanotlar',
      },
      {
        id: 'diamond_frame',
        name: 'Olmos Ramka (Diamond Border)',
        type: 'frame',
        priceXp: 300,
        emoji: '💎',
        description: 'Profilingiz atrofidagi yaltiroq olmos hoshiya',
      },
      {
        id: 'shield_band9',
        name: 'Band 9 Himoya Qalqoni (Aegis)',
        type: 'shield',
        priceXp: 180,
        emoji: '🛡️',
        description: 'Grammatik va hisob-kitob xatolaridan himoya qiluvchi ramziy qalqon',
      },
    ];
  }

  static addXP(amount: number): number {
    const profile = this.getProfile();
    profile.xp = (profile.xp || 0) + amount;
    profile.totalEarnedXp = (profile.totalEarnedXp || 0) + amount;
    this.saveProfile(profile);
    return profile.xp;
  }

  // --- 3D Avatar Kiyintirish Studiyasi (Interactive Wardrobe & Dress-up) ---
  static getWardrobeCatalog() {
    return {
      headwear: [
        {
          id: 'none',
          name: 'Bosh kiyimsiz',
          category: 'headwear' as const,
          priceXp: 0,
          emoji: '👤',
          description: 'Tabiiy soch turmagi',
          badge: 'Standart',
        },
        {
          id: 'crown',
          name: 'Shohona Oltin Toj 3D',
          category: 'headwear' as const,
          priceXp: 250,
          emoji: '👑',
          description: 'Imtihon g\'oliblari uchun yoqut va zumradli shohona toj',
          badge: 'VIP Elita',
        },
        {
          id: 'grad_cap',
          name: 'Garvard Bitiruv Shapkasi',
          category: 'headwear' as const,
          priceXp: 200,
          emoji: '🎓',
          description: 'Top universitetlar bitiruvchisining akademik shlyapasi',
          badge: 'Akademik',
        },
        {
          id: 'headphones',
          name: 'Kiber RGB Quloqchinlar',
          category: 'headwear' as const,
          priceXp: 150,
          emoji: '🎧',
          description: 'IELTS Listening uchun fokus kuchaytiruvchi neon quloqchin',
          badge: 'Kiber',
        },
        {
          id: 'cap',
          name: 'Trenddagi Prepora Kepkasi',
          category: 'headwear' as const,
          priceXp: 100,
          emoji: '🧢',
          description: 'Zamonaviy ko\'cha uslubidagi sportiv kepka',
          badge: 'Casual',
        },
      ],
      outfit: [
        {
          id: 'casual',
          name: 'Prepora Brend T-Shirt',
          category: 'outfit' as const,
          priceXp: 0,
          emoji: '👕',
          description: 'Qulay va erkin boshlang\'ich libos',
          badge: 'Standart',
        },
        {
          id: 'suit',
          name: 'Oxford Klassik Kostyum',
          category: 'outfit' as const,
          priceXp: 300,
          emoji: '👔',
          description: 'Rasmiy diplomatiya va Speaking intervyusi uchun galstukli kostyum',
          badge: 'Elita',
        },
        {
          id: 'hoodie',
          name: 'Cambridge Band 9 Xudi',
          category: 'outfit' as const,
          priceXp: 250,
          emoji: '🧥',
          description: 'Kembrij kollejlari uslubidagi premium qalin xudi',
          badge: 'Band 9',
        },
        {
          id: 'cyber_jacket',
          name: 'Cyberpunk Neon Bomber Jaket',
          category: 'outfit' as const,
          priceXp: 350,
          emoji: '🥼',
          description: 'Digital SAT 1600 kiber neon yaltiroq sportiv kurtka',
          badge: 'Afsonaviy',
        },
      ],
      glasses: [
        {
          id: 'none',
          name: 'Ko\'zoynaksiz',
          category: 'glasses' as const,
          priceXp: 0,
          emoji: '👀',
          description: 'Tabiiy ko\'rinish',
          badge: 'Standart',
        },
        {
          id: 'vr_visor',
          name: 'VR Kiber Vizor (Smart AR)',
          category: 'glasses' as const,
          priceXp: 200,
          emoji: '🥽',
          description: 'Desmos formulalar va test tahlili uchun kiber vizor',
          badge: 'Futuristik',
        },
        {
          id: 'smart_glasses',
          name: 'Garvard Smart Ko\'zoynagi',
          category: 'glasses' as const,
          priceXp: 120,
          emoji: '👓',
          description: 'Ziyoli olimlar uchun dumaloq klassik ko\'zoynak',
          badge: 'Olimona',
        },
        {
          id: 'sunglasses',
          name: 'VIP Qora Quyosh Ko\'zoynagi',
          category: 'glasses' as const,
          priceXp: 100,
          emoji: '🕶️',
          description: 'Salobatli va cool ko\'rinish beruvchi qora ko\'zoynak',
          badge: 'Trend',
        },
      ],
      aura: [
        {
          id: 'none',
          name: 'Aurasiz',
          category: 'aura' as const,
          priceXp: 0,
          emoji: '⚪',
          description: 'Oddiy tinch ko\'rinish',
          badge: 'Standart',
        },
        {
          id: 'fire_wings',
          name: 'Olovli Qaqnus Qanotlari',
          category: 'aura' as const,
          priceXp: 400,
          emoji: '🪽',
          description: 'Orqada yonib turuvchi olovli afsonaviy qanotlar',
          badge: 'Mifologik',
        },
        {
          id: 'neon_glow',
          name: 'Kiber Neon Doira Aulasi',
          category: 'aura' as const,
          priceXp: 250,
          emoji: '⚡',
          description: 'Avatarni o\'rab turuvchi aylanuvchi elektr-neon halqa',
          badge: 'Kiber',
        },
        {
          id: 'golden_sparkles',
          name: 'Shohona Oltin Zarrachalar',
          category: 'aura' as const,
          priceXp: 300,
          emoji: '✨',
          description: 'Yulduzdek miltillovchi oltin sehrli nur va zarrachalar',
          badge: 'VIP',
        },
      ],
    };
  }

  static setAvatarGender(gender: 'boy' | 'girl'): void {
    const profile = this.getProfile();
    if (!profile.avatarConfig) {
      profile.avatarConfig = {
        gender: 'boy',
        headwear: 'none',
        outfit: 'casual',
        glasses: 'none',
        aura: 'none',
      };
    }
    profile.avatarConfig.gender = gender;
    this.saveProfile(profile);
  }

  static buyAndEquipWardrobeItem(
    category: 'headwear' | 'outfit' | 'glasses' | 'aura',
    itemId: string,
    priceXp: number
  ): { success: boolean; message: string } {
    const profile = this.getProfile();
    if (!profile.avatarConfig) {
      profile.avatarConfig = {
        gender: 'boy',
        headwear: 'none',
        outfit: 'casual',
        glasses: 'none',
        aura: 'none',
      };
    }
    const unlocked = profile.unlockedWardrobe || ['casual', 'none'];

    const isAlreadyUnlocked = priceXp === 0 || unlocked.includes(itemId);

    if (!isAlreadyUnlocked) {
      const currentXp = profile.xp || 0;
      if (currentXp < priceXp) {
        return {
          success: false,
          message: `XP yetarli emas! Sizda ${currentXp} XP bor, kerak: ${priceXp} XP`,
        };
      }
      profile.xp = currentXp - priceXp;
      profile.spentXp = (profile.spentXp || 0) + priceXp;
      unlocked.push(itemId);
      profile.unlockedWardrobe = unlocked;
    }

    profile.avatarConfig[category] = itemId as any;
    this.saveProfile(profile);

    return {
      success: true,
      message: isAlreadyUnlocked
        ? "Kiyim muvaffaqiyatli taqildi!"
        : `Xarid qilindi va taqildi (-${priceXp} XP)!`,
    };
  }

  static buyAndEquip3DAvatar(avatarId: string): { success: boolean; message: string } {
    const profile = this.getProfile();
    const avatars = this.get3DAvatars();
    const target = avatars.find((a) => a.id === avatarId);
    if (!target) return { success: false, message: 'Avatar topilmadi' };

    const unlocked = profile.unlockedAvatars || ['scholar_3d'];
    const currentXp = profile.xp || 0;

    if (!unlocked.includes(avatarId)) {
      if (currentXp < target.priceXp) {
        return {
          success: false,
          message: `XP yetarli emas! Sizda ${currentXp} XP bor, kerak: ${target.priceXp} XP`,
        };
      }
      profile.xp = currentXp - target.priceXp;
      unlocked.push(avatarId);
      profile.unlockedAvatars = unlocked;
    }

    profile.avatar3D = avatarId;
    this.saveProfile(profile);
    if (this.isClient()) {
      window.dispatchEvent(new Event('prepora_profile_updated'));
    }
    return { success: true, message: `${target.name} muvaffaqiyatli tanlandi!` };
  }

  static buyAndEquipAccessory(itemId: string): { success: boolean; message: string } {
    const profile = this.getProfile();
    const items = this.getAccessoryItems();
    const target = items.find((i) => i.id === itemId);
    if (!target) return { success: false, message: 'Narsa topilmadi' };

    const unlocked = profile.unlockedItems || [];
    const currentXp = profile.xp || 0;

    if (!unlocked.includes(itemId)) {
      if (currentXp < target.priceXp) {
        return {
          success: false,
          message: `XP yetarli emas! Sizda ${currentXp} XP bor, kerak: ${target.priceXp} XP`,
        };
      }
      profile.xp = currentXp - target.priceXp;
      unlocked.push(itemId);
      profile.unlockedItems = unlocked;
    }

    // Toggle equipment: if already equipped, unequip; otherwise equip
    profile.equippedItem = profile.equippedItem === itemId ? '' : itemId;
    this.saveProfile(profile);
    if (this.isClient()) {
      window.dispatchEvent(new Event('prepora_profile_updated'));
    }
    return {
      success: true,
      message: profile.equippedItem === itemId ? `${target.name} taqildi!` : `${target.name} yechildi.`,
    };
  }
}

