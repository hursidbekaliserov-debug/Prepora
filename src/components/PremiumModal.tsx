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
  Calendar,
  Receipt
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

type PaymentStep = 'card_input' | 'sms_verify' | 'success';

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  const [step, setStep] = useState<PaymentStep>('card_input');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [smsCode, setSmsCode] = useState('');
  const [generatedSms, setGeneratedSms] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
    if (errorMessage) setErrorMessage(null);
  };

  // 1. Request SMS Code (Kartani tekshirish)
  const handleRequestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length !== 16) {
      setErrorMessage('Karta raqami kiritilishi shart! Iltimos, 16 xonali Uzcard yoki Humo kartangizni kiriting.');
      return;
    }

    if (!cleanCard.startsWith('8600') && !cleanCard.startsWith('9860') && !cleanCard.startsWith('5614')) {
      setErrorMessage('Karta raqami noto\'g\'ri! Karta Uzcard (8600...) yoki Humo (9860...) bo\'lishi kerak.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setErrorMessage('Karta amal qilish muddatini kiriting (masalan 12/28).');
      return;
    }

    if (phone.trim().length < 13) {
      setErrorMessage('SMS tasdiqlash uchun telefon raqamingizni to\'liq kiriting.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // 6 xonali SMS kod generatsiya qilish
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedSms(code);
      setIsProcessing(false);
      setStep('sms_verify');
    }, 700);
  };

  // 2. Verify SMS and Deduct 50 000 UZS from Card
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!smsCode.trim()) {
      setErrorMessage('SMS tasdiqlash kodini kiritmasdan to\'lovni amalga oshirib bo\'lmaydi!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const result = StorageManager.processCardPayment({
        cardNumber,
        expiry,
        phone,
        smsCode,
        expectedSmsCode: generatedSms,
      });

      setIsProcessing(false);

      if (result.success) {
        setReceiptData(result.receipt);
        setStep('success');
      } else {
        setErrorMessage(result.message);
      }
    }, 800);
  };

  const handleResetAndClose = () => {
    setStep('card_input');
    setCardNumber('');
    setExpiry('');
    setSmsCode('');
    setErrorMessage(null);
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
            onClick={handleResetAndClose}
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
              Bank Karta Shlyuzi
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            50 000 So'm Kartadan To'lov
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {reason === 'chat_limit' && "Bugungi 5 ta bepul AI muloqot limitingiz tugadi."}
            {reason === 'test_limit' && "Bugungi 5 ta bepul test limitingiz tugadi."}
            {reason === 'general' && "Prepora platformasida to'liq cheksiz tayyorgarlik ko'ring."}
            {" "}To'lov Uzcard va Humo bank kartalari orqali xavfsiz yechiladi.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CARD NUMBER & EXPIRY INPUT */}
          {step === 'card_input' && (
            <form onSubmit={handleRequestSms} className="space-y-4">
              {/* Virtual Card Graphic */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white shadow-md space-y-4 border border-blue-800/40">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Xavfsiz Bank Shlyuzi
                  </span>
                  <span className="font-bold uppercase tracking-wider text-amber-400">50 000 UZS</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-300 uppercase tracking-widest block font-bold mb-1">
                    Karta Raqami (16 xonali)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardChange}
                    placeholder="8600 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-base sm:text-lg font-mono font-bold tracking-widest text-amber-300 placeholder-slate-400 focus:outline-hidden focus:bg-white/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold mb-1">
                      Amal Qilish Muddati
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-400 focus:outline-hidden focus:bg-white/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold mb-1">
                      Karta Turi
                    </label>
                    <div className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 font-bold text-amber-300 text-xs">
                      {cardNumber.startsWith('8600') ? 'UzCard Online' : cardNumber.startsWith('9860') ? 'Humo Online' : 'Uzcard / Humo'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone number for SMS */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Telefon Raqamingiz (SMS tasdiqlash kodi uchun)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    required
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  ⚠️ Karta raqamini kiritmasdan yoki noto'g'ri karta bilan to'lash mumkin emas.
                </span>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-950/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {isProcessing ? (
                    <span>Karta tekshirilmoqda...</span>
                  ) : (
                    <>
                      <span>50 000 So'm To'lash (SMS Kod Olish)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SMS OTP CONFIRMATION */}
          {step === 'sms_verify' && (
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>SMS Tasdiqlash Kodi Yuborildi!</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Kartangizdan <strong>50 000 so'm</strong> yechilishi uchun <strong className="text-blue-950">{phone}</strong> raqamiga yuborilgan 6 xonali kodni kiriting.
                </p>

                {/* Simulation helper banner */}
                <div className="p-2.5 rounded-xl bg-white border border-amber-300 font-mono text-center">
                  <span className="text-[10px] text-slate-500 block uppercase">Xavfsiz Bank SMS Tasdiqlash Kodi:</span>
                  <span className="text-lg font-black text-blue-950 tracking-widest">{generatedSms}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  6 Xonali SMS Kodni Kiriting:
                </label>
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => {
                    setSmsCode(e.target.value.slice(0, 6));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masalan: 123456"
                  maxLength={6}
                  className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-2xl bg-slate-50 border border-slate-300 font-bold focus:outline-hidden focus:border-blue-950"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('card_input')}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Orqaga
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Pul yechilmoqda...</span>
                  ) : (
                    <>
                      <span>Kartadan 50 000 So'm Yechish & Faollashtirish</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OFFICIAL RECEIPT */}
          {step === 'success' && receiptData && (
            <div className="p-6 text-center space-y-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-emerald-950">50 000 So'm Muvaffaqiyatli Yechildi!</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Prepora Premium hisobingiz 1 oy muddatga to'liq cheksiz faollashtirildi.
                </p>
              </div>

              {/* Receipt card */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-left text-xs space-y-2 font-mono">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 font-bold text-slate-800">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Rasmiy To'lov Kvitansiyasi</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tranzaksiya ID:</span>
                  <span className="font-bold text-blue-950">{receiptData.transactionId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Yechilgan Summa:</span>
                  <span className="font-bold text-emerald-700">50 000 UZS</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Karta:</span>
                  <span className="font-bold text-blue-950">{receiptData.maskedCard}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sana va Vaqt:</span>
                  <span>{receiptData.date}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-md"
              >
                Cheksiz Mashg'ulotlarni Boshlash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
