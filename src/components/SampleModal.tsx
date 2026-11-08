import React from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import { SAMPLE_TEXTS, SampleItem } from '../utils/sampleTexts';

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleItem) => void;
}

export const SampleModal: React.FC<SampleModalProps> = ({
  isOpen,
  onClose,
  onSelectSample
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-pink-50/70 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pink-950">Choose a Sample Text</h3>
              <p className="text-xs text-pink-700/80">
                Load ready-made text to test word counting, readability, and keyword density.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-3">
          {SAMPLE_TEXTS.map((sample) => (
            <div
              key={sample.id}
              className="p-4 rounded-2xl border border-pink-200/80 hover:border-pink-400 hover:bg-pink-50/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-pink-100 text-pink-800">
                    {sample.category}
                  </span>
                  <span className="text-sm font-bold text-pink-950 group-hover:text-pink-600 transition-colors">
                    {sample.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {sample.description}
                </p>
                <p className="text-xs text-pink-900/60 line-clamp-1 italic font-mono">
                  "{sample.text.substring(0, 90)}..."
                </p>
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-pink-50 text-pink-700 border border-pink-200 group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600 transition-all flex items-center gap-1 shrink-0 self-start sm:self-center"
              >
                <span>Load Text</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-pink-50/40 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-pink-900 hover:bg-pink-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
