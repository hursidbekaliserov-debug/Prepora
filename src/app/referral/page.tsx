'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  Gift, 
  Users, 
  Crown, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ArrowRight, 
  Share2, 
  Zap, 
  Award, 
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

export default function ReferralPage() {
  const [referralData, setReferralData] = useState({
    code: 'PREP-7281',
    invitedCount: 0,
    maxGoal: 3,
    isProUnlocked: false,
    invitedFriends: [] as { id: string; name: string; date: string }[],
  });

  const [copied, setCopied] = useState(false);
  const [simulatedFriendName, setSimulatedFriendName] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(false);

  const loadData = () => {
    setReferralData(StorageManager.getReferralData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('prepora_referral_updated', loadData);
    return () => window.removeEventListener('prepora_referral_updated', loadData);
  }, []);

  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?ref=${referralData.code}`
    : `https://prepora.uz/?ref=${referralData.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(
      `👋 Salom! Men Prepora platformasida IELTS va SAT ga tayyorlanyapman.\n\n` +
      `Bu yerda AI Tutor, Speaking suhbatdoshi, to'liq Mock testlar va video darsliklar bor ekan!\n\n` +
      `Quyidagi havola orqali kirsangiz, sizga ham bepul tayyorgarlik imkoniyatlari beriladi:`
    );
    const url = encodeURIComponent(referralUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleSimulateFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const name = simulatedFriendName.trim() || `Do'st #${referralData.invitedCount + 1}`;
    const result = StorageManager.addReferralFriend(name);
    setSimulatedFriendName('');
    if (result.justUnlockedPro) {
      setJustUnlocked(true);
    }
  };

  const progressPercent = Math.min(100, Math.round((referralData.invitedCount / referralData.maxGoal) * 100));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Prepora Virallik Dasturi • Bepul Pro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight">
            Do'stlaringizni Taklif Qiling, <br />
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              1 Oylik Pro Obunani Bepul Oling!
            </span>
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Har bir taklif qilingan do'stingiz uchun qimmatbaho bonuslar oling. Atigi <strong>3 ta do'stingiz</strong> qo'shilsa, 50 000 so'mlik <strong>Prepora Pro</strong> avtomatik ravishda bepul ochiladi!
          </p>
        </div>

        {/* Success Modal Notification if Pro Just Unlocked */}
        {(justUnlocked || referralData.isProUnlocked) && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                <Crown className="w-8 h-8 text-amber-300 fill-amber-300 animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                  Muvaffaqiyat!
                </span>
                <h3 className="text-xl font-black">Prepora Pro Faollashtirildi!</h3>
                <p className="text-xs text-emerald-100">
                  Siz 3 ta do'stingizni taklif qildingiz. Barcha SAT/IELTS testlari va darslar 1 oy bepul cheksiz ochildi!
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 transition shadow-md shrink-0 flex items-center gap-1"
            >
              <span>Platformani Ishlatish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Progress Tracker Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Sizning Natijangiz
              </span>
              <h2 className="text-2xl font-black text-blue-950 flex items-center gap-2 mt-0.5">
                <Users className="w-6 h-6 text-indigo-600" />
                <span>{referralData.invitedCount} / {referralData.maxGoal} Do'st Taklif Qilindi</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {progressPercent}%
              </span>
              <span className="text-xs text-slate-500 font-medium">bajarildi</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 pt-1">
              <span className={referralData.invitedCount >= 1 ? 'text-indigo-600 font-black' : ''}>
                1-do'st (+200 XP)
              </span>
              <span className={referralData.invitedCount >= 2 ? 'text-amber-600 font-black' : ''}>
                2-do'st (+500 XP)
              </span>
              <span className={referralData.invitedCount >= 3 ? 'text-emerald-600 font-black' : ''}>
                3-do'st (👑 Pro Bepul)
              </span>
            </div>
          </div>

          {/* 3 Step Reward Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className={`p-4 rounded-2xl border transition-all ${
              referralData.invitedCount >= 1 
                ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950' 
                : 'bg-slate-50 border-slate-200 text-slate-700 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                {referralData.invitedCount >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="font-extrabold text-xs">1-Do'st</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                +200 XP Tajriba va 5 ta bepul AI savoli.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${
              referralData.invitedCount >= 2 
                ? 'bg-amber-50/70 border-amber-300 text-amber-950' 
                : 'bg-slate-50 border-slate-200 text-slate-700 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                {referralData.invitedCount >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="font-extrabold text-xs">2-Do'st</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                +500 XP Tajriba va 10 ta bepul Mock test.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border-2 transition-all ${
              referralData.invitedCount >= 3 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm' 
                : 'bg-slate-50 border-amber-300/80 text-blue-950'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <h4 className="font-black text-xs text-amber-600 flex items-center gap-1">
                <span>1 OYLIK PRO BEPUL</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                50 000 so'mlik Pro obunasi mutlaqo tekinga beriladi!
              </p>
            </div>
          </div>
        </div>

        {/* Share Link Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl space-y-4 border border-blue-800/40">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              Sizning Maxsus Taklif Havolangiz
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Do'stlaringiz Bilan Ulashing
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Ushbu havolani nusxalang yoki to'g'ridan-to'g'ri Telegramdagi sinfdosh va guruhlaringizga yuboring.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2 overflow-hidden">
              <span className="font-mono text-xs sm:text-sm text-amber-300 truncate font-semibold">
                {referralUrl}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300 font-bold shrink-0">
                {referralData.code}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Nusxalash</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTelegramShare}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegramda Yuborish</span>
            </button>
          </div>
        </div>

        {/* Simulation / Testing Box */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="font-extrabold text-xs text-blue-950">
                Taklif Tizimini Sinab Ko'rish (Test Rejimi)
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Do'st qo'shilishini darhol sinash
            </span>
          </div>

          <form onSubmit={handleSimulateFriend} className="flex gap-2">
            <input
              type="text"
              value={simulatedFriendName}
              onChange={(e) => setSimulatedFriendName(e.target.value)}
              placeholder="Do'stingiz ismi (masalan: Azizbek)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-blue-950"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Do'st Qo'shish (+1)</span>
            </button>
          </form>

          {/* List of invited friends */}
          {referralData.invitedFriends.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Taklif qilingan do'stlar ro'yxati:
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {referralData.invitedFriends.map((friend) => (
                  <div key={friend.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {friend.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{friend.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
