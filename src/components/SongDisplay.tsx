'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Song, LyricLine } from '../types';
import { albums } from '../data/albums';
import MobileDrawer from './MobileDrawer';
import SongStats from './SongStats';
import { getArtistColor } from '../utils/colors';

interface SongDisplayProps {
  song: Song;
}

const CALM_COLOR = '#38bdf8'; // Sky-400
const ENCORE_COLOR = '#f472b6'; // Pink-400

export default function SongDisplay({ song }: SongDisplayProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const selectedLyric = selectedLine !== null ? song.lyrics[selectedLine] : null;

  // Find Album Cover
  const albumData = albums.find(a => a.title === song.album);
  const coverArt = albumData?.coverArt;

  // Group lyrics by speaker
  const groupedLyrics = useMemo(() => {
    const groups: { speaker: string | undefined; lines: { lyric: LyricLine; index: number }[] }[] = [];
    let currentGroup: { speaker: string | undefined; lines: { lyric: LyricLine; index: number }[] } | null = null;

    song.lyrics.forEach((line, index) => {
      const speaker = line.speaker;

      if (!currentGroup || currentGroup.speaker !== speaker) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { speaker, lines: [] };
      }
      currentGroup.lines.push({ lyric: line, index });
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [song.lyrics]);

  const getSpeakerStyle = (speaker: string | undefined) => {
    const s = speaker?.toLowerCase() || "";

    if (s.includes("chorus") || s.includes("hook") || s.includes("seedhe maut")) {
      return {
        label: speaker?.toUpperCase() || "CHORUS",
        isArtist: false,
        color: '#a1a1aa',
        baseClass: "text-zinc-300",
        labelClass: "text-zinc-500"
      };
    }

    const color = getArtistColor(speaker || "Unknown", CALM_COLOR, ENCORE_COLOR);

    return {
      label: speaker?.toUpperCase() || "UNKNOWN",
      isArtist: true,
      color: color,
      baseClass: "transition-colors duration-300"
    };
  };

  const renderLineAnalysis = (isMobile: boolean = false) => {
    if (!selectedLyric) return null;

    // On mobile, we want a cleaner look without the box/border since it's already in a drawer
    const containerClasses = isMobile
      ? "animate-in fade-in slide-in-from-bottom-4 duration-300 mb-8"
      : "animate-in fade-in slide-in-from-top-4 duration-300 mb-12 p-6 border border-tbsm-red/30 bg-tbsm-red/5 rounded-sm";

    return (
      <div className={containerClasses}>


        <div className="mb-8">
          <h3 className="text-[9px] font-mono text-zinc-500 uppercase mb-2 tracking-widest">Translation</h3>
          <p className="text-xl text-white font-oswald uppercase italic leading-tight">
            {selectedLyric.translation || "Translation pending..."}
          </p>
        </div>

        {selectedLyric.explanation && (
          <div className="mb-8">
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase mb-2 tracking-widest">Meaning</h3>
            <p className="text-zinc-400 leading-relaxed font-light text-sm italic">{selectedLyric.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSongIntel = () => {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-8">
          <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-bold">Intel / Context</h2>
        </div>

        <div className="space-y-8 mb-12">
          <div>
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase mb-2 tracking-widest">Brief</h3>
            <p className="text-zinc-400 font-light leading-relaxed">
              {song.summary || "Analysis pending for this track. Check back soon for detailed context, backstory, and lyrical breakdown."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-sm">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Type</div>
              <div className="text-sm font-oswald text-zinc-300 uppercase">{song.type || "Track"}</div>
            </div>
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-sm">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Vibe</div>
              <div className="text-sm font-oswald text-zinc-300 uppercase">{song.vibe || "Unknown"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">

      {/* Centered Navigation / Big Logo */}
      <nav className="flex justify-center py-12 mb-8">
        <Link href="/" className="group">
          <h1 className="text-6xl md:text-[10rem] leading-none font-black tracking-tighter text-tbsm-red font-oswald glitch mix-blend-difference" data-text="TBSM">
            TBSM
          </h1>
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="mb-24 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-zinc-900 pb-12 text-center md:text-left">
        {coverArt && (
          <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden shadow-2xl rounded-sm">
            <img src={coverArt} alt={song.album} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-tbsm-red font-mono text-[10px] uppercase tracking-[0.3em]">Track</span>
            <span className="h-px bg-tbsm-red/20 flex-1"></span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-oswald uppercase leading-none text-white mb-2">
            {song.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            <span>Album:</span>
            <span className="text-zinc-300 font-oswald text-sm tracking-normal">{song.album}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-12">
          {/* Mobile Brief/Intel */}
          <div className="md:hidden">
            {renderSongIntel()}
          </div>

          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-bold">Lyrics / Hindi</h2>
            <span className="text-[10px] font-mono text-zinc-700">SCRIPT MODE</span>
          </div>

          <div className="space-y-12">
            {groupedLyrics.map((group, gIdx) => {
              const style = getSpeakerStyle(group.speaker);
              const isActive = style.isArtist;

              const textStyle = isActive ? { color: style.color } : {};
              const labelStyle = isActive ? { color: style.color } : {};

              return (
                <div
                  key={gIdx}
                  className={`relative ${style.baseClass}`}
                >
                  {/* Speaker Label */}
                  {group.speaker && (
                    <div
                      className={`flex items-center gap-2 mb-4 ${style.labelClass || ""}`}
                      style={labelStyle}
                    >
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
                        {style.label}
                      </span>
                      <span className="h-px w-8 bg-current opacity-20"></span>
                    </div>
                  )}

                  {/* Lines */}
                  <div className="space-y-1">
                    {group.lines.map(({ lyric, index }) => (
                      <div
                        key={index}
                        onClick={() => setSelectedLine(index === selectedLine ? null : index)}
                        className={`cursor-pointer transition-all duration-150 p-2 rounded-sm -ml-2 ${selectedLine === index
                          ? 'bg-tbsm-red text-white shadow-lg scale-[1.02] origin-left z-10 relative'
                          : 'hover:bg-zinc-900/50'
                          }`}
                      >
                        <p
                          className="text-lg md:text-xl leading-relaxed font-mono font-medium"
                          style={selectedLine === index ? {} : textStyle}
                        >
                          {lyric.original}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mt-12 border-t border-zinc-900 pt-12">
            <SongStats song={song} calmColor={CALM_COLOR} encoreColor={ENCORE_COLOR} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-12 h-fit">
          {/* Always show Intel, Analysis pops above it */}
          {selectedLine !== null && renderLineAnalysis(false)}

          {renderSongIntel()}

          <div className="mt-12">
            <SongStats song={song} calmColor={CALM_COLOR} encoreColor={ENCORE_COLOR} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <MobileDrawer
          isOpen={selectedLine !== null}
          onClose={() => setSelectedLine(null)}
        >
          {renderLineAnalysis(true)}
        </MobileDrawer>
      </div>
    </div>
  );
}