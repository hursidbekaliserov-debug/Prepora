'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { AudioSynthesizer } from '@/lib/audio';

interface AudioPlayerProps {
  title: string;
  partNumber: number;
  script: string;
  onAudioComplete?: () => void;
}

export default function AudioPlayer({
  title,
  partNumber,
  script,
  onAudioComplete,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [accent, setAccent] = useState<'british' | 'australian' | 'american'>('british');

  useEffect(() => {
    return () => {
      AudioSynthesizer.stop();
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      AudioSynthesizer.pause();
      setIsPlaying(false);
    } else {
      AudioSynthesizer.playScript(script, {
        rate: speed,
        voicePreference: accent,
        onEnd: () => {
          setIsPlaying(false);
          if (onAudioComplete) onAudioComplete();
        },
      });
      setIsPlaying(true);
    }
  };

  const restartAudio = () => {
    AudioSynthesizer.stop();
    setIsPlaying(false);
    setTimeout(() => {
      togglePlayback();
    }, 100);
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      AudioSynthesizer.stop();
      AudioSynthesizer.playScript(script, {
        rate: newSpeed,
        voicePreference: accent,
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-950 border border-blue-200">
              Part {partNumber} Audio
            </span>
            <span className="text-xs text-slate-500 font-medium">Nutq Mexanizmi</span>
          </div>
          <h3 className="text-base font-bold text-blue-950 mt-1">{title}</h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Accent selector */}
          <select
            value={accent}
            onChange={(e) => setAccent(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-950"
          >
            <option value="british">British Accent</option>
            <option value="australian">Australian Accent</option>
            <option value="american">American Accent</option>
          </select>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5 text-xs">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                className={`px-2 py-1 rounded font-bold transition ${
                  speed === s ? 'bg-blue-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Play Bar */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20 animate-pulse'
                : 'bg-blue-950 hover:bg-blue-900 shadow-blue-950/20 hover:scale-105'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={restartAudio}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Qaytadan boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-blue-950">
              {isPlaying ? 'Audio eshittirilmoqda...' : 'Audioni eshitish uchun Play tugmasini bosing'}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Volume2 className="w-3 h-3 text-blue-900" />
              Diqqat bilan tinglang. Haqiqiy IELTS imtihonida audio faqat bir marta qo'yiladi.
            </span>
          </div>
        </div>

        {/* Transcript toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
        >
          <FileText className="w-3.5 h-3.5 text-blue-950" />
          <span>{showTranscript ? 'Matnni yashirish' : 'Audioscript'}</span>
          {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Transcript Collapsible */}
      {showTranscript && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl max-h-48 overflow-y-auto border border-slate-200">
          <p className="font-bold text-blue-950 mb-2 uppercase tracking-wider text-[10px]">
            Audio Matni (Transcript):
          </p>
          <p className="whitespace-pre-line">{script}</p>
        </div>
      )}
    </div>
  );
}
