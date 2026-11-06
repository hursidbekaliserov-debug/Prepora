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
  Gift,
  Swords,
  Radio,
  User,
  ShieldAlert
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface Opponent {
  name: string;
  city: string;
  avatar: string;
  exam: string;
  rating: number;
}

const PVP_OPPONENTS: Opponent[] = [
  { name: 'Azizbek Karimov', city: 'Toshkent', avatar: '👨‍🎓', exam: 'IELTS 7.5', rating: 1420 },
  { name: 'Madina Olimova', city: 'Samarqand', avatar: '👩‍🎓', exam: 'SAT 1490', rating: 1510 },
  { name: 'Shahzod Bekmurodov', city: 'Buxoro', avatar: '🧑‍💻', exam: 'IELTS 8.0', rating: 1640 },
  { name: 'Diyora Rahimova', city: 'Andijon', avatar: '👩‍💼', exam: 'SAT Math 790', rating: 1480 },
  { name: 'Islom Yusupov', city: 'Namangan', avatar: '👨‍💼', exam: 'IELTS 7.0', rating: 1390 },
];

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
  { label: '+150 XP', fullLabel: "+150 XP Tajriba Balli", icon: '⚡', color: '#4f46e5' },
  { label: '1 Test', fullLabel: "1 Bepul AI Savoli", icon: '🤖', color: '#059669' },
  { label: 'VIP', fullLabel: "Super VIP Talaba Mavqei", icon: '💎', color: '#0891b2' },
  { label: '+300 XP', fullLabel: "+300 XP Katta Bonus", icon: '✨', color: '#d97706' },
  { label: 'Oltin', fullLabel: "Oltin Sertifikat Mavqei", icon: '🏆', color: '#7c3aed' },
  { label: 'Ninja', fullLabel: "Grammar Ninja Unvoni", icon: '🎯', color: '#e11d48' },
  { label: '+100 XP', fullLabel: "+100 XP Kunlik Tajriba", icon: '⭐', color: '#2563eb' },
  { label: 'Olov', fullLabel: "Olovli O'rganish Mavqei", icon: '🔥', color: '#ea580c' },
];

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState<'spin' | 'blitz' | 'pvp' | 'leaderboard'>('spin');

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

  // 1v1 PvP Duel State
  const [pvpState, setPvpState] = useState<'idle' | 'searching' | 'battling' | 'finished'>('idle');
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [pvpTimeLeft, setPvpTimeLeft] = useState(60);
  const [userPvpScore, setUserPvpScore] = useState(0);
  const [opponentPvpScore, setOpponentPvpScore] = useState(0);
  const [pvpQIndex, setPvpQIndex] = useState(0);
  const [pvpUserCombo, setPvpUserCombo] = useState(1);

  // 1v1 PvP Timer & Opponent Live Simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let aiSim: NodeJS.Timeout;

    if (pvpState === 'battling' && pvpTimeLeft > 0) {
      timer = setInterval(() => {
        setPvpTimeLeft((t) => t - 1);
      }, 1000);

      // Opponent simulates real-time competitive answers
      aiSim = setInterval(() => {
        setOpponentPvpScore((prev) => {
          const rand = Math.random();
          if (rand > 0.25) {
            return prev + Math.floor(10 + Math.random() * 15);
          }
          return prev;
        });
      }, 3400);
    } else if (pvpState === 'battling' && pvpTimeLeft === 0) {
      setPvpState('finished');
      if (userPvpScore > opponentPvpScore) {
        try {
          const profile = StorageManager.getProfile();
          profile.totalStudyMinutes = (profile.totalStudyMinutes || 0) + 15;
          profile.xp = (profile.xp || 0) + 200;
          StorageManager.saveProfile(profile);
          window.dispatchEvent(new Event('prepora_profile_updated'));
        } catch {
          // ignore
        }
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (aiSim) clearInterval(aiSim);
    };
  }, [pvpState, pvpTimeLeft, userPvpScore, opponentPvpScore]);

  const startPvpSearch = () => {
    setPvpState('searching');
    setOpponent(null);
    setUserPvpScore(0);
    setOpponentPvpScore(0);
    setPvpTimeLeft(60);
    setPvpUserCombo(1);
    setPvpQIndex(0);

    setTimeout(() => {
      const picked = PVP_OPPONENTS[Math.floor(Math.random() * PVP_OPPONENTS.length)];
      setOpponent(picked);

      setTimeout(() => {
        setPvpState('battling');
      }, 1800);
    }, 2400);
  };

  const handlePvpAnswer = (selectedIdx: number) => {
    const q = BLITZ_QUESTIONS[pvpQIndex];
    if (selectedIdx === q.correct) {
      setUserPvpScore((s) => s + (15 * pvpUserCombo));
      setPvpUserCombo((c) => Math.min(c + 1, 4));
    } else {
      setPvpUserCombo(1);
    }

    if (pvpQIndex < BLITZ_QUESTIONS.length - 1) {
      setPvpQIndex((idx) => idx + 1);
    } else {
      setPvpQIndex(0);
    }
  };

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

    // Randomize degrees (6 full turns + landing slice at top pointer)
    const prizeIndex = Math.floor(Math.random() * SPIN_PRIZES.length);
    const extraTurns = 360 * 6;
    const sliceDegree = 360 / SPIN_PRIZES.length;
    const targetDegree = extraTurns + ((SPIN_PRIZES.length - prizeIndex) % SPIN_PRIZES.length) * sliceDegree;

    setSpinDegree(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = SPIN_PRIZES[prizeIndex].fullLabel;
      setWonPrize(prize);
      setHasSpunToday(true);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('prepora_last_spin_date', today);

      if (prize.includes('+150 XP')) StorageManager.addXP(150);
      else if (prize.includes('+300 XP')) StorageManager.addXP(300);
      else if (prize.includes('+100 XP')) StorageManager.addXP(100);
      window.dispatchEvent(new Event('prepora_profile_updated'));
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
                <span>60-Soniya Blitz ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pvp')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeTab === 'pvp'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
                }`}
              >
                <Swords className="w-4 h-4 text-rose-400" />
                <span>1v1 PvP Duel ⚔️</span>
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
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
              {/* Pointer at the top */}
              <div className="absolute -top-3.5 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-500 filter drop-shadow-lg" />

              {/* Rotating Circular Wheel SVG */}
              <div 
                className="w-full h-full relative transition-all ease-out"
                style={{
                  transform: `rotate(${spinDegree}deg)`,
                  transitionDuration: isSpinning ? '4000ms' : '0ms',
                }}
              >
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl select-none">
                  {/* Outer Golden Rim */}
                  <circle cx="150" cy="150" r="148" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />

                  {/* Slices */}
                  {SPIN_PRIZES.map((prize, idx) => {
                    const midAngle = idx * 45 - 90;
                    const startAngle = (midAngle - 22.5) * (Math.PI / 180);
                    const endAngle = (midAngle + 22.5) * (Math.PI / 180);

                    const x1 = 150 + 142 * Math.cos(startAngle);
                    const y1 = 150 + 142 * Math.sin(startAngle);
                    const x2 = 150 + 142 * Math.cos(endAngle);
                    const y2 = 150 + 142 * Math.sin(endAngle);

                    const pathData = `M 150 150 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 142 142 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

                    return (
                      <g key={idx}>
                        <path
                          d={pathData}
                          fill={prize.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeOpacity="0.3"
                        />
                        <g transform={`rotate(${midAngle}, 150, 150)`}>
                          {/* Icon in inner radius zone */}
                          <text
                            x="208"
                            y="154"
                            textAnchor="middle"
                            fontSize="13"
                            className="select-none"
                          >
                            {prize.icon}
                          </text>
                          {/* Label Text placed comfortably in the wide outer sector (no overflow) */}
                          <text
                            x="250"
                            y="153.5"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="900"
                            letterSpacing="0.2px"
                            className="select-none font-sans"
                          >
                            {prize.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Decorative golden rim dots */}
                  {Array.from({ length: 24 }).map((_, dotIdx) => {
                    const dotAngle = (360 / 24) * dotIdx * (Math.PI / 180);
                    const dx = 150 + 145 * Math.cos(dotAngle);
                    const dy = 150 + 145 * Math.sin(dotAngle);
                    return (
                      <circle key={dotIdx} cx={dx} cy={dy} r="2" fill="#ffffff" opacity="0.9" />
                    );
                  })}
                </svg>
              </div>

              {/* Center Wheel Hub */}
              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={isSpinning || hasSpunToday}
                className="absolute z-10 w-18 h-18 rounded-full bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 text-amber-300 font-black text-xs shadow-2xl border-4 border-amber-400 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-75 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mb-0.5 text-amber-400 fill-amber-400" />
                <span className="text-[11px] tracking-wider font-black">{isSpinning ? '...' : 'SPIN'}</span>
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

        {/* 2.5 JONLI 1V1 PVP DUEL */}
        {activeTab === 'pvp' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
            {pvpState === 'idle' && (
              <div className="space-y-4 py-8">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-md">
                  <Swords className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-blue-950">Jonli 1v1 Intellektual Duel</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  O'zbekiston bo'yicha boshqa onlayn tayyorlanayotgan talabalar bilan real vaqtda 60 soniyada bilim sinashing!
                  Kim ko'p va tezroq topsa, g'olib bo'ladi va <strong>+300 XP</strong> hamda <strong>Arena Kubogini</strong> qo'lga kiritadi.
                </p>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
                    ⚡ 60 Soniya
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200">
                    🧠 IELTS & SAT Drills
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                    🏆 +300 XP G'alabaga
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startPvpSearch}
                  className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-xl transition flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95 cursor-pointer mt-4"
                >
                  <Swords className="w-5 h-5" />
                  <span>Raqib Qidirish va Jangni Boshlash</span>
                </button>
              </div>
            )}

            {pvpState === 'searching' && (
              <div className="space-y-6 py-12 animate-fade-in">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping opacity-60" />
                  <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-400 flex items-center justify-center text-rose-600 shadow-lg">
                    <Radio className="w-8 h-8 animate-spin" />
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-black text-blue-950">
                    {!opponent ? "Onlayn Raqib Qidirilmoqda..." : "Raqib Topildi!"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {!opponent ? "O'zbekiston bo'yicha mos darajadagi talaba tanlanmoqda..." : "Jang boshlanmoqda..."}
                  </p>
                </div>

                {opponent && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white max-w-sm mx-auto shadow-xl flex items-center justify-between border border-rose-500/40 animate-bounce">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{opponent.avatar}</div>
                      <div className="text-left">
                        <span className="font-bold text-xs text-white block">{opponent.name}</span>
                        <span className="text-[10px] text-slate-400 block">{opponent.city} • {opponent.exam}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black font-mono">
                      {opponent.rating} Elo
                    </span>
                  </div>
                )}
              </div>
            )}

            {pvpState === 'battling' && opponent && (
              <div className="space-y-6 text-left">
                {/* Real-time Matchup Header: Siz vs Raqib */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-blue-800/40">
                  <div className="flex items-center justify-between">
                    {/* User side */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                        Siz
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-slate-200">Siz</span>
                        <span className="text-lg font-black font-mono text-emerald-400">{userPvpScore} XP</span>
                      </div>
                    </div>

                    {/* Timer & VS Badge in Center */}
                    <div className="flex flex-col items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                        VS
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xl font-black text-amber-400">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>{pvpTimeLeft}s</span>
                      </div>
                    </div>

                    {/* Opponent side */}
                    <div className="flex items-center gap-2.5 text-right">
                      <div>
                        <span className="text-xs font-bold block text-slate-200 truncate max-w-[90px]">{opponent.name}</span>
                        <span className="text-lg font-black font-mono text-rose-400">{opponentPvpScore} XP</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-2xl shadow-sm">
                        {opponent.avatar}
                      </div>
                    </div>
                  </div>

                  {/* Combo pill */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold">
                      Combo bonus: x{pvpUserCombo} (+{15 * pvpUserCombo} ball)
                    </span>
                    <span className="text-slate-400">
                      Raqib: {opponent.city}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Savol #{pvpQIndex + 1} • {BLITZ_QUESTIONS[pvpQIndex].type.toUpperCase()}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-blue-950">
                    {BLITZ_QUESTIONS[pvpQIndex].question}
                  </h4>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BLITZ_QUESTIONS[pvpQIndex].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handlePvpAnswer(oIdx)}
                      className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm text-blue-950 text-left transition active:scale-95 shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pvpState === 'finished' && opponent && (
              <div className="space-y-4 py-6 animate-fade-in text-center">
                {userPvpScore > opponentPvpScore ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-md border-2 border-amber-300 animate-bounce">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-emerald-600">G'ALABA (VICTORY)! 🏆</h3>
                    <p className="text-xs text-slate-600">
                      Siz <strong>{opponent.name}</strong> ustidan g'alaba qozondingiz va <strong>+300 XP</strong> qo'lga kiritdingiz!
                    </p>
                  </div>
                ) : userPvpScore < opponentPvpScore ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-md">
                      <Swords className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-rose-600">Mag'lubiyat ⚔️</h3>
                    <p className="text-xs text-slate-600">
                      Raqibingiz <strong>{opponent.name}</strong> biroz tezroq harakat qildi. Ishtirok uchun +60 XP berildi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto shadow-md">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-blue-950">DURANG! 🤝</h3>
                    <p className="text-xs text-slate-600">
                      Ikkala o'quvchi ham teng ball to'pladi!
                    </p>
                  </div>
                )}

                {/* Final Scoreboard Comparison */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">Siz</span>
                    <span className="text-2xl font-black text-blue-950 font-mono">{userPvpScore}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400">VS</span>
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">{opponent.name}</span>
                    <span className="text-2xl font-black text-rose-600 font-mono">{opponentPvpScore}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startPvpSearch}
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yangi Raqib Bilan Bellashish</span>
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

