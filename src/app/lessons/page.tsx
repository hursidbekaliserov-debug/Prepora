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
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles
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
  {
    id: 'sat-m-1',
    youtubeId: 'TFmt1VwZte8',
    title: "Digital SAT Math - Desmos Lesson #1: Solve Any Equation!",
    category: 'SAT',
    skill: 'Math',
    duration: '22 daqiqa',
    instructor: 'Tutorllini Test Prep',
    instructorTitle: 'Digital SAT Perfect 800 Specialist',
    level: 'All Levels',
    description: "Digital SAT imtihonida Desmos kalkulyatoridan maksimal foydalanish: har qanday tenglamani grafik usulda 5 soniyada yechish formulalari.",
    topics: ['Desmos grafik interfeysi sirlari', 'Murakkab tenglamalarni yechish', 'Vaqtni 50% ga tejash']
  },
  {
    id: 'ielts-w-1',
    youtubeId: 'SWVs5NYLuP8',
    title: "IELTS Writing Task 2: Band 9 Advantages & Disadvantages",
    category: 'IELTS',
    skill: 'Writing',
    duration: '26 daqiqa',
    instructor: 'IELTS with Juva',
    instructorTitle: 'Rasmiy Cambridge Examiner (Band 9)',
    level: 'Advanced',
    description: "Insho tuzilishining rasmiy 4 mezonini tushunish: Task Achievement, Cohesion & Coherence, Lexical Resource va Grammar bo'yicha Band 9 strategiyalari.",
    topics: ['Kirish qismini 3 daqiqada yozish', 'Asosiy fikrlar (Body Paragraphs) strukturasi', 'Band 9 lug\'atlar va akademik iboralar']
  },
  {
    id: 'sat-m-2',
    youtubeId: 'oL9_EOn5x7w',
    title: "Digital SAT Math - Desmos Lesson #2: Systems of Equations",
    category: 'SAT',
    skill: 'Math',
    duration: '28 daqiqa',
    instructor: 'Tutorllini Test Prep',
    instructorTitle: 'Perfect 1600 Scorer / MIT Alum',
    level: 'All Levels',
    description: "Tenglamalar sistemasi, regression, va parabolalarning kesishish nuqtalarini Desmosda tezkor topish.",
    topics: ['Regression tahlili orqali funksiya topish', 'Aylana va chiziqlar kesishishi', 'Desmosda vaqtni 50% tejash']
  },
  {
    id: 'ielts-w-2',
    youtubeId: 'w9tVmGia0_c',
    title: "How to Get a Band 9 in IELTS Writing Task 2 (Proven System)",
    category: 'IELTS',
    skill: 'Writing',
    duration: '24 daqiqa',
    instructor: 'Asiya (Fastrack IELTS)',
    instructorTitle: 'Oxford Academic Specialist',
    level: 'Intermediate - Advanced',
    description: "Rasmiy imtihonchilar e'tibor beradigan nozik nuqtalar: xatolardan qochish, so'z boyligini to'g'ri tanlash va parafraza qilish.",
    topics: ['Proven System bosqichlari', 'Xatolar tahlili', 'Band 9 xulosasi yozish']
  },
  {
    id: 'sat-all-1',
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
    id: 'ielts-w-3',
    youtubeId: 'qhxzCiwX11o',
    title: "How To Get Band 9 in IELTS Writing Task 1 Academic",
    category: 'IELTS',
    skill: 'Writing Task 1',
    duration: '31 daqiqa',
    instructor: 'Christopher Pell (IELTS Advantage)',
    instructorTitle: 'Cambridge Certified Examiner',
    level: 'Intermediate - Advanced',
    description: "Grafiklar, jadvallar va xaritalarni (Task 1) 20 daqiqada mukammal yozish bo'yicha to'liq qo'llanma.",
    topics: ['Overview yozish sirlari', 'Katta o\'zgarishlarni taqqoslash', 'Akademik so\'zlar']
  }
];

export default function LessonsPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'IELTS' | 'SAT'>('ALL');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const update = () => setSubStatus(StorageManager.getSubscriptionStatus());
    update();
    window.addEventListener('prepora_subscription_updated', update);
    return () => window.removeEventListener('prepora_subscription_updated', update);
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsPlaying(true);
  };

  const filteredLessons = activeCategory === 'ALL'
    ? LESSONS_DATA
    : LESSONS_DATA.filter((l) => l.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#0d0c22] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea4c89]/10 border border-[#ea4c89]/20 text-[#ea4c89] text-xs font-bold mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>Prepora Video Masterclasslar</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0d0c22] tracking-tight">
              IELTS va SAT Video Darsliklari
            </h1>
            <p className="text-xs sm:text-sm text-[#6e6d7a] mt-1">
              Eng yuqori sifatli YouTube video darsliklari: to'g'ridan-to'g'ri brauzeringizda tomosha qiling.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {subStatus?.isPremium ? (
              <span className="px-4 py-2 rounded-full bg-[#0d0c22] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Pro: Barcha Videolar Ochiq ⚡</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-xs font-bold text-[#0d0c22]">
                Bepul Kirish Ochiq
              </span>
            )}
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 border-b border-black/10 pb-3 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'ALL'
                ? 'bg-[#0d0c22] text-white shadow-xs'
                : 'bg-white hover:bg-black/5 text-[#6e6d7a] border border-black/10'
              }`}
          >
            Barcha Darslar ({LESSONS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('IELTS')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'IELTS'
                ? 'bg-[#0d0c22] text-white shadow-xs'
                : 'bg-white hover:bg-black/5 text-[#6e6d7a] border border-black/10'
              }`}
          >
            IELTS Darsliklari
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('SAT')}
            className={`px-4 py-2 rounded-full transition ${activeCategory === 'SAT'
                ? 'bg-[#0d0c22] text-white shadow-xs'
                : 'bg-white hover:bg-black/5 text-[#6e6d7a] border border-black/10'
              }`}
          >
            Digital SAT Darsliklari
          </button>
        </div>

        {/* Video Player & Playlist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Embedded YouTube Video Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-xl border border-black/10 aspect-video">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedLesson.youtubeId}?autoplay=1&rel=0`}
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0d0c22] text-white text-xs font-bold">
                    {selectedLesson.category} • {selectedLesson.skill}
                  </span>
                  <span className="text-xs text-[#6e6d7a] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration}
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

              <h2 className="text-xl sm:text-2xl font-black text-[#0d0c22]">
                {selectedLesson.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#6e6d7a] leading-relaxed">
                {selectedLesson.description}
              </p>

              {/* Instructor */}
              <div className="pt-4 border-t border-black/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d0c22] text-white flex items-center justify-center font-bold text-sm">
                  {selectedLesson.instructor.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0d0c22]">{selectedLesson.instructor}</h4>
                  <span className="text-[10px] text-[#6e6d7a] block">{selectedLesson.instructorTitle}</span>
                </div>
              </div>

              {/* Topics in this lesson */}
              <div className="p-4 rounded-2xl bg-[#f8f7f4] border border-black/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#6e6d7a] tracking-wider block">
                  Ushbu darsda o'rganiladigan asosiy mavzular:
                </span>
                <ul className="space-y-1.5 text-xs text-[#0d0c22]">
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

          {/* Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#0d0c22]">
                Darslar Ro'yxati ({filteredLessons.length})
              </h3>
              <span className="text-xs text-[#6e6d7a] font-bold">HD Video</span>
            </div>

            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson) => {
                const isCurrent = lesson.id === selectedLesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group ${isCurrent
                        ? 'bg-white border-[#0d0c22] shadow-md ring-2 ring-black/5'
                        : 'bg-white hover:bg-slate-50 border-black/10'
                      }`}
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                      <img
                        src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className={`w-4 h-4 fill-white ${isCurrent ? 'text-[#ea4c89]' : 'text-white'}`} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#ea4c89] uppercase tracking-wide block">
                        {lesson.category} • {lesson.skill}
                      </span>
                      <h4 className="text-xs font-bold text-[#0d0c22] line-clamp-2 leading-tight mt-0.5">
                        {lesson.title}
                      </h4>
                      <span className="text-[10px] text-[#6e6d7a] mt-1 block">
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
        reason="general"
      />
    </div>
  );
}
