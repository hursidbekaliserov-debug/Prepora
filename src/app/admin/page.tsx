'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Crown, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Filter, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  BookOpen, 
  LogOut, 
  RefreshCw, 
  UserPlus, 
  Download, 
  SlidersHorizontal,
  Sparkles,
  DollarSign,
  Activity,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { StorageManager, UserAccount } from '@/lib/storage';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRO' | 'FREE' | 'IELTS' | 'SAT'>('ALL');
  
  // Feedback alert state
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newExam, setNewExam] = useState<'IELTS' | 'SAT' | 'BOTH'>('IELTS');
  const [newIsPro, setNewIsPro] = useState(true);

  useEffect(() => {
    // Strict Admin Access Verification
    const check = StorageManager.isAdminLoggedIn();
    if (!check) {
      router.push('/login');
      return;
    }
    setIsAdmin(true);
    loadUsers();

    const handleUsersUpdate = () => loadUsers();
    window.addEventListener('prepora_users_updated', handleUsersUpdate);
    return () => window.removeEventListener('prepora_users_updated', handleUsersUpdate);
  }, [router]);

  const loadUsers = () => {
    const list = StorageManager.getUsers();
    setUsers(list);
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleLogout = () => {
    StorageManager.logoutAdmin();
    showToast("Admin paneldan muvaffaqiyatli chiqildi.", 'success');
    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  const handleTogglePro = (userId: string, currentStatus?: boolean) => {
    const updated = StorageManager.toggleUserPro(userId);
    setUsers(updated);
    showToast(currentStatus ? "Foydalanuvchining Pro maqomi bekor qilindi." : "Foydalanuvchiga VIP Pro obuna faollashtirildi!", 'success');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Haqiqatan ham "${userName}" foydalanuvchisini o'chirmoqchimisiz?`)) {
      const updated = StorageManager.deleteUser(userId);
      setUsers(updated);
      showToast(`"${userName}" foydalanuvchisi bazadan o'chirildi.`, 'success');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast("Ism va email maydonlarini to'ldiring!", 'error');
      return;
    }

    const updated = StorageManager.addUser({
      fullName: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      targetExam: newExam,
      isPro: newIsPro,
      xp: newIsPro ? 1200 : 350,
      lastActive: 'Hozirgina'
    });

    setUsers(updated);
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    showToast(`"${newName}" tizimga muvaffaqiyatli qo'shildi!`, 'success');
  };

  const handleExportUsers = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `prepora_users_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Foydalanuvchilar ro'yxati yuklab olindi (JSON)!", 'success');
  };

  // Filter & Search logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'PRO') return u.isPro;
    if (activeFilter === 'FREE') return !u.isPro;
    if (activeFilter === 'IELTS') return u.targetExam === 'IELTS' || u.targetExam === 'BOTH';
    if (activeFilter === 'SAT') return u.targetExam === 'SAT' || u.targetExam === 'BOTH';
    return true;
  });

  const totalUsersCount = users.length;
  const proUsersCount = users.filter((u) => u.isPro).length;
  const freeUsersCount = totalUsersCount - proUsersCount;
  const ieltsStudentsCount = users.filter((u) => u.targetExam === 'IELTS' || u.targetExam === 'BOTH').length;
  const satStudentsCount = users.filter((u) => u.targetExam === 'SAT' || u.targetExam === 'BOTH').length;
  const estimatedRevenue = proUsersCount * 50000;

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5146E5]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B0F19] text-[#171A2B] dark:text-[#F1F5F9] font-sans transition-colors duration-300">
      
      {/* 1. Super Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group" title="Bosh sahifaga o'tish">
              <img
                src="/logo.png"
                alt="Prepora"
                className="w-9 h-9 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-[#171A2B] dark:text-white leading-none">
                  Prepora<span className="text-[#5146E5]">.</span>
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5146E5]/10 border border-[#5146E5]/20 text-[#5146E5] dark:text-[#8B7CF6] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Server Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Server: Faol (Online)</span>
            </div>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <div className="w-6 h-6 rounded-full bg-[#5146E5] text-white flex items-center justify-center font-black text-[11px]">
                X
              </div>
              <span className="hidden sm:inline text-xs font-bold">Xurshid Admin</span>
              <span className="text-xs">👑</span>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition"
              title="Admin paneldan chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Toast Notification */}
        {feedback && (
          <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Welcome Banner & System Status */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#171A2B] via-[#1E2238] to-[#171A2B] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5146E5]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-white/10">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Boshqaruv Tizimi: <strong>Xurshid_admin@gmail.com</strong></span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Prepora Platformasi Boshqaruv Paneli
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Platformadagi barcha real foydalanuvchilar soni, obunalar, IELTS va SAT statistikalarini real vaqtda kuzating va boshqaring.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={loadUsers}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yangilash</span>
              </button>

              <button
                type="button"
                onClick={handleExportUsers}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Eksport (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition shadow-md shadow-[#5146E5]/30"
              >
                <UserPlus className="w-4 h-4" />
                <span>Yangi Talaba Qo'shish</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Four Core Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Real Users */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#5146E5]/50 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B] dark:text-slate-400">Jami Real Foydalanuvchilar</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5146E5] flex items-center justify-center border border-indigo-100 dark:border-indigo-900 group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#171A2B] dark:text-white">{totalUsersCount}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Real Ro'yxat</span>
            </div>
            <p className="text-[11px] text-[#85899B] dark:text-slate-400 mt-1">Platformada saqlangan o'quvchilar</p>
          </div>

          {/* Card 2: Pro Subscribers & Revenue */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#5146E5]/50 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B] dark:text-slate-400">Faol PRO Obunachilar</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-900 group-hover:scale-105 transition">
                <Crown className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#171A2B] dark:text-white">{proUsersCount}</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ~{estimatedRevenue.toLocaleString()} UZS/oy
              </span>
            </div>
            <p className="text-[11px] text-[#85899B] dark:text-slate-400 mt-1">{freeUsersCount} ta bepul foydalanuvchi</p>
          </div>

          {/* Card 3: IELTS vs SAT split */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#5146E5]/50 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B] dark:text-slate-400">IELTS & SAT Taqsimoti</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center border border-purple-100 dark:border-purple-900 group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#171A2B] dark:text-white">{ieltsStudentsCount} / {satStudentsCount}</span>
              <span className="text-xs font-semibold text-[#85899B]">IELTS / SAT</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-[#5146E5] h-1.5 rounded-full" style={{ width: `${Math.round((ieltsStudentsCount / Math.max(1, totalUsersCount)) * 100)}%` }} />
            </div>
          </div>

          {/* Card 4: Platform Performance */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#5146E5]/50 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#85899B] dark:text-slate-400">O'quv Resurslari</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 group-hover:scale-105 transition">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#171A2B] dark:text-white">20</span>
              <span className="text-xs font-bold text-emerald-600">Video Darsliklar</span>
            </div>
            <p className="text-[11px] text-[#85899B] dark:text-slate-400 mt-1">10 ta IELTS + 10 ta SAT rasmiy dars</p>
          </div>
        </div>

        {/* 4. Users Table & Controls Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Controls Bar: Search & Filter Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Foydalanuvchini ism yoki email orqali qidiring..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'ALL', label: `Barchasi (${totalUsersCount})` },
                { id: 'PRO', label: `PRO (${proUsersCount})` },
                { id: 'FREE', label: `Free (${freeUsersCount})` },
                { id: 'IELTS', label: `IELTS (${ieltsStudentsCount})` },
                { id: 'SAT', label: `SAT (${satStudentsCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeFilter === tab.id
                      ? 'bg-[#5146E5] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#85899B] dark:text-slate-300 hover:text-[#171A2B] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[#85899B] dark:text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Talaba / Foydalanuvchi</th>
                  <th className="py-3.5 px-4">Ro'yxatdan O'tgan Sana</th>
                  <th className="py-3.5 px-4">Yo'nalishi</th>
                  <th className="py-3.5 px-4">Obuna Maqomi</th>
                  <th className="py-3.5 px-4">XP Bali</th>
                  <th className="py-3.5 px-4 text-right">Amallar (Boshqarish)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#85899B]">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      Qidiruv bo'yicha hech qanday foydalanuvchi topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => {
                    const isPro = !!user.isPro;
                    return (
                      <tr 
                        key={user.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-4 text-[#85899B] font-mono">{idx + 1}</td>
                        
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5146E5] to-[#8B7CF6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[#171A2B] dark:text-white flex items-center gap-1.5">
                                <span className="truncate">{user.fullName}</span>
                                {isPro && <span title="PRO Obuna">👑</span>}
                              </div>
                              <span className="text-[11px] text-[#85899B] dark:text-slate-400 block truncate">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-[#85899B] dark:text-slate-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Yangi'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            user.targetExam === 'SAT'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : user.targetExam === 'BOTH'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-indigo-50 text-[#5146E5] dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}>
                            {user.targetExam || 'IELTS'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPro ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              VIP PRO Faol
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                              Bepul (Free)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-[#171A2B] dark:text-slate-200">
                          {user.xp || 500} XP
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Pro button */}
                            <button
                              type="button"
                              onClick={() => handleTogglePro(user.id, isPro)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1 ${
                                isPro
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                              }`}
                              title={isPro ? "Pro obunani bekor qilish" : "Pro obunani faollashtirish"}
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>{isPro ? "Bekor qilish" : "PRO Berish"}</span>
                            </button>

                            {/* Delete User button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.fullName)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-400 dark:hover:text-rose-400 transition"
                              title="Foydalanuvchini o'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-[#85899B] pt-2">
            <span>Ko'rsatilmoqda: <strong>{filteredUsers.length}</strong> ta foydalanuvchi</span>
            <span>Jami ro'yxatdan o'tganlar: <strong>{totalUsersCount}</strong></span>
          </div>
        </div>

      </main>

      {/* 5. Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-[#171A2B] dark:text-white">
            
            <div className="p-6 bg-gradient-to-r from-[#171A2B] to-[#1E2238] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5146E5] text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Yangi Talaba Qo'shish</h3>
                  <p className="text-[11px] text-slate-300">Admin orqali to'g'ridan-to'g'ri ro'yxatdan o'tkazish</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Talaba Ism Familiyasi
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masalan: Azizbek Karimov"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Manzili
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="azizbek@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parol
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-[#5146E5]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yo'nalishi
                  </label>
                  <select
                    value={newExam}
                    onChange={(e) => setNewExam(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:border-[#5146E5]"
                  >
                    <option value="IELTS">IELTS</option>
                    <option value="SAT">Digital SAT</option>
                    <option value="BOTH">Har ikkisi (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Obuna Turi
                  </label>
                  <select
                    value={newIsPro ? 'PRO' : 'FREE'}
                    onChange={(e) => setNewIsPro(e.target.value === 'PRO')}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:border-[#5146E5]"
                  >
                    <option value="PRO">VIP PRO (Faol)</option>
                    <option value="FREE">Bepul (Free)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition shadow-md"
                >
                  Qo'shish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
