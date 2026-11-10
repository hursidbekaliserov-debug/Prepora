'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Menu, 
  X,
  Mic,
  Crown,
  Gamepad2,
  ChevronDown,
  Gift,
  UserPlus,
  LogIn,
  BookOpen,
  HelpCircle,
  Video
} from 'lucide-react';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import { SessionManager } from '@/lib/session';
import { UserProfile } from '@/types';
import PremiumModal from '@/components/PremiumModal';
import Avatar3DRenderer from '@/components/Avatar3DRenderer';
import ThemeToggle from '@/components/ThemeToggle';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Auth gate modal for navigation links when not logged in
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const cleanupWatcher = SessionManager.initSessionWatcher();

    const checkAuthAndProfile = () => {
      const logged = StorageManager.isUserLoggedIn();
      setIsLoggedIn(logged);
      if (logged) {
        setProfile(StorageManager.getProfile());
      } else {
        setProfile(null);
      }
    };

    const updateSub = () => {
      setSubStatus(StorageManager.getSubscriptionStatus());
    };

    checkAuthAndProfile();
    updateSub();

    window.addEventListener('prepora_profile_updated', checkAuthAndProfile);
    window.addEventListener('prepora_auth_changed', checkAuthAndProfile);
    window.addEventListener('prepora_subscription_updated', updateSub);

    return () => {
      cleanupWatcher();
      window.removeEventListener('prepora_profile_updated', checkAuthAndProfile);
      window.removeEventListener('prepora_auth_changed', checkAuthAndProfile);
      window.removeEventListener('prepora_subscription_updated', updateSub);
    };
  }, []);

  const handleProtectedLink = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthRedirectUrl(href);
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (authRedirectUrl) {
      router.push(authRedirectUrl);
      setAuthRedirectUrl(null);
    }
  };

  const isExamPage = pathname.includes('/mock-exam');

  if (isExamPage) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] dark:border-slate-800 bg-[#F8F9FC]/90 dark:bg-[#0B0F19]/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand: Prepora with 3D Graduation Ribbon Cap Logo */}
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Prepora Logo"
                className="w-9 h-9 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-[#171A2B] dark:text-white leading-none font-sans">
                  Prepora<span className="text-[#5146E5] font-black">.</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-[#171A2B] dark:text-slate-200">
              <Link 
                href="/" 
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname === '/' 
                    ? 'bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] font-bold' 
                    : 'text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              <Link 
                href="/ielts" 
                onClick={(e) => handleProtectedLink(e, '/ielts')}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname.startsWith('/ielts') && !pathname.includes('/ielts-gg')
                    ? 'bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] font-bold' 
                    : 'text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                IELTS
              </Link>

              <Link 
                href="/sat" 
                onClick={(e) => handleProtectedLink(e, '/sat')}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname.startsWith('/sat') 
                    ? 'bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] font-bold' 
                    : 'text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                SAT
              </Link>

              <Link 
                href="/lessons" 
                onClick={(e) => handleProtectedLink(e, '/lessons')}
                className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                  pathname === '/lessons' 
                    ? 'bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] font-bold' 
                    : 'text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-[#5146E5]" />
                <span>Lessons</span>
              </Link>

              <Link 
                href="/ielts-gg" 
                onClick={(e) => handleProtectedLink(e, '/ielts-gg')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  pathname === '/ielts-gg' 
                    ? 'bg-[#5146E5] text-white font-bold shadow-xs' 
                    : 'text-[#5146E5] bg-[#5146E5]/10 hover:bg-[#5146E5]/20 font-bold'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-[#5146E5]" />
                <span>Voice AI</span>
              </Link>

              <Link 
                href="/arena" 
                onClick={(e) => handleProtectedLink(e, '/arena')}
                className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                  pathname === '/arena' 
                    ? 'bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] font-bold' 
                    : 'text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Arena</span>
              </Link>

              {/* Dropdown More Features */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="px-3 py-1.5 rounded-full text-[#85899B] hover:text-[#171A2B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1 transition"
                >
                  <span>Features</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {moreDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                  >
                    <Link
                      href="/dashboard"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/dashboard');
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#5146E5]" />
                      Dashboard
                    </Link>
                    <Link
                      href="/tutor"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/tutor');
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Tutor
                    </Link>
                    <Link
                      href="/vocabulary"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/vocabulary');
                      }}
                      className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      Vocabulary
                    </Link>
                    <Link
                      href="/study-plan"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/study-plan');
                      }}
                      className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      Study Plan
                    </Link>
                    <Link
                      href="/mistakes"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/mistakes');
                      }}
                      className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      Mistakes Notebook
                    </Link>
                    <Link
                      href="/analytics"
                      onClick={(e) => {
                        setMoreDropdownOpen(false);
                        handleProtectedLink(e, '/analytics');
                      }}
                      className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#171A2B] dark:text-slate-200 font-semibold"
                    >
                      Analytics & Stats
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right side controls: Theme Toggle, CTA Buttons, Profile & Mobile Menu */}
          <div className="flex items-center gap-2.5">
            
            {/* Theme Toggle Button (Light Mode & Dark Mode) */}
            <ThemeToggle />

            {/* Referral Pro Pill */}
            <Link 
              href="/referral" 
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#5146E5]/10 text-[#5146E5] hover:bg-[#5146E5]/20 transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Bepul Pro 🎁</span>
            </Link>

            {/* Pricing CTA */}
            <Link 
              href="/pricing" 
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#171A2B] dark:bg-white text-white dark:text-[#171A2B] hover:bg-[#252A40] dark:hover:bg-slate-100 shadow-sm transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pricing</span>
            </Link>

            {/* Authentication State: Register / Login vs User Profile */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link 
                  href="/login" 
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-[#171A2B] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#5146E5] text-white hover:bg-[#4338CA] shadow-sm transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            ) : (
              <Link 
                href="/settings"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E5E7EB] dark:border-slate-800 text-xs font-bold text-[#171A2B] dark:text-white shadow-2xs transition"
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                  />
                ) : profile?.avatarConfig ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-black/10">
                    <Avatar3DRenderer config={profile.avatarConfig} size="sm" className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#171A2B] text-white flex items-center justify-center font-bold text-[10px]">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs">
                  {profile?.fullName || 'Student'}
                </span>
                {profile?.avatarConfig?.headwear === 'crown' ? (
                  <span className="text-xs" title="Shohona Toj">👑</span>
                ) : profile?.avatarConfig?.aura === 'fire_wings' ? (
                  <span className="text-xs" title="Olovli Qanotlar">🪽</span>
                ) : profile?.avatarConfig?.glasses === 'vr_visor' ? (
                  <span className="text-xs" title="VR Vizor">🥽</span>
                ) : profile?.equippedItem ? (
                  <span className="text-xs" title="Taqilgan 3D aksessuar">
                    {profile.equippedItem === 'crown_3d' ? '👑' :
                     profile.equippedItem === 'aura_3d' ? '⚡' :
                     profile.equippedItem === 'visors_3d' ? '🕶️' :
                     profile.equippedItem === 'wings_3d' ? '🪽' :
                     profile.equippedItem === 'diamond_frame' ? '💎' :
                     profile.equippedItem === 'shield_band9' ? '🛡️' : ''}
                  </span>
                ) : null}
                {subStatus?.isPremium && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#5146E5] text-white">
                    PRO
                  </span>
                )}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#171A2B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E5E7EB] dark:border-slate-800 bg-[#F8F9FC] dark:bg-[#0B0F19] px-4 py-4 space-y-2.5 shadow-xl animate-fade-in text-xs font-bold">
            {!isLoggedIn ? (
              <div className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between gap-2 mb-2 shadow-2xs">
                <span className="text-[#85899B] font-medium text-xs">Akkauntingiz yo'qmi?</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#171A2B] dark:text-white text-xs font-bold transition"
                  >
                    Kirish
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-1.5 rounded-full bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between gap-3 mb-2 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  {profile?.avatarConfig ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                      <Avatar3DRenderer config={profile.avatarConfig} size="sm" className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#171A2B] text-white flex items-center justify-center font-bold text-xs">
                      {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-[#171A2B] dark:text-white">{profile?.fullName || 'Student'}</h4>
                    <span className="text-[10px] text-[#85899B] font-normal">{profile?.email || 'student@prepora.uz'}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-[10px] font-bold">
                  Sozlamalar
                </span>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/ielts"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleProtectedLink(e, '/ielts');
                }}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#171A2B] dark:text-white hover:bg-indigo-50/50 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#5146E5]" />
                <span>IELTS Mock</span>
              </Link>

              <Link
                href="/sat"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleProtectedLink(e, '/sat');
                }}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#171A2B] dark:text-white hover:bg-indigo-50/50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Digital SAT</span>
              </Link>

              <Link
                href="/lessons"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleProtectedLink(e, '/lessons');
                }}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#171A2B] dark:text-white hover:bg-indigo-50/50 flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-[#5146E5]" />
                <span>20 Ta Darslik</span>
              </Link>

              <Link
                href="/ielts-gg"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleProtectedLink(e, '/ielts-gg');
                }}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#171A2B] dark:text-white hover:bg-indigo-50/50 flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-[#5146E5]" />
                <span>Voice AI</span>
              </Link>

              <Link
                href="/arena"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleProtectedLink(e, '/arena');
                }}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#171A2B] dark:text-white hover:bg-indigo-50/50 flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-600" />
                <span>Arena PvP</span>
              </Link>

              <Link
                href="/referral"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-[#5146E5] hover:bg-indigo-50/50 flex items-center gap-2 font-black"
              >
                <Gift className="w-4 h-4 text-[#5146E5]" />
                <span>Bepul Pro 🎁</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Gate Modal when clicking protected items */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Darslik va Testlarga Kirish"
        subtitle="IELTS, SAT, Video darslar, Voice AI va boshqa bo'limlardan to'liq foydalanish uchun ro'yxatdan o'ting yoki kiring."
      />
    </>
  );
}
