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
  ArrowRight,
  Lock,
  Smartphone,
  ExternalLink,
  Receipt,
  FileCheck
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

type ModalTab = 'payment' | 'verify';

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  const [tab, setTab] = useState<ModalTab>('payment');
  const [selectedGateway, setSelectedGateway] = useState<'click' | 'payme'>('click');
  const [phone, setPhone] = useState('+998 ');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasOpenedGateway, setHasOpenedGateway] = useState(false);

  if (!isOpen) return null;

  // 1. Rasmiy Click / Payme to'lov oynasini ochish
  // MUHIM: Shunchaki Click ga kirib-chiqish bilan hechkashga PRO berilmaydi!
  const handleOpenPaymentGateway = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (phone.trim().length < 13) {
      setErrorMessage('Iltimos, telefon raqamingizni to\'liq kiriting (+998 ...).');
      return;
    }

    const clickUrl = `https://my.click.uz/services/pay?service_id=32491&merchant_id=23180&amount=50000&transaction_param=prepora_${phone.replace(/\D/g, '')}`;
    const paymeUrl = `https://checkout.paycom.uz/`;

    const targetUrl = selectedGateway === 'payme' ? paymeUrl : clickUrl;

    // Rasmiy to'lov oynasini ochish
    window.open(targetUrl, '_blank');
    setHasOpenedGateway(true);
    setTab('verify');
  };

  // 2. To'lov chekini / Tranzaksiya raqamini tekshirib tasdiqlash
  const handleVerifyReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanReceipt = receiptNumber.trim();
    if (!cleanReceipt) {
      setErrorMessage('To\'lov chekidagi tranzaksiya raqamini (ID) kiritmasdan Premiumga o\'tib bo\'lmaydi!');
      return;
    }

    if (cleanReceipt.length < 6) {
      setErrorMessage('Tranzaksiya raqami xato! Chekdagi to\'liq tranzaksiya raqamini kiriting (kamida 6 ta belgi).');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const result = StorageManager.activatePremiumWithProof(cleanReceipt, selectedGateway.toUpperCase());
      setIsVerifying(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setTab('payment');
          setReceiptNumber('');
          setHasOpenedGateway(false);
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.message);
      }
    }, 800);
  };

  const handleClose = () => {
    setErrorMessage(null);
    setTab('payment');
    setHasOpenedGateway(false);
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
              Prepora Premium
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              50 000 So'm / Oy
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Haqiqiy To'lov & Faollashtirish
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {reason === 'chat_limit' && "Bugungi 5 ta bepul AI muloqot limitingiz tugadi."}
            {reason === 'test_limit' && "Bugungi 2 ta bepul test limitingiz tugadi."}
            {reason === 'general' && "Prepora platformasida to'liq cheksiz tayyorgarlik ko'ring."}
            {" "}To'lov CLICK va PAYME rasmiy tizimlari orqali amalga oshiriladi.
          </p>

          {/* Navigation Tabs between Payment & Verification */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTab('payment');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                tab === 'payment' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. To'lov Qilish (Click / Payme)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('verify');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                tab === 'verify' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Chek Raqami Bilan Tasdiqlash
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
                Prepora Premium obunasi 1 oyga faollashtirildi. Barcha testlar va video darsliklar endi cheksiz!
              </p>
            </div>
          ) : tab === 'payment' ? (
            /* TAB 1: TO'LOV TIZIMINI TANLASH VA O'TISH */
            <form onSubmit={handleOpenPaymentGateway} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  To'lov Tizimini Tanlang:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('click')}
                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedGateway === 'click'
                        ? 'border-blue-950 bg-blue-50/80 ring-2 ring-blue-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base font-black text-[#0073FF]">CLICK</span>
                    <span className="text-[10px] text-slate-500 font-semibold">CLICK Up ilovasi yoki veb</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('payme')}
                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedGateway === 'payme'
                        ? 'border-blue-950 bg-blue-50/80 ring-2 ring-blue-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base font-black text-[#00CCCC]">PAYME</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Payme ilovasi yoki veb</span>
                  </button>
                </div>
              </div>

              {/* Phone number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Telefon Raqamingiz (To'lov cheki yuboriladigan raqam):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    required
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Obuna Narxi:</span>
                  <span className="text-xl font-black text-blue-950">50 000 so'm</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                  1 Oy Bezlimit
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                💡 <strong>Eslatma:</strong> Quyidagi tugmani bosganingizda <strong>{selectedGateway.toUpperCase()}</strong> rasmiy to'lov oynasi ochiladi. To'lovni amalga oshirgach, chekdagi raqamni 2-bosqichga kiritib hisobingizni faollashtirasiz. To'lovsiz shunchaki kirib chiqish bilan Premium berilmaydi!
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-950/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>50 000 So'm To'lash ({selectedGateway.toUpperCase()} Oynasini Ochish)</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: TO'LOV CHEKI / TRANZAKSIYA RAQAMINI KIRITISH */
            <form onSubmit={handleVerifyReceipt} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1.5">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-700" />
                  To'lovni Tasdiqlash
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Click yoki Payme da to'lovni bajarganingizdan so'ng, to'lov chekida ko'rsatilgan <strong>Tranzaksiya ID</strong> (Chek raqami)ni quyidagi maydonga kiriting:
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  To'lov Cheki Raqami (Tranzaksiya ID):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => {
                      setReceiptNumber(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masalan: 38491024 yoki TRX-8921"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-mono font-semibold focus:outline-hidden focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    required
                  />
                  <FileCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Kiritilgan raqam tekshiriladi. Faqat to'langan tranzaksiyagina hisobni Premium qiladi.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTab('payment')}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Orqaga
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>Chek tekshirilmoqda...</span>
                  ) : (
                    <>
                      <span>Chekni Tekshirish & Premiumga O'tish</span>
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
