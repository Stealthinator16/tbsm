'use client';

import React, { useState } from 'react';
import { getAllAnnotations } from '../../utils/codex';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function CodexPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const allEntries = getAllAnnotations();

    const filteredEntries = allEntries.filter(entry =>
        entry.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="bg-zinc-950 min-h-screen text-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="text-tbsm-red font-black font-oswald text-2xl uppercase tracking-widest">
                        The Codex
                    </div>
                    <div className="w-16" /> {/* Spacer for balance */}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 pt-12">
                {/* Search */}
                <div className="relative mb-12">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-tbsm-red/50 transition-all font-mono text-sm uppercase tracking-wider"
                        placeholder="Search the dictionary..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Stats */}
                <div className="flex gap-8 mb-12 border-b border-zinc-900 pb-8">
                    <div>
                        <div className="text-4xl font-black font-oswald text-white">{allEntries.length}</div>
                        <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Term Definitions</div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredEntries.map((entry) => (
                        <div key={entry.keyword} className="group bg-zinc-900/20 border border-zinc-900 rounded-lg p-6 hover:border-zinc-700 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold font-oswald uppercase tracking-wide text-white group-hover:text-tbsm-red transition-colors">
                                        {entry.keyword}
                                    </h2>
                                    <div className="flex gap-2 items-center mt-2">
                                        <span className="inline-block px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                            {entry.type}
                                        </span>
                                        {entry.aliases.length > 0 && (
                                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                                AKA: {entry.aliases.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded">
                                    {entry.count} {entry.count === 1 ? 'Ref' : 'Refs'}
                                </div>
                            </div>

                            {/* Meaning */}
                            {entry.meaning && (
                                <div className="mb-6 p-4 bg-zinc-950/50 border border-zinc-900 rounded italic text-sm text-zinc-300 border-l-tbsm-red border-l-4">
                                    {entry.meaning}
                                </div>
                            )}

                            {/* Songs List */}
                            <div className="space-y-2">
                                <div className="text-[10px] font-mono uppercase text-zinc-600 tracking-widest mb-2">Appearances</div>
                                {entry.songs.slice(0, 5).map(song => (
                                    <div key={song.id} className="border-l-2 border-zinc-800 pl-3 py-1">
                                        <Link href={`/song/${song.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white transition-colors block">
                                            {song.title}
                                        </Link>
                                        <p className="text-xs text-zinc-500 font-mono mt-1 line-clamp-1 italic">
                                            "{song.context}"
                                        </p>
                                    </div>
                                ))}
                                {entry.songs.length > 5 && (
                                    <div className="text-xs text-zinc-600 italic pl-3 pt-1">
                                        + {entry.songs.length - 5} more songs
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredEntries.length === 0 && (
                        <div className="text-center py-20 text-zinc-500 font-mono uppercase tracking-widest">
                            No terms found via satellites.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
