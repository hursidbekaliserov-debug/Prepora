'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { StorageManager } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        router.push('/dashboard');
      } catch (err: any) {
        setErrorMsg(err.message || 'Login failed');
        setLoading(false);
      }
    } else {
      // Local authentication for registered users
      setTimeout(() => {
        const user = StorageManager.loginUser(email, password);
        if (user) {
          window.dispatchEvent(new Event('prepora_auth_changed'));
          router.push('/dashboard');
        } else {
          setErrorMsg('Invalid email or password');
          setLoading(false);
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative">
        {/* Top logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <img 
              src="/logo.png" 
              alt="Prepora" 
              className="w-11 h-11 object-contain rounded-2xl group-hover:scale-105 transition-transform" 
            />
            <span className="text-2xl font-black text-[#171A2B] dark:text-white tracking-tight">Prepora<span className="text-[#5146E5]">.</span></span>
          </Link>
          <h1 className="text-xl font-extrabold text-[#171A2B] dark:text-white">Kirish / Sign In</h1>
          <p className="text-xs text-[#85899B] mt-1">
            IELTS va Digital SAT platformangizga kiring
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Manzil</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ismingiz@example.com"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-blue-950/20 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6 pt-6 border-t border-slate-100">
          Akkauntingiz yo'qmi?{' '}
          <Link href="/signup" className="text-blue-900 hover:underline font-bold">
            Ro'yxatdan o'tish (Sign Up)
          </Link>
        </p>
      </div>
    </div>
  );
}
