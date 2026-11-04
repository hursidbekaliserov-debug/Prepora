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
  AlertCircle
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
    id: 'ielts-w-1',
    youtubeId: 'sRFEVbyr6Kg',
    title: "IELTS Writing Task 2: Band 9.0 Insho Formulalari va Shabloni",
    category: 'IELTS',
    skill: 'Writing',
    duration: '35 daqiqa',
    instructor: 'Christopher Pell (IELTS Advantage)',
    instructorTitle: 'Rasmiy Cambridge Examiner (Band 9)',
    level: 'Advanced',
    description: "Insho tuzilishining rasmiy 4 mezonini tushunish: Task Achievement, Cohesion & Coherence, Lexical Resource va Grammar bo'yicha Band 9 strategiyalari.",
    topics: ['Kirish qismini 3 daqiqada yozish', 'Asosiy fikrlar (Body Paragraphs) strukturasi', 'Band 9 lug\'atlar va akademik iboralar']
  },
  {
    id: 'sat-m-1',
    youtubeId: 'f93125R4sK0',
    title: "SAT Math: Desmos Kalkulyatorining 10 ta Yashirin Sirlari",
    category: 'SAT',
    skill: 'Math',
    duration: '32 daqiqa',
    instructor: 'Tutorllini SAT Test Prep',
    instructorTitle: 'Perfect 1600 Scorer / MIT Alum',
    level: 'All Levels',
    description: "Digital SAT imtihonida Desmos grafik kalkulyatoridan maksimal foydalanish: tenglamalar sistemasi, regression, va parabolalarni 5 soniyada yechish.",
    topics: ['Regression tahlili orqali funksiya topish', 'Aylana va chiziqlar kesishishi', 'Desmosda vaqtni 50% tejash']
  },
  {
    id: 'ielts-s-1',
    youtubeId: '1b_j_O18r58',
    title: "IELTS Speaking Part 2 & 3: Examinerlarni Hayratda Qoldirish Sirlari",
    category: 'IELTS',
    skill: 'Speaking',
    duration: '28 daqiqa',
    instructor: 'Keith O\'Hare (Keith Speaking Academy)',
    instructorTitle: 'British Council Certified Trainer',
    level: 'Intermediate - Advanced',
    description: "Cue card bo'yicha 2 daqiqa to'xtovsiz ravon gapirish texnikasi va Part 3 dagi murakkab savollarga tabiiy javob berish usullari.",
    topics: ['1 daqiqalik tayyorgarlik daftari', 'Idiomalar va tabiiy bog\'lovchilar', 'Intonatsiya va urg\'u sirlari']
  },
  {
    id: 'sat-rw-1',
    youtubeId: 'z44q8q35R84',
    title: "SAT Reading & Writing: Grammatika va Punktuatsiya Qoidalari",
    category: 'SAT',
    skill: 'Reading & Writing',
    duration: '27 daqiqa',
    instructor: 'Hayden Rhodea SAT Prep',
    instructorTitle: 'Stanford SAT Verbal Coach',
    level: 'All Levels',
    description: "Standard English Conventions: vergul, nuqta-vergul, tire va apostroflarning SAT dagi aniq va qat'iy qoidalari.",
    topics: ['Run-on jumlalarni tuzatish', 'Subject-verb agreement qoidalari', 'Transitions va mantiqiy bog\'lovchilar']
  },
  {
    id: 'ielts-r-1',
    youtubeId: '0kH8fBw8a8E',
    title: "IELTS Reading: Skimming & Scanning - 60 Daqiqada 40/40 Ishlash",
    category: 'IELTS',
    skill: 'Reading',
    duration: '30 daqiqa',
    instructor: 'Asiya (Fastrack IELTS)',
    instructorTitle: 'Oxford Academic Reading Specialist',
    level: 'Intermediate - Advanced',
    description: "Matnni to'liq o'qimasdan to'g'ri javoblarni 15 soniyada topish, True/False/Not Given tuzoqlaridan qochish.",
    topics: ['Kalit so\'zlarni parafraza qilish', 'Headings moslashtirish usullari', 'Vaqtni 3 ta passage ga to\'g\'ri taqsimlash']
  },
  {
    id: 'sat-m-2',
    youtubeId: 'Yp69P0xK47I',
    title: "SAT Advanced Math: Kvadratik Tenglamalar va Murakkab Funksiyalar",
    category: 'SAT',
    skill: 'Advanced Math',
    duration: '25 daqiqa',
    instructor: 'Huzefa Kapadia (Scalar Learning)',
    instructorTitle: 'Perfect 800 Math Master',
    level: 'Hard / Module 2',
    description: "SAT Module 2 dagi eng qiyin 750-800 ballik algebra va funksiyalar masalalarining tezkor qadamma-qadam yechimlari.",
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

  // Videoni YouTubeda ochish (havola to'g'ridan-to'g'ri YouTube saytida yangi tabda ochiladi)
  const handleOpenVideoOnYouTube = (lesson: Lesson) => {
    // 1. Agar Pro (Premium) bo'lsa: barcha videolar cheksiz ochiq
    if (subStatus?.isPremium) {
      window.open(`https://www.youtube.com/watch?v=${lesson.youtubeId}`, '_blank');
      return;
    }

    // 2. Agar foydalanuvchi bepul bo'lsa:
    // Agar bu video bugun allaqachon ochilgan bo'lsa, uni qayta ko'rishga ruxsat
    if (unlockedVideoId === lesson.id) {
      window.open(`https://www.youtube.com/watch?v=${lesson.youtubeId}`, '_blank');
      return;
    }

    // Yangi video ko'rish uchun kunlik 1 ta quota tekshiriladi
    const quota = StorageManager.useVideoQuota();
    if (!quota.allowed) {
      setIsPremiumModalOpen(true);
      return;
    }

    // Muvaffaqiyatli ochildi: 1 ta limitdan foydalanildi
    setUnlockedVideoId(lesson.id);
    window.open(`https://www.youtube.com/watch?v=${lesson.youtubeId}`, '_blank');
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
              Rasmiy YouTube darsliklari: bir marta bosishda to'g'ridan-to'g'ri YouTubeda yuqori sifatda ochiladi.
            </p>
          </div>

          {/* Quota Indicator */}
          <div className="flex items-center gap-2">
            {subStatus?.isPremium ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-blue-950 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 fill-blue-950" />
                <span>Pro: Barcha Videolar Cheksiz ⚡</span>
              </span>
            ) : (
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center justify-between gap-3 text-slate-600 font-semibold">
                  <span>Bugungi Bepul Video Limiti:</span>
                  <span className="text-blue-950 font-bold">
                    {subStatus?.dailyVideoRemaining ?? 1}/1 qoldi
                  </span>
                </div>
                <span className="text-[10px] text-amber-700 block font-medium">
                  Oddiy hisobda kuniga 1 ta video ruxsat etiladi. Pro da esa cheksiz!
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
          {/* Main Video Screen with Direct YouTube Launch */}
          <div className="lg:col-span-8 space-y-4">
            {/* Visual HD Thumbnail Card */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800 aspect-video group">
              <img
                src={`https://img.youtube.com/vi/${selectedLesson.youtubeId}/hqdefault.jpg`}
                alt={selectedLesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Play className="w-3.5 h-3.5 fill-white" /> YouTube HD
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold">
                    {selectedLesson.duration}
                  </span>
                </div>

                {/* Center YouTube Play Button */}
                <div className="text-center space-y-3">
                  <button
                    type="button"
                    onClick={() => handleOpenVideoOnYouTube(selectedLesson)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-2xl transition hover:scale-105 active:scale-95 group/btn"
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-bold">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <span>Videoni YouTubeda Ko'rish</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </button>

                  <p className="text-[11px] text-slate-300 font-medium">
                    Bosganingizda video to'g'ridan-to'g'ri YouTube da ochiladi va uzluksiz o'ynaydi.
                  </p>
                </div>

                {/* Bottom title badge */}
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {selectedLesson.category} • {selectedLesson.skill}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {selectedLesson.title}
                  </h3>
                </div>
              </div>
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

                <button
                  type="button"
                  onClick={() => handleOpenVideoOnYouTube(selectedLesson)}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>YouTubeda Ochish</span>
                </button>
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
                  <div
                    key={lesson.id}
                    className={`w-full p-3.5 rounded-2xl text-left border transition flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-blue-950 text-white border-blue-950 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-blue-950'
                    }`}
                  >
                    <div 
                      onClick={() => {
                        setSelectedLesson(lesson);
                        handleOpenVideoOnYouTube(lesson);
                      }}
                      className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 cursor-pointer group"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`}
                        alt={lesson.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        {isLockedForFree ? (
                          <Lock className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Play className="w-4 h-4 text-white fill-white" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {lesson.category}
                        </span>
                        <span className={`text-[9px] ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                          {lesson.duration}
                        </span>
                        {isLockedForFree && (
                          <span className="text-[9px] font-black text-amber-400 uppercase ml-auto">
                            Pro
                          </span>
                        )}
                      </div>

                      <h4 
                        onClick={() => {
                          setSelectedLesson(lesson);
                          handleOpenVideoOnYouTube(lesson);
                        }}
                        className={`text-xs font-bold leading-snug line-clamp-2 cursor-pointer hover:underline ${
                          isCurrent ? 'text-white' : 'text-blue-950'
                        }`}
                      >
                        {lesson.title}
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLesson(lesson);
                          handleOpenVideoOnYouTube(lesson);
                        }}
                        className={`mt-1.5 text-[10px] font-bold flex items-center gap-1 ${
                          isCurrent ? 'text-amber-300 hover:text-white' : 'text-red-600 hover:text-red-700'
                        }`}
                      >
                        <span>YouTubeda Ochish</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
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
