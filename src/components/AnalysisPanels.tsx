import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Share2,
  ListFilter,
  Check,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { TextStats, WordFrequency } from '../types';
import { getKeywordDensity } from '../utils/textAnalysis';
import { PLATFORM_LIMITS } from '../utils/sampleTexts';

interface AnalysisPanelsProps {
  text: string;
  stats: TextStats;
}

export const AnalysisPanels: React.FC<AnalysisPanelsProps> = ({ text, stats }) => {
  const [activeTab, setActiveTab] = useState<'density' | 'readability' | 'platforms' | 'breakdown'>('density');
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);

  const keywords: WordFrequency[] = getKeywordDensity(text, excludeStopWords, 12);

  // Helper for Flesch score colors
  const getFleschColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <section id="analysis" className="w-full bg-white rounded-3xl border border-pink-200/90 shadow-xs overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-pink-50/50 border-b border-pink-100 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('density')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'density'
                ? 'bg-pink-600 text-white shadow-xs shadow-pink-300/40'
                : 'text-pink-900/80 hover:bg-pink-100/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Keyword Density</span>
          </button>

          <button
            id="readability"
            onClick={() => setActiveTab('readability')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'readability'
                ? 'bg-pink-600 text-white shadow-xs shadow-pink-300/40'
                : 'text-pink-900/80 hover:bg-pink-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Readability & Score</span>
          </button>

          <button
            id="limits"
            onClick={() => setActiveTab('platforms')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'platforms'
                ? 'bg-pink-600 text-white shadow-xs shadow-pink-300/40'
                : 'text-pink-900/80 hover:bg-pink-100/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Platform Limits</span>
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'breakdown'
                ? 'bg-pink-600 text-white shadow-xs shadow-pink-300/40'
                : 'text-pink-900/80 hover:bg-pink-100/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Character Details</span>
          </button>
        </div>

        {/* Tab-specific quick toggles */}
        {activeTab === 'density' && (
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={() => setExcludeStopWords(!excludeStopWords)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
                excludeStopWords
                  ? 'bg-pink-100 border-pink-300 text-pink-900 font-semibold'
                  : 'bg-white border-pink-200 text-slate-600 hover:bg-pink-50'
              }`}
              title="Toggle common English stop words filter (e.g. the, is, at, which)"
            >
              <ListFilter className="w-3.5 h-3.5 text-pink-600" />
              <span>Hide Stop Words</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6">
        {/* TAB 1: KEYWORD DENSITY */}
        {activeTab === 'density' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-pink-950">Most Frequent Keywords</h3>
                <p className="text-xs text-pink-800/70 mt-0.5">
                  Identifies the core themes and repeated terms in your writing.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-pink-900">
                  <span className="font-semibold text-pink-950 font-mono tabular-nums">
                    {stats.uniqueWords}
                  </span>{' '}
                  unique words
                </div>
                <div className="text-pink-900">
                  <span className="font-semibold text-pink-950 font-mono tabular-nums">
                    {stats.lexicalDiversity}%
                  </span>{' '}
                  lexical diversity
                </div>
              </div>
            </div>

            {keywords.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {keywords.map((kw, idx) => (
                  <div
                    key={kw.word}
                    className="p-3 rounded-xl bg-pink-50/50 border border-pink-200/80 hover:bg-pink-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 text-[10px] font-mono text-pink-400">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-pink-950 capitalize">{kw.word}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono tabular-nums text-pink-800">
                        <span className="font-bold">{kw.count}×</span>
                        <span className="text-[11px] text-pink-600/80">({kw.percentage}%)</span>
                      </div>
                    </div>
                    {/* Mini density bar */}
                    <div className="w-full bg-pink-200/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (kw.count / (keywords[0]?.count || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-pink-400">
                Type or paste a paragraph above to view keyword frequency analysis.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: READABILITY & SCORE */}
        {activeTab === 'readability' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-pink-950">Readability & Comprehension</h3>
                <p className="text-xs text-pink-800/70 mt-0.5">
                  Calculated using standard Flesch-Kincaid formula for reading ease and school grade levels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score Gauge Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/60 to-white border border-pink-200/90 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-pink-700/80 uppercase tracking-wider mb-2">
                    Flesch Reading Ease
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-pink-950">
                      {stats.fleschReadingEase}
                    </span>
                    <span className="text-xs text-pink-700/70">/ 100</span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${getFleschColor(
                        stats.fleschReadingEase
                      )}`}
                    >
                      {stats.readingLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-pink-100 text-xs text-slate-600">
                  Target: 60–70 for general public, 70–80 for marketing copy.
                </div>
              </div>

              {/* Grade Level Card */}
              <div className="p-5 rounded-2xl bg-white border border-pink-200/90 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-pink-700/80 uppercase tracking-wider mb-2">
                    Flesch-Kincaid Grade
                  </div>
                  <div className="text-2xl font-bold text-pink-950 mt-1">
                    {stats.gradeLevel}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Understood by an average reader with this educational background without difficulty.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-pink-100 text-xs text-pink-700/80">
                  Avg. sentence length: <span className="font-mono font-bold">{stats.averageSentenceLength}</span> words
                </div>
              </div>

              {/* Sentence & Word Flow Card */}
              <div className="p-5 rounded-2xl bg-white border border-pink-200/90 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-pink-700/80 uppercase tracking-wider mb-2">
                    Structural Flow
                  </div>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-pink-100">
                      <span className="text-slate-600">Average Word Length:</span>
                      <span className="font-mono font-bold text-pink-950">
                        {stats.averageWordLength} characters
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-pink-100">
                      <span className="text-slate-600">Average Sentence:</span>
                      <span className="font-mono font-bold text-pink-950">
                        {stats.averageSentenceLength} words
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600">Longest Word:</span>
                      <span
                        className="font-mono font-semibold text-pink-900 max-w-[120px] truncate"
                        title={stats.longestWord}
                      >
                        {stats.longestWord || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-pink-100 text-xs text-pink-700/80">
                  {stats.words > 0 ? `${stats.words} total words processed` : 'No text entered yet'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM LIMITS */}
        {activeTab === 'platforms' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-pink-950">Social Media & Publishing Limits</h3>
                <p className="text-xs text-pink-800/70 mt-0.5">
                  Live validation against standard length constraints for popular platforms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORM_LIMITS.map((platform) => {
                const count = stats.characters;
                const max = platform.max;
                const percentage = Math.min(100, Math.round((count / max) * 100));
                const isOver = count > max;
                const remaining = max - count;

                return (
                  <div
                    key={platform.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isOver
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-white border-pink-200/90 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-pink-950">{platform.name}</span>
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        {isOver ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            +{count - max} over
                          </span>
                        ) : (
                          <span className="text-pink-800">
                            {remaining} left
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 truncate">
                      {platform.description}
                    </div>

                    {/* Gauge Bar */}
                    <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver
                            ? 'bg-rose-600'
                            : percentage > 85
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-pink-700/70">
                      <span>{count} chars</span>
                      <span>{max} limit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CHARACTER BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-pink-950">Detailed Character Breakdown</h3>
                <p className="text-xs text-pink-800/70 mt-0.5">
                  Granular counts for letters, numbers, spaces, and punctuation symbols.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Letters */}
              <div className="p-4 rounded-2xl bg-white border border-pink-200/90 text-center">
                <div className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1">
                  Letters
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-pink-950">
                  {stats.letters.toLocaleString()}
                </div>
                <div className="text-[11px] text-pink-700/70 mt-1">
                  {stats.characters > 0
                    ? `${Math.round((stats.letters / stats.characters) * 100)}% of text`
                    : '0%'}
                </div>
              </div>

              {/* Digits */}
              <div className="p-4 rounded-2xl bg-white border border-pink-200/90 text-center">
                <div className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1">
                  Numbers / Digits
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-pink-950">
                  {stats.digits.toLocaleString()}
                </div>
                <div className="text-[11px] text-pink-700/70 mt-1">
                  {stats.characters > 0
                    ? `${Math.round((stats.digits / stats.characters) * 100)}% of text`
                    : '0%'}
                </div>
              </div>

              {/* Spaces */}
              <div className="p-4 rounded-2xl bg-white border border-pink-200/90 text-center">
                <div className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1">
                  Spaces & Tabs
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-pink-950">
                  {stats.spaces.toLocaleString()}
                </div>
                <div className="text-[11px] text-pink-700/70 mt-1">
                  {stats.characters > 0
                    ? `${Math.round((stats.spaces / stats.characters) * 100)}% of text`
                    : '0%'}
                </div>
              </div>

              {/* Punctuation */}
              <div className="p-4 rounded-2xl bg-white border border-pink-200/90 text-center">
                <div className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1">
                  Punctuation
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-pink-950">
                  {stats.punctuation.toLocaleString()}
                </div>
                <div className="text-[11px] text-pink-700/70 mt-1">
                  {stats.characters > 0
                    ? `${Math.round((stats.punctuation / stats.characters) * 100)}% of text`
                    : '0%'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
