'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  RotateCcw, 
  Calculator, 
  Sparkles, 
  Award,
  AlertCircle,
  Eye,
  FileCheck,
  Crown
} from 'lucide-react';
import { Question, ReadingPassage } from '@/types';
import { checkAnswer, getIeltsListeningBand, getIeltsReadingBand, estimateSatReadingWritingScore, estimateSatMathScore } from '@/lib/scoring';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import PremiumModal from '@/components/PremiumModal';

interface ExamEngineProps {
  title: string;
  exam: 'IELTS' | 'SAT';
  sectionName: string;
  questions: Question[];
  passages?: ReadingPassage[];
  timeLimitMinutes?: number;
  isMockExam?: boolean;
  onFinish?: (results: any) => void;
  audioPlayerComponent?: React.ReactNode;
}

export default function ExamEngine({
  title,
  exam,
  sectionName,
  questions,
  passages,
  timeLimitMinutes = 30,
  isMockExam = false,
  onFinish,
  audioPlayerComponent,
}: ExamEngineProps) {
  // Navigation & State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [practiceChecked, setPracticeChecked] = useState<Record<string, boolean>>({});
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    setSubStatus(StorageManager.getSubscriptionStatus());
    const update = () => setSubStatus(StorageManager.getSubscriptionStatus());
    window.addEventListener('prepora_subscription_updated', update);
    return () => window.removeEventListener('prepora_subscription_updated', update);
  }, []);

  const currentQ = questions[currentIndex];

  // Active Passage lookup if applicable
  const currentPassage = passages?.find(
    (p) => p.id === currentQ?.passageId || p.passageNumber === currentQ?.moduleOrPart
  ) || passages?.[0];

  // Timer countdown
  useEffect(() => {
    if (isExamFinished || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamFinished, secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectAnswer = (ans: string) => {
    if (isExamFinished) return;

    // Premium bo'lmagan foydalanuvchilar uchun 5 tadan ortiq savolga javob berishni qat'iy cheklash
    if (!subStatus?.isPremium) {
      const alreadyAnsweredCount = Object.keys(answers).length;
      const isAlreadyAnswered = !!answers[currentQ.id];

      if (!isAlreadyAnswered && alreadyAnsweredCount >= 5) {
        setIsPremiumModalOpen(true);
        return;
      }

      if (!isAlreadyAnswered) {
        const quota = StorageManager.useTestQuota();
        if (!quota.allowed) {
          setIsPremiumModalOpen(true);
          return;
        }
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const checkSinglePracticeAnswer = () => {
    if (!subStatus?.isPremium) {
      const quota = StorageManager.useTestQuota();
      if (!quota.allowed) {
        setIsPremiumModalOpen(true);
        return;
      }
    }

    setPracticeChecked((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const finishExam = () => {
    if (!subStatus?.isPremium) {
      const quota = StorageManager.useTestQuota();
      if (!quota.allowed) {
        setIsPremiumModalOpen(true);
        return;
      }
    }

    setIsExamFinished(true);
    setShowSubmitModal(false);

    let correctCount = 0;
    const domainBreakdown: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const userAns = answers[q.id] || '';
      const isCorrect = checkAnswer(userAns, q.correctAnswer);
      if (isCorrect) correctCount++;

      const domain = q.skillOrDomain || 'General';
      if (!domainBreakdown[domain]) {
        domainBreakdown[domain] = { total: 0, correct: 0 };
      }
      domainBreakdown[domain].total += 1;
      if (isCorrect) domainBreakdown[domain].correct += 1;

      if (!isCorrect && userAns) {
        StorageManager.saveMistake({
          id: `mistake-${q.id}-${Date.now()}`,
          questionId: q.id,
          exam: q.exam,
          skillOrDomain: q.skillOrDomain,
          prompt: q.prompt,
          userAnswer: userAns,
          correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
          explanation: q.explanation,
          recordedAt: new Date().toISOString(),
          reviewed: false,
        });
      }
    });

    const durationMinutes = Math.max(1, Math.round((timeLimitMinutes * 60 - secondsLeft) / 60));
    StorageManager.recordStudyActivity(durationMinutes);

    let scoreEst: number | undefined;
    if (exam === 'IELTS') {
      if (sectionName.toLowerCase().includes('listening')) {
        scoreEst = getIeltsListeningBand(correctCount);
      } else {
        scoreEst = getIeltsReadingBand(correctCount, 'ACADEMIC');
      }
    } else {
      if (sectionName.toLowerCase().includes('math')) {
        scoreEst = estimateSatMathScore(correctCount);
      } else {
        scoreEst = estimateSatReadingWritingScore(correctCount);
      }
    }

    const examResult = {
      id: `attempt-${Date.now()}`,
      examType: exam,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      isMockExam,
      domainBreakdown,
      userAnswers: answers,
      ...(exam === 'IELTS'
        ? {
            ieltsReadingRaw: correctCount,
            ieltsReadingBand: scoreEst,
          }
        : {
            satReadingWritingRaw: correctCount,
            satTotalScoreEst: scoreEst,
          }),
    };
    StorageManager.saveExamResult(examResult as any);

    if (onFinish) {
      onFinish(examResult);
    }
  };

  // -------------------------------------------------------------
  // RESULTS SCREEN
  // -------------------------------------------------------------
  if (isExamFinished) {
    let correctCount = 0;
    questions.forEach((q) => {
      if (checkAnswer(answers[q.id] || '', q.correctAnswer)) {
        correctCount++;
      }
    });
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const estimatedScore =
      exam === 'IELTS'
        ? getIeltsListeningBand(correctCount)
        : sectionName.toLowerCase().includes('math')
        ? estimateSatMathScore(correctCount)
        : estimateSatReadingWritingScore(correctCount);

    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        {/* Results Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-950 text-xs font-bold mb-3 border border-blue-200">
                <FileCheck className="w-3.5 h-3.5" />
                Test Yakunlandi & Saqlandi
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">{title}</h1>
              <p className="text-slate-600 text-sm mt-1">
                Sarflangan vaqt: {Math.max(1, Math.round((timeLimitMinutes * 60 - secondsLeft) / 60))} daqiqa. Xatolar daftaringizga kiritildi.
              </p>
            </div>

            {/* Score Badges */}
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center min-w-[130px] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                  To'g'ri Javoblar
                </span>
                <span className="text-3xl font-black text-blue-950 mt-1 block">
                  {correctCount} <span className="text-slate-400 text-lg font-normal">/ {questions.length}</span>
                </span>
                <span className="text-xs font-bold text-blue-900 mt-1 block">{accuracy}% Aniqlik</span>
              </div>

              <div className="bg-blue-950 rounded-2xl p-4 text-center min-w-[140px] text-white shadow-lg">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                  {exam === 'IELTS' ? 'Kutilayotgan Band' : 'Kutilayotgan Ball'}
                </span>
                <span className="text-3xl font-black mt-1 block">
                  {exam === 'IELTS' ? estimatedScore.toFixed(1) : `${estimatedScore}`}
                </span>
                <span className="text-[11px] text-slate-300 font-medium mt-1 block">
                  {exam === 'IELTS' ? 'Rasmiy IELTS Shkalasi' : '200–800 Shkalasi'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Retake & Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-900" />
            Javoblar Tahlili va Tushuntirishlar
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAnswers({});
                setFlagged({});
                setSecondsLeft(timeLimitMinutes * 60);
                setIsExamFinished(false);
                setCurrentIndex(0);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Qaytadan Ishlash
            </button>
            <a
              href={exam === 'IELTS' ? '/ielts' : '/sat'}
              className="px-5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-md shadow-blue-950/20"
            >
              Bo'limga Qaytish
            </a>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAns = answers[q.id] || '';
            const isCorrect = checkAnswer(userAns, q.correctAnswer);
            const correctDisplay = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl border transition bg-white ${
                  isCorrect
                    ? 'border-emerald-300'
                    : 'border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {q.skillOrDomain}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Qiyinlik: {q.difficulty}</span>
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> To'g'ri
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <XCircle className="w-4 h-4" /> Noto'g'ri
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-900 mt-3 whitespace-pre-line leading-relaxed">
                  {q.prompt}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-0.5">Sizning Javobingiz:</span>
                    <span
                      className={`font-bold px-3 py-1 rounded-lg ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {userAns || '(Belgilanmadi)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-0.5">To'g'ri Javob:</span>
                    <span className="font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-950 border border-blue-200">
                      {correctDisplay}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-blue-950 block mb-1">To'liq Izoh va Dalil:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE TEST ENGINE SCREEN
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Test Top Toolbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-blue-950 font-bold">Prepora • {exam}</span>
            <span className="text-sm font-black text-slate-900 truncate max-w-[200px] sm:max-w-md">{title}</span>
          </div>
          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {isMockExam ? 'Haqiqiy Vaqtli Imtihon' : 'Amaliyot Rejimi'}
          </span>
        </div>

        {/* Center Timer */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            secondsLeft < 300
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-slate-100 border-slate-200 text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-950" />
          <span>{formatTime(secondsLeft)}</span>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quota Badge */}
          {subStatus?.isPremium ? (
            <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-black">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Bezlimit
            </span>
          ) : (
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              <span>Test: {subStatus?.dailyTestRemaining ?? 5}/5</span>
              <span className="text-[10px] text-amber-600 font-extrabold underline">Premium</span>
            </button>
          )}
          {sectionName.toLowerCase().includes('math') && (
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              title="Formulalar"
            >
              <Calculator className="w-4 h-4 text-blue-950" />
              <span className="hidden sm:inline">Formulalar</span>
            </button>
          )}

          <button
            onClick={() => toggleFlag(currentQ.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border ${
              flagged[currentQ.id]
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden sm:inline">{flagged[currentQ.id] ? 'Belgilangan' : 'Belgilash'}</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition shadow-sm"
          >
            Topshirish
          </button>
        </div>
      </header>

      {/* Main split viewport */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full p-4 gap-4">
        {/* Left Side: Audio Player OR Reading Passage OR Context */}
        {(passages || audioPlayerComponent || currentQ?.audioScript) && (
          <div className="w-full lg:w-1/2 flex flex-col bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto max-h-[45vh] lg:max-h-[calc(100vh-160px)] shadow-xs">
            {audioPlayerComponent && <div className="mb-4">{audioPlayerComponent}</div>}

            {currentPassage && (
              <div>
                <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block mb-1">
                  Passage {currentPassage.passageNumber} / {passages?.length || 3}
                </span>
                <h2 className="text-xl font-black text-blue-950 mb-1">{currentPassage.title}</h2>
                {currentPassage.subtitle && (
                  <p className="text-xs text-slate-500 mb-4 italic font-medium">{currentPassage.subtitle}</p>
                )}

                <div className="space-y-4 text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                  {currentPassage.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="hover:bg-slate-50 p-1.5 rounded-lg transition select-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Question View & Answer Input */}
        <div className={`w-full ${passages || audioPlayerComponent ? 'lg:w-1/2' : 'max-w-3xl mx-auto'} flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm`}>
          <div>
            {/* Question Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-950 text-white font-black text-xs flex items-center justify-center">
                  {currentQ?.questionNumber || currentIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Savol {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-950">
                {currentQ?.skillOrDomain}
              </span>
            </div>

            {/* Prompt */}
            <div className="py-4">
              <p className="text-base text-slate-900 font-bold whitespace-pre-line leading-relaxed">
                {currentQ?.prompt}
              </p>
            </div>

            {/* Answer Options */}
            {currentQ?.choices && currentQ.choices.length > 0 ? (
              <div className="space-y-2.5 mt-2">
                {currentQ.choices.map((choice) => {
                  const isSelected = answers[currentQ.id] === choice.id || answers[currentQ.id] === choice.text;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleSelectAnswer(choice.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-950 text-blue-950 font-bold shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {choice.label}
                      </span>
                      <span className="text-sm leading-relaxed">{choice.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Aniq javobingizni quyidagi maydonga yozing:
                </label>
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Javobni kiriting..."
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            )}

            {/* Practice Mode feedback */}
            {!isMockExam && practiceChecked[currentQ.id] && (
              <div
                className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed ${
                  checkAnswer(answers[currentQ.id] || '', currentQ.correctAnswer)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {checkAnswer(answers[currentQ.id] || '', currentQ.correctAnswer) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>To'g'ri!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>
                        Noto'g'ri. To'g'ri javob:{' '}
                        {Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.join(' yoki ')
                          : currentQ.correctAnswer}
                      </span>
                    </>
                  )}
                </div>
                <p className="font-normal mt-1">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Bottom Nav Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Oldingi
            </button>

            {!isMockExam && !practiceChecked[currentQ.id] && (
              <button
                onClick={checkSinglePracticeAnswer}
                disabled={!answers[currentQ.id]}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 text-xs font-bold transition disabled:opacity-40"
              >
                Javobni Tekshirish
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-xs font-bold text-white transition shadow-sm"
              >
                Keyingi <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-sm"
              >
                Tekshirish va Topshirish <FileCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Grid Navigator Drawer */}
      <footer className="bg-white border-t border-slate-200 p-3 overflow-x-auto shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pr-2">
            Savollar:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isFlagged = Boolean(flagged[q.id]);
              const isCurrent = idx === currentIndex;

              let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
              if (isAnswered) btnClass = 'bg-blue-50 text-blue-950 border border-blue-300 font-bold';
              if (isFlagged) btnClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
              if (isCurrent) btnClass = 'bg-blue-950 text-white font-black shadow-xs ring-2 ring-blue-900';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition flex items-center justify-center relative ${btnClass}`}
                  title={`Savol ${idx + 1}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-blue-950 mb-2">Testni Topshirasizmi?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Siz <strong className="text-blue-950 font-bold">{questions.length}</strong> tadan{' '}
              <strong className="text-blue-950 font-bold">{Object.keys(answers).length}</strong> ta savolga javob berdingiz. 
              Topshirilgandan so'ng ball va tahlil hisoblanadi.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Davom etish
              </button>
              <button
                onClick={finishExam}
                className="px-5 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition shadow-md shadow-blue-950/20"
              >
                Ha, Topshirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Built-in Scientific Reference Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-950" />
                <h3 className="text-base font-bold text-blue-950">Digital SAT Asosiy Formulalari</h3>
              </div>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 font-bold"
              >
                Yopish
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-950 block mb-1">Aylana (Circle)</span>
                <p>Yuza: A = π r²</p>
                <p>Uzunlik: C = 2 π r</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-950 block mb-1">To'g'ri to'rtburchak & Uchburchak</span>
                <p>To'rtburchak: A = l w</p>
                <p>Uchburchak: A = 0.5 b h</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-950 block mb-1">Silindr & Konus</span>
                <p>Silindr: V = π r² h</p>
                <p>Konus: V = (1/3) π r² h</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-950 block mb-1">Pifagor & Maxsus Burchaklar</span>
                <p>c² = a² + b²</p>
                <p>30-60-90: x, x√3, 2x</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 50 000 UZS Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        reason="test_limit"
      />
    </div>
  );
}
