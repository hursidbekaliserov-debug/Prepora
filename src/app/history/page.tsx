'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Trash2
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { ExamResult } from '@/types';

export default function HistoryPage() {
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    setResults(StorageManager.getExamResults());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Clear all test attempt history?')) {
      StorageManager.clearExamResults();
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-blue-800" /> Official Exam Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Exam History & Saved Attempts</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Review your previous IELTS and SAT practice tests, raw correct answer counts, and completion times.
            </p>
          </div>

          {results.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold transition"
            >
              Clear Records
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center mx-auto border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-blue-950">No Completed Exams Yet</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Once you complete any IELTS listening/reading section or Digital SAT test, your comprehensive results will be archived here.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="/ielts/mock-exam"
                className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold transition shadow-md"
              >
                Try IELTS Mock
              </a>
              <a
                href="/sat/mock-exam"
                className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold transition shadow-md"
              >
                Try SAT Mock
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((res) => (
              <div
                key={res.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        res.examType === 'IELTS'
                          ? 'bg-blue-50 text-blue-950 border border-blue-200'
                          : 'bg-indigo-50 text-indigo-950 border border-indigo-200'
                      }`}
                    >
                      {res.examType} {res.isMockExam ? 'Full Mock' : 'Section Drill'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {res.date}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {res.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-blue-950 mt-1">
                    {res.examType === 'IELTS'
                      ? `IELTS ${res.testVariant || 'Academic'} Assessment`
                      : 'Digital SAT Assessment'}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                      Score
                    </span>
                    <span className="text-lg font-black text-blue-950">
                      {res.examType === 'IELTS'
                        ? res.ieltsReadingBand
                          ? `Band ${res.ieltsReadingBand.toFixed(1)}`
                          : 'Completed'
                        : `${res.satTotalScoreEst || 1350} pts`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
