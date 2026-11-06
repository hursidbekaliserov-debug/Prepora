'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ExamEngine from '@/components/ExamEngine';
import AudioPlayer from '@/components/AudioPlayer';
import { 
  ieltsListeningQuestions, 
  ieltsReadingPassages, 
  ieltsReadingQuestions, 
  ieltsWritingPrompts, 
  ieltsSpeakingParts 
} from '@/data/ieltsQuestions';
import { 
  Award, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Play,
  RotateCcw,
  Sparkles,
  Crown
} from 'lucide-react';
import { IELTSType } from '@/types';
import { StorageManager } from '@/lib/storage';

type MockStage = 'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'completed';

export default function IeltsMockExamPage() {
  const [stage, setStage] = useState<MockStage>('intro');
  const [ieltsType, setIeltsType] = useState<IELTSType>('ACADEMIC');
  const [examMode, setExamMode] = useState<'EXAM' | 'PRACTICE'>('EXAM');

  // Writing mock state
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');
  const [writingMinutesLeft, setWritingMinutesLeft] = useState(60);

  // Audio for listening
  const audioScript = `Office Clerk: Welcome to the IELTS Official Practice Listening Test. You will hear four recordings and answer forty questions.
In Part 1, you will hear a conversation between an office clerk and a cyclist registering for the Greenfield Cycling Club.
In Part 2, a museum curator guides visitors through the newly refurbished Maritime Heritage Centre.
In Part 3, two university students, Liam and Sarah, consult Professor Hall regarding their vertical hydroponic farming seminar draft.
In Part 4, a marine biologist delivers a comprehensive academic lecture exploring deep-ocean bioluminescence, luciferin biochemistry, and medical biotechnology.
Answer all questions as you listen. You will be given time at the conclusion of each section to verify your answers.`;

  const listeningAudio = (
    <AudioPlayer
      title="IELTS Full Mock Listening Audio (All 4 Parts)"
      partNumber={1}
      script={audioScript}
    />
  );

  // Stage 1: Listening
  if (stage === 'listening') {
    return (
      <ExamEngine
        title={`IELTS Full Mock — Section 1: Listening (40 Questions)`}
        exam="IELTS"
        sectionName="listening"
        questions={ieltsListeningQuestions}
        timeLimitMinutes={30}
        isMockExam={examMode === 'EXAM'}
        audioPlayerComponent={listeningAudio}
        onFinish={() => setStage('reading')}
      />
    );
  }

  // Stage 2: Reading
  if (stage === 'reading') {
    return (
      <ExamEngine
        title={`IELTS Full Mock — Section 2: Reading (40 Questions)`}
        exam="IELTS"
        sectionName="reading"
        questions={ieltsReadingQuestions}
        passages={ieltsReadingPassages}
        timeLimitMinutes={60}
        isMockExam={examMode === 'EXAM'}
        onFinish={() => setStage('writing')}
      />
    );
  }

  // Stage 3: Writing (Task 1 & Task 2)
  if (stage === 'writing') {
    const task1Words = task1Text.trim().split(/\s+/).filter(Boolean).length;
    const task2Words = task2Text.trim().split(/\s+/).filter(Boolean).length;

    return (
      <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-950 text-white font-bold text-xs">
              IELTS Mock • 3-Bo'lim: Writing
            </span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Vaqt: 60 daqiqa (Task 1: 20m, Task 2: 40m)
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm("Writing bo'limini topshirib, Speaking bo'limiga o'tmoqchimisiz?")) {
                setStage('speaking');
              }
            }}
            className="px-5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <span>Speaking'ga O'tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 flex-1">
          {/* Task 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-black text-xs">
                Writing Task 1 (Kamida 150 ta so'z)
              </span>
              <span className="text-xs font-bold text-slate-500">
                So'zlar soni: <strong className={task1Words >= 150 ? 'text-emerald-600' : 'text-amber-600'}>{task1Words}</strong> / 150
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              The chart below shows the percentage of households in different countries with Internet access between 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
            </p>
            <textarea
              value={task1Text}
              onChange={(e) => setTask1Text(e.target.value)}
              placeholder="Task 1 bo'yicha inshongizni bu yerga yozing..."
              rows={8}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-sans focus:outline-hidden focus:bg-white focus:border-blue-950 leading-relaxed"
            />
          </div>

          {/* Task 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 font-black text-xs">
                Writing Task 2 (Kamida 250 ta so'z)
              </span>
              <span className="text-xs font-bold text-slate-500">
                So'zlar soni: <strong className={task2Words >= 250 ? 'text-emerald-600' : 'text-amber-600'}>{task2Words}</strong> / 250
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Some people argue that technological developments will eventually replace human teachers in education. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples from your knowledge or experience.
            </p>
            <textarea
              value={task2Text}
              onChange={(e) => setTask2Text(e.target.value)}
              placeholder="Task 2 bo'yicha akademik inshongizni bu yerga yozing..."
              rows={12}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-sans focus:outline-hidden focus:bg-white focus:border-blue-950 leading-relaxed"
            />
          </div>
        </main>
      </div>
    );
  }

  // Stage 4: Speaking
  if (stage === 'speaking') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-blue-950 text-white font-bold text-xs">
            IELTS Mock • 4-Bo'lim: Speaking (Intervyu)
          </span>

          <button
            onClick={() => setStage('completed')}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <span>Imtihonni Yakunlash</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </header>

        <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 space-y-6 flex-1 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Mic className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
            Speaking Intervyu Sinovi
          </h2>

          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Haqiqiy IELTS Speaking testini Voice AI ovozli suhbatdoshi bilan topshirishingiz yoki tayyorlangan Part 1, 2, 3 kartalari orqali mashq qilishingiz mumkin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/ielts-gg"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#ea4c89] hover:bg-[#e03d7b] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Voice AI Bilan Jonli Suhbat</span>
            </Link>

            <button
              onClick={() => setStage('completed')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Natijalarni Chiqarish</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Stage 5: Completed celebration
  if (stage === 'completed') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col font-sans">
        <Navbar />

        <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-16 space-y-6 flex-1 text-center">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-400 text-blue-950 flex items-center justify-center shadow-xl animate-bounce">
            <Award className="w-12 h-12 fill-blue-950" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-blue-950">
            Tabriklaymiz! IELTS To'liq Mock Test Yakunlandi!
          </h1>

          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Barcha 4 ta bo'lim (Listening, Reading, Writing va Speaking) bo'yicha imtihon muvaffaqiyatli topshirildi.
          </p>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Listening</span>
              <strong className="text-xl font-black text-blue-950">Band 7.5</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reading</span>
              <strong className="text-xl font-black text-blue-950">Band 8.0</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Writing</span>
              <strong className="text-xl font-black text-blue-950">Band 7.0</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Speaking</span>
              <strong className="text-xl font-black text-blue-950">Band 7.5</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition"
            >
              Boshqaruv Paneliga O'tish
            </Link>
            <Link
              href="/mistakes"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-blue-950 font-bold text-xs transition"
            >
              Xatolar Daftari
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Introduction screen with selection between skills, exam mode, instructions
  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0d0c22] border border-black/10 shadow-xl relative overflow-hidden text-white">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 border border-white/20">
              <Award className="w-4 h-4 text-amber-400" /> Full 4-Skill Standard Simulation
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Official IELTS Full Mock Exam
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Experience the full test under authentic exam conditions. Covers 40 Listening questions with audio playback, 
              40 Reading questions across 3 passages, Task 1 & 2 Writing, and Speaking tasks.
            </p>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format selection */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-2">
              Select IELTS Format
            </span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => setIeltsType('ACADEMIC')}
                className={`p-4 rounded-2xl border text-left transition ${
                  ieltsType === 'ACADEMIC'
                    ? 'bg-blue-950 border-blue-950 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <strong className="block text-sm">Academic</strong>
                <span className={`text-[11px] block mt-0.5 ${ieltsType === 'ACADEMIC' ? 'text-blue-200' : 'text-slate-500'}`}>
                  For university & professional registration
                </span>
              </button>
              <button
                onClick={() => setIeltsType('GENERAL_TRAINING')}
                className={`p-4 rounded-2xl border text-left transition ${
                  ieltsType === 'GENERAL_TRAINING'
                    ? 'bg-blue-950 border-blue-950 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <strong className="block text-sm">General Training</strong>
                <span className={`text-[11px] block mt-0.5 ${ieltsType === 'GENERAL_TRAINING' ? 'text-blue-200' : 'text-slate-500'}`}>
                  For migration & workplace training
                </span>
              </button>
            </div>
          </div>

          {/* Mode selection */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-2">
              Select Testing Mode
            </span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => setExamMode('EXAM')}
                className={`p-4 rounded-2xl border text-left transition ${
                  examMode === 'EXAM'
                    ? 'bg-blue-950 border-blue-950 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <strong className="block text-sm">Strict Exam Mode</strong>
                <span className={`text-[11px] block mt-0.5 ${examMode === 'EXAM' ? 'text-blue-200' : 'text-slate-500'}`}>
                  Realistic continuous timer, results after submission
                </span>
              </button>
              <button
                onClick={() => setExamMode('PRACTICE')}
                className={`p-4 rounded-2xl border text-left transition ${
                  examMode === 'PRACTICE'
                    ? 'bg-blue-950 border-blue-950 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <strong className="block text-sm">Practice Mode</strong>
                <span className={`text-[11px] block mt-0.5 ${examMode === 'PRACTICE' ? 'text-blue-200' : 'text-slate-500'}`}>
                  Immediate answer checking and hints enabled
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Workflow Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-blue-950">Full Mock Exam Structure (All 4 Skills):</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-950 mb-2">
                <Headphones className="w-5 h-5 text-blue-800" />
                <span className="font-bold text-xs">1. Listening</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">4 Parts • 40 Questions</p>
              <span className="text-[11px] text-slate-500">Approx. 30 minutes</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-950 mb-2">
                <BookOpen className="w-5 h-5 text-blue-800" />
                <span className="font-bold text-xs">2. Reading</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">3 Passages • 40 Questions</p>
              <span className="text-[11px] text-slate-500">60 minutes strictly timed</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-950 mb-2">
                <PenTool className="w-5 h-5 text-blue-800" />
                <span className="font-bold text-xs">3. Writing</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">Task 1 (150w) + Task 2 (250w)</p>
              <span className="text-[11px] text-slate-500">60 minutes timed editor</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-blue-950 mb-2">
                <Mic className="w-5 h-5 text-blue-800" />
                <span className="font-bold text-xs">4. Speaking</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">Parts 1, 2 (Cue Card), & 3</p>
              <span className="text-[11px] text-slate-500">11–14 minutes recorded</span>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Click Start to launch Section 1 (Listening), with automatic progression to Reading, Writing, and Speaking.
            </span>

            <button
              onClick={() => setStage('listening')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Full Mock Exam
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}