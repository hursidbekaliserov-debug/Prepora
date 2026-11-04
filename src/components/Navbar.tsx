'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  User, 
  Menu, 
  X,
  Compass,
  Award,
  Mic,
  Crown
} from 'lucide-react';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import { UserProfile } from '@/types';
import PremiumModal from '@/components/PremiumModal';

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const updateProfile = () => {
      setProfile(StorageManager.getProfile());
    };
    const updateSub = () => {
      setSubStatus(StorageManager.getSubscriptionStatus());
    };

    updateProfile();
    updateSub();

    window.addEventListener('prepora_profile_updated', updateProfile);
    window.addEventListener('prepora_subscription_updated', updateSub);
    return () => {
      window.removeEventListener('prepora_profile_updated', updateProfile);
      window.removeEventListener('prepora_subscription_updated', updateSub);
    };
  }, []);

  const isExamPage = pathname.includes('/mock-exam');

  if (isExamPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand: Prepora with custom profile photo in front */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User Avatar'}
                className="w-10 h-10 rounded-xl object-cover shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform border border-blue-900/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="text-xl font-black tracking-tight text-blue-950">
                Prepora
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                IELTS & SAT
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <Link 
              href="/ielts" 
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/ielts') && !pathname.includes('/ielts-gg')
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              IELTS Hub
            </Link>
            <Link 
              href="/ielts-gg" 
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                pathname === '/ielts-gg' 
                  ? 'bg-blue-950 text-white shadow-md' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>IELTS.GG Voice AI</span>
            </Link>
            <Link 
              href="/sat" 
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/sat') 
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              SAT Hub
            </Link>
            <Link 
              href="/tutor" 
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                pathname === '/tutor' 
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Tutor
            </Link>
            <Link 
              href="/vocabulary" 
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/vocabulary' 
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              Vocab
            </Link>
            <Link 
              href="/study-plan" 
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/study-plan' 
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              Planner
            </Link>
            <Link 
              href="/pricing" 
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                pathname === '/pricing' 
                  ? 'bg-blue-50 text-blue-950 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Tariflar</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Mock shortcuts */}
          <Link
            href="/ielts/mock-exam"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-950 border border-slate-200 text-xs font-bold transition"
          >
            <Award className="w-3.5 h-3.5 text-blue-700" />
            <span>IELTS Mock</span>
          </Link>
          <Link
            href="/sat/mock-exam"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-950 border border-slate-200 text-xs font-bold transition"
          >
            <Award className="w-3.5 h-3.5 text-indigo-700" />
            <span>SAT Mock</span>
          </Link>

          {/* User Profile with custom picture and Telegram-style sticker */}
          <Link 
            href="/settings"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-slate-300 shadow-2xs"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-950 to-blue-800 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline font-bold text-blue-950">
                {profile?.fullName || 'Student'}
              </span>
              {/* Telegram-style Premium Sticker (Faqat haqiqiy Premium foydalanuvchilar uchun) */}
              {subStatus?.isPremium && profile?.premiumBadge && (
                <span 
                  className="inline-flex items-center justify-center text-sm select-none transform hover:scale-125 transition-transform" 
                  title="Telegram Premium Status"
                >
                  {profile.premiumBadge}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/ielts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-blue-950 bg-blue-50 border border-blue-100"
            >
              IELTS Hub
            </Link>
            <Link
              href="/sat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-blue-950 bg-blue-50 border border-blue-100"
            >
              SAT Hub
            </Link>
          </div>
          <Link
            href="/ielts-gg"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-900 bg-emerald-50 border border-emerald-200"
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            IELTS.GG Voice AI Examiner
          </Link>
          <Link
            href="/tutor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Tutor
          </Link>
          <Link
            href="/ielts/mock-exam"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            IELTS Full Mock Exam (40 Q)
          </Link>
          <Link
            href="/sat/mock-exam"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            SAT Full Mock Exam (98 Q)
          </Link>
          <Link
            href="/vocabulary"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Vocabulary Trainer
          </Link>
          <Link
            href="/mistakes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Mistake Notebook
          </Link>
          <Link
            href="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Analytics & Score Trends
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Profile & Settings
          </Link>
        </div>
      )}

      {/* Interactive 50 000 UZS Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        reason="general"
      />
    </header>
  );
}
