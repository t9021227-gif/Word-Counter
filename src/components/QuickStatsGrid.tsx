import React from 'react';
import { Type, AlignLeft, FileSpreadsheet, Hash } from 'lucide-react';
import { TextStats } from '../types';

interface QuickStatsGridProps {
  stats: TextStats;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ stats }) => {
  return (
    <section id="stats" className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Words Card (Dominant Hero Metric) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-pink-50/70 rounded-2xl p-4 sm:p-5 border border-pink-200/90 shadow-xs hover:border-pink-300 transition-all group">
          <div className="flex items-center justify-between text-pink-600 mb-2">
            <span className="text-xs font-bold tracking-wider text-pink-700/80 uppercase">
              Words
            </span>
            <Type className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-pink-950">
            {stats.words.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-pink-700/70 font-medium">
            {stats.uniqueWords} unique words
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-pink-300/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Characters Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-pink-200/90 shadow-xs hover:border-pink-300 transition-all group">
          <div className="flex items-center justify-between text-pink-600 mb-2">
            <span className="text-xs font-bold tracking-wider text-pink-700/80 uppercase">
              Characters
            </span>
            <Hash className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-pink-950">
            {stats.characters.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-pink-700/70 font-medium truncate" title={`${stats.charactersNoSpaces} without spaces`}>
            {stats.charactersNoSpaces.toLocaleString()} no spaces
          </div>
        </div>

        {/* Sentences Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-pink-200/90 shadow-xs hover:border-pink-300 transition-all group">
          <div className="flex items-center justify-between text-pink-600 mb-2">
            <span className="text-xs font-bold tracking-wider text-pink-700/80 uppercase">
              Sentences
            </span>
            <AlignLeft className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-pink-950">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-pink-700/70 font-medium">
            ~{stats.averageSentenceLength} words/sent.
          </div>
        </div>

        {/* Paragraphs Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-pink-200/90 shadow-xs hover:border-pink-300 transition-all group">
          <div className="flex items-center justify-between text-pink-600 mb-2">
            <span className="text-xs font-bold tracking-wider text-pink-700/80 uppercase">
              Paragraphs
            </span>
            <FileSpreadsheet className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-pink-950">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-pink-700/70 font-medium">
            {stats.paragraphs > 0
              ? `~${Math.round(stats.words / (stats.paragraphs || 1))} words/para`
              : '0 words/para'}
          </div>
        </div>
      </div>
    </section>
  );
};
