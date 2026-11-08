import React, { useEffect, useRef } from 'react';
import { Minimize2, Copy, Check } from 'lucide-react';
import { TextStats } from '../types';

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onChange: (text: string) => void;
  stats: TextStats;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  isOpen,
  onClose,
  text,
  onChange,
  stats
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fff5f8] flex flex-col animate-in fade-in duration-200">
      {/* Top Floating Bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-pink-200/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-xs font-bold text-pink-950 uppercase tracking-wider">
            Focus Mode
          </span>
          <span className="text-xs text-pink-700/60 hidden sm:inline">
            (Press Esc to return)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-pink-800 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Exit Focus Mode (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Focus</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Writing Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Begin writing in pure silence and focus..."
          className="w-full flex-1 bg-transparent text-slate-800 placeholder:text-pink-300/80 focus:outline-none resize-none text-lg sm:text-xl leading-relaxed"
          spellCheck={true}
        />
      </div>

      {/* Bottom Floating Stats Pill */}
      <div className="px-6 py-3 border-t border-pink-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between text-xs text-pink-900">
        <div className="flex items-center gap-4 font-mono tabular-nums">
          <div>
            <span className="font-bold text-pink-950 text-sm">{stats.words}</span> words
          </div>
          <div>
            <span className="font-bold text-pink-950 text-sm">{stats.characters}</span> characters
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-pink-950 text-sm">{stats.sentences}</span> sentences
          </div>
        </div>
        <div className="text-pink-700/80 font-medium text-[11px]">
          {stats.paragraphs} paragraphs · {stats.charactersNoSpaces} chars without spaces
        </div>
      </div>
    </div>
  );
};
