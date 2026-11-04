'use client';

import React from 'react';
import ExamEngine from '@/components/ExamEngine';
import { ieltsReadingPassages, ieltsReadingQuestions } from '@/data/ieltsQuestions';

export default function IeltsReadingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <ExamEngine
        title="IELTS Academic Reading Test (40 Questions)"
        exam="IELTS"
        sectionName="reading"
        questions={ieltsReadingQuestions}
        passages={ieltsReadingPassages}
        timeLimitMinutes={60}
      />
    </div>
  );
}
