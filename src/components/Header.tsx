import React from 'react';
import { PenTool, Target, FileText, Maximize2, Trash2, Copy, Check } from 'lucide-react';

interface HeaderProps {
  onOpenGoalModal: () => void;
  onOpenSampleModal: () => void;
  onToggleFocusMode: () => void;
  onClearText: () => void;
  onCopyText: () => void;
  hasText: boolean;
  copied: boolean;
  activeGoalText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGoalModal,
  onOpenSampleModal,
  onToggleFocusMode,
  onClearText,
  onCopyText,
  hasText,
  copied,
  activeGoalText
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xs shadow-pink-300/40">
            <PenTool className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-pink-950 whitespace-nowrap">
              Word Counter
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-pink-700/80">
              Live Text & Word Analytics
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Fast Jump Anchor Controls */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-pink-950/80">
          <a
            href="#editor"
            className="hover:text-pink-600 transition-colors whitespace-nowrap"
          >
            Editor
          </a>
          <a
            href="#stats"
            className="hover:text-pink-600 transition-colors whitespace-nowrap"
          >
            Counters
          </a>
          <a
            href="#analysis"
            className="hover:text-pink-600 transition-colors whitespace-nowrap"
          >
            Keyword Density
          </a>
          <a
            href="#readability"
            className="hover:text-pink-600 transition-colors whitespace-nowrap"
          >
            Readability
          </a>
          <a
            href="#limits"
            className="hover:text-pink-600 transition-colors whitespace-nowrap"
          >
            Platform Limits
          </a>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Sample Text Button */}
          <button
            onClick={onOpenSampleModal}
            className="px-3 py-1.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/90 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Load sample text"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Samples</span>
          </button>

          {/* Goal Tracker Button */}
          <button
            onClick={onOpenGoalModal}
            className="px-3 py-1.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/90 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Set target word or character count"
          >
            <Target className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">
              {activeGoalText ? activeGoalText : 'Target Goal'}
            </span>
            <span className="sm:hidden">Goal</span>
          </button>

          {/* Focus Mode Button */}
          <button
            onClick={onToggleFocusMode}
            className="p-1.5 text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/90 rounded-lg transition-colors whitespace-nowrap"
            title="Distraction-Free Focus Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Quick Copy */}
          <button
            onClick={onCopyText}
            disabled={!hasText}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              copied
                ? 'bg-emerald-600 text-white'
                : hasText
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-xs shadow-pink-200'
                : 'bg-pink-100 text-pink-300 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Text</span>
              </>
            )}
          </button>

          {/* Clear Button */}
          {hasText && (
            <button
              onClick={onClearText}
              className="p-1.5 text-pink-500 hover:text-rose-700 hover:bg-pink-100/80 rounded-lg transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
