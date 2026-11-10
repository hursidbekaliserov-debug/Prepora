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
  ChevronRight,
  Clock,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

export default function ReferralPage() {
  const [referralData, setReferralData] = useState<{
    code: string;
    invitedCount: number;
    verifiedCount: number;
    maxGoal: number;
    isProUnlocked: boolean;
    invitedFriends: { id: string; name: string; date: string; status: 'pending' | 'verified'; joinedExam?: string }[];
  }>({
    code: 'PREP-7281',
    invitedCount: 0,
    verifiedCount: 0,
    maxGoal: 10,
    isProUnlocked: false,
    invitedFriends: [],
  });

  const [copied, setCopied] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyNotice, setVerifyNotice] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const loadData = () => {
    setReferralData(StorageManager.getReferralData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('prepora_referral_updated', loadData);
    return () => window.removeEventListener('prepora_referral_updated', loadData);
  }, []);

  const referralUrl = `https://prepora-ruddy.vercel.app/?ref=${referralData.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(
      `👋 Salom do'stim! IELTS va SAT ga professional tayyorlanish uchun Prepora platformasiga taklif qilaman.\n\n` +
      `Bu yerda Band 9 AI Tutor, Real-time Speaking suhbatdoshi, Cambridge Mock testlari va Desmos darsliklari bor ekan!\n\n` +
      `Havola orqali ro'yxatdan o't: ${referralUrl}`
    );
    const url = encodeURIComponent(referralUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendNameInput.trim()) return;
    StorageManager.addReferralFriend(friendNameInput.trim());
    setFriendNameInput('');
  };

  const handleVerifyFriend = (friendId: string) => {
    setVerifyingId(friendId);
    setVerifyNotice(null);
    setTimeout(() => {
      const res = StorageManager.verifyReferralFriend(friendId);
      setVerifyingId(null);
      setVerifyNotice({
        type: res.success ? 'success' : 'warning',
        text: res.message,
      });
      if (res.justUnlockedPro) {
        setJustUnlocked(true);
      }
      setTimeout(() => setVerifyNotice(null), 5000);
    }, 800);
  };

  const verifiedCount = referralData.verifiedCount || 0;
  const maxGoal = referralData.maxGoal || 10;
  const progressPercent = Math.min(100, Math.round((verifiedCount / maxGoal) * 100));

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5146E5]/10 border border-[#5146E5]/20 text-[#5146E5] text-xs font-bold uppercase tracking-wider">
            <Gift className="w-4 h-4 text-[#5146E5]" />
            <span>Prepora Virallik Dasturi • 10 Ta Do'st = Bepul Pro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#171A2B] tracking-tight leading-tight">
            10 ta Do'stingizni Taklif Qiling, <br />
            <span className="text-[#5146E5]">1 Oylik Pro Obunani</span> Bepul Oling!
          </h1>

          <p className="text-xs sm:text-sm text-[#85899B] max-w-xl mx-auto leading-relaxed">
            Do'stlaringiz sizning taklif havolangiz orqali ro'yxatdan o'tishlari kerak. <strong>10 ta do'stingiz ro'yxatdan o'tgach</strong>, 50 000 so'mlik <strong>Prepora Pro</strong> obunasi 1 oyga to'liq bepul ochiladi!
          </p>
        </div>

        {/* Verification Toast Alert */}
        {verifyNotice && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in zoom-in-95 shadow-sm ${
            verifyNotice.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            {verifyNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>{verifyNotice.text}</span>
          </div>
        )}

        {/* Success Banner if Pro Unlocked */}
        {(justUnlocked || referralData.isProUnlocked) && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171A2B] to-[#252A40] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5146E5] text-white text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                  Muvaffaqiyat!
                </span>
                <h3 className="text-xl font-black">Prepora Pro Faollashtirildi!</h3>
                <p className="text-xs text-slate-300">
                  10 ta do'stingiz ro'yxatdan o'tdi va to'liq tasdiqlandi. Barcha testlar va video darsliklar 1 oy bepul ochildi!
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#5146E5] hover:bg-[#4338CA] text-white font-bold text-xs transition shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>Dashboardga O'tish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Progress Tracker Card (10 Steps) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
            <div>
              <span className="text-xs font-bold text-[#85899B] uppercase tracking-wider block">
                Tasdiqlangan Natija
              </span>
              <h2 className="text-2xl font-black text-[#171A2B] flex items-center gap-2 mt-0.5">
                <Users className="w-6 h-6 text-[#5146E5]" />
                <span>{verifiedCount} / {maxGoal} Do'st Tasdiqlandi</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#5146E5] font-mono">
                {progressPercent}%
              </span>
              <span className="text-xs text-[#85899B] font-medium">bajarildi</span>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#F3F4F6] rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#5146E5] to-[#8B7CF6] h-3 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 10 Step Indicators */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
              {Array.from({ length: maxGoal }).map((_, i) => {
                const isDone = i < verifiedCount;
                const isCurrent = i === verifiedCount;
                return (
                  <div
                    key={i}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-black transition-all ${
                      isDone
                        ? 'bg-[#5146E5] text-white border-[#5146E5] shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-50 text-[#5146E5] border-[#5146E5] ring-2 ring-[#5146E5]/20 animate-pulse'
                        : 'bg-[#F8F9FC] text-[#85899B] border-[#E5E7EB]'
                    }`}
                  >
                    <div className="text-[10px] leading-tight">#{i + 1}</div>
                    <div className="text-xs">{isDone ? '✓' : '👤'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Referral Link & Sharing Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="text-base sm:text-lg font-black text-[#171A2B]">
            Maxsus Taklif Havolangiz
          </h3>
          <p className="text-xs text-[#85899B]">
            Ushbu havolani do'stlaringizga, guruhlarga yoki Telegram orqali yuboring:
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full sm:flex-1 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] font-mono text-xs text-[#171A2B] truncate select-all">
              {referralUrl}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#171A2B] hover:bg-[#252A40] text-white text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Nusxa Olish</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTelegramShare}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Telegramga Yuborish</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[#85899B]">
            💡 Shaxsiy Referral Kodingiz: <strong className="font-mono text-[#5146E5] font-bold">{referralData.code}</strong>
          </div>
        </div>

        {/* Do'st qo'shish formasi */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
          <h3 className="font-black text-base sm:text-lg text-[#171A2B]">
            Taklif Qilgan Do'stingiz Ismini Yozing
          </h3>
          <p className="text-xs text-[#85899B]">
            Havolani kimga yuborganingizni belgilab boring. Do'stingiz saytda ro'yxatdan o'tgach, "Tekshirish" tugmasini bosing:
          </p>

          <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={friendNameInput}
              onChange={(e) => setFriendNameInput(e.target.value)}
              placeholder="Masalan: Sardor Aliyev yoki sardor@gmail.com"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-[#5146E5]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Do'stni Qo'shish</span>
            </button>
          </form>
        </div>

        {/* Do'stlar ro'yxati va "Tekshirish" mexanizmi */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base sm:text-lg text-[#171A2B]">
              Taklif Qilingan Do'stlar Ro'yxati
            </h3>
            <span className="text-xs font-bold text-[#85899B]">
              Jami: {referralData.invitedFriends.length} ta
            </span>
          </div>

          {referralData.invitedFriends.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F9FC] rounded-2xl border border-dashed border-[#E5E7EB] space-y-2">
              <Users className="w-8 h-8 text-[#85899B] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[#171A2B]">Hali do'stlar qo'shilmadi</p>
              <p className="text-[11px] text-[#85899B] max-w-sm mx-auto">
                Yuqoridagi maydonga taklif qilgan do'stlaringiz ismini kiriting yoki Telegram orqali havolangizni ulashing!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {referralData.invitedFriends.map((friend) => {
                const isVerified = friend.status === 'verified';
                const isChecking = verifyingId === friend.id;

                return (
                  <div
                    key={friend.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isVerified
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-[#F8F9FC] border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isVerified ? 'bg-emerald-600 text-white' : 'bg-[#171A2B] text-white'
                      }`}>
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#171A2B]">{friend.name}</h4>
                          {isVerified ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Tasdiqlandi</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Ro'yxatdan o'tishi kutilmoqda</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#85899B] block mt-0.5">
                          Qo'shilgan sana: {friend.date}
                        </span>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-end">
                      {isVerified ? (
                        <div className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Hisoblandi (+1)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyFriend(friend.id)}
                          disabled={isChecking}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60"
                        >
                          {isChecking ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Tekshirilmoqda...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Hozir Tekshirish</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
