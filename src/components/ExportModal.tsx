import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileText } from 'lucide-react';
import { TextStats } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  stats: TextStats;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  text,
  stats
}) => {
  const [reportCopied, setReportCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-counter-document-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    return `=== WORD COUNTER ANALYSIS REPORT ===
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

--- KEY METRICS ---
• Words: ${stats.words.toLocaleString()}
• Characters (with spaces): ${stats.characters.toLocaleString()}
• Characters (without spaces): ${stats.charactersNoSpaces.toLocaleString()}
• Sentences: ${stats.sentences.toLocaleString()}
• Paragraphs: ${stats.paragraphs.toLocaleString()}

--- READABILITY & FLOW ---
• Flesch Reading Ease: ${stats.fleschReadingEase} / 100 (${stats.readingLevel})
• Grade Level: ${stats.gradeLevel}
• Avg. Sentence Length: ${stats.averageSentenceLength} words
• Avg. Word Length: ${stats.averageWordLength} characters
• Unique Words: ${stats.uniqueWords} (${stats.lexicalDiversity}% diversity)
• Longest Word: "${stats.longestWord}"

Generated with Word Counter.
`;
  };

  const handleCopyReport = async () => {
    try {
      const report = generateReport();
      await navigator.clipboard.writeText(report);
      setReportCopied(true);
      setTimeout(() => setReportCopied(false), 2000);
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-pink-50/70 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pink-950">Export & Share</h3>
              <p className="text-xs text-pink-700/80">
                Download your document or copy a detailed verification report.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-900 hover:bg-pink-100/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Action 1: Download Text */}
          <div className="p-4 rounded-2xl border border-pink-200/80 bg-pink-50/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pink-600" />
                <span>Download as Plain Text (.txt)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Save your writing directly to your computer as a clean text file.
              </p>
            </div>
            <button
              onClick={handleDownloadTxt}
              disabled={!text}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-40 transition-colors whitespace-nowrap"
            >
              Download
            </button>
          </div>

          {/* Action 2: Copy Report */}
          <div className="p-4 rounded-2xl border border-pink-200/80 bg-pink-50/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-pink-600" />
                <span>Copy Word Count Verification Report</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Formats words, characters, readability grade, and structure metrics for submission.
              </p>
            </div>
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              {reportCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <span>Copy Report</span>
              )}
            </button>
          </div>

          {/* Action 3: Print */}
          <div className="p-4 rounded-2xl border border-pink-200/80 bg-pink-50/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-pink-600" />
                <span>Print Document</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Open browser print dialog formatted for standard letter pages.
              </p>
            </div>
            <button
              onClick={handlePrint}
              disabled={!text}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-pink-200 hover:bg-pink-100/70 text-pink-900 disabled:opacity-40 transition-colors whitespace-nowrap"
            >
              Print
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-pink-50/40 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-pink-900 hover:bg-pink-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
