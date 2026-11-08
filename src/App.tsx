/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { QuickStatsGrid } from './components/QuickStatsGrid';
import { TargetGoalTracker } from './components/TargetGoalTracker';
import { TextEditor } from './components/TextEditor';
import { AnalysisPanels } from './components/AnalysisPanels';
import { Footer } from './components/Footer';
import { SampleModal } from './components/SampleModal';
import { GoalModal } from './components/GoalModal';
import { ExportModal } from './components/ExportModal';
import { FocusModeModal } from './components/FocusModeModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { analyzeText } from './utils/textAnalysis';
import { SAMPLE_TEXTS, SampleItem } from './utils/sampleTexts';
import { TargetGoal } from './types';
import { Download, Sparkles } from 'lucide-react';

const STORAGE_KEY_TEXT = 'word_counter_content_v1';
const STORAGE_KEY_GOAL = 'word_counter_goal_v1';

export default function App() {
  // Initialize text with saved draft, or default to a rich starter sample so the app comes alive immediately
  const [text, setText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEXT);
      if (saved !== null) return saved;
    } catch {}
    // Default starter text demonstrating word counting, readability & social limits
    return SAMPLE_TEXTS[0].text;
  });

  // Target Goal state
  const [goal, setGoal] = useState<TargetGoal | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { type: 'words', target: 500, label: '500 words (Standard Essay)' };
  });

  // Modal visibility states
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Status feedback
  const [copied, setCopied] = useState(false);
  const [isAutoSaved, setIsAutoSaved] = useState(true);

  // Compute stats in real-time
  const stats = useMemo(() => {
    return analyzeText(text);
  }, [text]);

  // Persist text to local storage with debounce
  useEffect(() => {
    setIsAutoSaved(false);
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_TEXT, text);
        setIsAutoSaved(true);
      } catch {}
    }, 400);

    return () => clearTimeout(timeout);
  }, [text]);

  // Persist goal
  const handleSaveGoal = (newGoal: TargetGoal | null) => {
    setGoal(newGoal);
    try {
      if (newGoal) {
        localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(newGoal));
      } else {
        localStorage.removeItem(STORAGE_KEY_GOAL);
      }
    } catch {}
  };

  // Handlers
  const handleClearRequest = () => {
    if (stats.words > 25) {
      setIsClearConfirmOpen(true);
    } else {
      setText('');
    }
  };

  const handleConfirmClear = () => {
    setText('');
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectSample = (sample: SampleItem) => {
    setText(sample.text);
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] text-slate-800 flex flex-col selection:bg-pink-200 selection:text-pink-900">
      {/* Top Header matching top bar contract */}
      <Header
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onToggleFocusMode={() => setIsFocusModeOpen(true)}
        onClearText={handleClearRequest}
        onCopyText={handleCopyText}
        hasText={text.trim().length > 0}
        copied={copied}
        activeGoalText={goal ? `${goal.target.toLocaleString()} ${goal.type}` : undefined}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
        {/* Hero Section Banner: clean, unboxed pink aesthetics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-700 mb-1">
              <span>Fast & Intuitive</span>
              <span aria-hidden="true">·</span>
              <span>Real-Time Analytics</span>
              <span aria-hidden="true">·</span>
              <span>100% Private in Browser</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-pink-950 tracking-tight text-balance">
              Instant Word & Character Counter
            </h1>
            <p className="text-sm text-pink-900/70 mt-1 max-w-2xl text-balance">
              Count words, characters, sentences, and paragraphs in real time. Check readability levels, keyword density, and platform publishing limits instantly.
            </p>
          </div>

          {/* Quick Action Pills / Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-pink-800 bg-white hover:bg-pink-50 border border-pink-200/90 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-pink-600" />
              <span>Export & Share</span>
            </button>
            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-xl transition-all shadow-xs shadow-pink-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Samples</span>
            </button>
          </div>
        </div>

        {/* 1. Quick Stats Counters Grid */}
        <QuickStatsGrid stats={stats} />

        {/* 2. Target Goal Progress Tracker */}
        <TargetGoalTracker
          goal={goal}
          onSetGoal={handleSaveGoal}
          stats={stats}
        />

        {/* 3. The Core Text Editor Area */}
        <TextEditor
          text={text}
          onChange={setText}
          onClear={handleClearRequest}
          onToggleFocusMode={() => setIsFocusModeOpen(true)}
          isAutoSaved={isAutoSaved}
        />

        {/* 4. Analysis & Deep Insights Tabs */}
        <AnalysisPanels text={text} stats={stats} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={goal}
        onSaveGoal={handleSaveGoal}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        text={text}
        stats={stats}
      />

      <FocusModeModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        text={text}
        onChange={setText}
        stats={stats}
      />

      <ClearConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        wordCount={stats.words}
      />
    </div>
  );
}
