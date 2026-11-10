'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Sparkles, 
  Headphones, 
  PenTool, 
  Mic, 
  Calculator, 
  TrendingUp, 
  Bookmark, 
  Calendar, 
  ChevronRight,
  PlayCircle,
  BarChart3,
  Check,
  Zap,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { UserProfile, StudyTask, ExamResult, MistakeRecord } from '@/types';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [activeChartDay, setActiveChartDay] = useState<number>(3); // Wednesday active

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setTasks(StorageManager.getTasks());
    setResults(StorageManager.getExamResults());
    setMistakes(StorageManager.getMistakes());
  }, []);

  const handleToggleTask = (id: string) => {
    const updated = StorageManager.toggleTask(id);
    setTasks(updated);
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const latestIeltsResult = results.find((r) => r.examType === 'IELTS');
  const latestSatResult = results.find((r) => r.examType === 'SAT');

  // Weekly study activity data (Monday - Sunday)
  const weeklyActivity = [
    { day: 'Du', minutes: 45, full: 'Dushanba', date: '4 Nov' },
    { day: 'Se', minutes: 60, full: 'Seshanba', date: '5 Nov' },
    { day: 'Ch', minutes: 75, full: 'Chorshanba', date: '6 Nov' },
    { day: 'Pa', minutes: 50, full: 'Payshanba', date: '7 Nov' },
    { day: 'Ju', minutes: 90, full: 'Juma', date: '8 Nov' },
    { day: 'Sh', minutes: 30, full: 'Shanba', date: '9 Nov' },
    { day: 'Ya', minutes: 40, full: 'Yakshanba', date: '10 Nov' },
  ];

  const totalWeeklyMinutes = weeklyActivity.reduce((acc, curr) => acc + curr.minutes, 0);

  // Recent student activity timeline
  const recentActivities = [
    {
      id: 1,
      title: 'IELTS Academic Reading Test #3',
      type: 'test',
      score: 'Band 7.5',
      time: '2 soat oldin',
      icon: BookOpen,
      iconBg: 'bg-indigo-50 text-[#5146E5]',
    },
    {
      id: 2,
      title: 'SAT Math: Quadratic Equations & Functions',
      type: 'lesson',
      score: 'Tugatildi',
      time: 'Kecha, 18:30',
      icon: PlayCircle,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 3,
      title: 'IELTS Writing Task 2 AI Tahlili',
      type: 'ai',
      score: 'Band 7.0 (TA: 8, CC: 7)',
      time: '2 kun oldin',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Personalized Welcome & Overview Banner */}
        <div className="relative rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#5146E5]/10 via-[#8B7CF6]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-xs font-bold mb-3 border border-[#5146E5]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#5146E5]" />
                <span>Faol Yo'nalish: <strong>{profile?.targetExam || 'IELTS & SAT'}</strong></span>
                <span className="w-1 h-1 rounded-full bg-[#5146E5]" />
                <span>Maqsad: {profile?.examDate || '15-Dekabr, 2026'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A2B] tracking-tight">
                Xush kelibsiz, {profile?.fullName || 'Talaba'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-[#85899B] mt-1.5 max-w-2xl leading-relaxed">
                Bugungi o'quv rejangiz 3 ta dars va 1 ta mini-testdan iborat. Davomiyligingizni saqlab qoling va ballaringizni oshiring!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/lessons"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-[#171A2B] text-xs sm:text-sm font-bold transition border border-slate-200"
              >
                <PlayCircle className="w-4 h-4 text-[#5146E5]" />
                Video Darsliklar
              </Link>
              <Link
                href={profile?.targetExam === 'SAT' ? '/sat/reading-writing' : '/ielts/listening'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-bold transition shadow-sm shadow-[#5146E5]/25"
              >
                Darsni Boshlash
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Four Core SaaS KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Streak */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B]">Davomiylik (Streak)</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/80 group-hover:scale-105 transition">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">{profile?.streakDays || 5}</span>
              <span className="text-xs font-bold text-emerald-600">+1 Kun bugun</span>
            </div>
            <p className="text-[11px] text-[#85899B] mt-1">Har kungi faol mashq</p>
          </div>

          {/* Study Time */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B]">Haftalik Mashg'ulot</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5146E5] flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">{totalWeeklyMinutes}</span>
              <span className="text-xs font-medium text-[#85899B]">/ 400 daqiqa</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-[#5146E5] h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.round((totalWeeklyMinutes / 400) * 100))}%` }} />
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B]">Kunlik Vazifalar</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">{completedTasksCount}/{tasks.length}</span>
              <span className="text-xs font-bold text-emerald-600">{taskCompletionRate}%</span>
            </div>
            <p className="text-[11px] text-[#85899B] mt-1">{tasks.length - completedTasksCount} ta vazifa qoldi</p>
          </div>

          {/* Mistakes Logged */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B]">Xatolar Daftari</span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition">
                <Bookmark className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">{mistakes.length}</span>
              <span className="text-xs font-semibold text-rose-600">tahlilga tayyor</span>
            </div>
            <p className="text-[11px] text-[#85899B] mt-1">Takrorlash uchun saqlangan</p>
          </div>
        </div>

        {/* 3. IELTS & SAT Progress Cards (Core Academic Tracks) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* IELTS CARD */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5146E5] flex items-center justify-center font-black text-sm">
                    IELTS
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#171A2B]">IELTS Academic & General</h2>
                    <p className="text-xs text-[#85899B]">4 ta to'liq ko'nikma bo'yicha tayyorgarlik</p>
                  </div>
                </div>
                <Link
                  href="/ielts"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5146E5] hover:text-[#4338CA] transition"
                >
                  Hammasi <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Band Goals & Current Band */}
              <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#85899B]">Maqsad Band</span>
                  <div className="text-2xl font-black text-[#5146E5]">Band {profile?.targetIeltsBand || '8.0'}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#85899B]">Oxirgi Mock Ball</span>
                  <div className="text-2xl font-black text-[#171A2B]">
                    {latestIeltsResult?.ieltsReadingBand ? `Band ${latestIeltsResult.ieltsReadingBand.toFixed(1)}` : 'Band 7.0'}
                  </div>
                </div>
              </div>

              {/* 4 Skill Mini-Bars */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-[#5146E5]" /> Listening</span>
                    <span className="text-[#5146E5]">Band 7.5 (82%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5146E5] rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#5146E5]" /> Reading</span>
                    <span className="text-[#5146E5]">Band 7.0 (75%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5146E5] rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5 text-[#5146E5]" /> Writing Lab</span>
                    <span className="text-[#5146E5]">Band 6.5 (68%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5146E5] rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-[#5146E5]" /> Speaking Studio</span>
                    <span className="text-[#5146E5]">Band 7.0 (72%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5146E5] rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* IELTS Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <Link
                href="/ielts/listening"
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A2B] text-xs font-bold transition text-center"
              >
                Mashq Boshlash
              </Link>
              <Link
                href="/ielts/mock-exam"
                className="flex-1 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition text-center shadow-xs"
              >
                Mock Test (4-Skill)
              </Link>
            </div>
          </div>

          {/* SAT CARD */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5146E5] flex items-center justify-center font-black text-sm">
                    SAT
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#171A2B]">Digital SAT Prep</h2>
                    <p className="text-xs text-[#85899B]">Adaptive 2-stage modullar va Desmos kalkulyatori</p>
                  </div>
                </div>
                <Link
                  href="/sat"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5146E5] hover:text-[#4338CA] transition"
                >
                  Hammasi <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* SAT Goals & Current Score */}
              <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#85899B]">Maqsad Ball</span>
                  <div className="text-2xl font-black text-[#5146E5]">{profile?.targetSatScore || '1520'} / 1600</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#85899B]">Oxirgi Natija</span>
                  <div className="text-2xl font-black text-[#171A2B]">
                    {latestSatResult?.satTotalScoreEst ? `${latestSatResult.satTotalScoreEst} ball` : '1420 ball'}
                  </div>
                </div>
              </div>

              {/* 2 Section Mini-Bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#5146E5]" /> Reading & Writing</span>
                    <span className="text-[#5146E5]">710 / 800 (89%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5146E5] rounded-full" style={{ width: '89%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#171A2B] flex items-center gap-1.5"><Calculator className="w-3.5 h-3.5 text-[#5146E5]" /> Math Engine</span>
                    <span className="text-[#5146E5]">740 / 800 (92%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B7CF6] rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-[#85899B] flex items-center justify-between">
                  <span className="font-medium">O'rganilgan mavzular soni:</span>
                  <strong className="text-[#171A2B]">48 ta darslik</strong>
                </div>
              </div>
            </div>

            {/* SAT Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <Link
                href="/sat/reading-writing"
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A2B] text-xs font-bold transition text-center"
              >
                Mashq Boshlash
              </Link>
              <Link
                href="/sat/mock-exam"
                className="flex-1 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition text-center shadow-xs"
              >
                To'liq SAT Mock (98 Q)
              </Link>
            </div>
          </div>

        </div>

        {/* 4. Weekly Activity Chart & Upcoming Study Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Activity Chart & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Weekly Activity Interactive Bar Chart */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-[#171A2B] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#5146E5]" />
                    Haftalik Faollik Statistikasi
                  </h3>
                  <p className="text-xs text-[#85899B] mt-0.5">So'nggi 7 kunda umumiy sarflangan vaqt</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#85899B]">Jami:</span>
                  <span className="text-sm font-black text-[#5146E5] ml-1.5">{totalWeeklyMinutes} daqiqa</span>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-100">
                {weeklyActivity.map((item, idx) => {
                  const maxM = 100;
                  const heightPercent = Math.min(100, Math.round((item.minutes / maxM) * 100));
                  const isSelected = activeChartDay === idx;

                  return (
                    <div 
                      key={item.day}
                      onClick={() => setActiveChartDay(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip on hover/active */}
                      <div className={`text-[11px] font-bold mb-1.5 px-1.5 py-0.5 rounded-md transition ${
                        isSelected ? 'bg-[#5146E5] text-white scale-105' : 'text-[#85899B] opacity-0 group-hover:opacity-100'
                      }`}>
                        {item.minutes}m
                      </div>

                      {/* Bar */}
                      <div className="w-full max-w-[40px] rounded-t-lg bg-slate-100 group-hover:bg-[#5146E5]/30 transition relative overflow-hidden" style={{ height: '100%' }}>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 absolute bottom-0 left-0 ${
                            isSelected ? 'bg-[#5146E5]' : 'bg-[#8B7CF6]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`text-xs font-bold mt-2.5 transition ${isSelected ? 'text-[#5146E5]' : 'text-[#85899B]'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#85899B]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5146E5]" />
                  <span>Bugungi kun: <strong>{weeklyActivity[activeChartDay].full} ({weeklyActivity[activeChartDay].minutes} daqiqa)</strong></span>
                </div>
                <span>Kunlik norma: 45 daq</span>
              </div>
            </div>

            {/* Upcoming Study Tasks */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-[#171A2B] flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#5146E5]" />
                    Rejalashtirilgan Vazifalar
                  </h3>
                  <p className="text-xs text-[#85899B] mt-0.5">Bajarilgan vazifalarni belgilang</p>
                </div>
                <span className="text-xs font-bold text-[#5146E5] bg-[#5146E5]/10 px-2.5 py-1 rounded-full">
                  {completedTasksCount} / {tasks.length} Bajarildi
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200/80 opacity-60'
                        : 'bg-white border-slate-200 hover:border-[#5146E5]/40 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                          task.completed
                            ? 'bg-[#5146E5] border-[#5146E5] text-white'
                            : 'border-slate-300 hover:border-[#5146E5] bg-white'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div>
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            task.completed ? 'line-through text-slate-400' : 'text-[#171A2B]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#85899B] mt-0.5">
                          <span className="font-semibold text-[#5146E5] bg-[#5146E5]/10 px-1.5 py-0.5 rounded">
                            {task.skill}
                          </span>
                          <span>•</span>
                          <span>~{task.estimatedMinutes} daqiqa</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={task.link}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#5146E5] hover:text-white text-[#171A2B] text-xs font-bold shrink-0 transition"
                    >
                      Boshlash
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right 1 Col: AI Tutor, Video Shortcut, Recent Timeline */}
          <div className="space-y-6">
            
            {/* AI Assistant Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#171A2B] via-[#1E2238] to-[#171A2B] text-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#5146E5]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-10 h-10 rounded-xl bg-[#5146E5] text-white flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h4 className="text-base font-extrabold text-white mb-1.5">Prepora AI Ustoz</h4>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Tushunarsiz formulalar, IELTS insho xatolari yoki SAT masalalarini 24/7 AI orqali so'rang.
              </p>
              <Link
                href="/tutor"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#171A2B] font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                AI Tutor Bilan Maslahat <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Access to Video Lessons */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold text-[#171A2B] flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-[#5146E5]" />
                  Video Darsliklar
                </h4>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                  20 ta video
                </span>
              </div>
              <p className="text-xs text-[#85899B] mb-4">
                10 ta IELTS va 10 ta SAT rasmiy video darslari orqali bilimlaringizni mustahkamlang.
              </p>
              <Link
                href="/lessons"
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A2B] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                Videolarni Ko'rish <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recent Activities Timeline */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="text-sm font-extrabold text-[#171A2B] mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5146E5]" />
                So'nggi Mashg'ulotlar
              </h4>

              <div className="space-y-4">
                {recentActivities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#171A2B] truncate">{act.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[#85899B] mt-0.5">
                          <span className="font-semibold text-emerald-600">{act.score}</span>
                          <span>•</span>
                          <span>{act.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
