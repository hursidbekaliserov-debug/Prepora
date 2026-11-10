'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  BookOpen, 
  Calculator, 
  Award, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  BarChart2,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Check,
  Zap,
  Sliders,
  FileCheck,
  Cpu
} from 'lucide-react';

export default function SatHubPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'rw' | 'math'>('all');

  // Topic-based lesson & practice tracks
  const rwTopics = [
    {
      id: 'rw1',
      title: 'Craft and Structure: So\'zlar kontekstda va Matn Tahlili',
      domain: 'Craft & Structure',
      level: 'O\'rta (Medium)',
      questionsCount: 28,
      duration: '25 daq',
      completed: true,
      accuracy: '88%',
      link: '/sat/reading-writing',
    },
    {
      id: 'rw2',
      title: 'Information and Ideas: Markaziy Fikr va Ilmiy Dalillar',
      domain: 'Information & Ideas',
      level: 'Qiyin (Hard)',
      questionsCount: 32,
      duration: '30 daq',
      completed: true,
      accuracy: '84%',
      link: '/sat/reading-writing',
    },
    {
      id: 'rw3',
      title: 'Standard English Conventions: Vergul, Tinish va Sintaksis',
      domain: 'Conventions',
      level: 'Oson (Easy)',
      questionsCount: 25,
      duration: '20 daq',
      completed: false,
      accuracy: '-',
      link: '/sat/reading-writing',
    },
    {
      id: 'rw4',
      title: 'Expression of Ideas: Matn Mantiqiy Ketma-ketligi va O\'tishlar',
      domain: 'Expression',
      level: 'O\'rta (Medium)',
      questionsCount: 24,
      duration: '22 daq',
      completed: false,
      accuracy: '-',
      link: '/sat/reading-writing',
    },
  ];

  const mathTopics = [
    {
      id: 'm1',
      title: 'Algebra: Chiziqli Tenglamalar va Tengsizliklar Tizimi',
      domain: 'Heart of Algebra',
      level: 'Oson (Easy)',
      questionsCount: 30,
      duration: '25 daq',
      completed: true,
      accuracy: '94%',
      link: '/sat/math',
    },
    {
      id: 'm2',
      title: 'Advanced Math: Kvadrat Tenglamalar, Parabola va Polinomlar',
      domain: 'Advanced Math',
      level: 'Qiyin (Hard)',
      questionsCount: 35,
      duration: '35 daq',
      completed: true,
      accuracy: '86%',
      link: '/sat/math',
    },
    {
      id: 'm3',
      title: 'Problem Solving: Foizlar, Ehtimollik va Statistika Tahlili',
      domain: 'Data Analysis',
      level: 'O\'rta (Medium)',
      questionsCount: 26,
      duration: '25 daq',
      completed: false,
      accuracy: '-',
      link: '/sat/math',
    },
    {
      id: 'm4',
      title: 'Geometry & Trigonometry: Doiralar, Uchburchaklar va Burchaklar',
      domain: 'Geo & Trig',
      level: 'Qiyin (Hard)',
      questionsCount: 22,
      duration: '28 daq',
      completed: false,
      accuracy: '-',
      link: '/sat/math',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5146E5]/10 border border-[#5146E5]/20 text-[#5146E5] text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-[#5146E5]" />
              Rasmiy 1600-Ballik Digital SAT Standarti
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A2B] tracking-tight">
              Digital SAT Tayyorgarlik Markazi
            </h1>
            <p className="text-[#85899B] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Reading & Writing (54 Q) va Math (44 Q) bo'limlari bo'yicha College Board talablariga mos adaptive savollar, integratsiyalangan Desmos kalkulyatori va 98 savollik to'liq mock test.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/sat/mock-exam"
              className="px-5 py-3 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-extrabold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> To'liq 98 Savollik Mock
            </Link>
          </div>
        </div>

        {/* 2. SAT Performance Statistics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-[#85899B] block mb-1">Taxminiy SAT Ball</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#5146E5]">1450 <span className="text-xs font-medium text-[#85899B]">/ 1600</span></div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">Top 3% natija</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-[#85899B] block mb-1">Reading & Writing</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">710 <span className="text-xs font-medium text-[#85899B]">/ 800</span></div>
            <p className="text-[11px] text-[#85899B] mt-1">54 ta savoldan 48 tasi to'g'ri</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-[#85899B] block mb-1">Math Section</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171A2B]">740 <span className="text-xs font-medium text-[#85899B]">/ 800</span></div>
            <p className="text-[11px] text-[#85899B] mt-1">44 ta savoldan 41 tasi to'g'ri</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-[#85899B] block mb-1">Umumiy Aniqlik</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">89.2%</div>
            <p className="text-[11px] text-[#85899B] mt-1">So'nggi 240+ savol asosida</p>
          </div>
        </div>

        {/* 3. The 2 Core SAT Tracks: Reading & Writing and Math */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TRACK 1: Reading and Writing */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5146E5] flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#171A2B]">Reading and Writing</h2>
                    <span className="text-xs text-[#85899B]">2 Modul • 54 Savol • 64 Daqiqa</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-[#5146E5] border border-indigo-100">
                  800 Ballik
                </span>
              </div>

              <p className="text-xs text-[#85899B] leading-relaxed mb-5">
                4 ta asosiy domenni qamrab oladi: Information and Ideas, Craft and Structure, Expression of Ideas, hamda Standard English Conventions. Qisqa ilmiy matnlar va she'riyat tahlili.
              </p>

              {/* 4 RW Domains */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Information & Ideas
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Craft and Structure
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Expression of Ideas
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • English Conventions
                </div>
              </div>
            </div>

            <Link
              href="/sat/reading-writing"
              className="w-full py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              Reading & Writing Mashqlarini Boshlash <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TRACK 2: Math Engine */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#5146E5]/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5146E5] flex items-center justify-center">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#171A2B]">Math Engine & Desmos</h2>
                    <span className="text-xs text-[#85899B]">2 Modul • 44 Savol • 70 Daqiqa</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-[#5146E5] border border-indigo-100">
                  800 Ballik
                </span>
              </div>

              <p className="text-xs text-[#85899B] leading-relaxed mb-5">
                Ko'p variantli va raqamli javoblar (grid-in). Rasmiy Desmos grafik kalkulyatori, algebraik formulalar hamda bosqichma-bosqich yechim ko'rsatuvchi interaktiv muhit.
              </p>

              {/* 4 Math Domains */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Heart of Algebra
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Advanced Math
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Data Analysis
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200/70 text-[#171A2B]">
                  • Geo & Trigonometry
                </div>
              </div>
            </div>

            <Link
              href="/sat/math"
              className="w-full py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              Math Engine Mashqlarini Boshlash <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* 4. Full SAT Mock Exam Hero Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#171A2B] via-[#1E2238] to-[#171A2B] text-white shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[11px] font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Adaptive 2-Stage Multi-Stage Testing (MST)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Full-Length Digital SAT Mock Exam</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
              College Board rasmiy Bluebook imtihoni nusxasi: RW 1 & 2 (54 Q, 64 daq) + 10 daqiqalik tanaffus + Math 1 & 2 (44 Q, 70 daq). Sinov yakunida 400 dan 1600 gacha shkalalangan balingizni oling.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> Umumiy vaqt: 2 soat 14 daqiqa</span>
              <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-indigo-400" /> 98 ta savol • Adaptiv modul tizimi</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
            <Link
              href="/sat/mock-exam"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-extrabold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> To'liq Mock Imtihonni Boshlash
            </Link>
          </div>
        </div>

        {/* 5. Topic-based Lessons & Practice Questions Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#171A2B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5146E5]" />
                Mavzulashtirilgan Darslar & Savollar Bazasi
              </h3>
              <p className="text-xs text-[#85899B] mt-0.5">Qiyinlik darajalari va aniqlik ko'rsatkichi bilan</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'rw', label: 'Reading & Writing' },
                { id: 'math', label: 'Math' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeCategory === tab.id
                      ? 'bg-[#5146E5] text-white shadow-xs'
                      : 'bg-slate-100 text-[#85899B] hover:text-[#171A2B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of topic items */}
          <div className="space-y-3">
            {(activeCategory === 'all' || activeCategory === 'rw' ? rwTopics : []).concat(
              activeCategory === 'all' || activeCategory === 'math' ? mathTopics : []
            ).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70 hover:border-[#5146E5]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                    item.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171A2B] text-xs sm:text-sm">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#85899B] mt-0.5">
                      <span className="font-semibold text-[#5146E5]">{item.domain}</span>
                      <span>•</span>
                      <span>{item.level}</span>
                      <span>•</span>
                      <span>{item.questionsCount} ta savol</span>
                      <span>•</span>
                      <span>~{item.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {item.accuracy !== '-' && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      Aniqlik: {item.accuracy}
                    </span>
                  )}
                  <Link
                    href={item.link}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#5146E5] hover:text-white text-[#171A2B] font-bold border border-slate-200 transition"
                  >
                    Boshlash
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SAT Exam Structure 4 Modules Detail */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-extrabold text-[#171A2B] mb-2">Digital SAT Modullar Arxitekturasi:</h3>
          <p className="text-xs text-[#85899B] mb-6 leading-relaxed">
            Digital SAT ikkita teng bo'lim va jami 4 ta adaptiv moduldan iborat. Har bir bo'limning 1-moduli aralash qiyinlikda bo'lib, uning natijasiga qarab 2-modul osonroq yoki qiyinroq (yuqori ball uchun) adaptatsiya bo'ladi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70">
              <span className="text-[10px] font-bold text-[#5146E5] block uppercase tracking-wider mb-1">
                Modul 1
              </span>
              <h4 className="text-sm font-bold text-[#171A2B]">RW Modul 1</h4>
              <p className="text-xs text-[#85899B] mt-1">27 Savol • 32 Daqiqa</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70">
              <span className="text-[10px] font-bold text-[#5146E5] block uppercase tracking-wider mb-1">
                Modul 2 (Adaptiv)
              </span>
              <h4 className="text-sm font-bold text-[#171A2B]">RW Modul 2</h4>
              <p className="text-xs text-[#85899B] mt-1">27 Savol • 32 Daqiqa</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70">
              <span className="text-[10px] font-bold text-[#5146E5] block uppercase tracking-wider mb-1">
                Modul 3
              </span>
              <h4 className="text-sm font-bold text-[#171A2B]">Math Modul 1</h4>
              <p className="text-xs text-[#85899B] mt-1">22 Savol • 35 Daqiqa</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-slate-200/70">
              <span className="text-[10px] font-bold text-[#5146E5] block uppercase tracking-wider mb-1">
                Modul 4 (Adaptiv)
              </span>
              <h4 className="text-sm font-bold text-[#171A2B]">Math Modul 2</h4>
              <p className="text-xs text-[#85899B] mt-1">22 Savol • 35 Daqiqa</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
