'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  PenTool, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Save, 
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ieltsWritingPrompts } from '@/data/ieltsQuestions';
import { WritingPrompt, WritingFeedback } from '@/types';
import { StorageManager } from '@/lib/storage';
import PremiumModal from '@/components/PremiumModal';

export default function IeltsWritingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(ieltsWritingPrompts[2]); // Task 2 by default
  const [essayText, setEssayText] = useState('');
  const [seconds, setSeconds] = useState(40 * 60); // 40 minutes for Task 2, 20 for Task 1
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('Autosaved');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Word count
  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const minWords = selectedPrompt.minimumWords;

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, seconds]);

  // Autosave to localStorage
  useEffect(() => {
    if (essayText) {
      setSaveStatus('Saving...');
      const timeout = setTimeout(() => {
        localStorage.setItem(`ielts_writing_${selectedPrompt.id}`, essayText);
        setSaveStatus('Draft saved');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [essayText, selectedPrompt.id]);

  // Load saved draft on prompt switch
  const handlePromptSelect = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setFeedback(null);
    const saved = localStorage.getItem(`ielts_writing_${prompt.id}`) || '';
    setEssayText(saved);
    setSeconds(prompt.taskType === 'Task 1' ? 20 * 60 : 40 * 60);
    setIsTimerRunning(false);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEvaluate = async () => {
    if (wordCount < 30) {
      alert('Iltimos, AI tahlilidan oldin kamida 30 ta so\'z yozing.');
      return;
    }

    const quota = StorageManager.useChatQuota();
    if (!quota.allowed) {
      setIsPremiumModalOpen(true);
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: selectedPrompt.taskType,
          promptText: selectedPrompt.prompt,
          essayText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback);
      } else {
        alert('Evaluation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error evaluating writing:', err);
      alert('Network error connecting to AI evaluation engine.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Task Switcher */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-blue-800" /> IELTS Writing Lab
              </span>
              <span className="text-xs text-slate-500">{saveStatus}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-blue-950">Timed Writing Practice & AI Evaluation</h1>
          </div>

          {/* Prompt Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {ieltsWritingPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePromptSelect(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedPrompt.id === p.id
                    ? 'bg-blue-950 border-blue-950 text-white shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-950'
                }`}
              >
                {p.taskType} ({p.testType === 'ACADEMIC' ? 'Acad' : 'GT'})
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Prompt and Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompt Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">
                  {selectedPrompt.taskType} • {selectedPrompt.testType}
                </span>
                <span className="text-xs text-slate-500 font-semibold">Min {selectedPrompt.minimumWords} words</span>
              </div>

              <h2 className="text-lg font-bold text-blue-950">{selectedPrompt.title}</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedPrompt.prompt}
              </p>

              {/* Task 1 visual data reference */}
              {selectedPrompt.dataVisualDescription && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
                  <span className="font-bold text-blue-950 block mb-1 text-[11px] uppercase tracking-wider font-sans">
                    Visual Data Reference:
                  </span>
                  <pre className="whitespace-pre-line font-sans text-xs">{selectedPrompt.dataVisualDescription}</pre>
                </div>
              )}

              {/* Band 9 Scoring Criteria Guide */}
              <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
                <span className="font-bold text-blue-950 block">IELTS Assessment Criteria:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-950 block">1. Task Response</strong>
                    Fully address all parts with supported arguments.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-950 block">2. Coherence & Cohesion</strong>
                    Logical paragraph progression and linking.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-950 block">3. Lexical Resource</strong>
                    Collocations, academic vocabulary, flexibility.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-950 block">4. Grammatical Range</strong>
                    Complex structures with high accuracy.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Column */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex-1 flex flex-col">
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-3">
                  {/* Timer Toggle */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-blue-950">
                    <Clock className="w-3.5 h-3.5 text-blue-800" />
                    <span>{formatTime(seconds)}</span>
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
                  >
                    {isTimerRunning ? 'Pause' : 'Start Timer'}
                  </button>
                </div>

                {/* Word Counter */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      wordCount >= minWords
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {wordCount} / {minWords} words
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Type your complete response here. Follow formal essay paragraphs: Introduction, Body Paragraph 1, Body Paragraph 2, and Conclusion..."
                className="w-full flex-1 min-h-[360px] bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-blue-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950 leading-relaxed resize-y font-normal"
              />

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Clear current draft?')) setEssayText('');
                  }}
                  className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-600 transition"
                >
                  Clear Draft
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Assessing with AI Examiner...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" /> Evaluate with AI Examiner
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI FEEDBACK RESULTS SECTION */}
        {feedback && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-1">
                  Official IELTS Writing Feedback Report
                </span>
                <h3 className="text-xl font-bold text-blue-950">Assessment Results</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-950 text-white text-center shadow-md min-w-[100px]">
                  <span className="text-[10px] uppercase tracking-wider block font-bold text-blue-200">
                    Overall Band
                  </span>
                  <span className="text-2xl font-black">{feedback.overallBand.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* 4 Criteria Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Task Response</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.taskAchievementScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Coherence & Cohesion</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.coherenceCohesionScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Lexical Resource</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.lexicalResourceScore.toFixed(1)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block font-semibold">Grammatical Accuracy</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {feedback.grammarScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {feedback.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas for Improvement
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {feedback.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Paragraph-by-paragraph breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-blue-950 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-800" /> Paragraph-by-Paragraph Examiner Notes
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                {feedback.paragraphFeedback.map((fb, idx) => (
                  <p key={idx} className="p-3 rounded-xl bg-white border border-slate-200">
                    {fb}
                  </p>
                ))}
              </div>
            </div>

            {/* Actionable Suggestions */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <h4 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-800" /> Actionable Next Steps to Reach Band 8.5+
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {feedback.actionableImprovements.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-950 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
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
