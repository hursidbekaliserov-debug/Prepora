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
  FileText,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';
import { IELTSType } from '@/types';

interface ModuleLesson {
  id: string;
  title: string;
  level: 'B2 (O\'rta)' | 'C1 (Ilg\'or)' | 'C2 (Ekspert)';
  questionsCount: number;
  duration: string;
  completed: boolean;
  accuracy?: string;
  tag: string;
}

export default function IeltsHubPage() {
  const [selectedFormat, setSelectedFormat] = useState<IELTSType>('ACADEMIC');
  const [activeModule, setActiveModule] = useState<'all' | 'listening' | 'reading' | 'writing' | 'speaking'>('all');

  const modules = [
    {
      id: 'listening',
      name: 'Listening',
      icon: Headphones,
      badgeColor: 'bg-indigo-50 text-[#5146E5] border-indigo-200/70',
      accentColor: '#5146E5',
      lightBg: 'from-indigo-50/50 to-white',
      desc: 'Britaniya, Avstraliya va Amerika aksentidagi 4 qismli tabiiy audio muloqotlar va topshiriqlar.',
      progress: 78,
      difficulty: 'Easy to Hard (Band 6.0 - 9.0)',
      link: '/ielts/listening',
      lessonsCount: '40 Savol • 4 Bo\'lim',
      status: 'O\'rganilmoqda',
      lessons: [
        { id: 'l1', title: 'Part 1: Telefon raqamlari va manzillar (Note Completion)', level: 'B2 (O\'rta)', questionsCount: 10, duration: '8 daq', completed: true, accuracy: '90%', tag: 'Part 1' },
        { id: 'l2', title: 'Part 2: Shahar xaritasi va obyektlar joylashuvi (Map Labelling)', level: 'B2 (O\'rta)', questionsCount: 10, duration: '10 daq', completed: true, accuracy: '80%', tag: 'Part 2' },
        { id: 'l3', title: 'Part 3: Universitet loyihasi muhokamasi (Multiple Choice)', level: 'C1 (Ilg\'or)', questionsCount: 10, duration: '12 daq', completed: false, tag: 'Part 3' },
        { id: 'l4', title: 'Part 4: Akademik Ma\'ruza: Dengiz ekologiyasi (Summary)', level: 'C2 (Ekspert)', questionsCount: 10, duration: '14 daq', completed: false, tag: 'Part 4' },
      ]
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: BookOpen,
      badgeColor: 'bg-violet-50 text-[#8B7CF6] border-violet-200/70',
      accentColor: '#8B7CF6',
      lightBg: 'from-violet-50/50 to-white',
      desc: 'Akademik maqolalar, ilmiy kashfiyotlar, True/False/Not Given va Matching Headings strategiyalari.',
      progress: 70,
      difficulty: 'Intermediate to Advanced',
      link: '/ielts/reading',
      lessonsCount: '3 Matn • 40 Savol',
      status: 'O\'rganilmoqda',
      lessons: [
        { id: 'r1', title: 'Passage 1: Biomimik Arxitektura va Tabiat Muhandisligi', level: 'B2 (O\'rta)', questionsCount: 13, duration: '20 daq', completed: true, accuracy: '85%', tag: 'True/False/NG' },
        { id: 'r2', title: 'Passage 2: Uyqu va Xotira Mustahkamlanishi Neyrologiyasi', level: 'C1 (Ilg\'or)', questionsCount: 13, duration: '20 daq', completed: false, tag: 'Headings' },
        { id: 'r3', title: 'Passage 3: Chuqur Dengiz Robototexnikasi va Okeanografiya', level: 'C2 (Ekspert)', questionsCount: 14, duration: '20 daq', completed: false, tag: 'Multiple Choice' },
      ]
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200/70',
      accentColor: '#2563EB',
      lightBg: 'from-blue-50/50 to-white',
      desc: 'Task 1 (Grafik, Jadval, Xarita) va Task 2 (Akademik Esse) bo\'yicha sun\'iy intellektli tekshiruv va 4 mezon tahlili.',
      progress: 62,
      difficulty: 'Band 6.5 - 8.5',
      link: '/ielts/writing',
      lessonsCount: 'Task 1 & Task 2 • AI Lab',
      status: 'Boshlangan',
      lessons: [
        { id: 'w1', title: 'Task 1: Dinamik Grafik va Chiziqli Diagrammalarni Tasvirlash', level: 'B2 (O\'rta)', questionsCount: 1, duration: '20 daq', completed: true, accuracy: 'Band 7.0', tag: 'Academic Task 1' },
        { id: 'w2', title: 'Task 2: Agree or Disagree: Sun\'iy Intellekt va Kelajak Ish O\'rinlari', level: 'C1 (Ilg\'or)', questionsCount: 1, duration: '40 daq', completed: false, tag: 'Opinion Essay' },
        { id: 'w3', title: 'Task 2: Discuss Both Views & Give Your Opinion', level: 'C1 (Ilg\'or)', questionsCount: 1, duration: '40 daq', completed: false, tag: 'Discussion Essay' },
      ]
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: Mic,
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
      accentColor: '#059669',
      lightBg: 'from-emerald-50/50 to-white',
      desc: 'Part 1, 2, 3 interaktiv audio mashqlari hamda jonli IELTS.GG Voice AI Examiner bilan jonli muloqot.',
      progress: 80,
      difficulty: 'Band 6.0 - 9.0',
      link: '/ielts/speaking',
      lessonsCount: 'Parts 1, 2 & 3 • Audio Studio',
      status: 'Ilg\'or',
      lessons: [
        { id: 's1', title: 'Part 1: Hometown, Hobbies, Daily Routine & Technology', level: 'B2 (O\'rta)', questionsCount: 12, duration: '5 daq', completed: true, accuracy: 'Band 7.5', tag: 'Fluency' },
        { id: 's2', title: 'Part 2 Cue Card: O\'zingiz xursand bo\'lgan kutilmagan sovg\'a', level: 'C1 (Ilg\'or)', questionsCount: 1, duration: '4 daq', completed: true, accuracy: 'Band 7.0', tag: 'Monologue' },
        { id: 's3', title: 'Part 3: Zamonaviy Iste\'molchilik va Moddiy Qadriyatlar', level: 'C2 (Ekspert)', questionsCount: 5, duration: '6 daq', completed: false, tag: 'Abstract Discussion' },
      ]
    }
  ];

  const filteredModules = activeModule === 'all' 
    ? modules 
    : modules.filter(m => m.id === activeModule);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Header Banner & Format Switcher */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5146E5]/10 border border-[#5146E5]/20 text-[#5146E5] text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-[#5146E5]" />
              Rasmiy Prepora Band 9.0 Dasturi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A2B] tracking-tight">
              IELTS Tayyorgarlik Markazi
            </h1>
            <p className="text-[#85899B] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Barcha 4 ta ko'nikma (Listening, Reading, Writing, Speaking) bo'yicha strukturaviy darslar, real testlar va rasmiy baholash mezonlari.
            </p>
          </div>

          {/* Academic vs GT Format Switcher */}
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-2xl flex items-center shrink-0 self-start md:self-auto">
            <button
              onClick={() => setSelectedFormat('ACADEMIC')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'ACADEMIC'
                  ? 'bg-[#5146E5] text-white shadow-xs'
                  : 'text-[#85899B] hover:text-[#171A2B]'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setSelectedFormat('GENERAL_TRAINING')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition ${
                selectedFormat === 'GENERAL_TRAINING'
                  ? 'bg-[#5146E5] text-white shadow-xs'
                  : 'text-[#85899B] hover:text-[#171A2B]'
              }`}
            >
              General Training
            </button>
          </div>
        </div>

        {/* 2. Full Mock Exam Hero Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#171A2B] via-[#1E2238] to-[#171A2B] text-white shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[11px] font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              To'liq Imtihon Standarti
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Full-Length IELTS Mock Exam</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
              Barcha 4 ta bo'limni real vaqt va qat'iy nazorat ostida ketma-ket topshiring: Listening (40 Q, 30 daq), Reading (40 Q, 60 daq), Writing (Tasks 1 & 2, 60 daq) va Speaking.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> Umumiy vaqt: 2 soat 45 daqiqa</span>
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-400" /> 80 ta savol + 2 esse + intervyu</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
            <Link
              href="/ielts/mock-exam"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-extrabold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> To'liq Mock Testni Boshlash
            </Link>
          </div>
        </div>

        {/* 3. IELTS.GG Voice AI Speaking Examiner Banner */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-100 shrink-0">
              <Mic className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Prepora IELTS Voice AI Examiner
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#171A2B]">
                Britaniya yoki Amerika Ovozli AI Imtihon Oluvchisi Bilan Suhbatlashing!
              </h3>
              <p className="text-xs text-[#85899B] max-w-xl leading-relaxed">
                Haqiqiy imtihondagidek ovozli savollarga mikrofon orqali javob bering va darhol Talaffuz, Grammatika, Lug'at va Ravonlik bo'yicha Band ballingizni oling.
              </p>
            </div>
          </div>

          <Link
            href="/ielts-gg"
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-xs flex items-center justify-center gap-2 shrink-0"
          >
            <span>Ovozli Suhbatni Boshlash</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4. Module Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Barcha Modullar' },
              { id: 'listening', label: 'Listening' },
              { id: 'reading', label: 'Reading' },
              { id: 'writing', label: 'Writing' },
              { id: 'speaking', label: 'Speaking' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModule(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeModule === tab.id
                    ? 'bg-[#5146E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-[#85899B] border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-[#85899B] hidden sm:inline-block">
            4 ta modul • 50+ interaktiv topshiriq
          </span>
        </div>

        {/* 5. 4 Modules Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:border-[#5146E5]/40 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.badgeColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-[#171A2B]">{mod.name} Moduli</h3>
                        <span className="text-xs text-[#85899B] font-medium">{mod.lessonsCount}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#171A2B] border border-slate-200">
                      {mod.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#85899B] leading-relaxed mb-4">
                    {mod.desc}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#85899B]">Modul O'zlashtirish</span>
                      <span className="text-[#5146E5]">{mod.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mod.progress}%`, backgroundColor: mod.accentColor }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85899B] mt-1.5">
                      <span>Daraja: {mod.difficulty}</span>
                      <span>{mod.lessons.filter(l => l.completed).length}/{mod.lessons.length} tugatildi</span>
                    </div>
                  </div>

                  {/* Lesson Cards inside Module */}
                  <div className="space-y-2.5 mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#85899B] block">
                      Namunaviy Darslar & Mashqlar:
                    </span>
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-xl bg-[#F8F9FC] border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            lesson.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                          }`}>
                            {lesson.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-[#171A2B] truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.accuracy && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {lesson.accuracy}
                            </span>
                          )}
                          <span className="text-[10px] text-[#85899B]">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <Link
                    href={mod.link}
                    className="flex-1 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{mod.name} Bo'limiga O'tish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
