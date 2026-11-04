'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Copy,
  ExternalLink,
  Send,
  AlertCircle,
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'payme' | 'click' | 'uzum' | 'card'>('payme');
  const [transactionProof, setTransactionProof] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const CARD_NUMBER = '8600 1404 9821 7345';
  const CARD_HOLDER = 'PREPORA ACADEMY (UZCOMBINATOR)';

  const handleCopyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyAndActivate = () => {
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      const result = StorageManager.activatePremiumWithProof(transactionProof, selectedMethod.toUpperCase());
      setIsProcessing(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      } else {
        setErrorMessage(result.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-blue-950 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Prepora Premium
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Cheksiz Bezlimit
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Haqiqiy Rasmiy To'lov
          </h2>

          {reason === 'chat_limit' && (
            <p className="text-xs text-amber-200 mt-1 font-medium">
              ⚠️ Bugungi 5 ta bepul AI muloqot limitingiz tugadi. 50 000 so'm evaziga 1 oy cheksiz foydalaning!
            </p>
          )}
          {reason === 'test_limit' && (
            <p className="text-xs text-amber-200 mt-1 font-medium">
              ⚠️ Bugungi 5 ta bepul test limitingiz tugadi. 50 000 so'm evaziga barcha testlarni bezlimit ishlang!
            </p>
          )}
          {reason === 'general' && (
            <p className="text-xs text-slate-300 mt-1">
              Prepora Premium oylik obunasi 50 000 so'm. O'zbekiston bank kartalari, Payme va Click orqali xavfsiz to'lang.
            </p>
          )}

          {/* Price Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-300 uppercase font-bold tracking-wider block">
                To'lov Miqdori
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">50 000</span>
                <span className="text-sm font-bold text-white">so'm / oy</span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                100% Bezlimit
              </span>
              <span className="block text-[10px] text-slate-300 mt-1">Avtomatik cheksiz kirish</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Success Notification */}
          {isSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">To'lov Muvaffaqiyatli Tasdiqlandi!</h3>
              <p className="text-xs text-emerald-800">
                Tabriklaymiz! Sizning akkauntingizga <strong>Prepora Premium</strong> faollashtirildi. Barcha limitlar olib tashlandi.
              </p>
            </div>
          ) : (
            <>
              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  1. To'lov tizimini tanlang
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('payme')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedMethod === 'payme'
                        ? 'border-blue-950 bg-blue-50/80 shadow-xs ring-2 ring-blue-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-black text-[#00CCCC]">payme</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Ilova orqali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('click')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedMethod === 'click'
                        ? 'border-blue-950 bg-blue-50/80 shadow-xs ring-2 ring-blue-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-black text-[#0073FF]">CLICK</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Tezkor to'lov</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('uzum')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedMethod === 'uzum'
                        ? 'border-blue-950 bg-blue-50/80 shadow-xs ring-2 ring-blue-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-black text-[#7B2CBF]">uzum bank</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Ilova orqali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedMethod === 'card'
                        ? 'border-blue-950 bg-blue-50/80 shadow-xs ring-2 ring-blue-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-800">UzCard/Humo</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Karta o'tkazma</span>
                  </button>
                </div>
              </div>

              {/* Official Card Requisites */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    Rasmiy Qabul Qiluvchi Karta (50 000 so'm)
                  </span>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Aktiv Karta
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/15">
                  <div>
                    <span className="text-[10px] text-slate-300 block uppercase font-mono">Karta raqami:</span>
                    <span className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                      {CARD_NUMBER}
                    </span>
                    <span className="text-[11px] text-slate-300 block font-medium mt-0.5">
                      {CARD_HOLDER}
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

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>To'lov summasi: <strong className="text-white">50 000 so'm</strong></span>
                  <a
                    href="https://t.me/prepora_support"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-amber-300 hover:underline font-semibold"
                  >
                    <Send className="w-3 h-3" />
                    Telegram Support
                  </a>
                </div>
              </div>

              {/* Transaction Proof Input */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  2. To'lov cheki raqamini (Tranzaksiya ID) yoki faollashtirish kodini kiriting
                </span>
                
                <div className="relative">
                  <input
                    type="text"
                    value={transactionProof}
                    onChange={(e) => {
                      setTransactionProof(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masalan: TRX-982145 yoki 28491823 yoki vaucher kodi"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  💡 <strong>Qanday qilib faollashtiriladi?</strong> Payme, Click yoki istalgan bank ilovasida yuqoridagi kartaga <strong>50 000 so'm</strong> o'tkazing, to'lov chekidagi tranzaksiya ID sini shu yerga yozing yoki Telegram orqali adminga chekni yuboring.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isSuccess && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Summa:</span>
              <span className="text-lg font-black text-blue-950">50 000 so'm</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-blue-950 transition"
              >
                Yopish
              </button>

              <button
                type="button"
                onClick={handleVerifyAndActivate}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs shadow-xl shadow-blue-950/20 transition flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                {isProcessing ? (
                  <span>Tekshirilmoqda...</span>
                ) : (
                  <>
                    <span>To'lovni Tasdiqlash & Faollashtirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
