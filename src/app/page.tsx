'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  ArrowRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Calculator,
  Check,
  ChevronRight,
  Star,
  Zap,
  HelpCircle,
  GraduationCap,
  Users,
  Target,
  Sliders,
  Play,
  RotateCcw,
  Crown,
  Search,
  Heart,
  Eye,
  Bookmark,
  Gamepad2,
  Video,
  Award,
  Layers,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  CheckSquare
} from 'lucide-react';

interface ShotCard {
  id: string;
  category: 'all' | 'ielts' | 'sat' | 'voice' | 'lessons' | 'arena' | 'tools';
  title: string;
  tag: string;
  author: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
  link: string;
  initialLikes: number;
  views: string;
  bgGradient: string;
  accentColor: string;
  badgeText: string;
  description: string;
  featurePills: string[];
}

const SHOTS_DATA: ShotCard[] = [
  {
    id: 'shot-voice-ai',
    category: 'voice',
    title: 'Voice AI Speaking Examiner 🎙️',
    tag: 'Speaking Practice',
    author: {
      name: 'Prepora AI Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/ielts-gg',
    initialLikes: 842,
    views: '12.4k',
    bgGradient: 'from-pink-500/10 via-rose-500/10 to-amber-500/10',
    accentColor: '#ea4c89',
    badgeText: 'REAL-TIME VOICE',
    description: 'Haqiqiy IELTS imtihonchisi kabi siz bilan jonli muloqot qiladi, talaffuz va band darajangizni aniqlaydi.',
    featurePills: ['Band 9 Pronunciation', 'Lexical Analyzer', 'Instant Feedback']
  },
  {
    id: 'shot-ielts-full',
    category: 'ielts',
    title: 'Cambridge 19 To\'liq Mock Imtihon',
    tag: 'IELTS Academic & GT',
    author: {
      name: 'Cambridge Master',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/ielts',
    initialLikes: 619,
    views: '9.8k',
    bgGradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
    accentColor: '#2563eb',
    badgeText: 'CAMBRIDGE FORMAT',
    description: '40 ta Listening audio, 3 ta Academic Reading matni va AI tekshiruvli Writing insho tizimi.',
    featurePills: ['Audio Player', 'Timer 60m', 'Band 9 Criteria']
  },
  {
    id: 'shot-sat-desmos',
    category: 'sat',
    title: 'Digital SAT Desmos & Bluebook Dvigateli',
    tag: 'Digital SAT 1600',
    author: {
      name: 'MIT SAT Faculty',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/sat',
    initialLikes: 734,
    views: '11.1k',
    bgGradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
    accentColor: '#059669',
    badgeText: 'DESMOS INTEGRATED',
    description: '98 ta savol, 4 ta moslashuvchan modul, Desmos grafik kalkulyatori va Student-Produced Grid-in.',
    featurePills: ['Desmos Grapher', 'Adaptive Modules', 'Instant Score']
  },
  {
    id: 'shot-pvp-arena',
    category: 'arena',
    title: '1v1 PvP Duel & Omadli Aylana 🎮',
    tag: 'Gamified Prep',
    author: {
      name: 'Arena Games',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isPro: false,
    },
    link: '/arena',
    initialLikes: 955,
    views: '15.6k',
    bgGradient: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
    accentColor: '#d97706',
    badgeText: 'MULTIPLAYER',
    description: 'Do\'stlaringiz bilan real vaqtda so\'z va matematika janglari qiling, kunlik aylana orqali Pro yuting.',
    featurePills: ['Live PvP', 'Spin Wheel', 'XP & Leaderboard']
  },
  {
    id: 'shot-video-lessons',
    category: 'lessons',
    title: 'Video Darsliklar & Taktikalar 🎬',
    tag: 'Video Courses',
    author: {
      name: 'Top Tutors Hub',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/lessons',
    initialLikes: 489,
    views: '7.3k',
    bgGradient: 'from-violet-500/10 via-purple-500/10 to-pink-500/10',
    accentColor: '#7c3aed',
    badgeText: 'VIDEO MASTERY',
    description: 'Band 9 va SAT 1550+ egalaridan maxsus video darslar, tahlillar va imtihon sirlari.',
    featurePills: ['HD Video', 'Speed Control', 'Subtitles']
  },
  {
    id: 'shot-ai-tutor',
    category: 'tools',
    title: '24/7 AI Shaxsiy Repetitor 🤖',
    tag: 'Personal AI Coach',
    author: {
      name: 'Prepora Intelligence',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/tutor',
    initialLikes: 512,
    views: '8.4k',
    bgGradient: 'from-sky-500/10 via-blue-500/10 to-indigo-500/10',
    accentColor: '#0284c7',
    badgeText: '24/7 ASSISTANT',
    description: 'Tushunmagan har qanday savolingizni rasm yoki matn orqali so\'rang, sekundlarda to\'liq yechim oling.',
    featurePills: ['Math Solver', 'Writing Grader', 'Contextual Q&A']
  },
  {
    id: 'shot-vocab-flashcards',
    category: 'tools',
    title: 'Academic Vocab & Smart Flashcards 📚',
    tag: 'Vocabulary',
    author: {
      name: 'Lexicon Team',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      isPro: false,
    },
    link: '/vocabulary',
    initialLikes: 390,
    views: '6.2k',
    bgGradient: 'from-lime-500/10 via-emerald-500/10 to-teal-500/10',
    accentColor: '#16a34a',
    badgeText: 'SPACED REPETITION',
    description: 'IELTS va SAT da eng ko\'p uchraydigan 3000 ta so\'z, talaffuz audio va interval takrorlash tizimi.',
    featurePills: ['Audio Pronounce', 'Memory Spaced', 'Test Quizzes']
  },
  {
    id: 'shot-study-planner',
    category: 'tools',
    title: 'Moslashuvchan O\'quv Rejasi 🎯',
    tag: 'Productivity',
    author: {
      name: 'Prep Advisor',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
      isPro: true,
    },
    link: '/study-plan',
    initialLikes: 421,
    views: '6.9k',
    bgGradient: 'from-rose-500/10 via-orange-500/10 to-amber-500/10',
    accentColor: '#e11d48',
    badgeText: 'AI PLANNER',
    description: 'Imtihon sanangiz va hozirgi darajangizga mos kunlik vazifalar taqsimoti va intizom nazorati.',
    featurePills: ['Daily Roadmap', 'Goal Tracking', 'Streak Counter']
  }
];

export default function LandingPage() {
  // Capture referral code if arriving via referral link
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('prepora_referred_by', ref);
      }
    }
  }, []);

  // Dribbble category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive like states for shot cards
  const [likesState, setLikesState] = useState<{ [id: string]: { count: number; isLiked: boolean } }>(() => {
    const initial: { [id: string]: { count: number; isLiked: boolean } } = {};
    SHOTS_DATA.forEach(shot => {
      initial[shot.id] = { count: shot.initialLikes, isLiked: false };
    });
    return initial;
  });

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikesState(prev => {
      const current = prev[id] || { count: 0, isLiked: false };
      const newLiked = !current.isLiked;
      return {
        ...prev,
        [id]: {
          count: newLiked ? current.count + 1 : current.count - 1,
          isLiked: newLiked,
        }
      };
    });
  };

  // Score Calculator State
  const [calcExam, setCalcExam] = useState<'IELTS' | 'SAT'>('IELTS');
  const [currentScore, setCurrentScore] = useState<number>(6.0);
  const [targetScore, setTargetScore] = useState<number>(8.0);
  const [currentSat, setCurrentSat] = useState<number>(1150);
  const [targetSat, setTargetSat] = useState<number>(1500);

  // Band Comparison Lens State
  const [essayView, setEssayView] = useState<'BAND_5' | 'BAND_9'>('BAND_9');

  // Interactive Sample Question State
  const [activeTab, setActiveTab] = useState<'IELTS' | 'SAT'>('IELTS');
  const [sampleAnswer, setSampleAnswer] = useState<string | null>(null);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const sampleQuestion = activeTab === 'IELTS' ? {
    type: 'IELTS Academic Reading — Paragraph Matching',
    passage: 'Biomimicry emulates nature\'s time-tested designs to address modern human engineering dilemmas. Termite mounds maintain an interior fungal garden at an exact 30.5°C despite external temperature swings exceeding 40°C.',
    question: 'How do termite mounds maintain a steady internal temperature?',
    options: [
      { id: 'A', text: 'Passive convection via subterranean chimney vents' },
      { id: 'B', text: 'Electrical heating generated by solar radiation' },
      { id: 'C', text: 'Constant hydration from surrounding river water' },
      { id: 'D', text: 'Thick synthetic insulation blankets' },
    ],
    correct: 'A',
    explanation: 'Passive convection draws chilled subterranean air through ventilated chimneys, regulating the internal fungal chambers.',
  } : {
    type: 'Digital SAT Reading & Writing — Words in Context',
    passage: 'In high-altitude Andean hamlets, archaic Quechuan dialect markers that have elsewhere become entirely ________ have persisted virtually unchanged across centuries of external contact.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: [
      { id: 'A', text: 'obsolete' },
      { id: 'B', text: 'vibrant' },
      { id: 'C', text: 'perceptible' },
      { id: 'D', text: 'contentious' },
    ],
    correct: 'A',
    explanation: 'The context contrasts the survival of rare markers in isolation with their total disappearance elsewhere; "obsolete" means no longer used or outdated.',
  };

  const comparisonFeatures = [
    { title: 'To\'liq 4-Modulli Mock Imtihonlar', prepora: true, offline: 'Faqat qog\'ozda, kamdan-kam', apps: 'Faqat qisqa savollar' },
    { title: 'IELTS Writing AI Band Baholash', prepora: true, offline: '1-2 haftada tekshiriladi', apps: false },
    { title: 'IELTS Speaking Ovoz Yozish & Tahlil', prepora: true, offline: 'Faqat dars paytida', apps: false },
    { title: 'Digital SAT Desmos & Grid-in Dvigateli', prepora: true, offline: false, apps: 'Cheklangan' },
    { title: '24/7 AI Murabbiy (Tutor) Yordami', prepora: true, offline: false, apps: false },
    { title: 'Avtomatik Xatolar Daftari (Mistakes)', prepora: true, offline: 'Qo\'lda daftarga', apps: false },
    { title: 'Moslashuvchan Kundalik Tayyorgarlik Rejasi', prepora: true, offline: 'Umumiy jadval', apps: false },
  ];

  const studentReviews = [
    {
      name: 'Jasur Karimov',
      exam: 'IELTS Academic',
      score: 'Band 8.0',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      text: 'Prepora dagi to\'liq 40 savollik Listening va Reading mock imtihonlari hamda insholarni 4 ta rasmiy mezon bo\'yicha tahlili menga imtihonda 8.0 ball to\'plashimda katta yordam berdi.',
      target: 'Tashkent State University',
    },
    {
      name: 'Madina Umarova',
      exam: 'Digital SAT',
      score: '1520 Ball',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      text: 'Digital SAT dagi aynan 98 ta savol, 4 ta modul va Math bo\'limidagi Desmos formulalari haqiqiy Bluebook imtihonidan mutlaqo farq qilmadi. Math 780, RW 740 to\'pladim!',
      target: 'New York University Abu Dhabi',
    },
    {
      name: 'Bekzod Rahimov',
      exam: 'IELTS Academic',
      score: 'Band 7.5',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
      text: 'Voice AI va Speaking studiyasida mikrofon orqali o\'z ovozimni yozib olib, real taymerlar bilan amaliyot qilganim imtihonda hayajonimni yo\'qotdi.',
      target: 'Bocconi University',
    },
    {
      name: 'Nilufar Yusupova',
      exam: 'Digital SAT',
      score: '1480 Ball',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Xatolar daftari (Mistake Notebook) men uchun eng sevimli xususiyat bo\'ldi. Noto\'g\'ri javob bergan har bir savolim avtomat yig\'ilib, qayta ishlash imkonini berdi.',
      target: 'KAIST (Janubiy Koreya)',
    },
  ];

  const faqs = [
    {
      q: 'Prepora platformasida ro\'yxatdan o\'tish bepulmi?',
      a: 'Ha! Prepora da o\'z ismingiz va elektron pochtangiz bilan bepul ro\'yxatdan o\'tishingiz, o\'z profilingiz va maqsad ballaringizni belgilashingiz hamda to\'liq imtihonlarni topshirishingiz mumkin.',
    },
    {
      q: 'IELTS Writing insholarini AI qanday baholaydi?',
      a: 'Prepora inshoni IELTS ning 4 ta rasmiy mezoni asosida tekshiradi: Task Response (vazifa yoritilishi), Coherence & Cohesion (mantiqiy bog\'liqlik), Lexical Resource (akademik so\'z boyligi) va Grammatical Range & Accuracy (grammatika aniqligi). Har bir mezonga alohida ball va tushuntirish beriladi.',
    },
    {
      q: 'Digital SAT mock imtihonlari haqiqiy College Board formatidami?',
      a: 'Ha, 100% mos. Digital SAT testi 4 ta ketma-ket moduldan iborat: Reading & Writing Module 1 (27 savol), Module 2 (27 savol), majburiy 10 daqiqalik tanaffus, Math Module 1 (22 savol) va Module 2 (22 savol) — jami 98 ta original savol va student-produced grid-in javoblari.',
    },
    {
      q: 'IELTS Speaking Voice AI qanday ishlaydi?',
      a: 'Brauzeringizdagi mikrofon ruxsati orqali ovozingiz real-vaqtda tahlil qilinadi. Savollarga bergan javoblaringiz talaffuz, grammatika va so\'z boyligi bo\'yicha tekshirilib, darhol ball chiqariladi.',
    },
    {
      q: 'Topshirgan testlarim va xatolarim saqlanib qoladimi?',
      a: 'Albatta. Har bir topshirilgan mock test natijasi, to\'g\'ri/noto\'g\'ri javoblar soni va vaqt hisobi Tarix sahifasida, xato qilingan savollar esa Xatolar Daftarida avtomatik saqlanadi.',
    },
  ];

  // Helper calculations for dynamic calculator
  const ieltsGap = Math.max(0.5, targetScore - currentScore);
  const ieltsEstimatedWeeks = Math.round(ieltsGap * 8);
  const ieltsDailyMinutes = ieltsGap >= 1.5 ? 90 : ieltsGap >= 1.0 ? 60 : 45;

  const satGap = Math.max(50, targetSat - currentSat);
  const satEstimatedWeeks = Math.round(satGap / 35);
  const satDailyMinutes = satGap >= 300 ? 90 : satGap >= 200 ? 60 : 45;

  // Filter shots
  const filteredShots = SHOTS_DATA.filter(shot => {
    const matchesCategory = selectedCategory === 'all' || shot.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      shot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shot.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#0d0c22] flex flex-col font-sans selection:bg-[#ea4c89] selection:text-white">
      <Navbar />

      {/* 1. DRIBBLE SIGNATURE HERO: CENTERED EDITORIAL WITH ROUNDED SEARCH */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 text-xs font-bold text-[#0d0c22] shadow-2xs mb-6 hover:border-black/20 transition cursor-default">
          <span className="w-2 h-2 rounded-full bg-[#ea4c89] animate-pulse"></span>
          <span>O'zbekistonda 1-Raqamli IELTS & SAT Ta'lim Dizayni</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0d0c22] leading-[1.08] mb-6">
          IELTS va SAT uchun <br className="hidden sm:inline" />
          <span className="text-[#ea4c89]">eng mukammal</span> tayyorgarlik.
        </h1>

        <p className="text-base sm:text-xl text-[#6e6d7a] font-normal leading-relaxed max-w-2xl mx-auto mb-9">
          Cambridge 19 mock testlari, Digital SAT Desmos kalkulyatori, Real-vaqt AI Voice Examiner va 1v1 PvP do'stona janglar.
        </p>

        {/* Dribbble Signature Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-lg shadow-black/[0.04] border border-black/10 focus-within:border-black/30 focus-within:ring-4 focus-within:ring-black/5 transition-all">
            <Search className="w-5 h-5 text-[#6e6d7a] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiring: Speaking Voice AI, SAT Desmos, Cambridge 19..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-[#0d0c22] placeholder-[#6e6d7a] focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#6e6d7a] hover:text-[#0d0c22] font-semibold px-2 py-1 mr-2"
              >
                Tozalash
              </button>
            )}
            <button className="px-6 py-3 rounded-full bg-[#0d0c22] hover:bg-[#3d3d4e] text-white text-xs sm:text-sm font-bold shrink-0 transition-all shadow-sm">
              Qidirish
            </button>
          </div>
        </div>

        {/* Trending Tags (Dribbble style) */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#6e6d7a]">
          <span className="font-bold text-[#0d0c22]">Mashhur:</span>
          {[
            { label: '⚡ IELTS 8.5', cat: 'ielts' },
            { label: '📐 SAT Desmos', cat: 'sat' },
            { label: '🎙️ Speaking Voice AI', cat: 'voice' },
            { label: '🎮 1v1 Arena', cat: 'arena' },
            { label: '🎬 Video Darslar', cat: 'lessons' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(item.cat)}
              className="px-3 py-1 rounded-full bg-white hover:bg-black/5 border border-black/10 text-[#0d0c22] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. DRIBBLE HORIZONTAL CATEGORY FILTER PILLS */}
      <section className="sticky top-16 z-30 bg-[#f8f7f4]/95 backdrop-blur-md border-y border-black/[0.06] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Scrollable category pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'Barchasi (All)' },
              { id: 'ielts', label: 'IELTS Mock' },
              { id: 'sat', label: 'Digital SAT' },
              { id: 'voice', label: 'Voice AI 🎙️' },
              { id: 'lessons', label: 'Video Darslar 🎬' },
              { id: 'arena', label: '1v1 Arena 🎮' },
              { id: 'tools', label: 'Asboblar & Reja' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0d0c22] text-white shadow-sm'
                    : 'bg-white hover:bg-black/5 text-[#6e6d7a] hover:text-[#0d0c22] border border-black/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#6e6d7a]">
            <span>{filteredShots.length} ta namoyish</span>
          </div>
        </div>
      </section>

      {/* 3. DRIBBLE SIGNATURE "SHOTS" GRID FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {filteredShots.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/10 p-8">
            <Search className="w-12 h-12 text-[#6e6d7a] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0d0c22] mb-2">Hech qanday bo'lim topilmadi</h3>
            <p className="text-sm text-[#6e6d7a] mb-6">Boshqa kalit so'z bilan qidirib ko'ring yoki barcha bo'limlarni oching.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-full bg-[#0d0c22] text-white text-xs font-bold"
            >
              Barcha Shotslarni ko'rsatish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredShots.map((shot) => {
              const likeInfo = likesState[shot.id] || { count: shot.initialLikes, isLiked: false };

              return (
                <div key={shot.id} className="group flex flex-col">
                  {/* Shot Media Canvas Card */}
                  <Link
                    href={shot.link}
                    className="relative aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 block"
                  >
                    {/* Visual Graphic Area */}
                    <div className={`w-full h-full bg-gradient-to-br ${shot.bgGradient} p-6 flex flex-col justify-between relative`}>
                      {/* Top tags */}
                      <div className="flex items-center justify-between z-10">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#0d0c22] border border-black/10 shadow-2xs">
                          {shot.badgeText}
                        </span>
                        <span className="text-[11px] font-bold text-[#6e6d7a] bg-white/60 px-2.5 py-0.5 rounded-full">
                          {shot.tag}
                        </span>
                      </div>

                      {/* Center Decorative Visual Icon / Graphic */}
                      <div className="my-auto text-center z-10">
                        <h3 className="text-lg font-black text-[#0d0c22] tracking-tight leading-snug group-hover:text-[#ea4c89] transition-colors">
                          {shot.title}
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                          {shot.featurePills.map((pill, pIdx) => (
                            <span key={pIdx} className="text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded-md text-[#0d0c22] border border-black/5">
                              {pill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Subtle Bottom Preview */}
                      <div className="text-[11px] text-[#6e6d7a] font-medium line-clamp-1 z-10">
                        {shot.description}
                      </div>

                      {/* Dribbble Hover Overlay (Dark Scrim with Button & Bookmark) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-5 z-20">
                        <div className="flex justify-end">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#0d0c22] shadow-md transition"
                            title="Saqlab qo'yish"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs font-bold line-clamp-1">
                            {shot.title}
                          </span>
                          <span className="px-4 py-2 rounded-full bg-[#ea4c89] hover:bg-[#e03d7b] text-white text-xs font-bold shadow-md transition flex items-center gap-1 shrink-0">
                            Sinash
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Shot Meta Row: Author, Likes & Views (1:1 Dribbble Style) */}
                  <div className="mt-3 flex items-center justify-between text-xs px-1">
                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                      <img
                        src={shot.author.avatar}
                        alt={shot.author.name}
                        className="w-5 h-5 rounded-full object-cover border border-black/10"
                      />
                      <span className="font-bold text-[#0d0c22] hover:underline cursor-pointer">
                        {shot.author.name}
                      </span>
                      {shot.author.isPro && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#0d0c22] text-white leading-none">
                          PRO
                        </span>
                      )}
                    </div>

                    {/* Likes & Views */}
                    <div className="flex items-center gap-3 text-[#6e6d7a] font-bold">
                      <button
                        onClick={(e) => toggleLike(e, shot.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likeInfo.isLiked ? 'text-[#ea4c89]' : 'hover:text-[#ea4c89]'
                        }`}
                        title="Yoqdi"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likeInfo.isLiked ? 'fill-[#ea4c89]' : ''}`} />
                        <span>{likeInfo.count}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{shot.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. DRIBBLE BENTO SHOWCASE: BAND 5 VS BAND 9 LENS & INTERACTIVE CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ea4c89]/10 text-[#ea4c89] uppercase tracking-wide">
            Interaktiv Tahlil
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d0c22] mt-3 tracking-tight">
            IELTS Writing Band 5 vs Band 9 linzasi
          </h2>
          <p className="text-sm sm:text-base text-[#6e6d7a] mt-2">
            AI tekshiruvchimiz qanday qilib inshodagi har bir jumlani tahlil qilishini jonli ko'ring.
          </p>
        </div>

        {/* Dual Lens Card */}
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-black/10 gap-4">
            <div>
              <div className="text-xs font-bold text-[#6e6d7a]">Mavzu: IELTS Task 2 Essay</div>
              <h4 className="text-base font-extrabold text-[#0d0c22]">
                "Should university education be free for all citizens?"
              </h4>
            </div>

            {/* Pill Toggle Button */}
            <div className="flex items-center p-1 rounded-full bg-[#f8f7f4] border border-black/10">
              <button
                onClick={() => setEssayView('BAND_5')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  essayView === 'BAND_5'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-[#6e6d7a] hover:text-[#0d0c22]'
                }`}
              >
                Band 5.0 (Oddiy)
              </button>
              <button
                onClick={() => setEssayView('BAND_9')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  essayView === 'BAND_9'
                    ? 'bg-[#0d0c22] text-white shadow-xs'
                    : 'text-[#6e6d7a] hover:text-[#0d0c22]'
                }`}
              >
                Band 9.0 (Mukammal)
              </button>
            </div>
          </div>

          <div className="pt-6">
            {essayView === 'BAND_5' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-sm leading-relaxed text-slate-800">
                  <p>
                    I think university should be free because poor students do not have money to study. If government pays, everyone can go to university and get a good job. This is very good for economy. Also teachers will teach many people and country will become rich.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Task Response:</span>
                    <strong className="text-rose-600 font-extrabold">5.0 (Cheklangan)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Cohesion:</span>
                    <strong className="text-rose-600 font-extrabold">5.0 (Takroriy)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Vocabulary:</span>
                    <strong className="text-rose-600 font-extrabold">5.0 (Oddiy)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Grammar:</span>
                    <strong className="text-rose-600 font-extrabold">5.5 (Xatolar mavjud)</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-sm leading-relaxed text-slate-800">
                  <p>
                    Proponents of universal tertiary education argue that waiving tuition fees democratizes socioeconomic mobility. When state subsidies underwrite higher education, meritocratic access supersedes financial pedigree, precipitating exponential gains in human capital and fostering macroeconomic innovation across knowledge-intensive industries.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Task Response:</span>
                    <strong className="text-emerald-600 font-extrabold">9.0 (To'liq yoritilgan)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Cohesion:</span>
                    <strong className="text-emerald-600 font-extrabold">9.0 (Mukammal bog'lanish)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Vocabulary:</span>
                    <strong className="text-emerald-600 font-extrabold">9.0 (Akademik leksika)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[#6e6d7a] block">Grammar:</span>
                    <strong className="text-emerald-600 font-extrabold">9.0 (Murakkab strukturalar)</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. INTERACTIVE SCORE CALCULATOR */}
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-black/10 gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0d0c22] text-white">
                Kalkulyator
              </span>
              <h3 className="text-2xl font-black text-[#0d0c22] mt-2">
                Maqsadingizga erishish uchun qancha vaqt kerak?
              </h3>
            </div>

            <div className="flex items-center p-1 rounded-full bg-[#f8f7f4] border border-black/10">
              <button
                onClick={() => setCalcExam('IELTS')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  calcExam === 'IELTS'
                    ? 'bg-[#0d0c22] text-white'
                    : 'text-[#6e6d7a] hover:text-[#0d0c22]'
                }`}
              >
                IELTS
              </button>
              <button
                onClick={() => setCalcExam('SAT')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  calcExam === 'SAT'
                    ? 'bg-[#0d0c22] text-white'
                    : 'text-[#6e6d7a] hover:text-[#0d0c22]'
                }`}
              >
                SAT
              </button>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {calcExam === 'IELTS' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0d0c22] mb-2">
                    <span>Hozirgi IELTS Balingiz:</span>
                    <span className="text-[#ea4c89] font-black text-sm">{currentScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="8.5"
                    step="0.5"
                    value={currentScore}
                    onChange={(e) => setCurrentScore(parseFloat(e.target.value))}
                    className="w-full accent-[#0d0c22] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0d0c22] mb-2">
                    <span>Maqsad Qilingan Ball:</span>
                    <span className="text-emerald-600 font-black text-sm">{targetScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.5"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0d0c22] mb-2">
                    <span>Hozirgi SAT Balingiz:</span>
                    <span className="text-[#ea4c89] font-black text-sm">{currentSat}</span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="1550"
                    step="50"
                    value={currentSat}
                    onChange={(e) => setCurrentSat(parseInt(e.target.value))}
                    className="w-full accent-[#0d0c22] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0d0c22] mb-2">
                    <span>Maqsad SAT Bali:</span>
                    <span className="text-emerald-600 font-black text-sm">{targetSat}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="1600"
                    step="50"
                    value={targetSat}
                    onChange={(e) => setTargetSat(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Result Box */}
            <div className="bg-[#f8f7f4] rounded-2xl p-6 border border-black/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase text-[#6e6d7a] tracking-wider">
                  Tavsiya Etilgan Tayyorgarlik Rejasi
                </span>
                <div className="text-3xl font-black text-[#0d0c22] mt-2">
                  {calcExam === 'IELTS' ? `${ieltsEstimatedWeeks} Hafta` : `${satEstimatedWeeks} Hafta`}
                </div>
                <p className="text-xs text-[#6e6d7a] mt-1">
                  Har kuni kamida <strong className="text-[#0d0c22]">{calcExam === 'IELTS' ? ieltsDailyMinutes : satDailyMinutes} daqiqa</strong> maqsadli amaliyot bilan.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/study-plan"
                  className="w-full py-3 rounded-full bg-[#0d0c22] hover:bg-[#3d3d4e] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  Shaxsiy Rejani Tuzish
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DRIBBLE LIVE SAMPLE QUESTION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-black/10">
            <div>
              <span className="text-xs font-bold text-[#ea4c89]">Jonli Savol Sinovi</span>
              <h3 className="text-xl font-black text-[#0d0c22] mt-1">{sampleQuestion.type}</h3>
            </div>

            <div className="flex items-center p-1 rounded-full bg-[#f8f7f4] border border-black/10 text-xs font-bold">
              <button
                onClick={() => { setActiveTab('IELTS'); setSampleAnswer(null); }}
                className={`px-3 py-1 rounded-full transition ${activeTab === 'IELTS' ? 'bg-[#0d0c22] text-white' : 'text-[#6e6d7a]'}`}
              >
                IELTS
              </button>
              <button
                onClick={() => { setActiveTab('SAT'); setSampleAnswer(null); }}
                className={`px-3 py-1 rounded-full transition ${activeTab === 'SAT' ? 'bg-[#0d0c22] text-white' : 'text-[#6e6d7a]'}`}
              >
                SAT
              </button>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-[#f8f7f4] border border-black/5 text-sm text-[#0d0c22] leading-relaxed italic">
              "{sampleQuestion.passage}"
            </div>

            <p className="font-bold text-sm text-[#0d0c22]">
              {sampleQuestion.question}
            </p>

            <div className="space-y-2">
              {sampleQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSampleAnswer(opt.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                    sampleAnswer === opt.id
                      ? opt.id === sampleQuestion.correct
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
                      : 'bg-white hover:bg-slate-50 border-black/10 text-[#0d0c22]'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    sampleAnswer === opt.id
                      ? opt.id === sampleQuestion.correct ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      : 'bg-black/5 text-[#0d0c22]'
                  }`}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            {sampleAnswer && (
              <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                sampleAnswer === sampleQuestion.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <strong>{sampleAnswer === sampleQuestion.correct ? '✅ Barakalla! To\'g\'ri javob.' : '💡 Tushuntirish:'}</strong> {sampleQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. DRIBBLE TESTIMONIAL FEEDBACK CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ea4c89]/10 text-[#ea4c89] uppercase tracking-wide">
            O'quvchilarimiz Natijalari
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d0c22] mt-3 tracking-tight">
            Minglab talabalar Prepora orqali o'z maqsadiga erishdi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentReviews.map((rev, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#0d0c22] text-white">
                    {rev.score}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#0d0c22] leading-relaxed mb-6 font-normal">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-8 h-8 rounded-full object-cover border border-black/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0d0c22]">{rev.name}</h4>
                  <span className="text-[10px] text-[#6e6d7a] block">{rev.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DRIBBLE COMPARISON MATRIX */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-[#0d0c22]">
              Nega aynan Prepora?
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6d7a] mt-1">
              Oddiy o'quv markazlari va boshqa ilovalar bilan to'g'ridan-to'g'ri taqqoslang
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 font-bold text-[#6e6d7a]">Xususiyat</th>
                  <th className="pb-4 font-black text-[#ea4c89] text-center">Prepora Platformasi</th>
                  <th className="pb-4 font-semibold text-[#6e6d7a] text-center hidden sm:table-cell">Oddiy Kurslar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {comparisonFeatures.map((feat, fIdx) => (
                  <tr key={fIdx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-semibold text-[#0d0c22]">{feat.title}</td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mavjud</span>
                      </span>
                    </td>
                    <td className="py-3.5 text-center text-[#6e6d7a] hidden sm:table-cell">
                      {feat.offline === false ? '❌ Yo\'q' : feat.offline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (DRIBBLE PILL STYLE) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ea4c89]/10 text-[#ea4c89] uppercase tracking-wide">
            FAQ
          </span>
          <h2 className="text-3xl font-black text-[#0d0c22] mt-2">
            Tez-tez beriladigan savollar
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-2xs transition"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#0d0c22] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#6e6d7a] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6e6d7a] leading-relaxed border-t border-black/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. DRIBBLE BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 w-full">
        <div className="bg-[#0d0c22] text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Orzuingizdagi universitet sari bugun qadam qo'ying.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-normal">
              Ro'yxatdan o'ting, bepul mock testlarni topshiring va o'z xatolaringiz ustida ishlang.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ea4c89] hover:bg-[#e03d7b] text-white font-bold text-sm shadow-md transition"
              >
                Bepul Boshlash
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
              >
                Tariflarni ko'rish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. DRIBBLE-STYLE FOOTER */}
      <footer className="border-t border-black/[0.08] bg-[#f8f7f4] py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-[#6e6d7a]">
          {/* Logo & Bio Column */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl font-black tracking-tight text-[#0d0c22]">
                Prepora<span className="text-[#ea4c89]">.</span>
              </span>
            </Link>
            <p className="text-xs text-[#6e6d7a] max-w-sm leading-relaxed">
              O'zbekistonda IELTS va Digital SAT topshiruvchilar uchun yaratilgan eng zamonaviy AI platformasi.
            </p>
            <div className="pt-2 text-[11px] text-[#6e6d7a]">
              © {new Date().getFullYear()} Prepora Inc. Barcha huquqlar himoyalangan.
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#0d0c22] uppercase tracking-wider text-[11px]">Imtihonlar</h5>
            <ul className="space-y-2">
              <li><Link href="/ielts" className="hover:text-[#0d0c22]">IELTS Mock Test</Link></li>
              <li><Link href="/sat" className="hover:text-[#0d0c22]">Digital SAT Bluebook</Link></li>
              <li><Link href="/ielts-gg" className="hover:text-[#0d0c22]">Voice AI Speaking</Link></li>
              <li><Link href="/lessons" className="hover:text-[#0d0c22]">Video Darsliklar</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#0d0c22] uppercase tracking-wider text-[11px]">Asboblar</h5>
            <ul className="space-y-2">
              <li><Link href="/arena" className="hover:text-[#0d0c22]">1v1 PvP Arena</Link></li>
              <li><Link href="/vocabulary" className="hover:text-[#0d0c22]">Academic Vocab</Link></li>
              <li><Link href="/study-plan" className="hover:text-[#0d0c22]">O'quv Rejasi</Link></li>
              <li><Link href="/mistakes" className="hover:text-[#0d0c22]">Xatolar Daftari</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#0d0c22] uppercase tracking-wider text-[11px]">Kompaniya</h5>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="hover:text-[#0d0c22]">Tariflar</Link></li>
              <li><Link href="/referral" className="hover:text-[#0d0c22]">Bepul Pro Taklif</Link></li>
              <li><Link href="/settings" className="hover:text-[#0d0c22]">Mening Profilim</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}