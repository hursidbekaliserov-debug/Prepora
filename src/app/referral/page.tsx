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
  CheckCircle
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface RecommendUser {
  id: string;
  name: string;
  avatar: string;
  targetExam: string;
  targetScore: string;
}

const CANDIDATE_STUDENTS: RecommendUser[] = [
  { id: 'usr_101', name: 'Anvar Salimov', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', targetExam: 'IELTS Academic', targetScore: 'Band 8.0' },
  { id: 'usr_102', name: 'Dilnoza Karimova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', targetExam: 'Digital SAT', targetScore: '1520 Ball' },
  { id: 'usr_103', name: 'Shoxrux Aliyev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', targetExam: 'IELTS Academic', targetScore: 'Band 7.5' },
  { id: 'usr_104', name: 'Aziza Mahmudova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', targetExam: 'Digital SAT', targetScore: '1480 Ball' },
  { id: 'usr_105', name: 'Temur Po\'latov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', targetExam: 'IELTS Academic', targetScore: 'Band 8.5' },
];

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
    maxGoal: 5,
    isProUnlocked: false,
    invitedFriends: [],
  });

  const [copied, setCopied] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<string[]>([]);

  const loadData = () => {
    setReferralData(StorageManager.getReferralData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('prepora_referral_updated', loadData);
    return () => window.removeEventListener('prepora_referral_updated', loadData);
  }, []);

  // Referral link explicitly set to prepora-ruddy.vercel.app as requested
  const referralUrl = `https://prepora-ruddy.vercel.app/?ref=${referralData.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTelegramShare = (name?: string) => {
    const greeting = name ? `👋 Salom ${name}!` : `👋 Salom do'stim!`;
    const text = encodeURIComponent(
      `${greeting} Men Prepora platformasida IELTS va SAT ga tayyorlanyapman.\n\n` +
      `Bu yerda AI Tutor, Speaking suhbatdoshi, to'liq Mock testlar va video darsliklar bor ekan!\n\n` +
      `Quyidagi havola orqali ro'yxatdan o'tsangiz, sizga ham bepul kirish beriladi:`
    );
    const url = encodeURIComponent(referralUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  // Add friend by manual input
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const name = friendNameInput.trim() || `Do'st #${referralData.invitedCount + 1}`;
    StorageManager.addReferralFriend(name);
    setFriendNameInput('');
  };

  // Invite candidate from list
  const handleInviteCandidate = (candidate: RecommendUser) => {
    if (invitedCandidateIds.includes(candidate.id)) return;
    StorageManager.addReferralFriend(candidate.name);
    setInvitedCandidateIds((prev) => [...prev, candidate.id]);
    handleTelegramShare(candidate.name);
  };

  // Verify whether friend actually signed up
  const handleVerifyFriend = (friendId: string) => {
    setVerifyingId(friendId);
    setTimeout(() => {
      const res = StorageManager.verifyReferralFriend(friendId);
      setVerifyingId(null);
      if (res.justUnlockedPro) {
        setJustUnlocked(true);
      }
    }, 900);
  };

  const verifiedCount = referralData.verifiedCount || 0;
  const progressPercent = Math.min(100, Math.round((verifiedCount / 5) * 100));

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#0d0c22] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea4c89]/10 border border-[#ea4c89]/20 text-[#ea4c89] text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Prepora Virallik Dasturi • 5 Ta Do'st = Bepul Pro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0c22] tracking-tight leading-tight">
            5 ta Do'stingizni Taklif Qiling, <br />
            <span className="text-[#ea4c89]">1 Oylik Pro Obunani</span> Bepul Oling!
          </h1>

          <p className="text-xs sm:text-sm text-[#6e6d7a] max-w-xl mx-auto leading-relaxed">
            Har bir do'stingiz saytga kirib ro'yxatdan o'tgach, tizim avtomatik tekshiruvdan o'tkazadi. <strong>5 ta do'stingiz tasdiqlanganda</strong>, 50 000 so'mlik <strong>Prepora Pro</strong> obunasi 1 oyga bepul ochiladi!
          </p>
        </div>

        {/* Success Banner if Pro Unlocked */}
        {(justUnlocked || referralData.isProUnlocked) && (
          <div className="p-6 rounded-3xl bg-[#0d0c22] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/10 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ea4c89] text-white text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                  Muvaffaqiyat!
                </span>
                <h3 className="text-xl font-black">Prepora Pro Faollashtirildi!</h3>
                <p className="text-xs text-slate-300">
                  5 ta do'stingiz ro'yxatdan o'tdi va to'liq tasdiqlandi. Barcha testlar va video darsliklar 1 oy bepul ochildi!
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#ea4c89] hover:bg-[#e03d7b] text-white font-bold text-xs transition shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>Platformani Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Progress Tracker Card (5 Steps) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div>
              <span className="text-xs font-bold text-[#6e6d7a] uppercase tracking-wider block">
                Tasdiqlangan Natija
              </span>
              <h2 className="text-2xl font-black text-[#0d0c22] flex items-center gap-2 mt-0.5">
                <Users className="w-6 h-6 text-[#ea4c89]" />
                <span>{verifiedCount} / 5 Do'st Tasdiqlandi</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#ea4c89] font-mono">
                {progressPercent}%
              </span>
              <span className="text-xs text-[#6e6d7a] font-medium">bajarildi</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-black/10">
              <div 
                className="h-full bg-[#ea4c89] rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-[#6e6d7a] pt-1">
              <span className={verifiedCount >= 1 ? 'text-[#0d0c22] font-black' : ''}>1-do'st (+150 XP)</span>
              <span className={verifiedCount >= 2 ? 'text-[#0d0c22] font-black' : ''}>2-do'st (+300 XP)</span>
              <span className={verifiedCount >= 3 ? 'text-[#0d0c22] font-black' : ''}>3-do'st (+500 XP)</span>
              <span className={verifiedCount >= 4 ? 'text-[#0d0c22] font-black' : ''}>4-do'st (Aksessuar)</span>
              <span className={verifiedCount >= 5 ? 'text-[#ea4c89] font-black' : ''}>5-do'st (👑 Bepul Pro)</span>
            </div>
          </div>
        </div>

        {/* Share Link Box with explicit vercel URL */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0c22] text-white shadow-xl space-y-4 border border-black/10">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ea4c89] text-white text-[10px] font-black uppercase tracking-wider">
              Sizning Maxsus Taklif Havolangiz
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">
              Ushbu Havolani Do'stlaringizga Yuboring
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Do'stingiz ushbu havola orqali ro'yxatdan o'tganda sizga avtomatik tarzda hisoblanadi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 p-3 rounded-full bg-white/10 border border-white/20 flex items-center justify-between gap-2 overflow-hidden px-5">
              <span className="font-mono text-xs sm:text-sm text-amber-300 truncate font-semibold">
                {referralUrl}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-slate-300 font-bold shrink-0">
                {referralData.code}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3 px-5 rounded-full bg-[#ea4c89] hover:bg-[#e03d7b] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
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
              onClick={() => handleTelegramShare()}
              className="py-3 px-5 rounded-full bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegramda Yuborish</span>
            </button>
          </div>
        </div>

        {/* 1. Add Friend by Name */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#ea4c89]" />
            <h3 className="font-black text-lg text-[#0d0c22]">
              Do'stni Ismi Bilan Qo'shish & Chaqirish
            </h3>
          </div>
          <p className="text-xs text-[#6e6d7a]">
            Do'stingizning ismini kiriting va "Taklif Yuborish" tugmasini bosing:
          </p>

          <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={friendNameInput}
              onChange={(e) => setFriendNameInput(e.target.value)}
              placeholder="Do'stingizning ismi (masalan: Javohir Alimov)"
              className="flex-1 px-4 py-3 rounded-full bg-[#f8f7f4] border border-black/10 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-black/30"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#0d0c22] hover:bg-[#3d3d4e] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Do'stni Qo'shish</span>
            </button>
          </form>
        </div>

        {/* 2. Platformdagi boshqa o'quvchilar & Chaqirish ro'yxati */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#0d0c22]">
                Tavsiya Etilgan O'rtoqlar & Talabalar
              </h3>
              <p className="text-xs text-[#6e6d7a]">
                Bir marta bosish bilan ushbu o'quvchilarga ham taklif yuborishingiz mumkin:
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#ea4c89] bg-[#ea4c89]/10 px-2.5 py-1 rounded-full">
              Faol Tayyorgarlik
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {CANDIDATE_STUDENTS.map((stud) => {
              const isInvited = invitedCandidateIds.includes(stud.id);
              return (
                <div
                  key={stud.id}
                  className="p-3.5 rounded-2xl bg-[#f8f7f4] border border-black/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={stud.avatar}
                      alt={stud.name}
                      className="w-10 h-10 rounded-full object-cover border border-black/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#0d0c22]">{stud.name}</h4>
                      <span className="text-[10px] text-[#6e6d7a] block">
                        {stud.targetExam} • <strong className="text-emerald-600">{stud.targetScore}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInviteCandidate(stud)}
                    disabled={isInvited}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                      isInvited 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-[#0d0c22] hover:bg-[#3d3d4e] text-white shadow-2xs'
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Chaqirildi</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Chaqirish</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Do'stlar ro'yxati va "Tekshirish" mexanizmi */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#0d0c22]">
                Qo'shilgan Do'stlar & Tekshiruv Holati
              </h3>
              <p className="text-xs text-[#6e6d7a]">
                Sayt har bir do'stingizning ro'yxatdan o'tganligini tekshiradi va tasdiqlaydi:
              </p>
            </div>
            <span className="text-xs font-bold text-[#0d0c22]">
              Jami: {referralData.invitedFriends.length} ta
            </span>
          </div>

          {referralData.invitedFriends.length === 0 ? (
            <div className="text-center py-10 bg-[#f8f7f4] rounded-2xl border border-dashed border-black/10">
              <Users className="w-8 h-8 text-[#6e6d7a] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#0d0c22]">Hozircha do'stlar qo'shilmagan</p>
              <p className="text-[11px] text-[#6e6d7a] mt-1">Yuqoridagi maydonga do'stingiz ismini kiriting yoki taklif yuboring.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {referralData.invitedFriends.map((friend) => {
                const isVerified = friend.status === 'verified';
                const isChecking = verifyingId === friend.id;

                return (
                  <div
                    key={friend.id}
                    className="p-3.5 rounded-2xl bg-[#f8f7f4] border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isVerified ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#0d0c22] block">{friend.name}</span>
                        <span className="text-[10px] text-[#6e6d7a]">
                          Sana: {friend.date} • {friend.joinedExam || 'IELTS Mock'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isVerified ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tasdiqlandi (Ro'yxatdan o'tdi)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyFriend(friend.id)}
                          disabled={isChecking}
                          className="px-3.5 py-1.5 rounded-full bg-[#0d0c22] hover:bg-[#3d3d4e] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                          <span>{isChecking ? 'Tekshirilmoqda...' : 'Tekshirish'}</span>
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