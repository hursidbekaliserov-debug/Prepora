'use client';

import React, { useState } from 'react';
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
  ShieldAlert,
  Play
} from 'lucide-react';
import { IELTSType } from '@/types';

type MockStage = 'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'completed';

export default function IeltsMockExamPage() {
  const [stage, setStage] = useState<MockStage>('intro');
  const [ieltsType, setIeltsType] = useState<IELTSType>('ACADEMIC');
  const [examMode, setExamMode] = useState<'EXAM' | 'PRACTICE'>('EXAM');

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

  // If in active stage, render the corresponding skill engine
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

  // Introduction screen with selection between skills, exam mode, instructions
  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-blue-950 border border-blue-900 shadow-xl relative overflow-hidden text-white">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/40 text-blue-200 text-xs font-bold mb-3 border border-blue-700/50">
              <Award className="w-4 h-4 text-blue-300" /> Full 4-Skill Standard Simulation
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
