'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AuthModal({ isOpen, onSuccess, onClose }: AuthModalProps) {
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
        setErrorMessage('Iltimos, barcha maydonlarni (ism, email, parol) to\'ldiring!');
        return;
      }

      if (password.length < 4) {
        setErrorMessage('Parol kamida 4 ta belgidan iborat bo\'lishi kerak!');
        return;
      }

      StorageManager.registerUser(fullName.trim(), email.trim(), password.trim());
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        window.dispatchEvent(new Event('prepora_auth_changed'));
      }, 700);
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Iltimos, email va parolingizni kiriting!');
        return;
      }

      const user = StorageManager.loginUser(email.trim(), password.trim());
      if (user) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onSuccess) onSuccess();
          window.dispatchEvent(new Event('prepora_auth_changed'));
        }, 700);
      } else {
        setErrorMessage('Email yoki parol noto\'g\'ri!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-blue-950/20 overflow-hidden text-blue-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-950 to-indigo-950 text-white text-center relative">
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
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2.5 shadow-md">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === 'register' ? "Saytga Ro'yxatdan O'tish" : "Tizimga Kirish"}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Sayt imkoniyatlaridan foydalanish uchun ro'yxatdan o'tish majburiy.
          </p>

          {/* Switch tabs */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'register' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
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
                mode === 'login' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kirish (Sign In)
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-8 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-emerald-950">Muvaffaqiyatli!</h3>
              <p className="text-xs text-emerald-700">Profilingiz faollashtirildi, sahifaga yo'naltirilmoqdasiz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    To'liq Ismingiz
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Sardor Aliyev"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:bg-white focus:outline-hidden focus:border-blue-950"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Manzilingiz
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ismingiz@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:bg-white focus:outline-hidden focus:border-blue-950"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parol
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium focus:bg-white focus:outline-hidden focus:border-blue-950"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
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

