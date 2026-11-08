import React from 'react';
import { PenTool, HelpCircle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-pink-200/80 bg-white/60 backdrop-blur-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Informative Guidance Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
            <h4 className="font-bold text-pink-950 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              How Words Are Counted
            </h4>
            <p className="leading-relaxed">
              Words are identified by letter and number sequences, properly preserving hyphenated compound words (e.g., <em>well-known</em>) and apostrophe contractions (e.g., <em>don't</em>, <em>it's</em>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
            <h4 className="font-bold text-pink-950 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Characters & Sentences
            </h4>
            <p className="leading-relaxed">
              Calculates total characters with and without whitespace. Sentences are accurately parsed with support for abbreviations and decimal numbers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
            <h4 className="font-bold text-pink-950 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Privacy & Local Storage
            </h4>
            <p className="leading-relaxed">
              All text analysis executes entirely in your browser. No drafts, keystrokes, or documents are ever uploaded to external servers. Auto-saves locally for your convenience.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pink-900/70">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-6 h-6 rounded-lg bg-pink-600 text-white flex items-center justify-center">
              <PenTool className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-pink-950">Word Counter</span>
            <span aria-hidden="true">·</span>
            <span>Fast, clean writing statistics</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>in soft rose & pink for writers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
