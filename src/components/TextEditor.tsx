import React, { useRef, useState, useEffect } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  RotateCw,
  Clipboard,
  Trash2,
  Sparkles,
  CaseSensitive,
  AlignJustify,
  Maximize2
} from 'lucide-react';
import {
  convertCase,
  removeExtraSpaces,
  removeEmptyLines,
  cleanLineBreaks
} from '../utils/textAnalysis';

interface TextEditorProps {
  text: string;
  onChange: (newText: string) => void;
  onClear: () => void;
  onToggleFocusMode: () => void;
  isAutoSaved: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  onClear,
  onToggleFocusMode,
  isAutoSaved
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>([text]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Selection tracking
  const [selectionStats, setSelectionStats] = useState<{ words: number; chars: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Visual feedback states
  const [copied, setCopied] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showCleanMenu, setShowCleanMenu] = useState(false);
  const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg' | 'text-xl'>('text-base');
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  // Sync external text changes to history when it's replaced completely
  const pushToHistory = (newContent: string) => {
    if (newContent === history[historyIndex]) return;
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newContent);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    onChange(newContent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    pushToHistory(val);
    updateSelectionAndCursor();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  const updateSelectionAndCursor = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    // Calculate line and col
    const textBefore = el.value.substring(0, start);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });

    if (start !== end) {
      const selectedStr = el.value.substring(start, end);
      const words = (selectedStr.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length;
      setSelectionStats({ words, chars: selectedStr.length });
    } else {
      setSelectionStats(null);
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        const el = textareaRef.current;
        if (el) {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          const updated = text.substring(0, start) + clipText + text.substring(end);
          pushToHistory(updated);
        } else {
          pushToHistory(text + clipText);
        }
      }
    } catch {
      setPasteNotice('Press Ctrl+V / Cmd+V to paste');
      setTimeout(() => setPasteNotice(null), 3000);
    }
  };

  const handleTransformCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel') => {
    const el = textareaRef.current;
    if (el && el.selectionStart !== el.selectionEnd) {
      // Transform only selected
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = text.substring(start, end);
      const converted = convertCase(selected, type);
      const updated = text.substring(0, start) + converted + text.substring(end);
      pushToHistory(updated);
    } else {
      // Transform full text
      const converted = convertCase(text, type);
      pushToHistory(converted);
    }
    setShowCaseMenu(false);
  };

  const handleCleanAction = (action: 'spaces' | 'empty-lines' | 'line-breaks') => {
    let cleaned = text;
    if (action === 'spaces') cleaned = removeExtraSpaces(text);
    if (action === 'empty-lines') cleaned = removeEmptyLines(text);
    if (action === 'line-breaks') cleaned = cleanLineBreaks(text);
    pushToHistory(cleaned);
    setShowCleanMenu(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const closeMenus = () => {
      setShowCaseMenu(false);
      setShowCleanMenu(false);
    };
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  return (
    <section id="editor" className="w-full">
      <div className="bg-white rounded-3xl border border-pink-200/90 shadow-xs hover:border-pink-300 transition-all flex flex-col overflow-hidden">
        {/* Editor Action Toolbar */}
        <div className="bg-pink-50/70 border-b border-pink-200/80 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left: Editing & Formatting Tools */}
          <div className="flex items-center flex-wrap gap-1">
            {/* Undo / Redo */}
            <div className="flex items-center rounded-lg border border-pink-200 bg-white overflow-hidden mr-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 text-pink-700 hover:text-pink-950 hover:bg-pink-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3.5 bg-pink-200" />
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 text-pink-700 hover:text-pink-950 hover:bg-pink-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Case Conversion Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCaseMenu(!showCaseMenu);
                  setShowCleanMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-900 hover:bg-pink-100/70 font-medium flex items-center gap-1.5 transition-colors"
              >
                <CaseSensitive className="w-3.5 h-3.5 text-pink-600" />
                <span>Text Case</span>
              </button>

              {showCaseMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-pink-200 py-1.5 z-30"
                >
                  <button
                    onClick={() => handleTransformCase('sentence')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    Sentence case
                  </button>
                  <button
                    onClick={() => handleTransformCase('title')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    Title Case
                  </button>
                  <button
                    onClick={() => handleTransformCase('upper')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    UPPERCASE
                  </button>
                  <button
                    onClick={() => handleTransformCase('lower')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    lowercase
                  </button>
                  <button
                    onClick={() => handleTransformCase('camel')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    camelCase
                  </button>
                </div>
              )}
            </div>

            {/* Text Cleanup Tools */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCleanMenu(!showCleanMenu);
                  setShowCaseMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-900 hover:bg-pink-100/70 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>Clean Up</span>
              </button>

              {showCleanMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-pink-200 py-1.5 z-30"
                >
                  <button
                    onClick={() => handleCleanAction('spaces')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    Trim extra spaces
                  </button>
                  <button
                    onClick={() => handleCleanAction('empty-lines')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    Remove blank lines
                  </button>
                  <button
                    onClick={() => handleCleanAction('line-breaks')}
                    className="w-full text-left px-3 py-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-900 transition-colors"
                  >
                    Standardize paragraphs
                  </button>
                </div>
              )}
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center rounded-lg border border-pink-200 bg-white overflow-hidden text-[11px] font-semibold text-pink-800">
              <button
                type="button"
                onClick={() => setFontSize('text-sm')}
                className={`px-2 py-1 transition-colors ${
                  fontSize === 'text-sm' ? 'bg-pink-600 text-white' : 'hover:bg-pink-50'
                }`}
                title="Small text size"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => setFontSize('text-base')}
                className={`px-2 py-1 transition-colors ${
                  fontSize === 'text-base' ? 'bg-pink-600 text-white' : 'hover:bg-pink-50'
                }`}
                title="Normal text size"
              >
                M
              </button>
              <button
                type="button"
                onClick={() => setFontSize('text-lg')}
                className={`px-2 py-1 transition-colors ${
                  fontSize === 'text-lg' ? 'bg-pink-600 text-white' : 'hover:bg-pink-50'
                }`}
                title="Large text size"
              >
                L
              </button>
              <button
                type="button"
                onClick={() => setFontSize('text-xl')}
                className={`px-2 py-1 transition-colors ${
                  fontSize === 'text-xl' ? 'bg-pink-600 text-white' : 'hover:bg-pink-50'
                }`}
                title="Extra large text size"
              >
                XL
              </button>
            </div>
          </div>

          {/* Right: Quick Clipboard, Paste, Fullscreen Actions */}
          <div className="flex items-center gap-1.5">
            {pasteNotice && (
              <span className="text-[11px] text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                {pasteNotice}
              </span>
            )}
            <button
              type="button"
              onClick={handlePaste}
              className="px-2.5 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-900 hover:bg-pink-100/70 font-medium flex items-center gap-1.5 transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-pink-600" />
              <span>Paste</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="px-2.5 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-900 hover:bg-pink-100/70 disabled:opacity-40 font-medium flex items-center gap-1.5 transition-colors"
              title="Copy all text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-pink-600" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClear}
              disabled={!text}
              className="p-1.5 rounded-lg border border-pink-200 bg-white text-pink-600 hover:text-rose-700 hover:bg-pink-100/70 disabled:opacity-30 transition-colors"
              title="Clear all text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onToggleFocusMode}
              className="p-1.5 rounded-lg border border-pink-200 bg-white text-pink-700 hover:bg-pink-100/70 transition-colors"
              title="Open distraction-free focus mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onSelect={updateSelectionAndCursor}
            onKeyUp={updateSelectionAndCursor}
            onClick={updateSelectionAndCursor}
            placeholder="Type or paste your text here to count words, characters, sentences, paragraphs, and readability instantly..."
            rows={12}
            className={`w-full p-4 sm:p-6 bg-transparent text-slate-800 placeholder:text-pink-300 focus:outline-none resize-y min-h-[280px] leading-relaxed transition-all ${fontSize}`}
            spellCheck={true}
          />

          {/* Empty Prompt Hint */}
          {!text && (
            <div className="pointer-events-none absolute bottom-4 right-4 text-xs text-pink-400/80 hidden sm:flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time statistics update as you type</span>
            </div>
          )}
        </div>

        {/* Status Bar (Line/Col, Selection, Auto-save) */}
        <div className="bg-pink-50/50 border-t border-pink-100 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-pink-800/80">
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-pink-700">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              <span>{isAutoSaved ? 'Saved in browser' : 'Auto-saving...'}</span>
            </div>

            {/* Selection stats if active */}
            {selectionStats && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-pink-900 bg-pink-100/90 px-2 py-0.5 rounded-md border border-pink-200">
                <AlignJustify className="w-3 h-3 text-pink-600" />
                <span>
                  Selected: {selectionStats.words} {selectionStats.words === 1 ? 'word' : 'words'} ·{' '}
                  {selectionStats.chars} chars
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-pink-700/70">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
