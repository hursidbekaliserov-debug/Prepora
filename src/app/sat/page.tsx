'use client';

import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export default function SatHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hub Header */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-blue-900" /> Rasmiy 1600-Ballik Digital SAT
            </div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight">Digital SAT Tayyorgarlik Markazi</h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Reading & Writing (54 Q) va Math (44 Q) bo'limlarini rasmiy College Board standartida o'rganing. 
              Desmos formulalari va 98 savollik to'liq mock test.
            </p>
          </div>

          <Link
            href="/sat/mock-exam"
            className="px-6 py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md shadow-blue-950/20 transition flex items-center justify-center gap-2 shrink-0"
          >
            <Award className="w-4 h-4" /> To'liq 98 Savollik Mock
          </Link>
        </div>

        {/* 2 Core SAT Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Reading and Writing */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  2 Modul • 54 Savol • 64 Daqiqa
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Reading and Writing</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                4 ta asosiy domenni qamrab oladi: Information and Ideas, Craft and Structure, Expression of Ideas, 
                hamda Standard English Conventions. Qisqa matnlar va 4 ta variant.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-semibold mb-6">
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Information & Ideas
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Craft and Structure
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Expression of Ideas
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • English Conventions
                </span>
              </div>
            </div>

            <Link
              href="/sat/reading-writing"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Reading & Writing Mashqlari <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Section 2: Math */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center border border-blue-100">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  2 Modul • 44 Savol • 70 Daqiqa
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Math Dvigateli</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Ko'p variantli va o'quvchi tomonidan yoziladigan raqamli javoblar (grid-in). 
                Geometriya va algebra formulalari, bosqichma-bosqich yechimlar.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-semibold mb-6">
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Algebra (Tenglamalar)
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Kvadratik Funksiyalar
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Ma'lumotlar Tahlili
                </span>
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  • Geometriya & Trigonometriya
                </span>
              </div>
            </div>

            <Link
              href="/sat/math"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-950 hover:text-white text-blue-950 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
            >
              Math Mashqlari <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SAT Structure Explainer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-blue-950 mb-2">Digital SAT To'liq Test Tuzilishi:</h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Digital SAT ikkita bo'lim va jami 4 ta moduldan iborat. Umumiy test vaqti 2 soat 14 daqiqa bo'lib, o'rtada 10 daqiqalik tanaffus mavjud.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-blue-950 block uppercase tracking-wider mb-1">
                Modul 1
              </span>
              <h4 className="text-sm font-bold text-slate-900">RW Modul 1</h4>
              <p className="text-xs text-slate-500 mt-1">27 Savol • 32 Daq</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-blue-950 block uppercase tracking-wider mb-1">
                Modul 2
              </span>
              <h4 className="text-sm font-bold text-slate-900">RW Modul 2</h4>
              <p className="text-xs text-slate-500 mt-1">27 Savol • 32 Daq</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-blue-950 block uppercase tracking-wider mb-1">
                Modul 3
              </span>
              <h4 className="text-sm font-bold text-slate-900">Math Modul 1</h4>
              <p className="text-xs text-slate-500 mt-1">22 Savol • 35 Daq</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-blue-950 block uppercase tracking-wider mb-1">
                Modul 4
              </span>
              <h4 className="text-sm font-bold text-slate-900">Math Modul 2</h4>
              <p className="text-xs text-slate-500 mt-1">22 Savol • 35 Daq</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
