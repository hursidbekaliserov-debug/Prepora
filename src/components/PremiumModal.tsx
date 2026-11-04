'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  KeyRound,
  ArrowRight,
  Bot,
  Clock,
  ExternalLink,
  RefreshCw,
  Camera,
  Trash2,
  FileCheck
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'chat_limit' | 'test_limit' | 'general';
}

export default function PremiumModal({ isOpen, onClose, reason = 'general' }: PremiumModalProps) {
  // Qabul qiluvchi karta raqami
  const RECIPIENT_CARD = process.env.NEXT_PUBLIC_RECIPIENT_CARD || '9987 1000 3057 1273';
  const TELEGRAM_BOT_URL = 'https://t.me/prepora_support_bot';

  const [activeTab, setActiveTab] = useState<'pay_and_submit' | 'manual_code' | 'telegram_bot'>('pay_and_submit');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form fields
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('+998 ');
  const [transactionProof, setTransactionProof] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'PENDING' | 'APPROVED' | 'REJECTED'>('IDLE');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto load user profile if available
  useEffect(() => {
    if (isOpen) {
      try {
        const profile = StorageManager.getProfile();
        if (profile?.fullName) setUserName(profile.fullName);
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Clean up polling interval
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Poll status when in PENDING state
  useEffect(() => {
    if (requestStatus === 'PENDING' && activeRequestId) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/telegram/check-status?requestId=${activeRequestId}`);
          const data = await res.json();

          if (data.success) {
            if (data.status === 'APPROVED') {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              setRequestStatus('APPROVED');
              setSuccessCode(data.activationCode || 'ADMIN-APPROVED');
              StorageManager.activatePremiumWithProof(data.activationCode || 'PREPORA-VIP-2026', 'Telegram Admin Verification');
              setIsSuccess(true);
            } else if (data.status === 'REJECTED') {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              setRequestStatus('REJECTED');
              setErrorMessage('To\'lov cheki admin tomonidan rad etildi. Karta hisobiga pul tushmagan yoki chek noto\'g\'ri.');
            }
          }
        } catch (err) {
          console.error('Status check error:', err);
        }
      }, 3000);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
  }, [requestStatus, activeRequestId]);

  if (!isOpen) return null;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(RECIPIENT_CARD.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Screenshot File Selection
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage("Faqat rasm formatidagi fayl yuklang (PNG, JPG, JPEG)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Rasm hajmi juda katta (maksimal 10MB). Iltimos, kichikroq skrinshot yuklang.");
      return;
    }

    setPhotoFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setPhotoBase64(null);
    setPhotoFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit receipt to Telegram Bot
  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanProof = transactionProof.trim();
    const cleanPhone = userPhone.trim();
    const cleanName = userName.trim();

    if (!cleanPhone || cleanPhone === '+998') {
      setErrorMessage('Iltimos, telefon raqamingizni kiriting!');
      return;
    }

    // Screenshot is strictly mandatory
    if (!photoBase64) {
      setErrorMessage("To'lov cheki skrinshotini (rasmini) yuklash majburiy! Iltimos, Click yoki Payme orqali to'lov cheki skrinshotini yuklang.");
      return;
    }

    if (!cleanProof) {
      setErrorMessage('Iltimos, to\'lov cheki raqamini yoki tranzaksiya izohini kiriting!');
      return;
    }

    // Ban dummy fake patterns
    const dummyPatterns = ['123456', '1234567', '12345678', '111111', '000000', 'TEST', 'DEMO'];
    if (dummyPatterns.includes(cleanProof) || /^(\d)\1+$/.test(cleanProof)) {
      setErrorMessage('Soxta yoki ketma-ket chek raqami qabul qilinmaydi! Iltimos, haqiqiy to\'lov qiling.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/telegram/submit-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: cleanName || 'O\'quvchi',
          userPhone: cleanPhone,
          transactionProof: cleanProof,
          photoBase64,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setActiveRequestId(data.requestId);
        setRequestStatus('PENDING');
      } else {
        setErrorMessage(data.message || 'Chekni yuborishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Server bilan bog\'lanishda xatolik. Qaytadan urinib ko\'ring.');
    }
  };

  // Manual code entry
  const handleVerifyManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = manualCode.trim();
    if (!clean) {
      setErrorMessage('Iltimos, rasmiy aktivatsiya kodini kiriting!');
      return;
    }

    setIsVerifyingCode(true);

    setTimeout(() => {
      const result = StorageManager.activatePremiumWithProof(clean, 'PAYME/CLICK/ADMIN');
      setIsVerifyingCode(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          handleClose();
        }, 1800);
      } else {
        setErrorMessage(result.message);
      }
    }, 600);
  };

  const handleClose = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setErrorMessage(null);
    setTransactionProof('');
    setManualCode('');
    setPhotoBase64(null);
    setPhotoFileName(null);
    setRequestStatus('IDLE');
    setActiveRequestId(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-blue-950 max-h-[94vh] flex flex-col"
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
            {" "}Pul to'g'ridan-to'g'ri rasmiy kartaga o'tkaziladi.
          </p>

          {/* Tab Selector */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pay_and_submit');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition text-center ${
                activeTab === 'pay_and_submit' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. To'lov & Chek Yuborish
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('manual_code');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition text-center ${
                activeTab === 'manual_code' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Kodni Kiritish
            </button>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-1 text-[11px]"
              title="Telegram Bot orqali yozish"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Bot</span>
            </a>
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
            /* SUCCESS SCREEN */
            <div className="p-6 text-center space-y-3 bg-emerald-50 border-2 border-emerald-300 rounded-3xl animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">To'lov Muvaffaqiyatli Tasdiqlandi!</h3>
              <p className="text-xs text-emerald-800">
                Tabriklaymiz! Telegram admin to'lov cheki skrinshotini tekshirib tasdiqladi. Prepora Pro obunasi hisobingizga muvaffaqiyatli yoqildi.
              </p>
              {successCode && (
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-emerald-950 font-bold inline-block">
                  KOD: {successCode}
                </div>
              )}
            </div>
          ) : requestStatus === 'PENDING' ? (
            /* LIVE WAITING SCREEN FOR ADMIN APPROVAL */
            <div className="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-mono font-bold border border-blue-300 inline-block mb-2">
                  So'rov ID: {activeRequestId}
                </span>
                <h3 className="text-lg font-black text-blue-950">Admin Skrinshotni Tekshirmoqda...</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-sm mx-auto">
                  Chek skrinshotingiz <strong>@prepora_support_bot</strong> orqali barcha adminlarga yuborildi. Admin kartaga 50 000 so'm tushganini tasdiqlashi bilan, ushbu oyna <strong>avtomatik Pro</strong> ga aylanadi!
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-blue-100 text-[11px] text-slate-500 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Jonli tekshirilmoqda (sahifani yopishingiz shart emas)</span>
              </div>

              <div className="flex gap-2 justify-center pt-1">
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4" />
                  <span>Telegram Botni Ochish</span>
                </a>

                <button
                  type="button"
                  onClick={() => setRequestStatus('IDLE')}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                >
                  Qaytadan Yuborish
                </button>
              </div>
            </div>
          ) : activeTab === 'pay_and_submit' ? (
            /* TAB 1: REKVIZITLAR VA TO'LOV CHEKINI YUBORISH */
            <div className="space-y-4">
              {/* Card visual */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white shadow-md space-y-2 border border-blue-800/40">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    Karta Raqami
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    50 000 so'm
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2 overflow-hidden">
                  <span className="text-base sm:text-xl font-mono font-black text-amber-300 tracking-wider whitespace-nowrap select-all">
                    {RECIPIENT_CARD}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-black transition shrink-0 shadow-sm"
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
              </div>

              {/* Form to submit receipt to Telegram Bot */}
              <form onSubmit={handleSubmitReceipt} className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    To'lov Chekini Botga Yuborish
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">
                    * Skrinshot majburiy
                  </span>
                </div>

                {/* File Upload Area for Screenshot */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>To'lov Cheki Skrinshoti:</span>
                      <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 font-black px-1.5 py-0.5 rounded">
                        MAJBURIY
                      </span>
                    </label>
                    {photoBase64 && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <FileCheck className="w-3.5 h-3.5" />
                        Yuklandi
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleScreenshotChange}
                    accept="image/*"
                    className="hidden"
                    id="receipt-screenshot-input"
                  />

                  {!photoBase64 ? (
                    <label
                      htmlFor="receipt-screenshot-input"
                      className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/60 hover:bg-blue-50 transition rounded-2xl p-4 flex flex-col items-center justify-center text-center group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 text-blue-700 flex items-center justify-center mb-1.5 transition">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-blue-950 block">
                        Chek Skrinshotini Yuklang (Majburiy)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Click yoki Payme to'lov kvitansiyasi rasmini tanlang (PNG, JPG)
                      </span>
                      <span className="mt-2.5 px-3 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <span>Faylni Tanlash</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </label>
                  ) : (
                    <div className="p-3 bg-white border-2 border-emerald-300 rounded-2xl flex items-center gap-3 shadow-xs">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoBase64}
                          alt="Chek skrinshoti"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 block truncate">
                          {photoFileName || 'To\'lov cheki skrinshoti'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                          ✓ Skrinshot adminga yuborish uchun tayyor
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="Skrinshotni almashtirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Ism / Familiyangiz:
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Masalan: Sardor Rahimov"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-blue-950"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Telefon Raqamingiz:
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-blue-950"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    To'lov Cheki / Tranzaksiya Raqami:
                  </label>
                  <input
                    type="text"
                    value={transactionProof}
                    onChange={(e) => {
                      setTransactionProof(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masalan: Payme tranzaksiya raqami yoki chek ID"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold focus:outline-hidden focus:border-blue-950"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Kvitansiyadagi tranzaksiya raqamini yozing.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Chek & Skrinshot Adminga Yuborilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Chek Skrinshotini Adminga Yuborish (50 000 so'm)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Bot info card */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-950 font-medium">
                  <Bot className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Rasmiy Admin Bot: <strong>@prepora_support_bot</strong></span>
                </div>
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 hover:underline font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>Ochish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            /* TAB 2: TASDIQLASH KODINI KIRITISH */
            <form onSubmit={handleVerifyManualCode} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Admin Bergan Kodni Kiritish
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Agar to'lov chekini Telegram orqali yuborgan bo'lsangiz yoki adminga murojaat qilgan bo'lsangiz, sizga berilgan rasmiy <strong>Aktivatsiya Kodini</strong> kiriting.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Aktivatsiya Kodi:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => {
                      setManualCode(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masalan: PREPORA-PRO-XXXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-mono font-bold uppercase focus:outline-hidden focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pay_and_submit')}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Orqaga
                </button>

                <button
                  type="submit"
                  disabled={isVerifyingCode}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isVerifyingCode ? (
                    <span>Kod tekshirilmoqda...</span>
                  ) : (
                    <>
                      <span>Pro ga O'tish</span>
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
