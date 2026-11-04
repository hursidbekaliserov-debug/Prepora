'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Plus, 
  Filter,
  Bookmark
} from 'lucide-react';
import { initialVocabList } from '@/data/vocabData';
import { VocabWord } from '@/types';
import { AudioSynthesizer } from '@/lib/audio';
import { StorageManager } from '@/lib/storage';

export default function VocabularyPage() {
  const [vocabList, setVocabList] = useState<VocabWord[]>([]);
  const [selectedExam, setSelectedExam] = useState<'ALL' | 'IELTS' | 'SAT'>('ALL');
  const [selectedMastery, setSelectedMastery] = useState<'ALL' | 'learning' | 'reviewing' | 'mastered'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedWordId, setFlippedWordId] = useState<string | null>(null);

  useEffect(() => {
    const custom = StorageManager.getCustomVocab();
    if (custom.length > 0) {
      setVocabList(custom);
    } else {
      setVocabList(initialVocabList);
      StorageManager.saveCustomVocab(initialVocabList);
    }
  }, []);

  const handlePronounce = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    AudioSynthesizer.playScript(word, { voicePreference: 'british', rate: 0.9 });
  };

  const handleUpdateMastery = (wordId: string, level: 'learning' | 'reviewing' | 'mastered', e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = vocabList.map((w) => (w.id === wordId ? { ...w, masteryLevel: level } : w));
    setVocabList(updated);
    StorageManager.saveCustomVocab(updated);
  };

  const filteredWords = vocabList.filter((w) => {
    const matchesExam = selectedExam === 'ALL' || w.examTarget === selectedExam || w.examTarget === 'BOTH';
    const matchesMastery = selectedMastery === 'ALL' || w.masteryLevel === selectedMastery;
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesMastery && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Yuqori Chastotali Akademik Lug'at
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950">Lug'at Boyitish (Vocabulary)</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Band 8.5+ IELTS so'zlari va Digital SAT kalit leksikasi. Talaffuzni eshiting va kartochkalar orqali yod oling.
            </p>
          </div>

          {/* Quick Mastery Count */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              {vocabList.filter((w) => w.masteryLevel === 'mastered').length} O'zlashtirildi
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold">
              {vocabList.filter((w) => w.masteryLevel === 'reviewing').length} Qaytarilmoqda
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold">
              {vocabList.filter((w) => w.masteryLevel === 'learning').length} O'rganilmoqda
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="So'z yoki ta'rifni qidiring..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Exam Filter */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
              {(['ALL', 'IELTS', 'SAT'] as const).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSelectedExam(ex)}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedExam === ex ? 'bg-blue-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Mastery Filter */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
              {(['ALL', 'learning', 'reviewing', 'mastered'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMastery(m)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition ${
                    selectedMastery === m ? 'bg-blue-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flashcard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((item) => {
            const isFlipped = flippedWordId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setFlippedWordId(isFlipped ? null : item.id)}
                className="cursor-pointer p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between min-h-[260px] shadow-xs group relative"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-950 border border-blue-200">
                      {item.examTarget}
                    </span>
                    <button
                      onClick={(e) => handlePronounce(item.word, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-950 text-slate-700 hover:text-white transition"
                      title="Britaniya talaffuzini eshitish"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Word & Phonetics */}
                  <h3 className="text-xl font-black text-blue-950 group-hover:text-blue-800 transition">
                    {item.word}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 mb-3 font-semibold">
                    <span className="font-mono text-blue-900">{item.phonetic}</span>
                    <span>•</span>
                    <span className="italic">{item.partOfSpeech}</span>
                  </div>

                  {/* Definition / Example */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                    {item.definition}
                  </p>

                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{item.exampleSentence}"
                  </p>

                  {/* Synonyms & Notes */}
                  {isFlipped && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                      <div>
                        <span className="text-[11px] font-bold text-blue-950 block">Sinonimlar:</span>
                        <span className="text-slate-700">{item.synonyms.join(', ')}</span>
                      </div>
                      {item.notes && (
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 block">Imtihon Strategiyasi:</span>
                          <span className="text-slate-600">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Mastery Status Toggle */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Batafsil ko'rish uchun bosing</span>
                  <div className="flex items-center gap-1">
                    {(['learning', 'reviewing', 'mastered'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={(e) => handleUpdateMastery(item.id, lvl, e)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition ${
                          item.masteryLevel === lvl
                            ? lvl === 'mastered'
                              ? 'bg-emerald-600 text-white'
                              : lvl === 'reviewing'
                              ? 'bg-amber-600 text-white'
                              : 'bg-blue-950 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
