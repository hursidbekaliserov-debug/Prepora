'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  ArrowRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Calculator,
  Check,
  ChevronRight,
  Star,
  Zap,
  HelpCircle,
  GraduationCap,
  Users,
  Target,
  Play,
  RotateCcw,
  Crown,
  Search,
  CheckCircle2,
  Award,
  Video,
  ShieldCheck,
  TrendingUp,
  Flame,
  ChevronDown,
  Globe,
  MessageSquare
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

export default function LandingPage() {
  // Capture referral code if arriving via referral link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('prepora_referred_by', ref);
      }
    }
  }, []);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mockPreviewTab, setMockPreviewTab] = useState<'ielts' | 'sat'>('ielts');

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: "Prepora platformasi nima va u qanday imtihonlarga tayyorlaydi?",
      a: "Prepora — xalqaro IELTS va Digital SAT imtihonlariga eng yuqori darajada tayyorlanish uchun mo'ljallangan zamonaviy intellektual platforma. Bizda Cambridge formatidagi to'liq mock imtihonlar, Desmos kalkulyatorli SAT darslari, sun'iy intellekt asosidagi Voice Speaking va insho tekshiruvchi modullar jamlangan."
    },
    {
      q: "Voice AI Speaking qanday ishlaydi?",
      a: "Voice AI real vaqt rejimida siz bilan mikrofon orqali ingliz tilida suhbatlashadi. Xuddi rasmiy Cambridge imtihonchisi kabi Part 1, Part 2 va Part 3 savollarini beradi, talaffuzingiz, grammatikangiz va so'z boyligingizni tahlil qilib, aniq IELTS Band ballini chiqarib beradi."
    },
    {
      q: "Bepul foydalanish imkoniyati bormi?",
      a: "Ha! Har bir yangi o'quvchi uchun mock testlar, kundalik bepul video darsliklar, lug'at va so'z kartochkalari ochiq. Shuningdek, 10 ta do'stingizni taklif qilib, 1 oylik to'liq Prepora Pro obunasini mutlaqo bepul qo'lga kiritishingiz mumkin."
    },
    {
      q: "Prepora Pro obunasi qancha va unga nimalar kiradi?",
      a: "Prepora Pro obunasi oyiga atigi 50 000 so'm. Unga cheksiz barcha 20 ta video masterclasslar, cheksiz AI Tutor savollari, to'liq Cambridge va Digital SAT mock testlari hamda VIP status kiradi."
    },
    {
      q: "Platformadan telefonda yoki planshetda foydalanish mumkinmi?",
      a: "Albatta! Prepora to'liq responsiv bo'lib, mobil telefon, planshet, noutbuk va kompyuterlarda yuqori tezlikda hamda qulay ishlaydi."
    }
  ];

  const TESTIMONIALS = [
    {
      name: "Jasur Rahmatov",
      exam: "IELTS Academic",
      score: "Band 8.5",
      university: "Admitted to University of Oxford",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      comment: "Prepora'ning Voice AI Speaking moduli meni imtihon oldidagi barcha hayajonimni yo'qotdi. Imtihondan roppa-rosa 8.5 oldim!"
    },
    {
      name: "Madina Karimova",
      exam: "Digital SAT",
      score: "1540 Ball",
      university: "MIT Class of 2029",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      comment: "Desmos darslari va savolma-savol tahlillar shunchaki ajoyib. Matematikadan 800/800 olishimda eng katta yordamchi bo'ldi."
    },
    {
      name: "Sardorbek Aliyev",
      exam: "IELTS Academic",
      score: "Band 8.0",
      university: "National University of Singapore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      comment: "Writing Task 1 va Task 2 insholarimni soniyalar ichida tekshirib, xatolarimni ko'rsatib bergani uchun juda minnatdorman."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans selection:bg-[#5146E5] selection:text-white">
      {/* 1. Modern Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          {/* Subtle geometric gradient orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#5146E5]/10 via-[#8B7CF6]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#171A2B] tracking-tight leading-[1.08] max-w-4xl mx-auto">
              Your Journey to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5146E5] via-[#6366F1] to-[#8B7CF6]">
                Academic Excellence
              </span> Starts Here.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-[#85899B] max-w-2xl mx-auto leading-relaxed font-normal">
              IELTS va Digital SAT imtihonlariga eng ilg'or AI texnologiyalari, real-time Speaking suhbatdosh, Desmos darsliklari va to'liq mock testlar bilan tayyorlaning.
            </p>

            {/* Two Prominent Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#5146E5]/25 hover:shadow-xl hover:shadow-[#5146E5]/35 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#courses"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#171A2B] font-bold text-sm sm:text-base border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#5146E5]" />
                <span>Explore Courses</span>
              </a>
            </div>

            {/* Trust Metrics Pill */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#85899B] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4,800+ Faol Talabalar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>O'rtacha +1.5 IELTS Band O'sishi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Digital SAT 1500+ Natijalari</span>
              </div>
            </div>

            {/* 3. Educational Dashboard Preview Mockup */}
            <div className="pt-8 max-w-5xl mx-auto">
              <div className="p-3 sm:p-5 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xl space-y-4">
                {/* Mockup Window Controls & Tabs */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-mono font-bold text-[#85899B]">prepora.app/dashboard</span>
                  </div>

                  {/* Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => setMockPreviewTab('ielts')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        mockPreviewTab === 'ielts' ? 'bg-[#5146E5] text-white shadow-xs' : 'text-[#85899B]'
                      }`}
                    >
                      IELTS Module Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockPreviewTab('sat')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        mockPreviewTab === 'sat' ? 'bg-[#5146E5] text-white shadow-xs' : 'text-[#85899B]'
                      }`}
                    >
                      SAT Module Preview
                    </button>
                  </div>
                </div>

                {/* Dashboard Inner Preview */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] text-left grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Column stats */}
                  <div className="md:col-span-4 space-y-3">
                    <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#85899B]">Hozirgi Natija</span>
                      <div className="text-3xl font-black text-[#171A2B] mt-1">
                        {mockPreviewTab === 'ielts' ? 'Band 8.0' : '1520 Ball'}
                      </div>
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +15% o'sish bu oyda
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#171A2B]">
                        <span>Kunlik Reja</span>
                        <span className="text-[#5146E5]">3/4 Bajarildi</span>
                      </div>
                      <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                        <div className="bg-[#5146E5] h-2 rounded-full w-3/4" />
                      </div>
                      <span className="text-[11px] text-[#85899B] block">🔥 7 kunlik ketma-ket o'rganish seriyasi</span>
                    </div>
                  </div>

                  {/* Right Column tasks / cards */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5146E5]/10 text-[#5146E5] flex items-center justify-center">
                          {mockPreviewTab === 'ielts' ? <Mic className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#171A2B]">
                            {mockPreviewTab === 'ielts' ? 'Voice AI Speaking Practice #4' : 'Desmos Quadratic Systems Mastery'}
                          </h4>
                          <span className="text-[11px] text-[#85899B]">
                            {mockPreviewTab === 'ielts' ? 'Part 2: Describe a memorable journey' : '15 ta murakkab savol yechimi'}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={mockPreviewTab === 'ielts' ? '/ielts-gg' : '/sat/math'}
                        className="px-3.5 py-1.5 rounded-xl bg-[#171A2B] text-white text-xs font-bold hover:bg-[#252A40] transition shrink-0"
                      >
                        Boshlash
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                        <span className="text-[10px] text-[#85899B] uppercase font-bold">
                          {mockPreviewTab === 'ielts' ? 'Writing Task 2' : 'EBRW Grammar'}
                        </span>
                        <div className="text-sm font-bold text-[#171A2B] mt-0.5">
                          {mockPreviewTab === 'ielts' ? 'AI Insho Tahlili' : 'Tinish belgilari'}
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold block mt-1">✓ 100% Tayyor</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                        <span className="text-[10px] text-[#85899B] uppercase font-bold">
                          {mockPreviewTab === 'ielts' ? 'Listening Cambridge 19' : 'Math Hard Module'}
                        </span>
                        <div className="text-sm font-bold text-[#171A2B] mt-0.5">
                          {mockPreviewTab === 'ielts' ? 'Audio Test 40 savol' : '22 ta test'}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-1">40/40 To'g'ri</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. IELTS and SAT Course Cards (#courses) */}
        <section id="courses" className="py-16 md:py-24 bg-white border-y border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-xs font-bold uppercase tracking-wider">
                Imtihon Yo'nalishlari
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171A2B] tracking-tight">
                Ixtisoslashgan IELTS & SAT Kurslari
              </h2>
              <p className="text-sm text-[#85899B]">
                Har bir imtihonning o'ziga xos talablari, mezonlari va texnikalariga to'liq moslashtirilgan dasturlar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* CARD 1: IELTS */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] hover:border-[#5146E5] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl group space-y-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#5146E5] text-white text-xs font-bold uppercase tracking-wider">
                      Band 7.5 - 9.0
                    </span>
                    <span className="text-xs font-bold text-[#85899B]">Cambridge Format</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#171A2B]">
                      IELTS Complete Mastery
                    </h3>
                    <p className="text-xs sm:text-sm text-[#85899B] mt-2 leading-relaxed">
                      Academic va General Training modullari: Listening audio pleer, Reading matnlari, sun'iy intellektli Writing insho baholash va jonli Voice AI Speaking imtihonchisi.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Cambridge 15-19 formatidagi 40 ta Listening & 3 ta Reading matnlari</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Real-time Voice AI Speaking suhbati va talaffuz tahlili</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Writing Task 1 va 2 bo'yicha tezkor mezonlar tahlili</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>10 ta eng sara video darsliklar va lug'at kartochkalari</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/ielts"
                    className="w-full py-4 rounded-2xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Start IELTS Preparation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* CARD 2: DIGITAL SAT */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] hover:border-[#171A2B] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl group space-y-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#171A2B] text-white text-xs font-bold uppercase tracking-wider">
                      Target 1500 - 1600
                    </span>
                    <span className="text-xs font-bold text-[#85899B]">College Board Style</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#171A2B]">
                      Digital SAT 1600 Elite
                    </h3>
                    <p className="text-xs sm:text-sm text-[#85899B] mt-2 leading-relaxed">
                      Yangi Bluebook moslashuvchan test formati: Desmos kalkulyatorini 100% o'rganish, Reading & Writing grammatika va lug'at qoidalari, qiyin darajadagi modullar.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Desmos kalkulyatori yordamida har qanday tenglamani 5 soniyada yechish</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Reading & Writing modulida tinish belgilari va rhetorical synthesis</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Moslashuvchan Hard Module savollarini yechish bo'yicha tahlil</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2B]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>10 ta professional SAT video masterclass va test savollari</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/sat"
                    className="w-full py-4 rounded-2xl bg-[#171A2B] hover:bg-[#252A40] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Start SAT Preparation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Features Section */}
        <section className="py-16 md:py-24 bg-[#F8F9FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-xs font-bold uppercase tracking-wider">
                Imkoniyatlar
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171A2B] tracking-tight">
                Nima Uchun Prepora Boshqalardan Ustun?
              </h2>
              <p className="text-sm text-[#85899B]">
                Faqat kitob o'qish emas, balki sun'iy intellekt va faol o'yin elementlari bilan natijaga kafolat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5146E5]/10 text-[#5146E5] flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">Voice AI Speaking Suhbatdoshi</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  Haqiqiy inson kabi talaffuzingiz va ravonligingizni tinglaydi, darhol band bahosini beradi.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">Desmos SAT Kalkulyator Integratsiyasi</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  Rasmiy Digital SAT interfeysi bilan 1:1 o'xshash kalkulyator va uning barcha sirlari.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">Tezkor Insho (Essay) Baholash</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  Task 1 va Task 2 insholarini yuboring, AI gramatika, leksika va tuzilish xatolarini tuzatib beradi.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">24/7 AI Shaxsiy Repetitor</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  Har qanday tushunarsiz qoida yoki matematik tenglamani so'rang, batafsil qadamma-qadam tushuntirib beradi.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">20 Ta Eksklyuziv Video Darslik</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  IELTS va SAT bo'yicha 10 tadan eng sara video masterclasslar to'g'ridan-to'g'ri platformada.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md transition space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#171A2B]">3D Avatar & Gamifikatsiya</h3>
                <p className="text-xs text-[#85899B] leading-relaxed">
                  XP to'plang, o'g'il yoki qiz bola 3D qahramoningizni shohona kiyimlar va aksessuarlar bilan kiyintiring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Learning Statistics */}
        <section className="py-16 md:py-20 bg-[#171A2B] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#5146E5] font-mono">98.4%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Maqsadiga Erishganlar</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-white font-mono">120K+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Yechilgan Test Savollari</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#8B7CF6] font-mono">14,500+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">AI Tekshirgan Insholar</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono">4.9 / 5</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">O'quvchilar Bahosi</div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Student Testimonials */}
        <section className="py-16 md:py-24 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-xs font-bold uppercase tracking-wider">
                Fikrlar
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171A2B] tracking-tight">
                Muvaffaqiyatli Talabalar Fikrlari
              </h2>
              <p className="text-sm text-[#85899B]">
                Prepora orqali o'z maqsadiga erishgan o'zbekistonlik talabalar haqiqiy natijalari.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#171A2B] leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#171A2B]">{t.name}</h4>
                      <span className="text-[10px] text-[#5146E5] font-bold block">{t.exam} • {t.score}</span>
                      <span className="text-[9px] text-[#85899B] font-medium block">{t.university}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section className="py-16 md:py-24 bg-[#F8F9FC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#5146E5]/10 text-[#5146E5] text-xs font-bold uppercase tracking-wider">
                Ko'p Beriladigan Savollar
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171A2B] tracking-tight">
                Tez-tez So'raladigan Savollar
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left font-bold text-xs sm:text-sm text-[#171A2B] flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#85899B] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#5146E5]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-[#85899B] leading-relaxed border-t border-[#F3F4F6]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to action card */}
        <section className="py-12 md:py-16 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#171A2B] to-[#252A40] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-black">
                  Tayyorgarlikni Bugunoq Boshlang!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                  Ro'yxatdan o'ting, 3D qahramoningizni tanlang va IELTS hamda Digital SAT'dan yuqori ball oling.
                </p>
              </div>

              <Link
                href="/signup"
                className="px-8 py-4 rounded-2xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-bold text-sm transition shadow-lg shrink-0 flex items-center gap-2"
              >
                <span>Bepul Ro'yxatdan O'tish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Professional Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12 text-xs text-[#85899B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Prepora" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-base font-black text-[#171A2B]">Prepora<span className="text-[#5146E5]">.</span></span>
              </div>
              <p className="text-xs text-[#85899B] max-w-sm leading-relaxed">
                IELTS va Digital SAT imtihonlariga xalqaro standartda tayyorlovchi zamonaviy sun'iy intellekt ta'lim platformasi.
              </p>
              <div className="text-[11px] text-[#85899B]">
                © {new Date().getFullYear()} Prepora Academy. Barcha huquqlar himoyalangan.
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-[#171A2B] uppercase tracking-wider text-[11px]">IELTS</h4>
              <ul className="space-y-1.5">
                <li><Link href="/ielts/listening" className="hover:text-[#5146E5]">Listening Mock</Link></li>
                <li><Link href="/ielts/reading" className="hover:text-[#5146E5]">Reading Mock</Link></li>
                <li><Link href="/ielts/writing" className="hover:text-[#5146E5]">Writing AI Grader</Link></li>
                <li><Link href="/ielts-gg" className="hover:text-[#5146E5]">Voice AI Speaking</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-[#171A2B] uppercase tracking-wider text-[11px]">Digital SAT</h4>
              <ul className="space-y-1.5">
                <li><Link href="/sat/math" className="hover:text-[#5146E5]">SAT Math & Desmos</Link></li>
                <li><Link href="/sat/reading-writing" className="hover:text-[#5146E5]">Reading & Writing</Link></li>
                <li><Link href="/sat/mock-exam" className="hover:text-[#5146E5]">Full SAT Mock</Link></li>
                <li><Link href="/lessons" className="hover:text-[#5146E5]">SAT Video Darslar</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-[#171A2B] uppercase tracking-wider text-[11px]">Platforma</h4>
              <ul className="space-y-1.5">
                <li><Link href="/dashboard" className="hover:text-[#5146E5]">Student Dashboard</Link></li>
                <li><Link href="/arena" className="hover:text-[#5146E5]">Arena PvP</Link></li>
                <li><Link href="/referral" className="hover:text-[#5146E5]">Do'stlar & Bepul Pro</Link></li>
                <li><Link href="/pricing" className="hover:text-[#5146E5]">Tariflar (Pricing)</Link></li>
                <li><Link href="/settings" className="hover:text-[#5146E5]">3D Avatar Studiyasi</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
