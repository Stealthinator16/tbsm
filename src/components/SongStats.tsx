'use client';

import React, { useMemo } from 'react';
import { Song } from '../types';
import { analyzeSongLyrics } from '../utils/analytics';
import { getArtistColor } from '../utils/colors';

interface SongStatsProps {
  song: Song;
  calmColor: string;
  encoreColor: string;
}

export default function SongStats({ song, calmColor, encoreColor }: SongStatsProps) {
  const analytics = useMemo(() => analyzeSongLyrics(song), [song]);
  
  // Get all artists except generic ones for the main stats
  const rappers = Object.values(analytics.artistStats).filter(
    a => !a.name.toLowerCase().includes('chorus') && 
         !a.name.toLowerCase().includes('seedhe maut') &&
         a.name !== 'Unknown'
  );

  // Sort: Calm and Encore first, then others by word count
  rappers.sort((a, b) => {
    const isA_SM = a.name.includes('Calm') || a.name.includes('Encore');
    const isB_SM = b.name.includes('Calm') || b.name.includes('Encore');
    if (isA_SM && !isB_SM) return -1;
    if (!isA_SM && isB_SM) return 1;
    return b.words - a.words;
  });

  // Calculate totals for percentages (Using .size for sets)
  const totalRapWords = rappers.reduce((acc, curr) => acc + curr.words, 0);
  const totalRapLines = rappers.reduce((acc, curr) => acc + curr.lines, 0);
  const totalVocab = rappers.reduce((acc, curr) => acc + curr.uniqueWords.size, 0);
  const totalFlow = rappers.reduce((acc, curr) => acc + curr.longestStreak, 0);

  // Helper for the multi-colored bar
  const ComparisonBar = ({ metric, total }: { metric: keyof typeof rappers[0], total: number }) => (
    <div className="flex h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      {rappers.map((artist) => {
        let val = 0;
        if (metric === 'uniqueWords') {
           val = artist.uniqueWords.size;
        } else {
           val = artist[metric] as number;
        }
        
        const pct = total > 0 ? (val / total) * 100 : 0;
        const color = getArtistColor(artist.name, calmColor, encoreColor);
        
        return (
          <div 
            key={artist.name}
            style={{ width: `${pct}%`, backgroundColor: color }} 
            className="h-full transition-all duration-500 ease-out border-r border-zinc-900 last:border-r-0"
          />
        );
      })}
    </div>
  );

  const StatRow = ({ label, metric, total }: { label: string, metric: keyof typeof rappers[0], total: number }) => (
    <div className="mb-6">
      {/* Values Row */}
      <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2 text-zinc-500">
        {rappers.map((artist, idx) => {
          const color = getArtistColor(artist.name, calmColor, encoreColor);
          const alignment = idx === 0 ? 'text-left' : idx === rappers.length - 1 ? 'text-right' : 'text-center';
          
          let displayValue = 0;
          if (metric === 'uniqueWords') {
             displayValue = artist.uniqueWords.size;
          } else {
             displayValue = artist[metric] as number;
          }

          return (
            <span key={artist.name} style={{ color }} className={`${alignment} flex-1`}>
              {displayValue.toLocaleString()}
            </span>
          );
        })}
      </div>
      
      <div className="text-center text-[10px] font-bold text-zinc-600 mb-1 uppercase tracking-[0.2em]">{label}</div>

      <ComparisonBar metric={metric} total={total} />
    </div>
  );

  return (
    <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-lg mb-12 backdrop-blur-sm">
      <h3 className="text-xs font-bold font-oswald uppercase tracking-[0.2em] text-zinc-400 mb-8 text-center border-b border-zinc-800 pb-4">
        Battle Reports
      </h3>

      {/* Head to Head Header */}
      <div className="flex justify-between items-center mb-8 text-center px-2">
        {rappers.map((artist, idx) => {
          const color = getArtistColor(artist.name, calmColor, encoreColor);
          return (
            <React.Fragment key={artist.name}>
              <div className="text-sm font-bold font-mono tracking-wider" style={{ color }}>
                {artist.name.split(' ')[0].toUpperCase()}
              </div>
              {idx < rappers.length - 1 && (
                <div className="text-xs text-zinc-700 font-mono px-2">VS</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <StatRow label="Words" metric="words" total={totalRapWords} />
      <StatRow label="Bars" metric="lines" total={totalRapLines} />
      <StatRow label="Vocab" metric="uniqueWords" total={totalVocab} /> 
      <StatRow label="Flow Streak" metric="longestStreak" total={totalFlow} />
    </div>
  );
}
