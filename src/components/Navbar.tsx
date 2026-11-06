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
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-[#f8f7f4]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand: Dribbble style Prepora. */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2 group">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User Avatar'}
                className="w-9 h-9 rounded-full object-cover border border-black/10 group-hover:scale-105 transition-transform shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0d0c22] text-white flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform shrink-0">
                P
              </div>
            )}
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-[#0d0c22] leading-none font-sans">
                Prepora<span className="text-[#ea4c89] font-black">.</span>
              </span>
            </div>
          </Link>

          {/* Dribbble Pills Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-[#0d0c22]">
            <Link 
              href="/ielts" 
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname.startsWith('/ielts') && !pathname.includes('/ielts-gg')
                  ? 'bg-black text-white font-bold' 
                  : 'text-[#6e6d7a] hover:text-[#0d0c22] hover:bg-black/5'
              }`}
            >
              IELTS Mock
            </Link>

            <Link 
              href="/sat" 
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname.startsWith('/sat') 
                  ? 'bg-black text-white font-bold' 
                  : 'text-[#6e6d7a] hover:text-[#0d0c22] hover:bg-black/5'
              }`}
            >
              Digital SAT
            </Link>

            <Link 
              href="/ielts-gg" 
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                pathname === '/ielts-gg' 
                  ? 'bg-[#ea4c89] text-white font-bold shadow-xs' 
                  : 'text-[#0d0c22] bg-[#ea4c89]/10 hover:bg-[#ea4c89]/20 font-bold'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#ea4c89]" />
              <span>Voice AI</span>
            </Link>

            <Link 
              href="/lessons" 
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                pathname === '/lessons' 
                  ? 'bg-black text-white font-bold' 
                  : 'text-[#6e6d7a] hover:text-[#0d0c22] hover:bg-black/5'
              }`}
            >
              <span>Darslar</span>
            </Link>

            <Link 
              href="/arena" 
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all ${
                pathname === '/arena' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-900 bg-amber-100/70 hover:bg-amber-200/70'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Arena 🎮</span>
            </Link>

            {/* More menu dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-3 py-1.5 rounded-full text-[#6e6d7a] hover:text-[#0d0c22] hover:bg-black/5 flex items-center gap-1 transition"
              >
                <span>Yana</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white border border-black/10 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <Link
                    href="/tutor"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-[#0d0c22] font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Tutor
                  </Link>
                  <Link
                    href="/vocabulary"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-[#0d0c22] font-semibold"
                  >
                    Lug'at (Vocab)
                  </Link>
                  <Link
                    href="/study-plan"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-[#0d0c22] font-semibold"
                  >
                    O'quv Rejasi
                  </Link>
                  <Link
                    href="/mistakes"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-[#0d0c22] font-semibold"
                  >
                    Xatolar Daftari
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-[#0d0c22] font-semibold"
                  >
                    Statistika & Tarix
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side controls: CTA Buttons, Profile & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Referral Pro Pill */}
          <Link 
            href="/referral" 
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ea4c89]/10 text-[#ea4c89] hover:bg-[#ea4c89]/20 transition-colors"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Bepul Pro 🎁</span>
          </Link>

          {/* Pricing CTA */}
          <Link 
            href="/pricing" 
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#0d0c22] text-white hover:bg-[#3d3d4e] shadow-sm hover:shadow transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Tariflar</span>
          </Link>

          {/* User Profile */}
          <Link 
            href="/settings"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-black/10 text-xs font-bold text-[#0d0c22] shadow-2xs transition"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'User'}
                className="w-6 h-6 rounded-full object-cover border border-black/10"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#0d0c22] text-white flex items-center justify-center font-bold text-[10px]">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="hidden sm:inline text-xs">
              {profile?.fullName || 'Student'}
            </span>
            {subStatus?.isPremium && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#ea4c89] text-white">
                PRO
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#0d0c22] hover:bg-black/5"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 bg-[#f8f7f4] px-4 py-4 space-y-2 shadow-xl animate-fade-in text-xs font-bold">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/ielts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-full text-xs font-bold text-[#0d0c22] bg-white border border-black/10 text-center"
            >
              IELTS Mock
            </Link>
            <Link
              href="/sat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-full text-xs font-bold text-[#0d0c22] bg-white border border-black/10 text-center"
            >
              Digital SAT
            </Link>
          </div>
          <Link
            href="/ielts-gg"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white bg-[#ea4c89] font-bold"
          >
            <Mic className="w-4 h-4 text-white" />
            Voice AI Speaking
          </Link>
          <Link
            href="/lessons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[#0d0c22] bg-white border border-black/10 font-bold"
          >
            <span>Video Darsliklar 🎬</span>
          </Link>
          <Link
            href="/arena"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-amber-950 bg-amber-100 border border-amber-200 font-bold"
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            Arena (Omadli Aylana & 1v1 PvP) 🎮
          </Link>
          <Link
            href="/referral"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-rose-900 bg-rose-100 border border-rose-200 font-bold"
          >
            <Gift className="w-4 h-4 text-rose-600" />
            Do'stlarni Taklif Qilish (Bepul Pro) 🎁
          </Link>
          <Link
            href="/tutor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[#0d0c22] bg-white border border-black/10"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Tutor
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white bg-[#0d0c22] font-bold"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Tariflar
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-full text-[#0d0c22] bg-white border border-black/10"
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
