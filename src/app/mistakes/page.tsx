'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Bookmark, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { MistakeRecord } from '@/types';

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [filterExam, setFilterExam] = useState<'ALL' | 'IELTS' | 'SAT'>('ALL');
  const [retryAnswer, setRetryAnswer] = useState<Record<string, string>>({});
  const [retryResult, setRetryResult] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMistakes(StorageManager.getMistakes());
  }, []);

  const handleRemove = (questionId: string) => {
    StorageManager.removeMistake(questionId);
    setMistakes(StorageManager.getMistakes());
  };

  const handleTestRetry = (item: MistakeRecord) => {
    const input = (retryAnswer[item.id] || '').trim().toLowerCase();
    const correct = item.correctAnswer.trim().toLowerCase();
    const isCorrect = input === correct;

    setRetryResult((prev) => ({
      ...prev,
      [item.id]: isCorrect,
    }));
  };

  const filteredMistakes = mistakes.filter((m) => {
    if (filterExam === 'ALL') return true;
    return m.exam === filterExam;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
              <Bookmark className="w-3.5 h-3.5" /> Xatolarni Tahlil Qilish
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950">Xatolar Daftari (Mistake Notebook)</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              IELTS va SAT mashqlarida yo'l qo'yilgan xatolar bu yerga yoziladi. Tushuntirishlarni o'rganing va qaytadan yeching.
            </p>
          </div>

          {/* Exam Filter */}
          <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-2xl text-xs font-bold shrink-0">
            {(['ALL', 'IELTS', 'SAT'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setFilterExam(ex)}
                className={`px-4 py-1.5 rounded-xl transition ${
                  filterExam === ex ? 'bg-blue-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredMistakes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-blue-950">Hozircha Saqlangan Xatolar Yo'q!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              IELTS va SAT testlarini bajarganingiz sari noto'g'ri ishlangan savollar avtomatik ravishda bu yerda paydo bo'ladi.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-xs"
            >
              Mashqlarni Boshlash
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-950 border border-blue-200">
                      {item.exam}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">{item.skillOrDomain}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(item.questionId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    title="Daftardan o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                  {item.prompt}
                </p>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block mb-0.5">
                      Sizning Oldingi Javobingiz:
                    </span>
                    {item.userAnswer || '(Javob berilmagan)'}
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">
                      To'g'ri Javob:
                    </span>
                    {item.correctAnswer}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-blue-950 block mb-1">Yechim Izohi:</span>
                  {item.explanation}
                </div>

                {/* Interactive Retry Box */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={retryAnswer[item.id] || ''}
                    onChange={(e) => setRetryAnswer({ ...retryAnswer, [item.id]: e.target.value })}
                    placeholder="Qaytadan javob berib ko'ring..."
                    className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-950"
                  />
                  <button
                    onClick={() => handleTestRetry(item)}
                    className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shrink-0 shadow-xs"
                  >
                    Javobni Tekshirish
                  </button>

                  {retryResult[item.id] !== undefined && (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 ${
                        retryResult[item.id]
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {retryResult[item.id] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {retryResult[item.id] ? 'To\'g\'ri!' : 'Qayta urinib ko\'ring'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
