'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Target, 
  Calendar, 
  Clock, 
  Award,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { ExamType, IELTSType } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form states
  const [targetExam, setTargetExam] = useState<ExamType>('BOTH');
  const [ieltsType, setIeltsType] = useState<IELTSType>('ACADEMIC');
  const [currentIelts, setCurrentIelts] = useState<number>(6.5);
  const [targetIelts, setTargetIelts] = useState<number>(8.0);
  const [currentSat, setCurrentSat] = useState<number>(1280);
  const [targetSat, setTargetSat] = useState<number>(1520);
  const [examDate, setExamDate] = useState('2026-12-15');
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [weakTopics, setWeakTopics] = useState<string[]>([
    'IELTS Listening Part 4',
    'SAT Advanced Math',
  ]);

  const allTopics = [
    'IELTS Listening Part 3 & 4',
    'IELTS Academic Reading Headings',
    'IELTS Writing Task 2 Cohesion',
    'IELTS Speaking Fluency & Lexicon',
    'SAT Standard English Conventions',
    'SAT Words in Context',
    'SAT Advanced Math (Quadratics)',
    'SAT Geometry & Trigonometry',
    'SAT Problem-Solving & Ratios',
  ];

  const toggleTopic = (t: string) => {
    if (weakTopics.includes(t)) {
      setWeakTopics(weakTopics.filter((item) => item !== t));
    } else {
      setWeakTopics([...weakTopics, t]);
    }
  };

  const handleFinish = async () => {
    const profile = StorageManager.getProfile();
    profile.targetExam = targetExam;
    profile.ieltsType = ieltsType;
    profile.currentIeltsBand = currentIelts;
    profile.targetIeltsBand = targetIelts;
    profile.currentSatScore = currentSat;
    profile.targetSatScore = targetSat;
    profile.examDate = examDate;
    profile.dailyStudyMinutes = dailyMinutes;
    profile.weakTopics = weakTopics;

    await StorageManager.saveProfile(profile);

    // Generate personalized study tasks based on weak skills
    const tasks = [
      {
        id: 'task-init-1',
        title: `Target Practice: ${weakTopics[0] || 'Core Diagnostic'}`,
        exam: targetExam === 'SAT' ? 'SAT' : 'IELTS',
        skill: 'Diagnostic',
        estimatedMinutes: 25,
        completed: false,
        dueDate: 'Today',
        link: targetExam === 'SAT' ? '/sat/reading-writing' : '/ielts/reading',
      },
      {
        id: 'task-init-2',
        title: 'Complete First Timed Mini Mock Module',
        exam: targetExam === 'SAT' ? 'SAT' : 'IELTS',
        skill: 'Exam Engine',
        estimatedMinutes: 35,
        completed: false,
        dueDate: 'Tomorrow',
        link: targetExam === 'SAT' ? '/sat/mock-exam' : '/ielts/mock-exam',
      },
      {
        id: 'task-init-3',
        title: 'Prepora AI Tutor Diagnostic Consultation',
        exam: targetExam === 'SAT' ? 'SAT' : 'IELTS',
        skill: 'Tutoring',
        estimatedMinutes: 15,
        completed: false,
        dueDate: 'In 2 days',
        link: '/tutor',
      },
    ];
    StorageManager.saveTasks(tasks as any);

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Step progress */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {step}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bosqich {step} / 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-blue-950' : s < step ? 'w-4 bg-blue-800' : 'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Exam Choice */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black text-blue-950 mb-2">Qaysi Imtihonga Tayyorlanyapsiz?</h1>
            <p className="text-xs text-slate-500 mb-6">
              Prepora sizning tanlovingizga qarab shaxsiy topshiriqlar va AI tavsiyalarini tayyorlaydi.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { id: 'IELTS', title: 'Faqat IELTS', desc: 'Listening, Reading, Writing va Speaking bo\'yicha to\'liq tayyorgarlik' },
                { id: 'SAT', title: 'Faqat Digital SAT', desc: 'Reading & Writing va Math modullari bo\'yicha 98 savollik testlar' },
                { id: 'BOTH', title: 'IELTS & Digital SAT (Ikkisi ham)', desc: 'Ikkala xalqaro imtihon uchun keng qamrovli tayyorgarlik' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTargetExam(opt.id as ExamType)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    targetExam === opt.id
                      ? 'bg-blue-50 border-blue-900 text-blue-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-bold">{opt.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  {targetExam === opt.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-950 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* IELTS Type if IELTS selected */}
            {(targetExam === 'IELTS' || targetExam === 'BOTH') && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  IELTS Formatini Tanlang:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIeltsType('ACADEMIC')}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${
                      ieltsType === 'ACADEMIC'
                        ? 'bg-blue-950 border-blue-950 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    IELTS Academic
                  </button>
                  <button
                    onClick={() => setIeltsType('GENERAL_TRAINING')}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${
                      ieltsType === 'GENERAL_TRAINING'
                        ? 'bg-blue-950 border-blue-950 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    General Training
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-blue-950/20 transition flex items-center justify-center gap-2"
            >
              Keyingi: Maqsad Ballari <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Score Goals & Timeline */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black text-blue-950 mb-2">Maqsad Ball & Imtihon Sanasi</h1>
            <p className="text-xs text-slate-500 mb-6">
              Siz xohlagan natijaga yetishingiz uchun kunlik o'rganish vaqti belgilang.
            </p>

            {(targetExam === 'IELTS' || targetExam === 'BOTH') && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-3">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                  IELTS Band Maqsadi (Scale 1.0 – 9.0)
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hozirgi Ball</label>
                    <input
                      type="number"
                      step="0.5"
                      min="4.0"
                      max="9.0"
                      value={currentIelts}
                      onChange={(e) => setCurrentIelts(parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Maqsad Ball</label>
                    <input
                      type="number"
                      step="0.5"
                      min="5.0"
                      max="9.0"
                      value={targetIelts}
                      onChange={(e) => setTargetIelts(parseFloat(e.target.value))}
                      className="w-full bg-white border border-blue-900 rounded-xl px-3 py-2 text-sm text-blue-950 font-bold focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                </div>
              </div>
            )}

            {(targetExam === 'SAT' || targetExam === 'BOTH') && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-3">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                  Digital SAT Maqsadi (Scale 400 – 1600)
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hozirgi Ball</label>
                    <input
                      type="number"
                      step="10"
                      min="600"
                      max="1600"
                      value={currentSat}
                      onChange={(e) => setCurrentSat(parseInt(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Maqsad Ball</label>
                    <input
                      type="number"
                      step="10"
                      min="800"
                      max="1600"
                      value={targetSat}
                      onChange={(e) => setTargetSat(parseInt(e.target.value))}
                      className="w-full bg-white border border-blue-900 rounded-xl px-3 py-2 text-sm text-blue-950 font-bold focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-950" /> Imtihon Sanasi
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-950" /> Kunlik O'qish Vaqti
                </label>
                <select
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold"
                >
                  <option value={30}>30 daqiqa / kun</option>
                  <option value={45}>45 daqiqa / kun</option>
                  <option value={60}>60 daqiqa / kun</option>
                  <option value={90}>90 daqiqa / kun</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Orqaga
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md shadow-blue-950/20 flex items-center justify-center gap-2"
              >
                Keyingi: Qiyin Mavzular <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Weak Topics & Generation */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-black text-blue-950 mb-2">Qaysi Mavzularda Yordam Kerak?</h1>
            <p className="text-xs text-slate-500 mb-6">
              O'zingizga qiyin bo'lgan mavzularni tanlang; Prepora ularga ustuvorlik beradi.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {allTopics.map((topic) => {
                const isSelected = weakTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Orqaga
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-blue-950/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Dasturni Ishga Tushirish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
