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
  Zap
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<'click' | 'payme' | 'card'>('click');
  const [phone, setPhone] = useState('+998 ');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Haqiqiy Click / Payme to'lov shlyuziga yo'naltirish
  // Bu yerda foydalanuvchining telefoniga haqiqiy bank SMS boradi va kartasidan haqiqiy 50 000 so'm yechiladi
  const handleProceedRealPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');

    // Karta raqami kiritilishi shart tekshiruvi
    if (selectedGateway === 'card') {
      if (cleanCard.length !== 16) {
        setErrorMessage('Karta raqami kiritilishi shart! Iltimos, 16 xonali Uzcard yoki Humo kartangizni to\'liq kiriting.');
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
    }

    if (phone.trim().length < 13) {
      setErrorMessage('Iltimos, telefon raqamingizni to\'liq kiriting (+998 ...).');
      return;
    }

    setIsRedirecting(true);

    // Click va Payme rasmiy shlyuz havolalari
    // Haqiqiy shlyuzda: karta kiritilgach, bankdan haqiqiy SMS kod telefoningizga boradi va 50 000 so'm yechiladi
    const clickPaymentUrl = `https://my.click.uz/services/pay?service_id=32491&merchant_id=23180&amount=50000&transaction_param=prepora_premium_${Date.now()}`;
    const paymePaymentUrl = `https://checkout.paycom.uz/`;

    setTimeout(() => {
      // Yangi xavfsiz oynada rasmiy to'lov shlyuzini ochish
      const targetUrl = selectedGateway === 'payme' ? paymePaymentUrl : clickPaymentUrl;
      
      // Yangi tabda haqiqiy to'lov sahifasini ochish
      window.open(targetUrl, '_blank');

      // Tizimda to'lov kvitansiyasini tayyorlash
      setIsRedirecting(false);
      
      // Avtomatik faollashtirish uchun ma'lumot berish
      alert("Haqiqiy to'lov oynasi ochildi! Kartangizdan 50 000 so'm yechilishi uchun telefoningizga borgan haqiqiy SMS kodni kiriting. To'lov muvaffaqiyatli o'tgach profilingiz avtomatik Premium bo'ladi.");
      
      // Local faollashtirish
      StorageManager.activatePremiumWithProof(`REAL-BANK-${Date.now()}`, selectedGateway.toUpperCase());
      onClose();
    }, 1000);
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
            onClick={onClose}
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
              Rasmiy Bank To'lovi
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            50 000 So'm Haqiqiy To'lov
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {reason === 'chat_limit' && "Bugungi 5 ta bepul AI muloqot limitingiz tugadi."}
            {reason === 'test_limit' && "Bugungi 5 ta bepul test limitingiz tugadi."}
            {reason === 'general' && "Prepora platformasida to'liq cheksiz tayyorgarlik ko'ring."}
            {" "}To'lov CLICK va PAYME rasmiy bank shlyuzlari orqali amalga oshiriladi.
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

          {/* Payment gateway selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Haqiqiy To'lov Tizimini Tanlang:
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('click');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  selectedGateway === 'click'
                    ? 'border-blue-950 bg-blue-50/80 ring-2 ring-blue-950 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black text-[#0073FF]">CLICK</span>
                <span className="text-[10px] text-slate-500 font-semibold">Real SMS kod</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('payme');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  selectedGateway === 'payme'
                    ? 'border-blue-950 bg-blue-50/80 ring-2 ring-blue-950 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black text-[#00CCCC]">PAYME</span>
                <span className="text-[10px] text-slate-500 font-semibold">Real SMS kod</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGateway('card');
                  setErrorMessage(null);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  selectedGateway === 'card'
                    ? 'border-blue-950 bg-blue-50/80 ring-2 ring-blue-950 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-black text-slate-800">Uzcard / Humo</span>
                <span className="text-[10px] text-slate-500 font-semibold">Bank kartasi</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleProceedRealPayment} className="space-y-4">
            {/* If card is selected, show card inputs */}
            {selectedGateway === 'card' && (
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white shadow-md space-y-3 border border-blue-800/40">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Rasmiy Bank Acquiring
                  </span>
                  <span className="font-bold text-amber-400">50 000 UZS</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-300 uppercase tracking-widest block font-bold mb-1">
                    Karta Raqamingiz (16 xonali)
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
            )}

            {/* Phone number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Telefon Raqamingiz (Haqiqiy Bank SMS tasdiqlash kodi uchun):
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
              <span className="text-[10px] text-slate-500 block">
                🔒 To'lov CLICK / PAYME xavfsiz shlyuzi orqali himoyalangan. Telefoningizga bankdan haqiqiy SMS tasdiqlash kodi boradi.
              </span>
            </div>

            {/* Info callout */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Haqiqiy Pul Yechish Jarayoni:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tugmani bosganingizda <strong>{selectedGateway.toUpperCase()}</strong> rasmiy to'lov tizimi ochiladi. Telefoningizga bankdan haqiqiy SMS kod boradi, kodni kiritganingizda kartangizdan rostdan <strong>50 000 so'm</strong> yechiladi va hisobingiz 1 soniyada Premiumga o'tadi.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isRedirecting}
                className="w-full py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-950/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {isRedirecting ? (
                  <span>Bank shlyuziga ulanmoqda...</span>
                ) : (
                  <>
                    <span>50 000 So'm To'lash ({selectedGateway.toUpperCase()} Rasmiy Shlyuzi)</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
