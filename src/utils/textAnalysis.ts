import { TextStats, WordFrequency } from '../types';

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they',
  'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Counts syllables in an English word using phonetic heuristic rules
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Replace common suffixes before counting
  let processed = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, '')
    .replace(/^y/, '');

  const matches = processed.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Analyzes the text and calculates all counting metrics and readability scores
 */
export function analyzeText(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
      fleschReadingEase: 100,
      readingLevel: 'Not enough text',
      gradeLevel: 'N/A',
      letters: 0,
      digits: 0,
      spaces: 0,
      punctuation: 0,
      longestWord: '',
      uniqueWords: 0,
      lexicalDiversity: 0
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Words matching: sequences of letters, digits, or hyphenated/apostrophe words
  const wordsArray = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
  const words = wordsArray.length;

  // Paragraphs: chunks of non-whitespace separated by newline
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Sentences: splitting by sentence terminators (. ! ?) while handling abbreviations
  const rawSentences = text
    .replace(/([A-Z][a-z]{1,2}\.)(?=\s+[A-Z])/g, '$1#') // e.g. Mr. Dr.
    .replace(/([0-9]+\.[0-9]+)/g, '#') // decimals
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentences = Math.max(words > 0 ? 1 : 0, rawSentences.length);

  // Breakdown counts
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let punctuation = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\p{L}/u.test(ch)) {
      letters++;
    } else if (/\p{N}/u.test(ch)) {
      digits++;
    } else if (/\s/.test(ch)) {
      spaces++;
    } else if (/[^\p{L}\p{N}\s]/u.test(ch)) {
      punctuation++;
    }
  }

  // Word analytics
  let totalWordLetters = 0;
  let longest = '';
  const wordSet = new Set<string>();
  let totalSyllables = 0;

  for (const w of wordsArray) {
    totalWordLetters += w.length;
    if (w.length > longest.length) {
      longest = w;
    }
    wordSet.add(w.toLowerCase());
    totalSyllables += countSyllables(w);
  }

  const averageWordLength = words > 0 ? Number((totalWordLetters / words).toFixed(1)) : 0;
  const averageSentenceLength = sentences > 0 ? Number((words / sentences).toFixed(1)) : 0;
  const uniqueWords = wordSet.size;
  const lexicalDiversity = words > 0 ? Math.round((uniqueWords / words) * 100) : 0;

  // Flesch Reading Ease: 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
  let flesch = 100;
  let readingLevel = 'Very Easy to Read';
  let gradeLevel = '5th Grade';

  if (words >= 5 && sentences >= 1) {
    const wordsPerSentence = words / sentences;
    const syllablesPerWord = totalSyllables / words;
    const score = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
    flesch = Math.max(0, Math.min(100, Math.round(score)));

    // Flesch-Kincaid Grade Level
    const fkGrade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
    const roundedGrade = Math.max(1, Math.round(fkGrade));

    if (flesch >= 90) {
      readingLevel = 'Very Easy to Read';
      gradeLevel = '5th Grade';
    } else if (flesch >= 80) {
      readingLevel = 'Easy to Read';
      gradeLevel = '6th Grade';
    } else if (flesch >= 70) {
      readingLevel = 'Fairly Easy';
      gradeLevel = '7th Grade';
    } else if (flesch >= 60) {
      readingLevel = 'Plain English';
      gradeLevel = '8th - 9th Grade';
    } else if (flesch >= 50) {
      readingLevel = 'Fairly Difficult';
      gradeLevel = '10th - 12th Grade';
    } else if (flesch >= 30) {
      readingLevel = 'Difficult';
      gradeLevel = 'College Level';
    } else {
      readingLevel = 'Very Difficult';
      gradeLevel = 'College Graduate';
    }

    if (roundedGrade > 12) {
      gradeLevel = 'College Level';
    } else if (roundedGrade > 8) {
      gradeLevel = `${roundedGrade}th Grade (High School)`;
    } else {
      gradeLevel = `${roundedGrade}th Grade (Middle School)`;
    }
  }

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    averageWordLength,
    averageSentenceLength,
    fleschReadingEase: flesch,
    readingLevel,
    gradeLevel,
    letters,
    digits,
    spaces,
    punctuation,
    longestWord: longest,
    uniqueWords,
    lexicalDiversity
  };
}

/**
 * Extracts top keyword frequency list
 */
export function getKeywordDensity(
  text: string,
  excludeStopWords: boolean = true,
  maxResults: number = 12
): WordFrequency[] {
  const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
  if (words.length === 0) return [];

  const counts: Record<string, number> = {};
  let validWordCount = 0;

  for (const raw of words) {
    const word = raw.toLowerCase();
    // Exclude single characters unless digits/letters that make sense, and stop words if requested
    if (excludeStopWords && (STOP_WORDS.has(word) || word.length < 2)) {
      continue;
    }
    counts[word] = (counts[word] || 0) + 1;
    validWordCount++;
  }

  const entries = Object.entries(counts).map(([word, count]) => ({
    word,
    count,
    percentage: words.length > 0 ? Number(((count / words.length) * 100).toFixed(1)) : 0
  }));

  entries.sort((a, b) => b.count - a.count);
  return entries.slice(0, maxResults);
}

/**
 * Case converters
 */
export function convertCase(
  text: string,
  type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel'
): string {
  if (!text) return text;

  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    case 'sentence': {
      // Capitalize first letter of each sentence
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    }
    case 'camel': {
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
    }
    default:
      return text;
  }
}

/**
 * Clean up text helpers
 */
export function removeExtraSpaces(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
}

export function removeEmptyLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

export function cleanLineBreaks(text: string): string {
  return text.replace(/(\r\n|\r|\n)+/g, '\n\n').trim();
}
