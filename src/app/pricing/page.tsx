'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PremiumModal from '@/components/PremiumModal';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Award, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';

export default function PricingPage() {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setSubStatus(StorageManager.getSubscriptionStatus());
    };
    update();

    window.addEventListener('prepora_subscription_updated', update);
    return () => window.removeEventListener('prepora_subscription_updated', update);
  }, []);

  const faqs = [
    {
      q: "50 000 so'mlik Premium obunaga nimalar kiradi?",
      a: "Prepora Premium bilan siz platformadagi barcha imkoniyatlardan mutlaqo bezlimit (cheksiz) foydalanasiz: Voice AI bilan cheksiz ovozli suhbat, 24/7 AI repetitor, to'liq 98 savollik SAT va 4 ko'nikmali IELTS mock testlari hamda insholarni Cambridge mezonlari bo'yicha tekshirish."
    },
    {
      q: "Bepul tarifda qanday cheklovlar bor?",
      a: "Bepul (Standart) hisob egalari uchun har kuni 5 ta AI muloqot xabari (Voice AI yoki AI Repetitor) va 5 ta test ishlash imkoniyati beriladi. Har kecha soat 00:00 da bu limitlar qayta tiklanadi."
    },
    {
      q: "Qanday to'lov tizimlari orqali to'lash mumkin?",
      a: "O'zbekistondagi barcha asosiy tizimlar: Payme, Click, Uzum Bank hamda UzCard va Humo bank kartalari orqali xavfsiz to'lash mumkin. To'lovdan so'ng hisobingiz 1 soniyada Premiumga aylanadi."
    },
    {
      q: "Obunani keyinroq bekor qilsa bo'ladimi?",
      a: "Albatta. Hech qanday majburiyat yo'q, xohlagan paytingizda sozlamalar bo'limidan bekor qilishingiz mumkin."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-blue-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-extrabold shadow-xs">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Prepora Obuna & Tarif Rejalari</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight">
            IELTS va SAT Maqsadingizga <br />
            <span className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Cheklovlarsiz Ering!
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium">
            O'zingizga mos tarifni tanlang. Xohlasangiz har kuni bepul limitlardan foydalaning, 
            yoki atigi <strong>50 000 so'm</strong> evaziga to'liq <strong>Bezlimit Premium</strong> ga o'ting!
          </p>
        </div>

        {/* Current status banner if user is premium */}
        {subStatus?.isPremium && (
          <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black">
                <Crown className="w-7 h-7 fill-blue-950" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">Faol Obuna</span>
                <h3 className="text-lg font-black text-blue-950">Sizda Prepora Premium (Bezlimit) Faol!</h3>
                <p className="text-xs text-slate-600">Barcha IELTS & SAT modullari va AI suhbatlari cheksiz ishlamoqda.</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm("Haqiqatan ham Premium obunani bekor qilmoqchimisiz?")) {
                  StorageManager.cancelPremium();
                }
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-600 hover:text-rose-600 transition"
            >
              Obunani Bekor Qilish
            </button>
          </div>
        )}

        {/* PRICING CARDS (2 COLUMNS: FREE vs PREMIUM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. FREE PLAN */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Standart Bepul
                </span>
                <span className="text-xs text-slate-400 font-semibold">Har kuni 00:00 da yangilanadi</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-950">0</span>
                  <span className="text-sm font-bold text-slate-500">so'm / doimiy bepul</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sayt bilan tanishish va kunlik qisqa mashqlar uchun.
                </p>
              </div>

              {/* Quota usage pills */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Bugungi AI Chat Limiti:</span>
                  <span className="text-blue-950 font-bold">{subStatus?.isPremium ? 'Bezlimit' : `${subStatus?.dailyChatRemaining ?? 5}/5 qoldi`}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Bugungi Test Limiti:</span>
                  <span className="text-blue-950 font-bold">{subStatus?.isPremium ? 'Bezlimit' : `${subStatus?.dailyTestRemaining ?? 5}/5 qoldi`}</span>
                </div>
              </div>

              <div className="pt-2 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kuniga 5 ta AI chat & Voice AI ovozli savol</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kuniga 5 ta test/mashq savolini yechish</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lug'at va audio talaffuz kartochkalari</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>To'liq 98 savollik Digital SAT Mock (Cheklangan)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Band 9.0 insho qayta yozish va batafsil tahlili</span>
                </div>
              </div>
            </div>

            <button
              disabled
              className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default text-center"
            >
              Joriy Standart Tarif
            </button>
          </div>

          {/* 2. PREMIUM PLAN (50,000 UZS) */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-white border-2 border-amber-400 shadow-xl flex flex-col justify-between space-y-6 ring-4 ring-amber-400/10">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Eng Mashhur & To'liq
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  Prepora Premium
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  100% Bezlimit
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-blue-950">50 000</span>
                  <span className="text-base font-extrabold text-slate-600">so'm / oy</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  IELTS 8.0+ yoki SAT 1500+ ga intilayotgan barcha talabalar uchun.
                </p>
              </div>

              {/* Highlight callout */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>Hech qanday kunlik limitlarsiz to'liq cheksiz foydalanish!</span>
              </div>

              <div className="pt-2 space-y-3 text-xs text-slate-800 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-blue-950">Bezlimit Voice AI ovozli suhbat</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-blue-950">Bezlimit AI Shaxsiy Repetitor (24/7 muloqot)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-blue-950">To'liq IELTS & SAT Mock Imtihonlari (Cheksiz)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cambridge 4-Mezonli Insho tekshirish va Band 9 tahlil</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SAT Math Desmos kalkulyator formulalari va qadam-baqadam yechim</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shaxsiy Xatolar Banki va 100+ kunlik Progress Tarixi</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-sm shadow-xl shadow-blue-950/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <span>{subStatus?.isPremium ? "Premium Ma'lumotlari" : "50 000 so'm To'lash & Premiumga O'tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PAYMENT PARTNERS LOGOS */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Ishonchli va Xavfsiz O'zbekiston To'lov Tizimlari
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-black text-slate-700">
            <span className="text-[#00CCCC] font-extrabold text-lg">payme</span>
            <span className="text-[#0073FF] font-extrabold text-lg">CLICK</span>
            <span className="text-[#7B2CBF] font-extrabold text-lg">uzum bank</span>
            <span className="text-blue-950 font-bold text-base">UzCard</span>
            <span className="text-amber-700 font-bold text-base">HUMO</span>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-blue-950">Ko'p So'raladigan Savollar</h3>
            <p className="text-xs text-slate-500">Obuna va to'lovlar haqida barcha kerakli ma'lumotlar</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-800 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      <PremiumModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        reason="general"
      />
    </div>
  );
}
