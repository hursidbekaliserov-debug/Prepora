-- ==========================================================
-- ALLPREP AI — COMPLETE POSTGRESQL DATABASE SCHEMA (SUPABASE)
-- ==========================================================

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  target_exam TEXT NOT NULL DEFAULT 'BOTH' CHECK (target_exam IN ('IELTS', 'SAT', 'BOTH')),
  ielts_type TEXT DEFAULT 'ACADEMIC' CHECK (ielts_type IN ('ACADEMIC', 'GENERAL_TRAINING')),
  current_ielts_band NUMERIC(2, 1) DEFAULT 6.5,
  target_ielts_band NUMERIC(2, 1) DEFAULT 8.0,
  current_sat_score INTEGER DEFAULT 1280,
  target_sat_score INTEGER DEFAULT 1520,
  exam_date DATE DEFAULT '2026-12-15',
  daily_study_minutes INTEGER DEFAULT 45,
  weak_topics TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 0,
  total_study_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

-- 2. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam TEXT NOT NULL CHECK (exam IN ('IELTS', 'SAT')),
  skill TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 20,
  completed BOOLEAN DEFAULT FALSE,
  due_date TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own study tasks"
  ON public.study_tasks
  FOR ALL
  USING (auth.uid() = user_id);

-- 3. EXAM RESULTS & ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('IELTS', 'SAT')),
  test_variant TEXT,
  date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL,
  ielts_listening_raw INTEGER,
  ielts_listening_band NUMERIC(2, 1),
  ielts_reading_raw INTEGER,
  ielts_reading_band NUMERIC(2, 1),
  ielts_writing_est NUMERIC(2, 1),
  ielts_speaking_est NUMERIC(2, 1),
  ielts_overall_est NUMERIC(2, 1),
  sat_rw_raw INTEGER,
  sat_rw_est INTEGER,
  sat_math_raw INTEGER,
  sat_math_est INTEGER,
  sat_total_est INTEGER,
  is_mock BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and save their own exam results"
  ON public.exam_results
  FOR ALL
  USING (auth.uid() = user_id);

-- 4. SAVED MISTAKES NOTEBOOK TABLE
CREATE TABLE IF NOT EXISTS public.saved_mistakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  exam TEXT NOT NULL CHECK (exam IN ('IELTS', 'SAT')),
  skill_or_domain TEXT NOT NULL,
  prompt TEXT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_mistakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mistakes notebook"
  ON public.saved_mistakes
  FOR ALL
  USING (auth.uid() = user_id);

-- 5. VOCABULARY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  definition TEXT NOT NULL,
  example_sentence TEXT,
  synonyms TEXT[] DEFAULT '{}',
  exam_target TEXT DEFAULT 'BOTH' CHECK (exam_target IN ('IELTS', 'SAT', 'BOTH')),
  mastery_level TEXT DEFAULT 'learning' CHECK (mastery_level IN ('learning', 'reviewing', 'mastered')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their personal vocabulary"
  ON public.vocabulary_items
  FOR ALL
  USING (auth.uid() = user_id);

-- 6. WRITING SUBMISSIONS & AI FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.writing_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  task_type TEXT NOT NULL,
  essay TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  overall_band NUMERIC(2, 1),
  task_achievement_score NUMERIC(2, 1),
  coherence_cohesion_score NUMERIC(2, 1),
  lexical_resource_score NUMERIC(2, 1),
  grammar_score NUMERIC(2, 1),
  feedback_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and save their own writing submissions"
  ON public.writing_submissions
  FOR ALL
  USING (auth.uid() = user_id);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON public.exam_results(user_id, exam_type);
CREATE INDEX IF NOT EXISTS idx_saved_mistakes_user ON public.saved_mistakes(user_id, exam);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user ON public.study_tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_vocab_user ON public.vocabulary_items(user_id, mastery_level);
