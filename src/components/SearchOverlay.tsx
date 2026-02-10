'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { allSongs } from '../data';
import { albums } from '../data/albums';
import { getAllAnnotations } from '../utils/codex';

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const codexEntries = useMemo(() => getAllAnnotations(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { songs: [], albums: [], codex: [] };
    const q = query.toLowerCase();

    const songs = allSongs
      .filter(s => s.title.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedAlbums = albums
      .filter(a => a.title.toLowerCase().includes(q))
      .slice(0, 3);

    const codex = codexEntries
      .filter(e => e.keyword.toLowerCase().includes(q))
      .slice(0, 3);

    return { songs, albums: matchedAlbums, codex };
  }, [query, codexEntries]);

  const hasResults = results.songs.length > 0 || results.albums.length > 0 || results.codex.length > 0;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-full hover:border-zinc-600 transition-colors group"
        aria-label="Search"
      >
        <Search className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="max-w-2xl mx-auto pt-[15vh] px-4" onClick={e => e.stopPropagation()}>
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search songs, albums, codex..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-tbsm-red/50 font-mono text-sm"
              />
              <button onClick={() => setIsOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Keyboard Hint */}
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                ESC to close
              </span>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                {/* Songs */}
                {results.songs.length > 0 && (
                  <div className="p-4">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Songs</div>
                    {results.songs.map(song => (
                      <Link
                        key={song.id}
                        href={`/song/${song.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
                      >
                        <div className="font-bold text-white text-sm">{song.title}</div>
                        <div className="text-xs font-mono text-zinc-500">{song.album || 'Single'}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Albums */}
                {results.albums.length > 0 && (
                  <div className="p-4 border-t border-zinc-800">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Albums</div>
                    {results.albums.map(album => (
                      <Link
                        key={album.id}
                        href={`/album/${album.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
                      >
                        <div className="font-bold text-white text-sm">{album.title}</div>
                        <div className="text-xs font-mono text-zinc-500">{album.releaseYear}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Codex */}
                {results.codex.length > 0 && (
                  <div className="p-4 border-t border-zinc-800">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Codex</div>
                    {results.codex.map(entry => (
                      <Link
                        key={entry.keyword}
                        href="/codex"
                        onClick={() => setIsOpen(false)}
                        className="block p-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
                      >
                        <div className="font-bold text-white text-sm">{entry.keyword}</div>
                        <div className="text-xs font-mono text-zinc-500">{entry.meaning || entry.type}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {!hasResults && (
                  <div className="p-8 text-center text-zinc-500 font-mono text-sm uppercase tracking-widest">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
