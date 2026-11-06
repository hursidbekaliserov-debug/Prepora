'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Key, 
  Save, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Sparkles,
  Camera,
  Upload,
  Crown,
  Lock,
  GraduationCap,
  Image as ImageIcon,
  Smile,
  X,
  Coins,
  ShoppingBag,
  Zap,
  Shirt,
  Glasses,
  Flame,
  Check
} from 'lucide-react';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { UserProfile, ExamType, IELTSType } from '@/types';
import PremiumModal from '@/components/PremiumModal';
import Avatar3DRenderer from '@/components/Avatar3DRenderer';

const VIP_PREMIUM_STICKERS = [
  { emoji: '👑', label: 'Oltin Toj' },
  { emoji: '💎', label: 'Olmos' },
  { emoji: '⚡', label: 'Yashin' },
  { emoji: '🔥', label: 'Olov' },
  { emoji: '🚀', label: 'Raketa' },
  { emoji: '⭐', label: 'Yulduz' },
  { emoji: '🏆', label: 'Kubok' },
  { emoji: '✨', label: 'Yaltiroq' },
  { emoji: '🛡️', label: 'Qalqon' },
  { emoji: '🎯', label: 'Nishon' },
  { emoji: '🌟', label: 'Yorqin Yulduz' },
  { emoji: '🦄', label: 'Sehrli Unicorn' },
  { emoji: '🎖️', label: 'Faxriy Medal' },
  { emoji: '🔮', label: 'Kristall Shar' },
  { emoji: '🪐', label: 'Sayyora' },
  { emoji: '🦁', label: 'Sher' },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [premiumBadge, setPremiumBadge] = useState('');
  const [targetExam, setTargetExam] = useState<ExamType>('BOTH');
  const [ieltsType, setIeltsType] = useState<IELTSType>('ACADEMIC');
  const [targetIelts, setTargetIelts] = useState<number>(8.0);
  const [targetSat, setTargetSat] = useState<number>(1520);
  const [examDate, setExamDate] = useState('2026-12-15');
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [stickerAlert, setStickerAlert] = useState<string | null>(null);
  const [shopFeedback, setShopFeedback] = useState<string | null>(null);
  const [activeWardrobeTab, setActiveWardrobeTab] = useState<'headwear' | 'outfit' | 'glasses' | 'aura'>('outfit');

  const wardrobeCatalog = StorageManager.getWardrobeCatalog();
  const avatars3D = StorageManager.get3DAvatars();
  const accessoryItems = StorageManager.getAccessoryItems();

  const handleSetGender = (gender: 'boy' | 'girl') => {
    StorageManager.setAvatarGender(gender);
    const updated = StorageManager.getProfile();
    setProfile(updated);
    setShopFeedback(gender === 'boy' ? "O'g'il bola qahramoni tanlandi!" : "Qiz bola qahramoni tanlandi!");
    setTimeout(() => setShopFeedback(null), 3000);
  };

  const handleSelectWardrobe = (
    category: 'headwear' | 'outfit' | 'glasses' | 'aura',
    itemId: string,
    priceXp: number
  ) => {
    const res = StorageManager.buyAndEquipWardrobeItem(category, itemId, priceXp);
    setShopFeedback(res.message);
    const updated = StorageManager.getProfile();
    setProfile(updated);
    setTimeout(() => setShopFeedback(null), 3500);
  };

  const handleSelect3DAvatar = (avatarId: string) => {
    const res = StorageManager.buyAndEquip3DAvatar(avatarId);
    setShopFeedback(res.message);
    setProfile(StorageManager.getProfile());
    setTimeout(() => setShopFeedback(null), 3500);
  };

  const handleSelectAccessory = (itemId: string) => {
    const res = StorageManager.buyAndEquipAccessory(itemId);
    setShopFeedback(res.message);
    setProfile(StorageManager.getProfile());
    setTimeout(() => setShopFeedback(null), 3500);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = StorageManager.getProfile();
    const sub = StorageManager.getSubscriptionStatus();
    setProfile(p);
    setSubStatus(sub);
    setName(p.fullName);
    setEmail(p.email);
    setAvatarUrl(p.avatarUrl || '');
    setPremiumBadge(p.premiumBadge || '');
    setTargetExam(p.targetExam);
    setIeltsType(p.ieltsType || 'ACADEMIC');
    setTargetIelts(p.targetIeltsBand || 8.0);
    setTargetSat(p.targetSatScore || 1520);
    setExamDate(p.examDate || '2026-12-15');
    setDailyMinutes(p.dailyStudyMinutes || 45);

    const updateSub = () => {
      setSubStatus(StorageManager.getSubscriptionStatus());
    };
    window.addEventListener('prepora_subscription_updated', updateSub);
    return () => window.removeEventListener('prepora_subscription_updated', updateSub);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("Rasm hajmi juda katta! Iltimos 2.5 MB dan kichik rasm tanlang.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSticker = (sticker: string) => {
    if (!subStatus?.isPremium) {
      setStickerAlert("🔒 Nik yoniga maxsus VIP stiker qo'yish faqat Premium obunachilar uchun mavjud! Oddiy foydalanuvchilar qo'ya olmaydi.");
      setTimeout(() => setStickerAlert(null), 4000);
      return;
    }

    if (premiumBadge === sticker) {
      setPremiumBadge('');
    } else {
      setPremiumBadge(sticker);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Oddiy foydalanuvchi stiker saqlay olmasligini qat'iy tekshirish
    const finalSticker = subStatus?.isPremium ? premiumBadge : '';

    const updated: UserProfile = {
      ...profile,
      fullName: name,
      email,
      avatarUrl,
      premiumBadge: finalSticker,
      targetExam,
      ieltsType,
      targetIeltsBand: targetIelts,
      targetSatScore: targetSat,
      examDate,
      dailyStudyMinutes: dailyMinutes,
      isDemoUser: false,
    };

    await StorageManager.saveProfile(updated);
    setProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Barcha o\'quv natijalari, xatolar daftari va sozlamalarni qayta boshlang\'ich holatga qaytarmoqchimisiz?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    StorageManager.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-blue-950">Profil va Sozlamalar</h1>
                {subStatus?.isPremium && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-800 text-xs font-black border border-amber-400/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600 fill-amber-600" />
                    Premium Foydalanuvchi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Profilingiz rasmi, ismingiz, VIP stikerlaringiz va maqsadli ballaringizni boshqaring.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold border border-slate-200 transition"
          >
            <LogOut className="w-4 h-4" /> Chiqish
          </button>
        </div>

        {/* SECTION 1: PROFILE PICTURE & LOGO PREVIEW */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-blue-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-900" />
                Profil Rasmi (Sayt Nomi Oldida Ko'rinadi)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                O'zingiz xohlagan rasmni yuklang. Ushbu rasm darhol sayt logotipi (Prepora) oldida va profilingizda aks etadi!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Current Picture Preview */}
            <div className="relative group shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profil rasmi"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-950 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-800 flex items-center justify-center text-white text-3xl font-black shadow-md">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1"
              >
                <Camera className="w-5 h-5" />
                <span>Almashtirish</span>
              </button>
            </div>

            {/* Picture Controls & Live Brand Demo */}
            <div className="flex-1 space-y-3 w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  Xohlagan Rasmni Yuklash (Fayldan)
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Rasmni Olib Tashlash
                  </button>
                )}
              </div>

              {/* URL input */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 block">
                  Yoki to'g'ridan-to'g'ri Rasm URL manzilini kiriting:
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-blue-950 focus:outline-hidden focus:border-blue-950"
                />
              </div>

              {/* Live Preview Header Pill */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Sayt Nomida Qanday Ko'rinishi (Jonli Preview):
                </span>
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Logo Avatar"
                      className="w-7 h-7 rounded-lg object-cover border border-blue-900/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center font-bold text-xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-black text-blue-950 leading-none block">Prepora</span>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">IELTS & SAT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: VIP PREMIUM STATUS STICKER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-blue-950 flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-500" />
                VIP Nik Yonidagi Maxsus Stiker
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Faqat Premium
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Ismingiz yoniga eksklyuziv VIP status emoji-stikerini qo'ying.
              </p>
            </div>

            {/* Current Nickname preview */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <span>Ko'rinishi:</span>
              <span className="text-blue-900 font-extrabold">{name || 'Talaba'}</span>
              {premiumBadge ? (
                <span className="text-base select-none">{premiumBadge}</span>
              ) : (
                <span className="text-[10px] text-slate-400 font-normal">(stikersiz)</span>
              )}
            </div>
          </div>

          {/* Alert if non-premium attempts */}
          {stickerAlert && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{stickerAlert}</span>
              </div>
              <Link
                href="/pricing"
                className="px-3 py-1 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shrink-0"
              >
                Tariflar
              </Link>
            </div>
          )}

          {/* Stickers Grid */}
          <div className="relative">
            {!subStatus?.isPremium && (
              <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-amber-300">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-blue-950">Faqat Premium Foydalanuvchilar Uchun</h4>
                <p className="text-xs text-slate-600 max-w-md mt-1">
                  VIP maxsus stikerlarni faqat <strong>Prepora Premium</strong> obunachilari ismining yoniga qo'ya oladi.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-extrabold shadow-sm transition"
                  >
                    Tariflar Bo'limiga O'tish (50 000 so'm)
                  </Link>
                </div>
              </div>
            )}

            <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-4 sm:grid-cols-8 gap-2.5 ${!subStatus?.isPremium ? 'opacity-40 pointer-events-none' : ''}`}>
              {VIP_PREMIUM_STICKERS.map((stk) => {
                const isSelected = premiumBadge === stk.emoji;
                return (
                  <button
                    key={stk.emoji}
                    type="button"
                    onClick={() => handleSelectSticker(stk.emoji)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 group ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400 shadow-sm scale-105'
                        : 'border-slate-200 bg-white hover:bg-amber-50/50 hover:border-amber-200'
                    }`}
                    title={stk.label}
                  >
                    <span className="text-2xl select-none group-hover:scale-125 transition-transform">
                      {stk.emoji}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 truncate max-w-full">
                      {stk.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {subStatus?.isPremium && premiumBadge && (
            <button
              type="button"
              onClick={() => setPremiumBadge('')}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Stikerni olib tashlash
            </button>
          )}
        </div>

        {/* SECTION 3: 3D AVATAR KIYINTIRISH STUDIYASI & XP HAMYONI */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/20 text-[#ea4c89] text-xs font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ea4c89]" />
                <span>3D Kiyintirish Studiyasi & XP Do'koni</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-950">
                3D Avatar (O'g'il & Qiz bola) Kiyintirish
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                O'g'il yoki Qiz bola qahramonini tanlang, imtihonlardan to'plagan XP laringiz evaziga shohona kiyimlar, kiber ko'zoynaklar va olovli qanotlar bilan kiyintiring!
              </p>
            </div>
          </div>

          {/* XP STATS: JAMI YIG'ILGAN XP, ISHLATILGAN XP, BALANS XP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Jami Toplangan XP (Olgan XP) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 flex items-center justify-between shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" />
                  Jami To'plangan (Olgan XP)
                </span>
                <div className="text-2xl font-black text-indigo-950">
                  {profile?.totalEarnedXp ?? 1200} <span className="text-sm font-bold text-indigo-600">XP</span>
                </div>
                <p className="text-[10px] text-slate-500">Imtihon & testlardan qozonilgan jami ball</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                💎
              </div>
            </div>

            {/* 2. Ishlatilgan XP (Ishlatgan XP) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/80 flex items-center justify-between shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                  Ishlatilgan (Xarid qilingan)
                </span>
                <div className="text-2xl font-black text-rose-950">
                  {profile?.spentXp ?? 250} <span className="text-sm font-bold text-rose-600">XP</span>
                </div>
                <p className="text-[10px] text-slate-500">Kiyim & aksessuarlarga sarflangan ballar</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                🛒
              </div>
            </div>

            {/* 3. Hozirgi Balans (Mavjud XP) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 flex items-center justify-between shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Hozirgi Balans (Mavjud XP)
                </span>
                <div className="text-2xl font-black text-amber-950">
                  {profile?.xp ?? 950} <span className="text-sm font-bold text-amber-600">XP</span>
                </div>
                <p className="text-[10px] text-slate-600">Xaridlar uchun do'konda qolgan balans</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center text-xl shadow-md shrink-0">
                ⚡
              </div>
            </div>
          </div>

          {/* Feedback Toast */}
          {shopFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{shopFeedback}</span>
            </div>
          )}

          {/* Interactive Studio: Left = 3D Character Preview & Gender Switcher, Right = Wardrobe Tabs & Items */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            {/* LEFT COLUMN: 3D LIVE AVATAR STAGE */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col items-center justify-between shadow-xl border border-blue-900/40 relative overflow-hidden">
              {/* Decorative radial lighting */}
              <div className="absolute top-0 w-72 h-72 bg-[#ea4c89]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Gender Selector Switcher */}
              <div className="w-full relative z-10 space-y-2 mb-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold block text-center">
                  Qahramon Jinsini Tanlang:
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <button
                    type="button"
                    onClick={() => handleSetGender('boy')}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                      (profile?.avatarConfig?.gender || 'boy') === 'boy'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>👦</span>
                    <span>O'g'il Bola</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetGender('girl')}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                      profile?.avatarConfig?.gender === 'girl'
                        ? 'bg-[#ea4c89] text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>👧</span>
                    <span>Qiz Bola</span>
                  </button>
                </div>
              </div>

              {/* LIVE 3D AVATAR RENDERER */}
              <div className="relative z-10 py-3 flex items-center justify-center">
                <Avatar3DRenderer
                  config={
                    profile?.avatarConfig || {
                      gender: 'boy',
                      headwear: 'none',
                      outfit: 'casual',
                      glasses: 'none',
                      aura: 'none',
                    }
                  }
                  size="xl"
                  className="filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Equipped Summary Badge Chips */}
              <div className="w-full relative z-10 pt-4 border-t border-white/10 mt-3 space-y-1.5">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block text-center">
                  Hozirgi Egnidagi Liboslar:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-bold border border-white/15">
                    🎩 {profile?.avatarConfig?.headwear === 'crown' ? 'Shohona Toj' : profile?.avatarConfig?.headwear === 'grad_cap' ? 'Garvard Shapkasi' : profile?.avatarConfig?.headwear === 'headphones' ? 'Kiber Quloqchin' : profile?.avatarConfig?.headwear === 'cap' ? 'Kepka' : 'Bosh kiyimsiz'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-bold border border-white/15">
                    👕 {profile?.avatarConfig?.outfit === 'suit' ? 'Oxford Kostyum' : profile?.avatarConfig?.outfit === 'hoodie' ? 'Cambridge Xudi' : profile?.avatarConfig?.outfit === 'cyber_jacket' ? 'Cyberpunk Bomber' : 'Prepora T-Shirt'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-bold border border-white/15">
                    👓 {profile?.avatarConfig?.glasses === 'vr_visor' ? 'VR Vizor' : profile?.avatarConfig?.glasses === 'smart_glasses' ? 'Garvard Ko\'zoynak' : profile?.avatarConfig?.glasses === 'sunglasses' ? 'VIP Ko\'zoynak' : 'Ko\'zoynaksiz'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-bold border border-white/15">
                    🪽 {profile?.avatarConfig?.aura === 'fire_wings' ? 'Olovli Qanotlar' : profile?.avatarConfig?.aura === 'neon_glow' ? 'Neon Doira' : profile?.avatarConfig?.aura === 'golden_sparkles' ? 'Oltin Zarrachalar' : 'Aurasiz'}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WARDROBE CATEGORY TABS & SHOP ITEMS */}
            <div className="lg:col-span-7 space-y-4">
              {/* Category Switcher Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveWardrobeTab('outfit')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    activeWardrobeTab === 'outfit'
                      ? 'bg-white text-blue-950 shadow-sm'
                      : 'text-slate-600 hover:text-blue-950'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5 text-blue-600" />
                  <span>Liboslar (Kiyim)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWardrobeTab('headwear')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    activeWardrobeTab === 'headwear'
                      ? 'bg-white text-blue-950 shadow-sm'
                      : 'text-slate-600 hover:text-blue-950'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bosh Kiyimlar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWardrobeTab('glasses')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    activeWardrobeTab === 'glasses'
                      ? 'bg-white text-blue-950 shadow-sm'
                      : 'text-slate-600 hover:text-blue-950'
                  }`}
                >
                  <Glasses className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Ko'zoynaklar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWardrobeTab('aura')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                    activeWardrobeTab === 'aura'
                      ? 'bg-white text-blue-950 shadow-sm'
                      : 'text-slate-600 hover:text-blue-950'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Qanotlar & Aura</span>
                </button>
              </div>

              {/* Items List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wardrobeCatalog[activeWardrobeTab].map((item) => {
                  const currentEquipped = profile?.avatarConfig?.[activeWardrobeTab];
                  const isEquipped = currentEquipped === item.id;
                  const isUnlocked = item.priceXp === 0 || (profile?.unlockedWardrobe || ['casual', 'none']).includes(item.id);
                  const canAfford = (profile?.xp || 0) >= item.priceXp;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isEquipped
                          ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-400 shadow-xs'
                          : 'border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-2xl shrink-0">
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-black text-blue-950 truncate">{item.name}</h4>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] font-bold text-indigo-700">
                              {item.priceXp === 0 ? '🎁 Bepul' : `${item.priceXp} XP`}
                            </span>
                            {isUnlocked && item.priceXp > 0 && (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                Xarid qilingan
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isEquipped ? (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-default"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Taqilgan</span>
                          </button>
                        ) : isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => handleSelectWardrobe(activeWardrobeTab, item.id, item.priceXp)}
                            className="w-full py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition"
                          >
                            Taqish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectWardrobe(activeWardrobeTab, item.id, item.priceXp)}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                              canAfford
                                ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 shadow-xs'
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>{canAfford ? `${item.priceXp} XP bilan Kiyish` : `Yetarli emas (${item.priceXp} XP)`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EXAM TARGET & STUDY PLAN FORM */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-blue-950 mb-4">Talaba Maqsadlari & Imtihon Rejasi</h2>

          {saveSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Barcha o'zgarishlar (profil rasmi, nik stikeri va ma'lumotlar) muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">To'liq Ismingiz (Nik)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Manzili</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tayyorgarlik Imtihoni</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                >
                  <option value="IELTS">IELTS</option>
                  <option value="SAT">Digital SAT</option>
                  <option value="BOTH">Har ikkalasi (IELTS & SAT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Imtihon Sanasi</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                >
                </input>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Maqsadli IELTS Ball</label>
                <input
                  type="number"
                  step="0.5"
                  min="5.0"
                  max="9.0"
                  value={targetIelts}
                  onChange={(e) => setTargetIelts(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Maqsadli SAT Ball</label>
                <input
                  type="number"
                  step="10"
                  min="800"
                  max="1600"
                  value={targetSat}
                  onChange={(e) => setTargetSat(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kunlik O'rganish Vaqti</label>
                <select
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-950"
                >
                  <option value={30}>30 daqiqa / kun</option>
                  <option value={45}>45 daqiqa / kun</option>
                  <option value={60}>60 daqiqa / kun</option>
                  <option value={90}>90 daqiqa / kun</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition font-semibold"
                >
                  Ma'lumotlarni Tozalash
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Haqiqatan ham hisobingizdan chiqmoqchimisiz?")) {
                      StorageManager.logout();
                      window.location.href = '/';
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Hisobdan Chiqish</span>
                </button>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Sozlamalarni Saqlash
              </button>
            </div>
          </form>
        </div>
      </main>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        reason="general"
      />
    </div>
  );
}
