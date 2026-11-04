'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Send, 
  Lock, 
  ExternalLink, 
  Receipt,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  // Qabul qiluvchi haqiqiy karta rekvizitlari
  // O'quvchi to'lagan 50 000 so'm to'g'ridan-to'g'ri shu kartaga tushadi
  const RECIPIENT_CARD = '8600 1404 9821 7345';
  const RECIPIENT_NAME = 'PREPORA ACADEMY (UZCARD / HUMO)';
  const TELEGRAM_ADMIN = 'https://t.me/prepora_support';

  const [activeTab, setActiveTab] = useState<'pay' | 'verify'>('pay');
  const [activationCode, setActivationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(RECIPIENT_CARD.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = activationCode.trim();
    if (!clean) {
      setErrorMessage('Iltimos, to\'lov tasdiqlash kodini kiriting!');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const result = StorageManager.activatePremiumWithProof(clean, 'CLICK/PAYME');
      setIsVerifying(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setActiveTab('pay');
          setActivationCode('');
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.message);
      }
    }, 600);
  };

  const handleClose = () => {
    setErrorMessage(null);
    setActivationCode('');
    setActiveTab('pay');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-blue-950 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-400/30">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
              Prepora Pro Obunasi
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              50 000 So'm / Oy
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            To'lov Qilish & Faollashtirish
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {reason === 'chat_limit' && "Bugungi 5 ta bepul AI muloqot limitingiz tugadi."}
            {reason === 'test_limit' && "Bugungi 2 ta bepul test limitingiz tugadi."}
            {reason === 'general' && "Prepora platformasida to'liq cheksiz tayyorgarlik ko'ring."}
            {" "}Pul to'g'ridan-to'g'ri rasmiy kartaga qabul qilinadi.
          </p>

          {/* Tab Selector */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pay');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'pay' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Kartaga 50 000 So'm To'lash
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('verify');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'verify' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Chek / Kodni Kiritish
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 border-2 border-emerald-300 rounded-3xl animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">To'lov Muvaffaqiyatli Tasdiqlandi!</h3>
              <p className="text-xs text-emerald-800">
                Tabriklaymiz! Prepora Pro obunasi faollashtirildi. Barcha SAT/IELTS testlari va video darsliklar endi cheksiz bezlimit!
              </p>
            </div>
          ) : activeTab === 'pay' ? (
            /* TAB 1: REKVIZITLAR VA TO'LOV QILISH */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white shadow-md space-y-3 border border-blue-800/40">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    Pul Qabul Qiluvchi Karta
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Aktiv Hisob
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase font-mono block">Karta Raqami:</span>
                    <span className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                      {RECIPIENT_CARD}
                    </span>
                    <span className="text-[11px] text-slate-300 block font-medium mt-0.5">
                      {RECIPIENT_NAME}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-bold transition shrink-0 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Nusxalandi!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nusxalash</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-300 pt-1 border-t border-white/10">
                  <span>To'lov summasi: <strong className="text-white font-bold">50 000 so'm</strong></span>
                  <span className="text-emerald-400 font-bold">Payme / Click / Humo</span>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-blue-950 block uppercase text-[11px] tracking-wider">
                  Qanday qilib to'lov qilinadi?
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed text-[11px]">
                  <li>Yuqoridagi karta raqamini nusxalab oling.</li>
                  <li><strong>Payme, Click</strong> yoki istalgan bank ilovangizdan shu kartaga <strong>50 000 so'm</strong> o'tkazing (pul to'g'ridan-to'g'ri shu kartaga tushadi).</li>
                  <li>To'lov chekini Telegram adminga yuboring va rasmiy aktivatsiya kodini oling.</li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <a
                  href={TELEGRAM_ADMIN}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Chekni Adminga Yuborish (Telegram)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveTab('verify')}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Kodni Kiritish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: TASDIQLASH KODINI KIRITISH */
            <form onSubmit={handleVerifyPayment} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Haqiqiy To'lov Tekshiruvi
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  To'lov qilganingizdan so'ng adminga chekni yuborib olingan rasmiy <strong>Aktivatsiya Kodini</strong> kiriting. Soxta raqamlar (masalan 12345678) qabul qilinmaydi!
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Rasmiy Aktivatsiya Kodi:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={activationCode}
                    onChange={(e) => {
                      setActivationCode(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masalan: PREPORA-VIP-2026 yoki ADMIN bergan kod"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-mono font-bold uppercase focus:outline-hidden focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Kod to'g'ri bo'lgandagina akkauntingiz Pro ga aylanadi.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pay')}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Orqaga
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>Kod tekshirilmoqda...</span>
                  ) : (
                    <>
                      <span>To'lovni Tasdiqlash & Proga O'tish</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
