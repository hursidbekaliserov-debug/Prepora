'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  Sparkles, 
  Award, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { StudyTask, UserProfile } from '@/types';

export default function StudyPlanPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskExam, setNewTaskExam] = useState<'IELTS' | 'SAT'>('IELTS');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setTasks(StorageManager.getTasks());
  }, []);

  const handleToggle = (id: string) => {
    const updated = StorageManager.toggleTask(id);
    setTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-custom-${Date.now()}`,
      title: newTaskTitle,
      exam: newTaskExam,
      skill: newTaskExam === 'IELTS' ? 'Speaking & Writing' : 'Math & Reading',
      estimatedMinutes: 30,
      completed: false,
      dueDate: 'This Week',
      link: newTaskExam === 'IELTS' ? '/ielts' : '/sat',
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    StorageManager.saveTasks(updated);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Days left until exam
  const examDateStr = profile?.examDate || '2026-12-15';
  const daysLeft = Math.max(
    1,
    Math.round((new Date(examDateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-800" /> Adaptive Schedule Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Personalized Study Planner</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Curated daily drills balancing your target exam date ({examDateStr}) and self-reported weak domains.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Custom Task
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">
              Countdown to Test Day
            </span>
            <span className="text-3xl font-black text-blue-950">{daysLeft} Days</span>
            <span className="text-[11px] text-blue-700 block mt-1 font-medium">Exam: {examDateStr}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">
              Daily Study Target
            </span>
            <span className="text-3xl font-black text-blue-950">{profile?.dailyStudyMinutes || 45} mins</span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Recorded today: {profile?.totalStudyMinutes || 340} mins total
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">
              Weekly Task Completion
            </span>
            <span className="text-3xl font-black text-emerald-600">{progressPercent}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {completedCount} of {tasks.length} objectives reached
            </span>
          </div>
        </div>

        {/* Weekly Schedule Overview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-800" /> Current Weekly Syllabus & Tasks
          </h3>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-blue-900/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-blue-950 bg-white'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-blue-950'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-950 font-bold border border-blue-100">
                        {task.exam}
                      </span>
                      <span>•</span>
                      <span>{task.skill}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 font-medium">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={task.link}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold shrink-0 transition"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-blue-950 mb-4">Add Study Objective</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Review 20 SAT Math Quadratics"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam</label>
                  <select
                    value={newTaskExam}
                    onChange={(e) => setNewTaskExam(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-950"
                  >
                    <option value="IELTS">IELTS</option>
                    <option value="SAT">Digital SAT</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-blue-950"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md"
                  >
                    Save Objective
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
