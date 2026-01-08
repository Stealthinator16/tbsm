import { Song } from '../types';
import { analyzeSongLyrics, ArtistStats } from './analytics';

export interface GlobalStats {
  totalSongs: number;
  totalAlbums: number;
  artistTotals: Record<string, {
    songs: number;
    bars: number;
    words: number;
    uniqueWords: Set<string>;
  }>;
}

export const computeGlobalStats = (songs: Song[]): GlobalStats => {
  const stats: GlobalStats = {
    totalSongs: songs.length,
    totalAlbums: new Set(songs.map(s => s.album)).size,
    artistTotals: {}
  };

  const getArtistEntry = (name: string) => {
    if (!stats.artistTotals[name]) {
      stats.artistTotals[name] = {
        songs: 0,
        bars: 0,
        words: 0,
        uniqueWords: new Set()
      };
    }
    return stats.artistTotals[name];
  };

  songs.forEach(song => {
    const songAnalysis = analyzeSongLyrics(song);
    
    Object.values(songAnalysis.artistStats).forEach((artistStat: ArtistStats) => {
      // Filter out generic speakers
      if (artistStat.name === 'Unknown') return;
      
      const entry = getArtistEntry(artistStat.name);
      
      entry.songs += 1;
      entry.bars += artistStat.lines;
      entry.words += artistStat.words;
      
      // Union of unique words
      artistStat.uniqueWords.forEach(w => entry.uniqueWords.add(w));
    });
  });

  return stats;
};
