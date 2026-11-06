'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  GraduationCap, 
  Menu, 
  X,
  Mic,
  Crown,
  Gamepad2,
  ChevronDown,
  Gift
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 sm:h-14 flex items-center justify-between">
        {/* Brand: Prepora with custom profile photo in front */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User Avatar'}
                className="w-8 h-8 rounded-lg object-cover shadow-xs group-hover:scale-105 transition-transform border border-blue-900/30 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-950 to-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-blue-950 leading-none">
                Prepora
              </span>
              <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                IELTS & SAT
              </span>
            </div>
          </Link>

          {/* Compact Modern Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            <Link 
              href="/ielts" 
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/ielts') && !pathname.includes('/ielts-gg')
                  ? 'bg-blue-50 text-blue-950' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              IELTS
            </Link>

            <Link 
              href="/sat" 
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/sat') 
                  ? 'bg-blue-50 text-blue-950' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              SAT
            </Link>

            {/* Renamed from "IELTS GG Voice AI" to clean "Voice AI" */}
            <Link 
              href="/ielts-gg" 
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                pathname === '/ielts-gg' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <Mic className="w-3 h-3 text-emerald-600" />
              <span>Voice AI</span>
            </Link>

            <Link 
              href="/tutor" 
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                pathname === '/tutor' 
                  ? 'bg-blue-50 text-blue-950' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>AI Tutor</span>
            </Link>

            {/* Video Darsliklar */}
            <Link 
              href="/lessons" 
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                pathname === '/lessons' 
                  ? 'bg-blue-50 text-blue-950 font-bold' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <span>Darslar 🎬</span>
            </Link>

            {/* Qiziqarli O'yinlar & Kunlik Spin */}
            <Link 
              href="/arena" 
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-extrabold transition-all ${
                pathname === '/arena' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/70'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Arena 🎮</span>
            </Link>

            {/* Bepul Pro referral */}
            <Link 
              href="/referral" 
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-extrabold transition-all ${
                pathname === '/referral' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              <span>Bepul Pro 🎁</span>
            </Link>

            <Link 
              href="/pricing" 
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                pathname === '/pricing' 
                  ? 'bg-blue-50 text-blue-950' 
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>Tariflar</span>
            </Link>

            {/* More menu dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-0.5"
              >
                <span>Yana</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-1"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <Link
                    href="/vocabulary"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    Lug'at (Vocab)
                  </Link>
                  <Link
                    href="/study-plan"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    O'quv Rejasi
                  </Link>
                  <Link
                    href="/mistakes"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    Xatolar Daftari
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    Statistika & Tarix
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side controls: Profile & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* User Profile with custom picture and Telegram-style sticker */}
          <Link 
            href="/settings"
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-semibold text-slate-800 transition"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-6 h-6 rounded-full object-cover border border-slate-300 shadow-2xs"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-950 to-blue-800 flex items-center justify-center text-white font-bold text-[11px] shadow-2xs">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline font-bold text-blue-950 text-xs">
                {profile?.fullName || 'Student'}
              </span>
              {/* Telegram-style Premium Sticker (Faqat haqiqiy Premium foydalanuvchilar uchun) */}
              {subStatus?.isPremium && profile?.premiumBadge && (
                <span 
                  className="inline-flex items-center justify-center text-xs select-none" 
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
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-fade-in text-xs font-semibold">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/ielts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-blue-950 bg-blue-50 border border-blue-100 text-center"
            >
              IELTS
            </Link>
            <Link
              href="/sat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-blue-950 bg-blue-50 border border-blue-100 text-center"
            >
              SAT
            </Link>
          </div>
          <Link
            href="/ielts-gg"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-900 bg-emerald-50 border border-emerald-200 font-bold"
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            Voice AI Examiner
          </Link>
          <Link
            href="/lessons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-blue-950 bg-blue-50 border border-blue-200 font-bold"
          >
            <span>Video Darsliklar 🎬</span>
          </Link>
          <Link
            href="/arena"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-900 bg-amber-50 border border-amber-200 font-bold"
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            Arena (Omadli Aylana & Speed Duel) 🎮
          </Link>
          <Link
            href="/referral"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-900 bg-rose-50 border border-rose-200 font-bold"
          >
            <Gift className="w-4 h-4 text-rose-600" />
            Do'stlarni Taklif Qilish (Bepul Pro) 🎁
          </Link>
          <Link
            href="/tutor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-100"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Tutor
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-100 font-bold"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            Tariflar
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-100"
          >
            Profil & Sozlamalar
          </Link>
        </div>
      )}

      {/* Interactive Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        reason="general"
      />
    </header>
  );
}
