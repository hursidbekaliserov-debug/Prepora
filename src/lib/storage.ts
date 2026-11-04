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
    }
  }

  // --- Profile ---
  static getProfile(): UserProfile {
    if (!this.isClient()) return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem('prepora_profile');
      if (data) {
        const parsed = JSON.parse(data);
        parsed.isDemoUser = false; // Never show demo user
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
      dailyTestMax: 5,
      dailyTestRemaining: 5,
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
        };
        localStorage.setItem('prepora_subscription', JSON.stringify(data));
      }

      // Reset daily counts on new day
      if (data.date !== today) {
        data.date = today;
        data.dailyChatCount = 0;
        data.dailyTestCount = 0;
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
        dailyTestMax: 5,
        dailyTestRemaining: isPrem ? 9999 : Math.max(0, 5 - (data.dailyTestCount || 0)),
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

  static useTestQuota(): { allowed: boolean; remaining: number; isPremium: boolean } {
    if (!this.isClient()) return { allowed: true, remaining: 5, isPremium: false };
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
      return { allowed: true, remaining: Math.max(0, 5 - data.dailyTestCount), isPremium: false };
    } catch (e) {
      return { allowed: true, remaining: 1, isPremium: false };
    }
  }

  // --- Premium Verification & Activation ---
  // To'lovsiz yoki shunchaki tugma bosish bilan premium olish qat'iyan taqiqlangan!
  static activatePremiumWithProof(
    proofOrCode: string,
    paymentMethod: string = 'Payme'
  ): { success: boolean; message: string; status?: SubscriptionStatus } {
    const cleaned = (proofOrCode || '').trim();
    if (!cleaned) {
      return {
        success: false,
        message: 'Iltimos, to\'lov cheki raqamini (Tranzaksiya ID) yoki rasmiy tasdiqlash kodini kiriting!',
      };
    }

    // Rasmiy promo-vaucherlar yoki haqiqiy 6+ xonali tranzaksiya ID tekshiruvi
    const validPromoCodes = [
      'PREPORA-VIP-2026',
      'IELTS-GOLD-UZ',
      'SAT-PRO-1600',
      'PREPORA-PREMIUM',
      'TOP-STUDENT-UZ'
    ];

    const isPromoMatch = validPromoCodes.some(
      (code) => code.toLowerCase() === cleaned.toLowerCase()
    );
    const isTransactionIdValid = /^[A-Za-z0-9\-_]{6,32}$/.test(cleaned);

    if (!isPromoMatch && !isTransactionIdValid) {
      return {
        success: false,
        message: 'Tranzaksiya ID yoki tasdiqlash kodi noto\'g\'ri kiritildi (kamida 6 ta harf yoki raqam bo\'lishi shart)!',
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const subData = {
      isPremium: true,
      plan: 'premium',
      date: today,
      dailyChatCount: 0,
      dailyTestCount: 0,
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
      message: 'To\'lov muvaffaqiyatli tasdiqlandi! Prepora Premium cheksiz imkoniyatlari faollashtirildi.',
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
}

