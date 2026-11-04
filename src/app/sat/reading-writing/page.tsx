'use client';

import React, { useState, useEffect } from 'react';
import ExamEngine from '@/components/ExamEngine';
import { satReadingWritingQuestions, shuffleArray } from '@/data/satQuestions';
import { Question } from '@/types';

export default function SatReadingWritingPage() {
  const [questions, setQuestions] = useState<Question[]>(satReadingWritingQuestions);

  useEffect(() => {
    setQuestions(shuffleArray(satReadingWritingQuestions));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <ExamEngine
        title={`Digital SAT Reading & Writing Practice (${questions.length} Ta Savol - Yangilangan)`}
        exam="SAT"
        sectionName="reading_writing"
        questions={questions}
        timeLimitMinutes={64}
      />
    </div>
  );
}
