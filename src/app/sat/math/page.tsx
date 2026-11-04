'use client';

import React, { useState, useEffect } from 'react';
import ExamEngine from '@/components/ExamEngine';
import { satMathQuestions, shuffleArray } from '@/data/satQuestions';
import { Question } from '@/types';

export default function SatMathPage() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(satMathQuestions);

  useEffect(() => {
    // Har safar kirilganda savollarni aralashtirib berish
    setShuffledQuestions(shuffleArray(satMathQuestions));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <ExamEngine
        title={`Digital SAT Math Practice (${shuffledQuestions.length} Ta Savol - Yangilangan)`}
        exam="SAT"
        sectionName="math"
        questions={shuffledQuestions}
        timeLimitMinutes={70}
      />
    </div>
  );
}
