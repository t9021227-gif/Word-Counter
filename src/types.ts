export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  averageWordLength: number;
  averageSentenceLength: number;
  fleschReadingEase: number;
  readingLevel: string;
  gradeLevel: string;
  letters: number;
  digits: number;
  spaces: number;
  punctuation: number;
  longestWord: string;
  uniqueWords: number;
  lexicalDiversity: number; // percentage of unique words
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface TargetGoal {
  type: 'words' | 'characters';
  target: number;
  label: string;
}

export interface PlatformLimit {
  id: string;
  name: string;
  type: 'characters' | 'words';
  max: number;
  recommendedMax?: number;
  description: string;
}
