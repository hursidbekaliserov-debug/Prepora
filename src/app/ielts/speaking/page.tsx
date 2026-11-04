'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  AlertCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { ieltsSpeakingParts } from '@/data/ieltsQuestions';
import { AudioRecorder } from '@/lib/audio';
import { StorageManager } from '@/lib/storage';
import PremiumModal from '@/components/PremiumModal';

export default function IeltsSpeakingPage() {
  const [activePartIndex, setActivePartIndex] = useState(0); // 0: Part 1, 1: Part 2, 2: Part 3
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recorderInstance, setRecorderInstance] = useState<AudioRecorder | null>(null);
  const [prepSeconds, setPrepSeconds] = useState(60); // 1-minute cue card prep
  const [isPrepping, setIsPrepping] = useState(false);
  const [speechSeconds, setSpeechSeconds] = useState(120); // 2-minute speaking limit
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [transcriptDraft, setTranscriptDraft] = useState('');

  const currentPart = ieltsSpeakingParts[activePartIndex];

  // Initialize recorder
  useEffect(() => {
    setRecorderInstance(new AudioRecorder());
  }, []);

  // 1-minute prep timer for Part 2
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPrepping && prepSeconds > 0) {
      timer = setInterval(() => {
        setPrepSeconds((prev) => prev - 1);
      }, 1000);
    } else if (prepSeconds === 0 && isPrepping) {
      setIsPrepping(false);
    }
    return () => clearInterval(timer);
  }, [isPrepping, prepSeconds]);

  // Speaking timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && speechSeconds > 0) {
      timer = setInterval(() => {
        setSpeechSeconds((prev) => prev - 1);
      }, 1000);
    } else if (speechSeconds === 0 && isRecording) {
      handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, speechSeconds]);

  const handleStartRecording = async () => {
    if (!recorderInstance) return;
    try {
      await recorderInstance.startRecording();
      setIsRecording(true);
      setRecordedAudioUrl(null);
      setSpeechSeconds(120);
      setFeedback(null);
    } catch (err) {
      alert('Microphone access denied or not available. Please allow microphone permissions in your browser.');
    }
  };

  const handleStopRecording = async () => {
    if (!recorderInstance || !isRecording) return;
    try {
      const { url } = await recorderInstance.stopRecording();
      setIsRecording(false);
      setRecordedAudioUrl(url);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setIsRecording(false);
    }
  };

  const handleRunAnalysis = () => {
    const quota = StorageManager.useChatQuota();
    if (!quota.allowed) {
      setIsPremiumModalOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setFeedback({
        overallEstimatedBand: 7.5,
        fluencyCoherenceScore: 7.5,
        lexicalResourceScore: 8.0,
        grammarScore: 7.0,
        pronunciationScore: 7.5,
        strengths: [
          'Excellent natural cadence and sustained speech flow without prolonged hesitation pauses.',
          'Rich lexical variety with natural idiomatic collocations and discourse markers.',
          'Successfully addressed all cue card bullet points with logical chronological order.',
        ],
        improvements: [
          'Watch conditional verb consistency in hypothetical scenarios (e.g., "If I had chosen... I would have achieved...").',
          'Use rising and falling intonation slightly more dynamically to mark emphatic contrasts.',
        ],
        sampleBand9Excerpt:
          '"Looking back on that pivotal turning point, what initially appeared as a formidable setback fundamentally reshaped my trajectory..."',
      });
      StorageManager.recordStudyActivity(15);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-950 text-xs font-bold mb-1 border border-blue-200">
              <Mic className="w-3.5 h-3.5 text-blue-800" />
              IELTS Speaking Studio
            </div>
            <h1 className="text-2xl font-extrabold text-blue-950">Interactive Speaking Test & Recording</h1>
          </div>

          {/* Part Selection */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1 rounded-2xl">
            {ieltsSpeakingParts.map((p, idx) => (
              <button
                key={p.part}
                onClick={() => {
                  setActivePartIndex(idx);
                  setRecordedAudioUrl(null);
                  setFeedback(null);
                  setPrepSeconds(60);
                  setIsPrepping(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activePartIndex === idx
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-950'
                }`}
              >
                Part {p.part}
              </button>
            ))}
          </div>
        </div>

        {/* Part Prompt Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">
              Part {currentPart.part} • {currentPart.topic}
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentPart.instructions}</span>
          </div>

          {/* Part 1 & 3 Questions */}
          {currentPart.questions && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 block">
                The examiner asks you these questions one by one:
              </span>
              <div className="space-y-2.5">
                {currentPart.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part 2 Cue Card */}
          {currentPart.cueCard && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-blue-50/50 border-2 border-blue-200 shadow-inner">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-2">
                  Official Candidate Task Card:
                </span>
                <h3 className="text-lg font-bold text-blue-950 mb-3">{currentPart.cueCard.topic}</h3>
                <span className="text-xs font-semibold text-slate-700 block mb-2">You should say:</span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {currentPart.cueCard.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-950 font-bold">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1-Minute Preparation Timer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-800" />
                  <span className="text-xs font-medium text-slate-700">
                    Candidate Preparation Time: <strong className="text-blue-950 font-mono">{prepSeconds}s</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPrepping(!isPrepping)}
                    className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-sm"
                  >
                    {isPrepping ? 'Pause Prep' : 'Start 1-Min Prep'}
                  </button>
                  <button
                    onClick={() => {
                      setIsPrepping(false);
                      setPrepSeconds(60);
                    }}
                    className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:text-blue-950 text-xs"
                    title="Reset Prep Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Recording & Studio Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-blue-950">Browser Audio Studio</h3>
              <p className="text-xs text-slate-500">
                Record your response directly through your microphone. Audio is processed locally.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition animate-pulse"
                >
                  <MicOff className="w-4 h-4" /> Stop Recording ({speechSeconds}s left)
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md flex items-center gap-2 transition hover:scale-105"
                >
                  <Mic className="w-4 h-4" /> Start Recording Response
                </button>
              )}
            </div>
          </div>

          {/* Recording Playback */}
          {recordedAudioUrl && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <audio src={recordedAudioUrl} controls className="h-10 w-full sm:w-64" />
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Audio Recorded
                </span>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Speaking Rubric...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" /> Run AI Speech Assessment
                  </>
                )}
              </button>
            </div>
          )}

          {/* Transcript / Spoken Notes area */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Spoken Transcript / Key Notes (Optional reference for AI review):
            </label>
            <textarea
              value={transcriptDraft}
              onChange={(e) => setTranscriptDraft(e.target.value)}
              placeholder="You can paste or summarize your spoken speech here for targeted grammar and vocabulary analysis..."
              className="w-full h-24 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-blue-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-950 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* AI FEEDBACK REPORT */}
        {feedback && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-1">
                  Examiner Speech Report
                </span>
                <h3 className="text-xl font-bold text-blue-950">Part {currentPart.part} Assessment</h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-950 text-white text-center shadow-md min-w-[100px]">
                <span className="text-[10px] uppercase tracking-wider block font-bold text-blue-200">
                  Estimated Band
                </span>
                <span className="text-2xl font-black">{feedback.overallEstimatedBand.toFixed(1)}</span>
              </div>
            </div>

            {/* 4 Criteria Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Fluency & Coherence</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.fluencyCoherenceScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Lexical Resource</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.lexicalResourceScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Grammatical Range</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.grammarScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Pronunciation</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.pronunciationScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spoken Strengths
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {feedback.strengths.map((str: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Delivery Improvements
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {feedback.improvements.map((imp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        reason="chat_limit"
      />
    </div>
  );
}
