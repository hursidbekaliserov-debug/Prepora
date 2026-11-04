'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PremiumModal from '@/components/PremiumModal';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import { 
  Video, 
  Play, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Crown, 
  BookOpen, 
  Calculator, 
  Sparkles, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  category: 'IELTS' | 'SAT';
  skill: string;
  duration: string;
  instructor: string;
  instructorTitle: string;
  level: string;
  videoUrl: string; // Embedable video or lecture
  description: string;
  topics: string[];
}

const LESSONS_DATA: Lesson[] = [
  {
    id: 'ielts-w-1',
    title: "IELTS Writing Task 2: Band 9.0 Insho Formulalari va Shabloni",
    category: 'IELTS',
    skill: 'Writing',
    duration: '35 daqiqa',
    instructor: 'Mr. David Vance',
    instructorTitle: 'Former Cambridge Examiner (Band 9)',
    level: 'Advanced',
    videoUrl: 'https://www.youtube.com/embed/5F_T2Wp2q80',
    description: "Insho tuzilishining rasmiy 4 mezonini tushunish: Task Achievement, Cohesion & Coherence, Lexical Resource va Grammar.",
    topics: ['Kirish qismini 3 daqiqada yozish', 'Asosiy fikrlar (Body Paragraphs) strukturasi', 'Band 9 lug\'atlar va akademik iboralar']
  },
  {
    id: 'sat-m-1',
    title: "SAT Math: Desmos Kalkulyatorining 10 ta Yashirin Sirlari",
    category: 'SAT',
    skill: 'Math',
    duration: '32 daqiqa',
    instructor: 'Alex Chen',
    instructorTitle: 'Perfect 1600 Scorer / MIT Alum',
    level: 'All Levels',
    videoUrl: 'https://www.youtube.com/embed/7U41xZf0Z4g',
    description: "Digital SAT imtihonida Desmos grafik kalkulyatoridan maksimal foydalanish: tenglamalar sistemasi, regression, va parabolalarni 5 soniyada yechish.",
    topics: ['Regression tahlili orqali funksiya topish', 'Aylana va chiziqlar kesishishi', 'Desmosda vaqtni 50% tejash']
  },
  {
    id: 'ielts-s-1',
    title: "IELTS Speaking Part 2 & 3: Examinerlarni Hayratda Qoldirish Sirlari",
    category: 'IELTS',
    skill: 'Speaking',
    duration: '28 daqiqa',
    instructor: 'Sarah Jenkins',
    instructorTitle: 'British Council Certified Trainer',
    level: 'Intermediate - Advanced',
    videoUrl: 'https://www.youtube.com/embed/sRFEVbyr6Kg',
    description: "Cue card bo'yicha 2 daqiqa to'xtovsiz ravon gapirish texnikasi va Part 3 dagi falsafiy savollarga mantiqiy javob berish.",
    topics: ['1 daqiqalik tayyorgarlik daftari', 'Idiomalar va tabiiy bog\'lovchilar', 'Intonatsiya va urg\'u sirlari']
  },
  {
    id: 'sat-rw-1',
    title: "SAT Reading & Writing: Grammatika va Punktuatsiya Qoidalari",
    category: 'SAT',
    skill: 'Reading & Writing',
    duration: '27 daqiqa',
    instructor: 'Rachel Adams',
    instructorTitle: 'Stanford SAT Verbal Coach',
    level: 'All Levels',
    videoUrl: 'https://www.youtube.com/embed/z44q8q35R84',
    description: "Standard English Conventions: vergul, nuqta-vergul, tire va apostroflarning SAT dagi aniq qoidalari.",
    topics: ['Run-on jumlalarni tuzatish', 'Subject-verb agreement qoidalari', 'Transitions va mantiqiy bog\'lovchilar']
  },
  {
    id: 'ielts-r-1',
    title: "IELTS Reading: Skimming & Scanning - 60 Daqiqada 40/40 Ishlash",
    category: 'IELTS',
    skill: 'Reading',
    duration: '30 daqiqa',
    instructor: 'Dr. Michael Brown',
    instructorTitle: 'Oxford Academic Reading Specialist',
    level: 'Intermediate - Advanced',
    videoUrl: 'https://www.youtube.com/embed/1vR_sB22r7E',
    description: "Matnni to'liq o'qimasdan to'g'ri javoblarni 15 soniyada topish, True/False/Not Given tuzoqlari.",
    topics: ['Kalit so\'zlarni parafraza qilish', 'Headings moslashtirish usullari', 'Vaqtni 3 ta passage ga to\'g\'ri taqsimlash']
  },
  {
    id: 'sat-m-2',
    title: "SAT Advanced Math: Kvadratik Tenglamalar va Murakkab Funksiyalar",
    category: 'SAT',
    skill: 'Advanced Math',
    duration: '25 daqiqa',
    instructor: 'Alex Chen',
    instructorTitle: 'Perfect 1600 Scorer / MIT Alum',
    level: 'Hard / Module 2',
    videoUrl: 'https://www.youtube.com/embed/p1m2eK34n3A',
    description: "SAT Module 2 dagi eng qiyin 750-800 ballik algebra va funksiyalar masalalarining tezkor yechimlari.",
    topics: ['Diskriminant va yechimlar soni', 'Funksiya simmetriyasi va vertex', 'Murakkab ildizlar']
  }
];

export default function LessonsPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'IELTS' | 'SAT'>('ALL');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS_DATA[0]);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [unlockedVideoId, setUnlockedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setSubStatus(StorageManager.getSubscriptionStatus());
    update();
    window.addEventListener('prepora_subscription_updated', update);
    return () => window.removeEventListener('prepora_subscription_updated', update);
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    // Agar Pro bo'lsa: barcha videolar cheksiz ochiq
    if (subStatus?.isPremium) {
      setSelectedLesson(lesson);
      return;
    }

    // Agar foydalanuvchi oddiy (bepul) bo'lsa:
    // Agar bu video bugun allaqachon ochilgan bo'lsa, qayta ochishga ruxsat
    if (unlockedVideoId === lesson.id) {
      setSelectedLesson(lesson);
      return;
    }

    // Yangi video ochish uchun kunlik quota tekshiriladi (kuniga 1 ta video)
    const quota = StorageManager.useVideoQuota();
    if (!quota.allowed) {
      setIsPremiumModalOpen(true);
      return;
    }

    setUnlockedVideoId(lesson.id);
    setSelectedLesson(lesson);
  };

  const filteredLessons = activeCategory === 'ALL' 
    ? LESSONS_DATA 
    : LESSONS_DATA.filter((l) => l.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-1.5">
              <Video className="w-3.5 h-3.5 text-blue-700" />
              <span>Prepora Video Masterclasslar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              IELTS va SAT Video Darsliklari
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Eng kuchli o'qituvchilar va imtihonchilar tomonidan tayyorlangan maxsus mahorat darslari.
            </p>
          </div>

          {/* Quota Indicator */}
          <div className="flex items-center gap-2">
            {subStatus?.isPremium ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-blue-950 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 fill-blue-950" />
                <span>Pro: Cheksiz Videolar ⚡</span>
              </span>
            ) : (
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center justify-between gap-3 text-slate-600 font-semibold">
                  <span>Kunlik Video Limiti:</span>
                  <span className="text-blue-950 font-bold">
                    {subStatus?.dailyVideoRemaining ?? 1}/1 qoldi
                  </span>
                </div>
                <span className="text-[10px] text-amber-700 block font-medium">
                  Oddiy hisobda kuniga 1 ta video ruxsat etiladi.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl transition ${
              activeCategory === 'ALL'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            Barcha Darslar ({LESSONS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('IELTS')}
            className={`px-4 py-2 rounded-xl transition ${
              activeCategory === 'IELTS'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            IELTS Darsliklari
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('SAT')}
            className={`px-4 py-2 rounded-xl transition ${
              activeCategory === 'SAT'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            Digital SAT Darsliklari
          </button>
        </div>

        {/* Video Player & Playlist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Screen */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800 aspect-video flex items-center justify-center">
              <iframe
                src={selectedLesson.videoUrl}
                title={selectedLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-950 text-xs font-black">
                    {selectedLesson.category} • {selectedLesson.skill}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration}
                  </span>
                </div>

                <span className="text-xs text-slate-600 font-bold">
                  Daraja: <span className="text-blue-950">{selectedLesson.level}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-blue-950">
                {selectedLesson.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedLesson.description}
              </p>

              {/* Instructor */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
                  {selectedLesson.instructor.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-950">{selectedLesson.instructor}</h4>
                  <span className="text-[10px] text-slate-500 block">{selectedLesson.instructorTitle}</span>
                </div>
              </div>

              {/* Topics in this lesson */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Ushbu darsda o'rganiladigan asosiy mavzular:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedLesson.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Video Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-wider flex items-center justify-between">
              <span>Barcha Darsliklar</span>
              <span className="text-xs text-slate-400 font-bold">{filteredLessons.length} ta dars</span>
            </h3>

            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson) => {
                const isCurrent = selectedLesson.id === lesson.id;
                const isLockedForFree = !subStatus?.isPremium && (subStatus?.dailyVideoRemaining ?? 1) <= 0 && unlockedVideoId !== lesson.id;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-start gap-3 group ${
                      isCurrent
                        ? 'bg-blue-950 text-white border-blue-950 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-blue-950'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isCurrent 
                        ? 'bg-amber-400 text-blue-950' 
                        : isLockedForFree 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-blue-50 text-blue-900 group-hover:scale-105'
                    }`}>
                      {isLockedForFree ? (
                        <Lock className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {lesson.category}
                        </span>
                        <span className={`text-[10px] ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                          {lesson.duration}
                        </span>
                        {isLockedForFree && (
                          <span className="text-[9px] font-black text-amber-500 uppercase ml-auto">
                            Pro Video
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isCurrent ? 'text-white' : 'text-blue-950'
                      }`}>
                        {lesson.title}
                      </h4>
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
        reason="general"
      />
    </div>
  );
}
