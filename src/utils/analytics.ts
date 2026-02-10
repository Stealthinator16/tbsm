import { Song } from '../types';

export interface ArtistStats {
  name: string;
  lines: number;
  words: number;
  uniqueWords: Set<string>;
  longestStreak: number; // Longest consecutive lines
}

export interface SongAnalytics {
  totalLines: number;
  totalWords: number;
  artistStats: Record<string, ArtistStats>;
}

const normalizeSpeaker = (speaker: string | undefined): string => {
  if (!speaker) return 'Unknown';
  const s = speaker.toLowerCase();
  
  if (s.includes('calm')) return 'Calm';
  if (s.includes('encore') || s.includes('abj')) return 'Encore ABJ';
  if (s.includes('chorus') || s.includes('hook')) return 'Chorus';
  if (s.includes('seedhe maut')) return 'Seedhe Maut'; // Usually chorus/unison
  
  return speaker; // Guest artists or others
};

export const analyzeSongLyrics = (song: Song): SongAnalytics => {
  const stats: Record<string, ArtistStats> = {};
  let currentSpeaker = '';
  let currentStreak = 0;

  // Initialize helper to get or create artist entry
  const getArtist = (name: string) => {
    if (!stats[name]) {
      stats[name] = {
        name,
        lines: 0,
        words: 0,
        uniqueWords: new Set(),
        longestStreak: 0
      };
    }
    return stats[name];
  };

  song.lyrics.forEach((line) => {
    const speaker = normalizeSpeaker(line.speaker);
    const artist = getArtist(speaker);
    
    // Line Count
    artist.lines += 1;

    // Word Count & Unique Words
    // Remove punctuation for word counting
    const cleanText = line.original.replace(/[^\w\s\u0900-\u097F]/g, '').toLowerCase(); 
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    
    artist.words += words.length;
    words.forEach(w => artist.uniqueWords.add(w));

    // Streak Calculation
    if (speaker === currentSpeaker) {
      currentStreak++;
    } else {
      // Finalize previous streak
      if (currentSpeaker && stats[currentSpeaker]) {
        stats[currentSpeaker].longestStreak = Math.max(stats[currentSpeaker].longestStreak, currentStreak);
      }
      currentSpeaker = speaker;
      currentStreak = 1;
    }
  });

  // Finalize last streak
  if (currentSpeaker && stats[currentSpeaker]) {
    stats[currentSpeaker].longestStreak = Math.max(stats[currentSpeaker].longestStreak, currentStreak);
  }

  // Aggregate totals
  const totalLines = Object.values(stats).reduce((acc, curr) => acc + curr.lines, 0);
  const totalWords = Object.values(stats).reduce((acc, curr) => acc + curr.words, 0);

  return {
    totalLines,
    totalWords,
    artistStats: stats
  };
};
