'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { SessionManager } from '@/lib/session';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AuthModal({ 
  isOpen, 
  onSuccess, 
  onClose,
  title,
  subtitle
}: AuthModalProps) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage("Iltimos, barcha maydonlarni (ism, email, parol) to'ldiring!");
        return;
      }

      if (password.length < 4) {
        setErrorMessage("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
        return;
      }

      StorageManager.registerUser(fullName.trim(), email.trim(), password.trim());
      SessionManager.touchActivity();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        window.dispatchEvent(new Event('prepora_auth_changed'));
        window.dispatchEvent(new Event('prepora_profile_updated'));
      }, 600);
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMessage("Iltimos, email va parolingizni kiriting!");
        return;
      }

      const user = StorageManager.loginUser(email.trim(), password.trim());
      if (user) {
        SessionManager.touchActivity();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onSuccess) onSuccess();
          window.dispatchEvent(new Event('prepora_auth_changed'));
          window.dispatchEvent(new Event('prepora_profile_updated'));
        }, 600);
      } else {
        setErrorMessage("Email yoki parol noto'g'ri!");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-[#171A2B] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#171A2B] via-[#1E2238] to-[#171A2B] text-white text-center relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* 3D Brand Logo */}
          <div className="w-14 h-14 mx-auto mb-2.5 flex items-center justify-center">
            <img src="/logo.png" alt="Prepora Logo" className="w-14 h-14 object-contain drop-shadow-md" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {title || (mode === 'register' ? "Prepora'da Ro'yxatdan O'tish" : "Tizimga Kirish")}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {subtitle || "IELTS va Digital SAT darsliklari, testlar va AI ustozidan foydalanish uchun hisobingizga kiring."}
          </p>

          {/* Switch tabs */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'register' ? 'bg-[#5146E5] text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ro'yxatdan O'tish
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'login' ? 'bg-[#5146E5] text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kirish (Sign In)
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-8 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">Muvaffaqiyatli!</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Profilingiz faollashtirildi, sahifa ochilmoqda...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    To'liq Ismingiz
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Sardor Aliyev"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Manzilingiz
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ismingiz@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parol
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{mode === 'register' ? "Ro'yxatdan O'tish va Boshlash" : "Tizimga Kirish"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
