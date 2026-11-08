import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';
import { TargetGoal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: TargetGoal | null;
  onSaveGoal: (goal: TargetGoal | null) => void;
}

const PRESET_OPTIONS: TargetGoal[] = [
  { type: 'characters', target: 280, label: 'Twitter / X Post (280 chars)' },
  { type: 'characters', target: 160, label: 'Google Meta Description (160 chars)' },
  { type: 'words', target: 250, label: 'Short Summary (250 words)' },
  { type: 'words', target: 500, label: 'Standard Essay (500 words)' },
  { type: 'words', target: 1000, label: 'Blog Article (1,000 words)' },
  { type: 'words', target: 1500, label: 'In-Depth Feature (1,500 words)' },
  { type: 'words', target: 2500, label: 'Academic Paper / Thesis (2,500 words)' }
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveGoal
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TargetGoal | null>(currentGoal);
  const [customType, setCustomType] = useState<'words' | 'characters'>(currentGoal?.type || 'words');
  const [customValue, setCustomValue] = useState<number>(currentGoal?.target || 500);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: TargetGoal) => {
    setSelectedPreset(preset);
    onSaveGoal(preset);
    onClose();
  };

  const handleApplyCustom = () => {
    if (customValue > 0) {
      const goal: TargetGoal = {
        type: customType,
        target: customValue,
        label: `${customValue.toLocaleString()} ${customType}`
      };
      onSaveGoal(goal);
      onClose();
    }
  };

  const handleClearGoal = () => {
    onSaveGoal(null);
    onClose();
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
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pink-950">Set Target Goal</h3>
              <p className="text-xs text-pink-700/80">
                Track real-time progress against your word or character target.
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Presets */}
          <div>
            <div className="text-xs font-bold text-pink-950 uppercase tracking-wider mb-2">
              Popular Presets
            </div>
            <div className="space-y-1.5">
              {PRESET_OPTIONS.map((preset) => {
                const isActive =
                  selectedPreset?.target === preset.target && selectedPreset?.type === preset.type;
                return (
                  <button
                    key={preset.label}
                    onClick={() => handleApplyPreset(preset)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-pink-600 text-white border-pink-600 font-semibold shadow-xs'
                        : 'bg-pink-50/40 hover:bg-pink-100/60 text-slate-800 border-pink-200/80'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom */}
          <div className="pt-3 border-t border-pink-100">
            <div className="text-xs font-bold text-pink-950 uppercase tracking-wider mb-2">
              Custom Target
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1000000"
                value={customValue}
                onChange={(e) => setCustomValue(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-36 px-3 py-2 text-sm bg-white border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono text-pink-950"
              />
              <div className="flex rounded-xl border border-pink-200 overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setCustomType('words')}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    customType === 'words'
                      ? 'bg-pink-600 text-white font-semibold'
                      : 'text-pink-850 hover:bg-pink-50'
                  }`}
                >
                  Words
                </button>
                <button
                  type="button"
                  onClick={() => setCustomType('characters')}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    customType === 'characters'
                      ? 'bg-pink-600 text-white font-semibold'
                      : 'text-pink-850 hover:bg-pink-50'
                  }`}
                >
                  Characters
                </button>
              </div>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-pink-50/40 border-t border-pink-100 flex items-center justify-between">
          {currentGoal ? (
            <button
              onClick={handleClearGoal}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium"
            >
              Remove Active Goal
            </button>
          ) : (
            <div />
          )}
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
