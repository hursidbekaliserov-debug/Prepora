'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ExamEngine from '@/components/ExamEngine';
import PremiumModal from '@/components/PremiumModal';
import { generateDynamicSatMock } from '@/data/satQuestions';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import { 
  Award, 
  BookOpen, 
  Calculator, 
  Clock, 
  Coffee, 
  CheckCircle2, 
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Crown
} from 'lucide-react';
import { Question } from '@/types';

type SatMockStage = 'intro' | 'rw_m1' | 'rw_m2' | 'break' | 'math_m1' | 'math_m2' | 'finished';

export default function SatMockExamPage() {
  const [stage, setStage] = useState<SatMockStage>('intro');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Dynamic modules that randomize / shuffle every time
  const [mockSet, setMockSet] = useState<{
    rwModule1: Question[];
    rwModule2: Question[];
    mathModule1: Question[];
    mathModule2: Question[];
  } | null>(null);

  useEffect(() => {
    // Generate fresh dynamic randomized mock test questions
    setMockSet(generateDynamicSatMock());
    setSubStatus(StorageManager.getSubscriptionStatus());

    const updateSub = () => {
      setSubStatus(StorageManager.getSubscriptionStatus());
    };
    window.addEventListener('prepora_subscription_updated', updateSub);
    return () => window.removeEventListener('prepora_subscription_updated', updateSub);
  }, []);

  const handleStartExam = () => {
    // Check if free user has reached limit
    if (!subStatus?.isPremium && typeof subStatus?.dailyTestRemaining === 'number' && subStatus.dailyTestRemaining <= 0) {
      setIsPremiumModalOpen(true);
      return;
    }
    // Generate fresh random questions every single test session
    setMockSet(generateDynamicSatMock());
    setStage('rw_m1');
  };

  const currentMock = mockSet || generateDynamicSatMock();

  // 1. Reading & Writing Module 1
  if (stage === 'rw_m1') {
    return (
      <ExamEngine
        title="Digital SAT Full Mock — Section 1: Reading & Writing (Module 1)"
        exam="SAT"
        sectionName="reading_writing"
        questions={currentMock.rwModule1}
        timeLimitMinutes={32}
        isMockExam={true}
        onFinish={() => setStage('rw_m2')}
      />
    );
  }

  // 2. Reading & Writing Module 2
  if (stage === 'rw_m2') {
    return (
      <ExamEngine
        title="Digital SAT Full Mock — Section 1: Reading & Writing (Module 2)"
        exam="SAT"
        sectionName="reading_writing"
        questions={currentMock.rwModule2}
        timeLimitMinutes={32}
        isMockExam={true}
        onFinish={() => setStage('break')}
      />
    );
  }

  // 3. Scheduled Break (10 minutes)
  if (stage === 'break') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <Coffee className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Rejali Imtihon Tanaffusi
            </span>
            <h2 className="text-2xl font-bold text-blue-950">Reading & Writing Bo'limi Tugadi!</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Rasmiy Digital SAT testida Math bo'limi boshlanishidan oldin 10 daqiqalik tanaffus beriladi. 
              Ko'zingizni dam oldiring va suv iching.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xl font-bold text-blue-950">
            Tanaffus Vaqti: 10:00
          </div>

          <button
            onClick={() => setStage('math_m1')}
            className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            Matematikani Boshlash: Math Module 1 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Math Module 1 (Almashgan yangi savollar)
  if (stage === 'math_m1') {
    return (
      <ExamEngine
        title="Digital SAT Full Mock — Section 2: Math (Module 1 - Yangilangan)"
        exam="SAT"
        sectionName="math"
        questions={currentMock.mathModule1}
        timeLimitMinutes={35}
        isMockExam={true}
        onFinish={() => setStage('math_m2')}
      />
    );
  }

  // 5. Math Module 2 (Almashgan yangi savollar)
  if (stage === 'math_m2') {
    return (
      <ExamEngine
        title="Digital SAT Full Mock — Section 2: Math (Module 2 - Yangilangan)"
        exam="SAT"
        sectionName="math"
        questions={currentMock.mathModule2}
        timeLimitMinutes={35}
        isMockExam={true}
        onFinish={() => setStage('finished')}
      />
    );
  }

  // Completed final screen
  if (stage === 'finished') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Imtihon Muvaffaqiyatli Yakunlandi
            </span>
            <h2 className="text-2xl font-bold text-blue-950">To'liq Digital SAT Topshirildi!</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Barcha 4 ta modul (Reading & Writing 1, 2 hamda Math 1, 2) yakunlandi. Natijalaringiz tahlili va ball prognozi Xatolar Bankida saqlandi.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setMockSet(generateDynamicSatMock());
                setStage('intro');
              }}
              className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Yangi Tasodifiy Variant Bilan Qayta Boshlash
            </button>

            <a
              href="/history"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition block text-center"
            >
              Natijalar va Progress Tarixi
            </a>
          </div>
        </div>
      </div>
    );
  }

  // INTRO SCREEN
  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Digital SAT Haqiqiy 98-Savollik Mock Imtihon</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Har Safar Yangi va Almashuvchi Savollar
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Haqiqiy Bluebook formati: Reading & Writing (54 savol) hamda Math (44 savol). 
            Algoritm har safar testni boshlaganingizda savollar to'plamini aralashtirib, yangi misollarni taqdim etadi.
          </p>
        </div>

        {/* Status Callout */}
        {!subStatus?.isPremium && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-600 shrink-0" />
              <span>
                <strong>Standart Bepul Tarif:</strong> Kuniga 5 ta test savoliga ruxsat beriladi. To'liq 98 talik imtihonni bezlimit ishlash uchun Premiumga o'ting!
              </span>
            </div>
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shrink-0"
            >
              Tariflar (50 000)
            </button>
          </div>
        )}

        {/* 4 Modules Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">Section 1</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-blue-950">Reading and Writing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Craft and Structure, Information and Ideas, Standard English</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold">Module 1</span>
                <span className="font-bold text-blue-950">27 Savol • 32 daq</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold">Module 2</span>
                <span className="font-bold text-blue-950">27 Savol • 32 daq</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">Section 2</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-blue-950">Math (Har safar yangi)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Algebra, Advanced Math, Problem Solving, Geometry & Trigonometry</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold">Module 1</span>
                <span className="font-bold text-blue-950">22 Savol • 35 daq</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 block font-bold">Module 2</span>
                <span className="font-bold text-blue-950">22 Savol • 35 daq</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-blue-950">Haqiqiy Bluebook Standarti</h4>
            <p className="text-xs text-slate-500">
              Jami 98 ta savol • 134 daqiqa vaqt • Rasmiy 400-1600 ball prognozi
            </p>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Imtihonni Boshlash (Yangi Variant)</span>
          </button>
        </div>
      </main>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        reason="test_limit"
      />
    </div>
  );
}
