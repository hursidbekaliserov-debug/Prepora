'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { StorageManager } from '@/lib/storage';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || localStorage.getItem('prepora_referred_by');
      if (ref) {
        setRefCode(ref);
        localStorage.setItem('prepora_referred_by', ref);
      }
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Iltimos, barcha maydonlarni to\'ldiring');
      setLoading(false);
      return;
    }

    // Process referral verification if referred
    if (refCode) {
      try {
        const storedRef = localStorage.getItem('prepora_referral_data');
        if (storedRef) {
          const parsed = JSON.parse(storedRef);
          parsed.invitedFriends = parsed.invitedFriends || [];
          parsed.invitedFriends.unshift({
            id: `ref_${Date.now()}`,
            name: fullName.trim(),
            date: new Date().toLocaleDateString('uz-UZ'),
            status: 'verified',
            joinedExam: 'Digital SAT & IELTS',
          });
          parsed.invitedCount = parsed.invitedFriends.length;
          parsed.verifiedCount = parsed.invitedFriends.filter((f: any) => f.status === 'verified').length;
          if (parsed.verifiedCount >= 5) {
            parsed.isProUnlocked = true;
            StorageManager.activatePremiumWithProof('PREPORA-VIP-2026', '5 Friends Referral Verified Bonus');
          }
          localStorage.setItem('prepora_referral_data', JSON.stringify(parsed));
          window.dispatchEvent(new Event('prepora_referral_updated'));
        }
      } catch {}
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        StorageManager.registerUser(fullName, email, password);
        router.push('/onboarding');
      } catch (err: any) {
        setErrorMsg(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        setLoading(false);
      }
    } else {
      // Real local registration
      setTimeout(() => {
        StorageManager.registerUser(fullName.trim(), email.trim(), password.trim());
        router.push('/onboarding');
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-11 h-11 rounded-2xl bg-blue-950 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-blue-950 tracking-tight">Prepora</span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Ro'yxatdan O'tish</h1>
          <p className="text-xs text-slate-500 mt-1">
            IELTS va SAT uchun o'z shaxsiy akkauntingizni yarating
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">To'liq Ismingiz (Full Name)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masalan: Sardor Aliyev"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Manzil</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sardor@example.com"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Parol Yarating</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-blue-950/20 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Yaratilmoqda...' : 'Akkaunt Yaratish & Davom Etish'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6 pt-6 border-t border-slate-100">
          Akkauntingiz bormi?{' '}
          <Link href="/login" className="text-blue-900 hover:underline font-bold">
            Kirish (Sign In)
          </Link>
        </p>
      </div>
    </div>
  );
}
