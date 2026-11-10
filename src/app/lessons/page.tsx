'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PremiumModal from '@/components/PremiumModal';
import Link from 'next/link';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import {
  Video,
  Play,
  Lock,
  Clock,
  CheckCircle2,
  Crown,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  BookOpen,
  Gift,
  ArrowRight
} from 'lucide-react';

interface Lesson {
  id: string;
  youtubeId: string;
  title: string;
  category: 'IELTS' | 'SAT';
  skill: string;
  duration: string;
  instructor: string;
  instructorTitle: string;
  level: string;
  description: string;
  topics: string[];
}

const LESSONS_DATA: Lesson[] = [
  // --- 10 TA IELTS VIDEO DARSLIKLARI ---
  {
    id: 'ielts-1',
    youtubeId: 'SWVs5NYLuP8',
    title: "IELTS Writing Task 2: Band 9 Advantages & Disadvantages Masterclass",
    category: 'IELTS',
    skill: 'Writing Task 2',
    duration: '26 daqiqa',
    instructor: 'IELTS with Juva',
    instructorTitle: 'Rasmiy Cambridge Examiner (Band 9)',
    level: 'Advanced',
    description: "Insho tuzilishining rasmiy 4 mezonini tushunish: Task Achievement, Coherence, Lexical Resource va Grammar bo'yicha Band 9 strategiyalari.",
    topics: ['Kirish qismini 3 daqiqada yozish', 'Asosiy fikrlar (Body Paragraphs) strukturasi', 'Band 9 lug\'atlar va akademik iboralar']
  },
  {
    id: 'ielts-2',
    youtubeId: 'w9tVmGia0_c',
    title: "How to Get a Band 9 in IELTS Writing Task 2 (Proven System)",
    category: 'IELTS',
    skill: 'Writing Task 2',
    duration: '24 daqiqa',
    instructor: 'Asiya (Fastrack IELTS)',
    instructorTitle: 'Oxford Academic Specialist',
    level: 'Intermediate - Advanced',
    description: "Rasmiy imtihonchilar e'tibor beradigan nozik nuqtalar: xatolardan qochish, so'z boyligini to'g'ri tanlash va parafraza qilish.",
    topics: ['Proven System bosqichlari', 'Xatolar tahlili', 'Band 9 xulosasi yozish']
  },
  {
    id: 'ielts-3',
    youtubeId: 'qhxzCiwX11o',
    title: "How To Get Band 9 in IELTS Writing Task 1 Academic",
    category: 'IELTS',
    skill: 'Writing Task 1',
    duration: '31 daqiqa',
    instructor: 'Christopher Pell (IELTS Advantage)',
    instructorTitle: 'Cambridge Certified Examiner',
    level: 'All Levels',
    description: "Grafiklar, jadvallar va xaritalarni (Task 1) 20 daqiqada mukammal yozish bo'yicha to'liq qo'llanma.",
    topics: ['Overview yozish sirlari', 'Katta o\'zgarishlarni taqqoslash', 'Akademik so\'zlar']
  },
  {
    id: 'ielts-4',
    youtubeId: 'YWqU_QwCYCQ',
    title: "IELTS Speaking Test - Perfect Band 9 Model Interview",
    category: 'IELTS',
    skill: 'Speaking',
    duration: '14 daqiqa',
    instructor: 'IELTS Advantage',
    instructorTitle: 'Ex-Examiner Showcase',
    level: 'Advanced',
    description: "Haqiqiy Band 9 talabaning Part 1, Part 2 va Part 3 bo'yicha to'liq jonli suhbati va ravonlik texnikalari.",
    topics: ['Part 2 hikoya qilish formulasi', 'Part 3 mavhum savollarga javob', 'Idiomalar va tabiiy urg\'u']
  },
  {
    id: 'ielts-5',
    youtubeId: 'Uyf17MMucCg',
    title: "How To Write a Band 9 Task 2 Introduction in 3 Minutes",
    category: 'IELTS',
    skill: 'Writing Task 2',
    duration: '18 daqiqa',
    instructor: 'IELTS Advantage',
    instructorTitle: 'Writing Master Coach',
    level: 'All Levels',
    description: "Har qanday mavzudagi Task 2 inshosi uchun 3 daqiqada mukammal kirish va tezis g'oyasi yozish usuli.",
    topics: ['Parafraza qilishning 3 usuli', 'Thesis statement yaratish', 'Vaqtni tejash']
  },
  {
    id: 'ielts-6',
    youtubeId: 'WC-8E9lqHhU',
    title: "The Real Band 9 Vocabulary Method for IELTS",
    category: 'IELTS',
    skill: 'Vocabulary',
    duration: '20 daqiqa',
    instructor: 'IELTS Advantage',
    instructorTitle: 'Senior Lexical Specialist',
    level: 'All Levels',
    description: "Nega murakkab so'zlar ballni tushiradi va aslida Band 9 so'z boyligi qanday bo'lishi kerakligi haqida.",
    topics: ['Collocations (so\'z birikmalari)', 'Tabiiy kontekst', 'Xato so\'zlardan qochish']
  },
  {
    id: 'ielts-7',
    youtubeId: 'tKFFrCNsioQ',
    title: "IELTS Speaking Test Band 9 with Official Examiner Feedback",
    category: 'IELTS',
    skill: 'Speaking',
    duration: '22 daqiqa',
    instructor: 'IELTS Official Partner',
    instructorTitle: 'Certified IELTS Evaluator',
    level: 'All Levels',
    description: "Imtihonchining har bir javobga bergan rasmiy izohi: talaffuz, grammatika va so'z boyligi ballari.",
    topics: ['Examiner mezonlari', 'Fluency va Coherence sirlari', 'Pronunciation baholash']
  },
  {
    id: 'ielts-8',
    youtubeId: 'HrsfGyxSlbk',
    title: "How I Got IELTS Band 9 (What I Actually Did Daily)",
    category: 'IELTS',
    skill: 'Full Strategy',
    duration: '16 daqiqa',
    instructor: 'Lizi (Band 9 Scorer)',
    instructorTitle: 'Harvard University Alum',
    level: 'All Levels',
    description: "6.5 dan 9.0 gacha ko'tarilishning kunlik o'quv tartibi, materiallari va listening/reading texnikasi.",
    topics: ['Kunlik 2 soatlik reja', 'Listening podkastlar', 'Reading skimming & scanning']
  },
  {
    id: 'ielts-9',
    youtubeId: 'EJixgV3iHVk',
    title: "IELTS Listening Band 9 Full Test By Asad Yaqub",
    category: 'IELTS',
    skill: 'Listening',
    duration: '35 daqiqa',
    instructor: 'Asad Yaqub',
    instructorTitle: 'Top IELTS Listening Coach',
    level: 'All Levels',
    description: "Barcha 4 qism bo'yicha to'liq test tahlili: distractor (chalg'ituvchi) javoblarni aniqlash.",
    topics: ['Section 1-4 tuzoqlari', 'Spelling qoidalari', 'Xaritalar va rejalar']
  },
  {
    id: 'ielts-10',
    youtubeId: 'jW1L5gkcBxY',
    title: "Cambridge 9 IELTS Listening Test 1 - Full Walkthrough",
    category: 'IELTS',
    skill: 'Listening',
    duration: '28 daqiqa',
    instructor: 'Cambridge IELTS Academy',
    instructorTitle: 'Official Audio Specialist',
    level: 'All Levels',
    description: "Cambridge rasmiy kitobidagi eng mashhur testlardan birini savolma-savol to'liq yechish.",
    topics: ['Multiple choice savollar', 'Bo\'shliqlarni to\'ldirish', 'Tezkor nutqni ilg\'ash']
  },

  // --- 10 TA DIGITAL SAT VIDEO DARSLIKLARI ---
  {
    id: 'sat-1',
    youtubeId: 'TFmt1VwZte8',
    title: "Digital SAT Math - Desmos Lesson #1: Solve Any Equation!",
    category: 'SAT',
    skill: 'Math (Desmos)',
    duration: '22 daqiqa',
    instructor: 'Tutorllini Test Prep',
    instructorTitle: 'Digital SAT Perfect 800 Specialist',
    level: 'All Levels',
    description: "Digital SAT imtihonida Desmos kalkulyatoridan maksimal foydalanish: har qanday tenglamani grafik usulda 5 soniyada yechish.",
    topics: ['Desmos grafik interfeysi sirlari', 'Murakkab tenglamalarni yechish', 'Vaqtni 50% ga tejash']
  },
  {
    id: 'sat-2',
    youtubeId: 'oL9_EOn5x7w',
    title: "Digital SAT Math - Desmos Lesson #2: Systems of Equations",
    category: 'SAT',
    skill: 'Math (Desmos)',
    duration: '28 daqiqa',
    instructor: 'Tutorllini Test Prep',
    instructorTitle: 'Perfect 1600 Scorer / MIT Alum',
    level: 'All Levels',
    description: "Tenglamalar sistemasi, regression, va parabolalarning kesishish nuqtalarini Desmosda tezkor topish.",
    topics: ['Regression tahlili orqali funksiya topish', 'Aylana va chiziqlar kesishishi', 'Kvadratik tenglamalar']
  },
  {
    id: 'sat-3',
    youtubeId: '1bTkbmHx944',
    title: "All of SAT Math Explained in 26 Minutes",
    category: 'SAT',
    skill: 'Full Math Review',
    duration: '26 daqiqa',
    instructor: 'LearnSATMath',
    instructorTitle: 'Perfect 800 Math Coach',
    level: 'All Levels',
    description: "Digital SAT ning barcha 4 ta matematikasini (Algebra, Advanced Math, Problem-Solving, Geometry) 26 daqiqada to'liq qamrab oluvchi masterclass.",
    topics: ['Algebra formulalari', 'Kvadratik tenglamalar', 'Trigonometriya va doiralar']
  },
  {
    id: 'sat-4',
    youtubeId: 'myDKkd2eoJc',
    title: "DESMOS SAT MATH: How to Solve Every SAT Math Problem with DESMOS",
    category: 'SAT',
    skill: 'Math (Desmos)',
    duration: '32 daqiqa',
    instructor: 'PrepPros SAT',
    instructorTitle: 'National Merit Scholar',
    level: 'All Levels',
    description: "SAT Math qismidagi savollarning 80 foizini Desmos yordamida formulasiz yechish sirlari.",
    topics: ['Sliderlar va jadvallar', 'Ildizlar va extremumlar', 'Ehtimollik va foizlar']
  },
  {
    id: 'sat-5',
    youtubeId: 'UDJ2RHMFax8',
    title: "All of SAT Desmos in 35 Minutes - Complete Masterclass",
    category: 'SAT',
    skill: 'Math (Desmos)',
    duration: '35 daqiqa',
    instructor: 'Scalar Learning',
    instructorTitle: '800 Math Perfect Scorer',
    level: 'All Levels',
    description: "Desmosning barcha imkoniyatlarini noldan boshlab murakkab savollargacha ko'rib chiqish.",
    topics: ['Eksponensial funksiyalar', 'Chiziqli tenglamalar', 'Doira tenglamalari']
  },
  {
    id: 'sat-6',
    youtubeId: '-vQBTDAQLkk',
    title: "All of SAT Desmos in 8 Minutes (Speed Shortcuts)",
    category: 'SAT',
    skill: 'Math Shortcuts',
    duration: '8 daqiqa',
    instructor: 'Tutorllini Test Prep',
    instructorTitle: 'SAT Strategy Coach',
    level: 'Quick Review',
    description: "Imtihonga oz vaqt qolganda Desmosning eng asosiy 10 ta tezkor klaviatura buyrug'i.",
    topics: ['Tezkor regression `~` belgisi', 'Kesishish nuqtalari', 'Qoldiq va foiz hisoblash']
  },
  {
    id: 'sat-7',
    youtubeId: '-pGNBb8M3LQ',
    title: "A Beginner's Guide to Desmos on the SAT Math",
    category: 'SAT',
    skill: 'Math Basics',
    duration: '15 daqiqa',
    instructor: 'College Board Prep',
    instructorTitle: 'EdTech Educator',
    level: 'Beginner',
    description: "Bluebook dasturidagi Desmos kalkulyatorini to'g'ri sozlash va foydalanish bo'yicha boshlang'ich qo'llanma.",
    topics: ['Bluebook interfeysi', 'Kalkulyatordan to\'g\'ri foydalanish', 'Oddiy xatolardan saqlanish']
  },
  {
    id: 'sat-8',
    youtubeId: 'NLz8CRdMvuI',
    title: "Every SAT Grammar Rule in 15 Minutes",
    category: 'SAT',
    skill: 'Reading & Writing',
    duration: '15 daqiqa',
    instructor: 'Rishab Jain',
    instructorTitle: 'Harvard Student / 1590 SAT',
    level: 'All Levels',
    description: "Digital SAT Reading & Writing modulidagi barcha tinish belgilari, fe'llar va jumlalar tuzilishi qoidalari.",
    topics: ['Nuqta-vergul va tire (dashes)', 'Comma splices', 'Mavzu va fe\'l moslashuvi']
  },
  {
    id: 'sat-9',
    youtubeId: 'yakLDhT3Wp0',
    title: "Digital SAT Grammar Rules You MUST Know",
    category: 'SAT',
    skill: 'Reading & Writing',
    duration: '21 daqiqa',
    instructor: 'Hayden Rhodea SAT',
    instructorTitle: 'Top SAT Educator (1560)',
    level: 'Intermediate',
    description: "Eng ko'p xato qilinadigan 12 ta grammatika qoidasi va ularni testda sekundlarda tanish usullari.",
    topics: ['Transitions (bog\'lovchilar)', 'Pronoun reference', 'Modifier xatolari']
  },
  {
    id: 'sat-10',
    youtubeId: 'jrfAMhyB0MA',
    title: "Digital SAT Reading & Writing Walkthrough",
    category: 'SAT',
    skill: 'Reading Strategy',
    duration: '27 daqiqa',
    instructor: 'Hayden Rhodea SAT',
    instructorTitle: 'Reading Specialist',
    level: 'Advanced',
    description: "Hard Module savollarini yechish, asosiy fikrni tez topish va logik xulosalar chiqarish.",
    topics: ['Rhetorical synthesis (notes)', 'Scientific passages', 'Xulosa va dalillar']
  }
];

export default function LessonsPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'IELTS' | 'SAT'>('ALL');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  useEffect(() => {
    const update = () => {
      const status = StorageManager.getSubscriptionStatus();
      setSubStatus(status);
      if (!status.isPremium && status.dailyVideoRemaining <= 0) {
        setIsLimitExceeded(true);
      } else {
        setIsLimitExceeded(false);
      }
    };
    update();
    window.addEventListener('prepora_subscription_updated', update);
    return () => window.removeEventListener('prepora_subscription_updated', update);
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    const status = StorageManager.getSubscriptionStatus();
    
    // Check quota for free users
    if (!status.isPremium) {
      if (status.dailyVideoRemaining <= 0 && lesson.id !== selectedLesson.id) {
        setIsLimitExceeded(true);
        setIsPremiumModalOpen(true);
        return;
      }
      StorageManager.useVideoQuota();
    }

    setSelectedLesson(lesson);
    setIsPlaying(true);
    setIsLimitExceeded(false);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const filteredLessons = activeCategory === 'ALL'
    ? LESSONS_DATA
    : LESSONS_DATA.filter((l) => l.category === activeCategory);

  const ieltsCount = LESSONS_DATA.filter((l) => l.category === 'IELTS').length;
  const satCount = LESSONS_DATA.filter((l) => l.category === 'SAT').length;

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#171A2B] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5146E5]/10 border border-[#5146E5]/20 text-[#5146E5] text-xs font-bold mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>Prepora Video Masterclasslar • 20 Ta Rasmiy Dars</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#171A2B] tracking-tight">
              IELTS va SAT Video Darsliklari
            </h1>
            <p className="text-xs sm:text-sm text-[#85899B] mt-1">
              Top Cambridge va MIT o'qituvchilarining 10 ta IELTS va 10 ta Digital SAT video darsliklari.
            </p>
          </div>

          {/* Daily Quota / Status Badge */}
          <div className="flex items-center gap-2">
            {subStatus?.isPremium ? (
              <span className="px-4 py-2 rounded-full bg-[#171A2B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Pro: Barcha 20 ta Video Cheksiz ⚡</span>
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold text-[#171A2B] shadow-2xs">
                  Kunlik Limit: <strong className="text-[#5146E5]">{subStatus?.dailyVideoRemaining ?? 2} / 2</strong> video qoldi
                </span>
                <button
                  type="button"
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition shadow-xs"
                >
                  Cheksiz Pro Olish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'ALL'
                ? 'bg-[#171A2B] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-[#85899B] border border-[#E5E7EB]'
              }`}
          >
            Barcha Darslar ({LESSONS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('IELTS')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'IELTS'
                ? 'bg-[#171A2B] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-[#85899B] border border-[#E5E7EB]'
              }`}
          >
            IELTS Darsliklari ({ieltsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('SAT')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'SAT'
                ? 'bg-[#171A2B] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-[#85899B] border border-[#E5E7EB]'
              }`}
          >
            Digital SAT Darsliklari ({satCount})
          </button>
        </div>

        {/* Video Player & Playlist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Embedded YouTube Video Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-xl border border-black/10 aspect-video flex items-center justify-center">
              {isLimitExceeded && !subStatus?.isPremium ? (
                /* LOCKED OVERLAY WHEN DAILY QUOTA EXHAUSTED */
                <div className="absolute inset-0 bg-slate-950/90 text-white flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-1">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black">Bugungi Bepul Video Limitingiz Tugadi (2/2)</h3>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                    Siz bugun 2 ta bepul video darslikni tomosha qildingiz. Barcha 20 ta IELTS va SAT darslarini cheklovlarsiz tomosha qilish uchun Pro obunani faollashtiring yoki do'stlaringizni taklif qilib bepul oling!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPremiumModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-[#5146E5] hover:bg-[#4338CA] text-white text-xs font-bold transition shadow-md"
                    >
                      Prepora Pro ni Ochish (50 000 so'm)
                    </button>
                    <Link
                      href="/referral"
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span>10 Do'st bilan Bepul Olish</span>
                    </Link>
                  </div>
                </div>
              ) : isPlaying ? (
                <iframe
                  key={selectedLesson.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${selectedLesson.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 rounded-3xl"
                />
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="w-full h-full relative cursor-pointer group"
                >
                  <img
                    src={`https://img.youtube.com/vi/${selectedLesson.youtubeId}/hqdefault.jpg`}
                    alt={selectedLesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#171A2B] text-white text-xs font-bold">
                    {selectedLesson.category} • {selectedLesson.skill}
                  </span>
                  <span className="text-xs text-[#85899B] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration}
                  </span>
                  <span className="text-xs text-[#5146E5] font-semibold bg-[#5146E5]/10 px-2.5 py-0.5 rounded-full">
                    {selectedLesson.level}
                  </span>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${selectedLesson.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>YouTubeda Ochish</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171A2B]">
                  {selectedLesson.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#85899B]">
                  <span className="font-bold text-[#171A2B]">{selectedLesson.instructor}</span>
                  <span>•</span>
                  <span>{selectedLesson.instructorTitle}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#85899B] leading-relaxed">
                {selectedLesson.description}
              </p>

              {/* Topics learned */}
              <div className="pt-2 border-t border-[#F3F4F6] space-y-2">
                <h4 className="text-xs font-bold text-[#171A2B] uppercase tracking-wider">
                  Ushbu darsda nimalarni o'rganasiz:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLesson.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#171A2B]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#171A2B]">
                Darslar Ro'yxati ({filteredLessons.length})
              </h3>
              <span className="text-xs text-[#85899B] font-bold">HD Video</span>
            </div>

            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson, idx) => {
                const isCurrent = lesson.id === selectedLesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group ${isCurrent
                        ? 'bg-white border-[#5146E5] shadow-md ring-2 ring-[#5146E5]/10'
                        : 'bg-white hover:bg-slate-50 border-[#E5E7EB]'
                      }`}
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                      <img
                        src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className={`w-4 h-4 fill-white ${isCurrent ? 'text-[#5146E5]' : 'text-white'}`} />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-mono px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#5146E5] uppercase tracking-wide block">
                        {lesson.category} • {lesson.skill}
                      </span>
                      <h4 className="text-xs font-bold text-[#171A2B] line-clamp-2 leading-tight mt-0.5">
                        {lesson.title}
                      </h4>
                      <span className="text-[10px] text-[#85899B] mt-1 block">
                        {lesson.instructor} • {lesson.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        reason="video_limit"
      />
    </div>
  );
}
