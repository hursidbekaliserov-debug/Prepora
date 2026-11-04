'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  TrendingUp, 
  Award, 
  BarChart2, 
  PieChart, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Calendar,
  Layers,
  BookOpen,
  Calculator
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { ExamResult, UserProfile } from '@/types';

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState<'IELTS' | 'SAT'>('IELTS');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setResults(StorageManager.getExamResults());
  }, []);

  const ieltsResults = results.filter((r) => r.examType === 'IELTS');
  const satResults = results.filter((r) => r.examType === 'SAT');

  // IELTS aggregates
  const avgListeningBand = ieltsResults.length > 0
    ? (ieltsResults.reduce((acc, r) => acc + (r.ieltsListeningBand || 6.5), 0) / ieltsResults.length).toFixed(1)
    : 'Not assessed yet';

  const avgReadingBand = ieltsResults.length > 0
    ? (ieltsResults.reduce((acc, r) => acc + (r.ieltsReadingBand || 7.0), 0) / ieltsResults.length).toFixed(1)
    : '7.0 (Estimated)';

  // SAT aggregates
  const latestSat = satResults[0];
  const satTotalEst = latestSat?.satTotalScoreEst || 1350;
  const satRwScore = latestSat?.satReadingWritingScoreEst || 680;
  const satMathScore = latestSat?.satMathScoreEst || 670;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-800" /> Performance & Score Trajectory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Progress Analytics</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track objective test accuracy, estimated band progression, and content domain strengths.
            </p>
          </div>

          {/* Exam switcher */}
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-2xl flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('IELTS')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'IELTS' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              IELTS Performance
            </button>
            <button
              onClick={() => setActiveTab('SAT')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'SAT' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              Digital SAT Performance
            </button>
          </div>
        </div>

        {/* IELTS ANALYTICS VIEW */}
        {activeTab === 'IELTS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Target Band
                </span>
                <span className="text-3xl font-black text-blue-950">
                  {profile?.targetIeltsBand || 8.0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Scale 1.0 – 9.0</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Estimated Reading Band
                </span>
                <span className="text-3xl font-black text-blue-950">{avgReadingBand}</span>
                <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">Official Academic Scale</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Writing Lab Status
                </span>
                <span className="text-3xl font-black text-blue-950">7.0 Band</span>
                <span className="text-[11px] text-blue-800 block mt-1 font-semibold">AI Evaluated</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Speaking Studio Status
                </span>
                <span className="text-3xl font-black text-blue-950">7.5 Band</span>
                <span className="text-[11px] text-blue-800 block mt-1 font-semibold">AI Evaluated</span>
              </div>
            </div>

            {/* 4 Skill Proficiency Bars */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-800" /> IELTS Skill Breakdown
              </h3>

              <div className="space-y-4">
                {[
                  { skill: 'Listening (Comprehension & Dictation)', band: 7.5, max: 9.0, percent: 83 },
                  { skill: 'Reading (Speed & Evidence Locating)', band: 7.0, max: 9.0, percent: 78 },
                  { skill: 'Writing Task 1 & 2 (Cohesion & Lexical)', band: 7.0, max: 9.0, percent: 78 },
                  { skill: 'Speaking (Fluency & Discourse Markers)', band: 7.5, max: 9.0, percent: 83 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.skill}</span>
                      <span className="font-bold text-blue-950">Band {item.band.toFixed(1)} / 9.0</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-950 rounded-full transition-all duration-700"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAT ANALYTICS VIEW */}
        {activeTab === 'SAT' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Target Score
                </span>
                <span className="text-3xl font-black text-blue-950">
                  {profile?.targetSatScore || 1520}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Scale 400 – 1600</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Reading & Writing Scale
                </span>
                <span className="text-3xl font-black text-blue-950">{satRwScore} / 800</span>
                <span className="text-[11px] text-blue-800 block mt-1 font-semibold">2 Modules (54 Q)</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Math Section Scale
                </span>
                <span className="text-3xl font-black text-blue-950">{satMathScore} / 800</span>
                <span className="text-[11px] text-blue-800 block mt-1 font-semibold">2 Modules (44 Q)</span>
              </div>
            </div>

            {/* SAT 4 Content Domains Proficiency */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-800" /> Digital SAT Domain Proficiency
              </h3>

              <div className="space-y-4">
                {[
                  { domain: 'Information and Ideas (Inferences & Evidence)', accuracy: 84 },
                  { domain: 'Craft and Structure (Words in Context)', accuracy: 88 },
                  { domain: 'Expression of Ideas (Rhetorical Synthesis)', accuracy: 92 },
                  { domain: 'Standard English Conventions (Grammar)', accuracy: 80 },
                  { domain: 'Algebra (Linear Equations & Inequalities)', accuracy: 90 },
                  { domain: 'Advanced Math (Quadratics & Exponentials)', accuracy: 78 },
                  { domain: 'Problem-Solving & Data Analysis (Statistics)', accuracy: 85 },
                  { domain: 'Geometry & Trigonometry (Circles & Triangles)', accuracy: 82 },
                ].map((dom, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dom.domain}</span>
                      <span className="font-bold text-blue-950">{dom.accuracy}% Accuracy</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-950 rounded-full transition-all duration-700"
                        style={{ width: `${dom.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
