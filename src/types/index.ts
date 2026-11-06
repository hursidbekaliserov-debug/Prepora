export type ExamType = 'IELTS' | 'SAT' | 'BOTH';

export type IELTSType = 'ACADEMIC' | 'GENERAL_TRAINING';

export type IELTSSkill = 'listening' | 'reading' | 'writing' | 'speaking';

export type SATSection = 'reading_writing' | 'math';

export type SATDomain = 
  // Reading & Writing
  | 'Information and Ideas'
  | 'Craft and Structure'
  | 'Expression of Ideas'
  | 'Standard English Conventions'
  // Math
  | 'Algebra'
  | 'Advanced Math'
  | 'Problem-Solving and Data Analysis'
  | 'Geometry and Trigonometry';

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'sentence_completion'
  | 'summary_completion'
  | 'short_answer'
  | 'grid_in'; // SAT Student-produced response

export interface QuestionChoice {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: string;
  exam: 'IELTS' | 'SAT';
  section: IELTSSkill | SATSection;
  moduleOrPart: number; // Part 1-4 for IELTS, Module 1-2 for SAT
  questionType: QuestionType;
  questionNumber: number;
  prompt: string;
  choices?: QuestionChoice[];
  correctAnswer: string | string[]; // Single string or array of accepted answers
  explanation: string;
  skillOrDomain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passageId?: string;
  passageText?: string;
  audioScript?: string;
  audioTime?: string;
  contextSnippet?: string;
}

export interface ReadingPassage {
  id: string;
  passageNumber: number;
  title: string;
  subtitle?: string;
  content: string[]; // paragraphs
  exam: 'IELTS' | 'SAT';
  testType?: IELTSType;
}

export interface WritingPrompt {
  id: string;
  taskType: 'Task 1' | 'Task 2';
  testType: IELTSType;
  title: string;
  prompt: string;
  dataVisualDescription?: string;
  minimumWords: number;
  sampleAnswer?: string;
}

export interface SpeakingPrompt {
  part: 1 | 2 | 3;
  topic: string;
  instructions: string;
  questions?: string[];
  cueCard?: {
    topic: string;
    bulletPoints: string[];
  };
}

export interface AvatarConfig {
  gender: 'boy' | 'girl';
  headwear: string;
  outfit: string;
  glasses: string;
  aura: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  targetExam: ExamType;
  ieltsType?: IELTSType;
  currentIeltsBand?: number;
  targetIeltsBand?: number;
  currentSatScore?: number;
  targetSatScore?: number;
  examDate?: string;
  dailyStudyMinutes: number;
  weakTopics: string[];
  streakDays: number;
  totalStudyMinutes: number;
  isDemoUser: boolean;
  avatarUrl?: string;
  avatar3D?: string;
  equippedItem?: string;
  unlockedAvatars?: string[];
  unlockedItems?: string[];
  xp?: number;
  totalEarnedXp?: number;
  spentXp?: number;
  avatarConfig?: AvatarConfig;
  unlockedWardrobe?: string[];
  premiumBadge?: string;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  exam: 'IELTS' | 'SAT';
  skill: string;
  estimatedMinutes: number;
  completed: boolean;
  dueDate: string;
  link: string;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  exam: 'IELTS' | 'SAT';
  skillOrDomain: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  recordedAt: string;
  reviewed: boolean;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  examTarget: 'IELTS' | 'SAT' | 'BOTH';
  masteryLevel: 'learning' | 'reviewing' | 'mastered';
  notes?: string;
}

export interface ExamSessionState {
  examId: string;
  examType: 'IELTS' | 'SAT';
  testVariant?: IELTSType;
  currentSectionIndex: number;
  currentModuleIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  flaggedQuestionIds: string[];
  timeRemainingSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface ExamResult {
  id: string;
  examType: 'IELTS' | 'SAT';
  testVariant?: IELTSType;
  date: string;
  durationMinutes: number;
  // IELTS Scores
  ieltsListeningRaw?: number;
  ieltsListeningBand?: number;
  ieltsReadingRaw?: number;
  ieltsReadingBand?: number;
  ieltsWritingEstimatedBand?: number;
  ieltsSpeakingEstimatedBand?: number;
  ieltsOverallEstimatedBand?: number;
  // SAT Scores
  satReadingWritingRaw?: number;
  satReadingWritingScoreEst?: number;
  satMathRaw?: number;
  satMathScoreEst?: number;
  satTotalScoreEst?: number;
  // Detailed feedback
  domainBreakdown: Record<string, { total: number; correct: number }>;
  userAnswers: Record<string, string>;
  isMockExam: boolean;
}

export interface WritingFeedback {
  taskAchievementScore: number;
  coherenceCohesionScore: number;
  lexicalResourceScore: number;
  grammarScore: number;
  overallBand: number;
  strengths: string[];
  weaknesses: string[];
  paragraphFeedback: string[];
  actionableImprovements: string[];
  correctedSampleExcerpt?: string;
}
