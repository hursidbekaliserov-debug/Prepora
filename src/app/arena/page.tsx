'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Zap, 
  RotateCw, 
  Flame, 
  Award, 
  CheckCircle2, 
  Clock, 
  Star,
  Target,
  Crown,
  Play,
  RotateCcw,
  Gift
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface BlitzQuestion {
  question: string;
  options: string[];
  correct: number;
  type: 'vocab' | 'math';
}

const BLITZ_QUESTIONS: BlitzQuestion[] = [
  { question: "Sinonim: 'Meticulous' so'zining ma'nosi?", options: ["Juda ehtiyotkor va aniq", "Dangasa", "Qo'pol", "Tezkor"], correct: 0, type: 'vocab' },
  { question: "Hisoblang: 3x - 7 = 14 bo'lsa, x = ?", options: ["5", "7", "9", "6"], correct: 1, type: 'math' },
  { question: "Sinonim: 'Ephemeral' nimani anglatadi?", options: ["Abadiy", "Qisqa muddatli", "Og'ir", "Baland"], correct: 1, type: 'vocab' },
  { question: "Hisoblang: 2^5 = ?", options: ["16", "24", "32", "64"], correct: 2, type: 'math' },
  { question: "Sinonim: 'Pragmatic' degani nima?", options: ["Amaliy va real", "Xayolparast", "Jahldor", "Bebaho"], correct: 0, type: 'vocab' },
  { question: "Hisoblang: 15% of 80 = ?", options: ["10", "12", "14", "16"], correct: 1, type: 'math' },
  { question: "Sinonim: 'Ambiguous' nimani bildiradi?", options: ["Aniq", "Noaniq / Ikki ma'noli", "To'g'ri", "Xira"], correct: 1, type: 'vocab' },
  { question: "Hisoblang: x^2 = 81 bo'lsa, musbat x = ?", options: ["7", "8", "9", "18"], correct: 2, type: 'math' },
  { question: "Sinonim: 'Eloquent' so'zi nimani anglatadi?", options: ["Fasahatli / Ravon so'zlovchi", "Jimjit", "Qo'rqoq", "Sekin"], correct: 0, type: 'vocab' },
  { question: "Hisoblang: Agar uchburchak burchaklari 50 va 60 bo'lsa, uchinchi burchak?", options: ["70", "80", "90", "60"], correct: 0, type: 'math' },
];

const SPIN_PRIZES = [
  { label: '+150 XP Tajriba', color: 'bg-indigo-600', text: 'text-white' },
  { label: '⚡ 1 Bepul AI Savoli', color: 'bg-emerald-500', text: 'text-white' },
  { label: '💎 Super Talaba', color: 'bg-cyan-500', text: 'text-white' },
  { label: '+300 XP Bonus', color: 'bg-amber-500', text: 'text-white' },
  { label: '🏆 Oltin Sertifikat', color: 'bg-purple-600', text: 'text-white' },
  { label: '🎯 Grammar Ninja', color: 'bg-rose-500', text: 'text-white' },
  { label: '+100 XP Tajriba', color: 'bg-blue-600', text: 'text-white' },
  { label: '🔥 Olovli Status', color: 'bg-orange-500', text: 'text-white' },
];

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState<'spin' | 'blitz' | 'leaderboard'>('spin');

  // Spin Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegree, setSpinDegree] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  // Blitz Duel State
  const [blitzActive, setBlitzActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzCombo, setBlitzCombo] = useState(1);
  const [blitzFinished, setBlitzFinished] = useState(false);

  useEffect(() => {
    const lastSpin = localStorage.getItem('prepora_last_spin_date');
    const today = new Date().toISOString().split('T')[0];
    if (lastSpin === today) {
      setHasSpunToday(true);
    }
  }, []);

  // Blitz Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (blitzActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (blitzActive && timeLeft === 0) {
      setBlitzActive(false);
      setBlitzFinished(true);
    }
    return () => clearInterval(timer);
  }, [blitzActive, timeLeft]);

  // Handle Spin Wheel
  const handleSpinWheel = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Randomize degrees (at least 5 full turns + random slice)
    const prizeIndex = Math.floor(Math.random() * SPIN_PRIZES.length);
    const extraTurns = 360 * 5;
    const sliceDegree = 360 / SPIN_PRIZES.length;
    const targetDegree = extraTurns + (prizeIndex * sliceDegree) + (sliceDegree / 2);

    setSpinDegree(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = SPIN_PRIZES[prizeIndex].label;
      setWonPrize(prize);
      setHasSpunToday(true);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('prepora_last_spin_date', today);
    }, 4000);
  };

  // Start Blitz Game
  const startBlitz = () => {
    setBlitzActive(true);
    setBlitzFinished(false);
    setTimeLeft(60);
    setBlitzScore(0);
    setBlitzCombo(1);
    setCurrentQIndex(0);
  };

  // Handle Blitz Answer
  const handleBlitzAnswer = (selectedIdx: number) => {
    const q = BLITZ_QUESTIONS[currentQIndex];
    if (selectedIdx === q.correct) {
      setBlitzScore((s) => s + (10 * blitzCombo));
      setBlitzCombo((c) => Math.min(c + 1, 4));
    } else {
      setBlitzCombo(1);
    }

    if (currentQIndex < BLITZ_QUESTIONS.length - 1) {
      setCurrentQIndex((idx) => idx + 1);
    } else {
      // Loop or finish
      setCurrentQIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Prepora Arena • O'yinlar & Mukofotlar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight">
            Zerikishni Unuting, <br />
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Musobaqalashib O'rganing!
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Har kuni kirib Omadli Barabanni aylantiring, 60 soniyalik tezkor jangda qatnashing va O'zbekiston bo'yicha Top talabalar reytingida yetakchi bo'ling!
          </p>

          {/* Interactive Mode Tabs */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex rounded-2xl bg-white border border-slate-200 p-1.5 shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('spin')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeTab === 'spin'
                    ? 'bg-amber-400 text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                <Gift className="w-4 h-4 text-blue-950" />
                <span>Omadli Baraban 🎡</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('blitz')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeTab === 'blitz'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>60-Soniya Blitz Jangi ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeTab === 'leaderboard'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Reyting Jadvali 🏆</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. LUCKY SPIN WHEEL */}
        {activeTab === 'spin' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6 max-w-2xl mx-auto">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                Kunlik Omadli Aylana
              </span>
              <h2 className="text-2xl font-black text-blue-950">
                Barabanni Aylantiring va Yuting!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Har bir foydalanuvchiga har kuni 1 marta bepul aylantirish imkoniyati beriladi.
              </p>
            </div>

            {/* Visual Wheel Display */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
              {/* Pointer at the top */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-500 filter drop-shadow-md" />

              {/* Rotating Circular Wheel */}
              <div 
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden relative transition-all ease-out"
                style={{
                  transform: `rotate(${spinDegree}deg)`,
                  transitionDuration: isSpinning ? '4000ms' : '0ms',
                }}
              >
                {SPIN_PRIZES.map((prize, idx) => {
                  const angle = (360 / SPIN_PRIZES.length) * idx;
                  return (
                    <div
                      key={idx}
                      className={`absolute w-1/2 h-full top-0 right-0 origin-left flex items-center justify-center font-black text-[10px] ${prize.color} ${prize.text} border-b border-white/20`}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
                      }}
                    >
                      <span className="transform rotate-90 translate-x-12 select-none">
                        {prize.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center Wheel Hub */}
              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={isSpinning || hasSpunToday}
                className="absolute z-10 w-16 h-16 rounded-full bg-blue-950 text-amber-400 font-black text-xs shadow-lg border-2 border-amber-400 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition disabled:opacity-80"
              >
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>{isSpinning ? '...' : 'SPIN'}</span>
              </button>
            </div>

            {/* Result banner */}
            {wonPrize && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 animate-bounce">
                <span className="text-xs font-bold block">🎉 Tabriklaymiz! Siz yutib oldingiz:</span>
                <span className="text-xl font-black text-emerald-700">{wonPrize}</span>
              </div>
            )}

            {hasSpunToday && !isSpinning && (
              <p className="text-xs text-slate-500 font-medium">
                ✅ Bugungi urinishingizdan foydalandingiz. Ertaga yangi sovrinlar bilan kutamiz!
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={isSpinning || hasSpunToday}
                className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{hasSpunToday ? 'Ertaga Qayta Kiring' : 'Omadingizni Sinab Ko\'ring!'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. 60-SECOND SPEED BLITZ GAME */}
        {activeTab === 'blitz' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
            {!blitzActive && !blitzFinished && (
              <div className="space-y-4 py-8">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-md">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-blue-950">60-Soniya Aql Jangi</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  60 soniya ichida imkon qadar ko'proq ingliz tili so'zlari va matematika misollarini to'g'ri toping! Har bir ketma-ket to'g'ri javob uchun Combo x2, x3 ochko beriladi.
                </p>

                <button
                  type="button"
                  onClick={startBlitz}
                  className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 mx-auto hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Jangni Boshlash (Start Blitz)</span>
                </button>
              </div>
            )}

            {blitzActive && (
              <div className="space-y-6 text-left">
                {/* Score & Timer Dashboard */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="font-mono text-xl font-black">{timeLeft}s</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-blue-950 font-black text-xs">
                      Combo x{blitzCombo}
                    </span>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      {blitzScore} Ball
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Savol #{currentQIndex + 1} • {BLITZ_QUESTIONS[currentQIndex].type.toUpperCase()}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-blue-950">
                    {BLITZ_QUESTIONS[currentQIndex].question}
                  </h4>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BLITZ_QUESTIONS[currentQIndex].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleBlitzAnswer(oIdx)}
                      className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50 font-bold text-xs sm:text-sm text-blue-950 text-left transition active:scale-95 shadow-2xs"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {blitzFinished && (
              <div className="space-y-4 py-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-blue-950">Vaqt Tugadi!</h3>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 max-w-xs mx-auto">
                  <span className="text-xs text-indigo-700 block font-bold">To'plangan Ball:</span>
                  <span className="text-4xl font-black text-indigo-950">{blitzScore}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Ajoyib natija! Natijangiz umumiy o'quvchilar reytingiga qo'shildi.
                </p>

                <button
                  type="button"
                  onClick={startBlitz}
                  className="px-6 py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qayta O'ynash</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. LIVE LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  O'zbekiston Bo'yicha Top O'quvchilar
                </h3>
                <p className="text-xs text-slate-500">
                  Eng yuqori ball to'plagan va faol talabalar ro'yxati.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Jonli Yangilanish
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { rank: 1, name: 'Malika Karimova', badge: '👑', score: '3,840 XP', band: 'IELTS 8.5', avatar: 'bg-amber-400' },
                { rank: 2, name: 'Javohir Usmonov', badge: '💎', score: '3,420 XP', band: 'SAT 1540', avatar: 'bg-indigo-600' },
                { rank: 3, name: 'Shaxnoza Aliyeva', badge: '⚡', score: '3,110 XP', band: 'IELTS 8.0', avatar: 'bg-emerald-500' },
                { rank: 4, name: 'Bekzod Rahimov', badge: '🚀', score: '2,890 XP', band: 'SAT 1490', avatar: 'bg-rose-500' },
                { rank: 5, name: 'Siz (Joriy Talaba)', badge: '⭐', score: '2,650 XP', band: 'Target 8.0', avatar: 'bg-blue-950', isCurrent: true },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border transition ${
                    user.isCurrent
                      ? 'bg-blue-50/80 border-blue-950/30 ring-1 ring-blue-950/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-sm text-slate-700">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                    </span>
                    <div className={`w-8 h-8 rounded-full ${user.avatar} text-white font-black text-xs flex items-center justify-center`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-extrabold text-blue-950">
                        <span>{user.name}</span>
                        <span className="text-sm">{user.badge}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{user.band}</span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-blue-950">{user.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

