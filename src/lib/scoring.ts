import { IELTSType } from "@/types";

export function getIeltsListeningBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 32) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 26) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 18) return 5.5;
  if (rawScore >= 16) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 6) return 3.5;
  if (rawScore >= 4) return 3.0;
  return 2.5;
}

export function getIeltsReadingBand(rawScore: number, type: IELTSType = 'ACADEMIC'): number {
  if (type === 'ACADEMIC') {
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0;
    if (rawScore >= 33) return 7.5;
    if (rawScore >= 30) return 7.0;
    if (rawScore >= 27) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 19) return 5.5;
    if (rawScore >= 15) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    if (rawScore >= 7) return 3.5;
    if (rawScore >= 5) return 3.0;
    return 2.5;
  } else {
    // General Training Reading
    if (rawScore === 40) return 9.0;
    if (rawScore === 39) return 8.5;
    if (rawScore >= 37) return 8.0;
    if (rawScore >= 36) return 7.5;
    if (rawScore >= 34) return 7.0;
    if (rawScore >= 32) return 6.5;
    if (rawScore >= 30) return 6.0;
    if (rawScore >= 27) return 5.5;
    if (rawScore >= 23) return 5.0;
    if (rawScore >= 19) return 4.5;
    if (rawScore >= 15) return 4.0;
    return 3.5;
  }
}

export function calculateIeltsOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const decimal = avg - Math.floor(avg);
  if (decimal < 0.25) return Math.floor(avg);
  if (decimal < 0.75) return Math.floor(avg) + 0.5;
  return Math.ceil(avg);
}

// Digital SAT practice scale estimators (RW: 54 questions, Math: 44 questions)
export function estimateSatReadingWritingScore(rawCorrect: number): number {
  if (rawCorrect <= 0) return 200;
  if (rawCorrect >= 54) return 800;
  // Non-linear scaling matching typical SAT raw-to-scaled curve
  const percentage = rawCorrect / 54;
  const scaled = 200 + Math.round(percentage * 600 / 10) * 10;
  return Math.min(800, Math.max(200, scaled));
}

export function estimateSatMathScore(rawCorrect: number): number {
  if (rawCorrect <= 0) return 200;
  if (rawCorrect >= 44) return 800;
  const percentage = rawCorrect / 44;
  const scaled = 200 + Math.round(percentage * 600 / 10) * 10;
  return Math.min(800, Math.max(200, scaled));
}

export function normalizeAnswer(ans: string): string {
  return ans.trim().toLowerCase().replace(/[\s\-_]+/g, ' ');
}

export function checkAnswer(userAns: string, correctAns: string | string[]): boolean {
  if (!userAns) return false;
  const user = normalizeAnswer(userAns);
  if (Array.isArray(correctAns)) {
    return correctAns.some((c) => normalizeAnswer(c) === user);
  }
  return normalizeAnswer(correctAns) === user;
}
