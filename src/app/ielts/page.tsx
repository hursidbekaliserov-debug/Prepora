'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Award, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';
import { IELTSType } from '@/types';

export default function IeltsHubPage() {
  const [selectedFormat, setSelectedFormat] = useState<IELTSType>('ACADEMIC');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hub Header */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-blue-900" /> Prepora IELTS Band 9.0 Dasturi
            </div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">IELTS Tayyorgarlik Markazi</h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Listening, Academic & General Reading, AI insho baholash va audio Speaking orqali barcha 4 ko'nikmani mukammal o'rganing.
            </p>
          </div>

          {/* Academic vs GT Format Switcher */}
          <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl flex items-center shrink-0">
            <button
              onClick={() => setSelectedFormat('ACADEMIC')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'ACADEMIC'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setSelectedFormat('GENERAL_TRAINING')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'GENERAL_TRAINING'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General Training
            </button>
          </div>
        </div>

        {/* Full Mock Exam Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-blue-950 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              To'liq Imtihon Simulyatsiyasi
            </span>
            <h2 className="text-2xl font-black text-white">Full-Length IELTS Mock Exam</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
              Barcha 4 ta bo'limni ketma-ket real vaqtda topshiring: Listening (40 Q, 30 daq), 
              Reading (40 Q, 60 daq), Writing (Tasks 1 & 2, 60 daq) va Speaking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              href="/ielts/mock-exam"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> To'liq Mock Testni Boshlash
            </Link>
          </div>
        </div>

        {/* IELTS.GG Voice AI Speaking Feature Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-2 border-emerald-500/40 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/30 shrink-0">
              <Mic className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> IELTS.GG Voice AI Examiner
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                AI Imtihon Oluvchi Bilan Real-Time Ovozli Suhbat Quring!
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Britaniya yoki Amerika aksentidagi AI Examiner savollarini jonli eshiting, mikrofoningiz orqali inglizcha javob bering va darhol 4 mezon bo'yicha Band ballingizni oling.
              </p>
            </div>
          </div>

          <Link
            href="/ielts-gg"
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2 shrink-0 hover:scale-105"
          >
            <span>Ovozli Suhbatni Boshlash</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill 1: Listening */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <Headphones className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  4 Qism • 40 Savol
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Listening Mashqlari</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Tabiiy nutq audio pleyeri, Britaniya va Avstraliya talaffuzi. Note-completion, ko'p variantli va xarita savollari.
              </p>
            </div>
            <Link
              href="/ielts/listening"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Listening Mashq Qilish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Skill 2: Reading */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  3 Matn • 40 Savol
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Reading Mashqlari</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Biomimik arxitektura, uyqu neyrobiologiyasi va dengiz robototexnikasi bo'yicha 3 ta akademik matn. True/False/Not Given va Headings.
              </p>
            </div>
            <Link
              href="/ielts/reading"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Reading Mashq Qilish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Skill 3: Writing */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <PenTool className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Task 1 & Task 2
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Writing Lab & AI Examiner</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                So'z sanagich va avtosaqlashli redaktor. Rasmiy 4 mezon bo'yicha darhol AI tekshiruvi va baholash.
              </p>
            </div>
            <Link
              href="/ielts/writing"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Writing Labga Kirish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Skill 4: Speaking */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Parts 1, 2, va 3
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Speaking Studio</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Part 1 savollari, Part 2 cue-card 1 daqiqalik tayyorgarlik va 2 daqiqalik nutqni mikrofon orqali yozib olish.
              </p>
            </div>
            <Link
              href="/ielts/speaking"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Speaking Studioni Ochish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
