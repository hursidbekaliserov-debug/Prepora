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
  AlertCircle,
  TrendingUp,
  Bookmark,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { UserProfile, StudyTask, ExamResult, MistakeRecord } from '@/types';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

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

  const latestIeltsResult = results.find((r) => r.examType === 'IELTS');
  const latestSatResult = results.find((r) => r.examType === 'SAT');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Imtihon Yo'nalishi: {profile?.targetExam || 'BOTH'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              Xush kelibsiz, {profile?.fullName || 'O\'quvchi'}! 👋
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Imtihon Sanasi: <strong className="text-blue-950 font-bold">{profile?.examDate || '15-Dekabr, 2026'}</strong> • Kunlik Maqsad: <strong className="text-blue-950 font-bold">{profile?.dailyStudyMinutes || 45} daqiqa</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              href="/study-plan"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-950 border border-slate-200 text-xs font-bold transition"
            >
              Rejani Ko'rish
            </Link>
            <Link
              href={profile?.targetExam === 'SAT' ? '/sat/reading-writing' : '/ielts/listening'}
              className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md shadow-blue-950/20 transition flex items-center gap-2"
            >
              Darsni Davom Ettirish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Streak */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
              <Flame className="w-6 h-6 fill-orange-500" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Davomiylik (Streak)</span>
              <span className="text-2xl font-black text-blue-950">{profile?.streakDays || 3} Kun</span>
            </div>
          </div>

          {/* Card 2: Study Time */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center shrink-0 border border-blue-100">
              <Clock className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Mashq Vaqti</span>
              <span className="text-2xl font-black text-blue-950">{profile?.totalStudyMinutes || 120} daq</span>
            </div>
          </div>

          {/* Card 3: Daily Tasks */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Bajarilgan Vazifalar</span>
              <span className="text-2xl font-black text-blue-950">
                {completedTasksCount} / {tasks.length}
              </span>
            </div>
          </div>

          {/* Card 4: Mistakes Logged */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Xatolar Daftari</span>
              <span className="text-2xl font-black text-blue-950">{mistakes.length}</span>
            </div>
          </div>
        </div>

        {/* EXAM HUBS SHORTCUT ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IELTS Hub Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    IE
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-950">IELTS Tayyorgarlik</h3>
                    <span className="text-xs text-slate-500 font-medium">{profile?.ieltsType || 'Academic'} Yo'nalishi</span>
                  </div>
                </div>
                <Link
                  href="/ielts"
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  Bo'limga o'tish <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Score Goal & Last Result */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">
                    Maqsad Band
                  </span>
                  <span className="text-xl font-black text-blue-950">
                    Band {profile?.targetIeltsBand || 8.0}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">
                    Oxirgi Test
                  </span>
                  <span className="text-xl font-black text-blue-950">
                    {latestIeltsResult?.ieltsReadingBand ? `Band ${latestIeltsResult.ieltsReadingBand.toFixed(1)}` : 'Hali topshirilmadi'}
                  </span>
                </div>
              </div>

              {/* 4 Skill Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/ielts/listening"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <Headphones className="w-4 h-4 text-blue-950" /> Listening (40 Q)
                </Link>
                <Link
                  href="/ielts/reading"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <BookOpen className="w-4 h-4 text-blue-950" /> Reading (40 Q)
                </Link>
                <Link
                  href="/ielts/writing"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <PenTool className="w-4 h-4 text-blue-950" /> Writing AI Lab
                </Link>
                <Link
                  href="/ielts/speaking"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <Mic className="w-4 h-4 text-blue-950" /> Speaking Studio
                </Link>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/ielts/mock-exam"
                className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Award className="w-4 h-4" /> To'liq 4-Skill IELTS Mock Test
              </Link>
            </div>
          </div>

          {/* SAT Hub Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    SAT
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-950">Digital SAT Tayyorgarlik</h3>
                    <span className="text-xs text-slate-500 font-medium">4 Modulli Shkala</span>
                  </div>
                </div>
                <Link
                  href="/sat"
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  Bo'limga o'tish <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Score Goal & Last Result */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">
                    Maqsad Ball
                  </span>
                  <span className="text-xl font-black text-blue-950">
                    {profile?.targetSatScore || 1520} / 1600
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">
                    Oxirgi Test
                  </span>
                  <span className="text-xl font-black text-blue-950">
                    {latestSatResult?.satTotalScoreEst ? `${latestSatResult.satTotalScoreEst} ball` : 'Hali topshirilmadi'}
                  </span>
                </div>
              </div>

              {/* 2 Section Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/sat/reading-writing"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <BookOpen className="w-4 h-4 text-blue-950" /> Reading & Writing (54 Q)
                </Link>
                <Link
                  href="/sat/math"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 transition"
                >
                  <Calculator className="w-4 h-4 text-blue-950" /> Math Engine (44 Q)
                </Link>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/sat/mock-exam"
                className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Award className="w-4 h-4" /> To'liq 98 Savollik SAT Mock Test
              </Link>
            </div>
          </div>
        </div>

        {/* TODAY'S STUDY TASKS & AI TUTOR RECOMMENDER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Tasks List */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-blue-950 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-900" />
                Bugungi O'quv Vazifalari
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {completedTasksCount} / {tasks.length} Bajarildi
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-slate-500 bg-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-blue-950">
                          {task.skill}
                        </span>
                        <span>•</span>
                        <span>~{task.estimatedMinutes} daq</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={task.link}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold shrink-0 transition"
                  >
                    Boshlash
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI & Vocab Shortcuts */}
          <div className="space-y-6">
            {/* AI Tutor Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-blue-950 text-white shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Prepora AI Tutor</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-normal">
                Qiyin savollar yoki insho tuzilishi bo'yicha darhol AI ustozidan tushuntirish oling.
              </p>
              <Link
                href="/tutor"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-950 font-extrabold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                AI Tutor Bilan Suhbatlashish
              </Link>
            </div>

            {/* Mistake Notebook Shortcut */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-blue-950">Xatolar Daftari</h4>
                <p className="text-xs text-slate-500 mt-0.5">{mistakes.length} ta savol saqlangan</p>
              </div>
              <Link
                href="/mistakes"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-950 text-xs font-bold transition"
              >
                Ko'rish
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
