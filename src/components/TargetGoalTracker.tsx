import React, { useState } from 'react';
import { Target, CheckCircle2, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { TargetGoal, TextStats } from '../types';

interface TargetGoalTrackerProps {
  goal: TargetGoal | null;
  onSetGoal: (goal: TargetGoal | null) => void;
  stats: TextStats;
}

const PRESET_GOALS: TargetGoal[] = [
  { type: 'characters', target: 280, label: 'Tweet (280 chars)' },
  { type: 'words', target: 250, label: '250 words (Quick memo)' },
  { type: 'words', target: 500, label: '500 words (Short essay)' },
  { type: 'words', target: 1000, label: '1,000 words (Full article)' },
  { type: 'words', target: 2000, label: '2,000 words (Longform)' }
];

export const TargetGoalTracker: React.FC<TargetGoalTrackerProps> = ({
  goal,
  onSetGoal,
  stats
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customType, setCustomType] = useState<'words' | 'characters'>('words');
  const [customTarget, setCustomTarget] = useState<number>(500);

  if (!goal && !isEditing) {
    return (
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-pink-100/60 rounded-xl border border-pink-200/90 text-xs text-pink-900">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-pink-600 shrink-0" />
          <span>
            Working towards a word count deadline or post limit? Set a target goal to track live progress.
          </span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          Set Goal
        </button>
      </div>
    );
  }

  // Calculate progress
  const currentCount = goal ? (goal.type === 'words' ? stats.words : stats.characters) : 0;
  const targetCount = goal ? goal.target : 1;
  const percentage = Math.min(100, Math.round((currentCount / targetCount) * 100));
  const isComplete = currentCount >= targetCount;
  const remaining = Math.max(0, targetCount - currentCount);

  const handleApplyCustom = () => {
    if (customTarget > 0) {
      onSetGoal({
        type: customType,
        target: customTarget,
        label: `${customTarget.toLocaleString()} ${customType}`
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-pink-200/90 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-pink-100 text-pink-600'}`}>
            {isComplete ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Target className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-pink-950">
                {goal ? goal.label : 'Set Target Goal'}
              </span>
              {isComplete && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> Goal Reached!
                </span>
              )}
            </div>
            {goal && (
              <div className="text-xs text-pink-700/80">
                {currentCount.toLocaleString()} / {targetCount.toLocaleString()} {goal.type}
                <span className="mx-1.5">·</span>
                {isComplete ? (
                  <span className="text-emerald-600 font-semibold">
                    +{currentCount - targetCount} extra {goal.type}
                  </span>
                ) : (
                  <span>{remaining.toLocaleString()} {goal.type} left</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-pink-600 hover:text-pink-800 px-2 py-1 rounded-md hover:bg-pink-50 transition-colors flex items-center gap-1"
          >
            {isEditing ? (
              <>Close <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Change <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
          {goal && (
            <button
              onClick={() => {
                onSetGoal(null);
                setIsEditing(false);
              }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-pink-50 transition-colors"
              title="Remove goal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {goal && (
        <div className="mt-2.5">
          <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isComplete
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-pink-700/70 mt-1">
            <span>0</span>
            <span className="font-bold text-pink-900">{percentage}%</span>
            <span>{targetCount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Preset and Custom Controls Drawer */}
      {isEditing && (
        <div className="mt-4 pt-3 border-t border-pink-100 space-y-3">
          <div className="text-xs font-semibold text-pink-900">Choose a standard preset:</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_GOALS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  onSetGoal(preset);
                  setIsEditing(false);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                  goal?.label === preset.label
                    ? 'bg-pink-600 text-white border-pink-600 font-semibold'
                    : 'bg-pink-50/80 text-pink-800 border-pink-200 hover:bg-pink-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-pink-900 pt-1">Or define a custom goal:</div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="1"
              max="1000000"
              value={customTarget}
              onChange={(e) => setCustomTarget(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-32 px-3 py-1.5 text-xs bg-white border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono text-pink-950"
              placeholder="e.g. 750"
            />
            <div className="flex rounded-lg border border-pink-200 overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setCustomType('words')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  customType === 'words'
                    ? 'bg-pink-600 text-white font-semibold'
                    : 'text-pink-800 hover:bg-pink-50'
                }`}
              >
                Words
              </button>
              <button
                type="button"
                onClick={() => setCustomType('characters')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  customType === 'characters'
                    ? 'bg-pink-600 text-white font-semibold'
                    : 'text-pink-800 hover:bg-pink-50'
                }`}
              >
                Characters
              </button>
            </div>
            <button
              onClick={handleApplyCustom}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
            >
              Apply Custom Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
