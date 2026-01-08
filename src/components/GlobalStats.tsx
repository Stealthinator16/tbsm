'use client';

import React, { useMemo } from 'react';
import { Song } from '../types';
import { computeGlobalStats } from '../utils/globalAnalytics';
import { getArtistColor } from '../utils/colors';

interface GlobalStatsProps {
  songs: Song[];
}

const CALM_COLOR = '#38bdf8'; // Sky-400
const ENCORE_COLOR = '#f472b6'; // Pink-400

export default function GlobalStats({ songs }: GlobalStatsProps) {
  const stats = useMemo(() => computeGlobalStats(songs), [songs]);
  
  const calm = stats.artistTotals['Calm'] || { songs: 0, bars: 0, words: 0, uniqueWords: new Set() };
  const encore = stats.artistTotals['Encore ABJ'] || { songs: 0, bars: 0, words: 0, uniqueWords: new Set() };
  
  // Featured Artists (Exclude Core & Generic)
  const features = Object.entries(stats.artistTotals)
    .filter(([name]) => 
      !name.includes('Calm') && 
      !name.includes('Encore') && 
      !name.includes('Chorus') && 
      !name.includes('Seedhe Maut')
    )
    .sort(([, a], [, b]) => b.bars - a.bars) // Sort by bars spat
    .slice(0, 5); // Top 5

  const ComparisonBar = ({ value1, value2 }: { value1: number, value2: number }) => {
    const total = value1 + value2;
    const p1 = total > 0 ? (value1 / total) * 100 : 0;
    const p2 = total > 0 ? (value2 / total) * 100 : 0;
    
    return (
      <div className="flex h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
        <div style={{ width: `${p1}%`, backgroundColor: CALM_COLOR }} className="h-full" />
        <div style={{ width: `${p2}%`, backgroundColor: ENCORE_COLOR }} className="h-full" />
      </div>
    );
  };

  return (
    <section className="mt-32 pt-24 border-t border-zinc-900">
      <div className="flex items-center gap-4 mb-16">
        <span className="text-tbsm-red font-mono text-xs uppercase tracking-[0.3em]">Analytics</span>
        <span className="h-px bg-tbsm-red/30 flex-1"></span>
      </div>

      <h2 className="text-6xl md:text-8xl font-black font-oswald uppercase text-white tracking-tighter leading-none mb-16">
        The Breakdown
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* DUO COMPARISON */}
        <div className="border border-zinc-900 bg-zinc-900/10 p-8 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold font-oswald uppercase tracking-widest text-zinc-400 mb-8 border-b border-zinc-800 pb-4">
            Calm vs Encore ABJ
          </h3>
          
          <div className="space-y-10">
            {/* Bars */}
            <div>
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-1 text-zinc-500">
                <span style={{ color: CALM_COLOR }}>{calm.bars.toLocaleString()}</span>
                <span>Total Bars</span>
                <span style={{ color: ENCORE_COLOR }}>{encore.bars.toLocaleString()}</span>
              </div>
              <ComparisonBar value1={calm.bars} value2={encore.bars} />
            </div>

            {/* Words */}
            <div>
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-1 text-zinc-500">
                <span style={{ color: CALM_COLOR }}>{calm.words.toLocaleString()}</span>
                <span>Total Words</span>
                <span style={{ color: ENCORE_COLOR }}>{encore.words.toLocaleString()}</span>
              </div>
              <ComparisonBar value1={calm.words} value2={encore.words} />
            </div>

            {/* Vocabulary */}
            <div>
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-1 text-zinc-500">
                <span style={{ color: CALM_COLOR }}>{calm.uniqueWords.size.toLocaleString()}</span>
                <span>Unique Words</span>
                <span style={{ color: ENCORE_COLOR }}>{encore.uniqueWords.size.toLocaleString()}</span>
              </div>
              <ComparisonBar value1={calm.uniqueWords.size} value2={encore.uniqueWords.size} />
            </div>
          </div>
        </div>

        {/* TOP FEATURES */}
        <div className="border border-zinc-900 bg-zinc-900/10 p-8 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold font-oswald uppercase tracking-widest text-zinc-400 mb-8 border-b border-zinc-800 pb-4">
            Top Collaborators
          </h3>
          
          <div className="space-y-6">
            {features.map(([name, stat], idx) => {
              const color = getArtistColor(name, CALM_COLOR, ENCORE_COLOR);
              return (
                <div key={name} className="flex items-center gap-4 group">
                  <div className="text-2xl font-black font-oswald text-zinc-700 w-8">{idx + 1}</div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-lg font-bold font-oswald uppercase tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                        {name}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">{stat.songs} Songs</span>
                    </div>
                    
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      {/* Scale bar relative to highest feature (first in sorted list) */}
                      <div 
                        style={{ width: `${(stat.bars / features[0][1].bars) * 100}%`, backgroundColor: color }} 
                        className="h-full opacity-60 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                    <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider text-right">
                      {stat.bars} Bars
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
