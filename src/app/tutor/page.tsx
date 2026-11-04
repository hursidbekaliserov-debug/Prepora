'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  BookOpen, 
  Calculator, 
  PenTool, 
  Mic, 
  HelpCircle,
  Clock,
  Crown
} from 'lucide-react';
import { StorageManager, SubscriptionStatus } from '@/lib/storage';
import PremiumModal from '@/components/PremiumModal';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isRealAi?: boolean;
  time: string;
}

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: `Salom! Men **Prepora AI** shaxsiy o'quv murabbiyingizman.

Men quyidagi yo'nalishlarda yordam bera olaman:
- **IELTS Writing**: Task 1 diagramma va Task 2 insho tuzilishi, Band 8+ jumlalar.
- **IELTS Speaking**: Part 2 cue-card javoblari va ravonlik bo'yicha tavsiyalar.
- **Digital SAT Reading & Writing**: Kontekstdagi so'zlar va grammatika qoidalari.
- **Digital SAT Math**: Matematika masalalarini qadamma-qadam yechish va formulalar.

Bugun qaysi mavzuni birgalikda o'rganamiz?`,
      time: 'Hozir',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<'IELTS' | 'SAT' | 'General'>('IELTS');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubStatus(StorageManager.getSubscriptionStatus());
    const updateSub = () => setSubStatus(StorageManager.getSubscriptionStatus());
    window.addEventListener('prepora_subscription_updated', updateSub);
    return () => window.removeEventListener('prepora_subscription_updated', updateSub);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'IELTS Task 2 inshoda Band 8+ olish uchun qanday struktura qo\'llash kerak?',
    'Digital SAT Math kvadrat tenglamalarining ildizlar yig\'indisi bo\'yicha tezkor usul.',
    'IELTS Reading True, False, Not Given savollarining farqi nima?',
    'SAT Words in Context bo\'yicha eng ko\'p uchraydigan 5 ta so\'z va misollar.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    // Check 5-chat daily quota
    const quota = StorageManager.useChatQuota();
    if (!quota.allowed) {
      setIsPremiumModalOpen(true);
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          examContext: selectedContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          isRealAi: data.isRealAi,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        StorageManager.recordStudyActivity(5);
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'AI Tutor bilan bog\'lanishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.',
          time: 'Hozir',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-4">
        {/* Tutor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-950 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-blue-950">Prepora AI Tutor</h1>
              <p className="text-xs text-slate-500 font-medium">IELTS & Digital SAT Aqlli Yordamchisi</p>
            </div>
          </div>

          {/* Context Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-2xl text-xs font-bold">
            {(['IELTS', 'SAT', 'General'] as const).map((ctx) => (
              <button
                key={ctx}
                onClick={() => setSelectedContext(ctx)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedContext === ctx
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>

          {/* Quota Indicator */}
          {subStatus?.isPremium ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-black flex items-center gap-1 shrink-0">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Bezlimit
            </span>
          ) : (
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
            >
              <span>Chat: {subStatus?.dailyChatRemaining ?? 5}/5</span>
              <span className="text-[10px] text-amber-600 font-extrabold underline">Premium (50k)</span>
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Savol berib ko'ring:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition text-xs font-semibold shadow-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Log Window */}
        <div className="flex-1 min-h-[420px] bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto space-y-4 shadow-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-950 text-white'
                    : 'bg-blue-50 text-blue-950 border border-blue-200'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-950 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-950 border border-blue-200 flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-950 animate-spin" />
                <span>AI Tutor tushuntirish yozmoqda...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${selectedContext} bo'yicha savolingizni yozing (masalan: grammatika, insho, tenglama)...`}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-blue-950 hover:bg-blue-900 disabled:opacity-40 text-white transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>

      {/* 50 000 UZS Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        reason="chat_limit"
      />
    </div>
  );
}
