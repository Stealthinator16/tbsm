'use client';

import React, { useState, useMemo } from 'react';
import { getAllVibes, getSongsByVibe, getVibeStats } from '../../utils/vibes';
import Link from 'next/link';
import { ArrowLeft, Play, Zap, Cloud, Brain, BookOpen, Flame, Moon } from 'lucide-react';

export default function VibesPage() {
    const vibes = getAllVibes();
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

    const songs = selectedVibe ? getSongsByVibe(selectedVibe) : [];
    const stats = useMemo(() => getVibeStats(), []);

    const getVibeIcon = (vibe: string) => {
        switch (vibe) {
            case 'Aggressive': return <Zap className="w-6 h-6" />;
            case 'Chill': return <Cloud className="w-6 h-6" />;
            case 'Introspective': return <Brain className="w-6 h-6" />;
            case 'Storytelling': return <BookOpen className="w-6 h-6" />;
            case 'Hype': return <Flame className="w-6 h-6" />;
            case 'Dark': return <Moon className="w-6 h-6" />;
            default: return <Play className="w-6 h-6" />;
        }
    };

    const getGradient = (vibe: string) => {
        switch (vibe) {
            case 'Aggressive': return 'from-red-600 via-orange-600 to-red-800';
            case 'Chill': return 'from-cyan-500 via-blue-500 to-indigo-600';
            case 'Introspective': return 'from-purple-600 via-indigo-600 to-violet-800';
            case 'Storytelling': return 'from-emerald-500 via-green-600 to-teal-700';
            case 'Hype': return 'from-yellow-400 via-orange-500 to-red-600';
            case 'Dark': return 'from-zinc-800 via-stone-900 to-black';
            default: return 'from-zinc-500 to-zinc-700';
        }
    };

    return (
        <main className="bg-zinc-950 min-h-screen text-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="text-tbsm-red font-black font-oswald text-2xl uppercase tracking-widest">
                        Vibe Matcher
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 pt-16">
                <h1 className="text-4xl md:text-6xl font-black font-oswald uppercase text-center mb-16 px-4">
                    How are you feeling?
                </h1>

                {/* Vibe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {vibes.map((vibe) => (
                        <button
                            key={vibe}
                            onClick={() => setSelectedVibe(vibe)}
                            className={`relative overflow-hidden group rounded-xl aspect-[4/3] flex flex-col items-center justify-center border transition-all duration-300 ${selectedVibe === vibe
                                ? 'border-white scale-105 shadow-2xl z-10'
                                : 'border-zinc-800 hover:border-zinc-600 hover:scale-[1.02]'
                                }`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(vibe)} opacity-20 group-hover:opacity-40 transition-opacity`} />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`p-4 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 ${selectedVibe === vibe ? 'text-white' : 'text-zinc-300'}`}>
                                    {getVibeIcon(vibe)}
                                </div>
                                <span className="font-bold font-oswald uppercase tracking-wide text-xl">
                                    {vibe}
                                </span>
                                <span className="text-xs font-mono uppercase bg-black/40 px-2 py-0.5 rounded text-zinc-400">
                                    {stats[vibe]} Tracks
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Results */}
                {selectedVibe && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-2xl font-bold font-oswald uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4 flex items-center gap-3">
                            {getVibeIcon(selectedVibe)}
                            {selectedVibe} Playlist
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {songs.map(song => (
                                <Link
                                    key={song.id}
                                    href={`/song/${song.slug}`}
                                    className="bg-zinc-900/30 border border-zinc-900 hover:border-zinc-700 p-4 rounded-lg group transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-zinc-200 group-hover:text-tbsm-red transition-colors mb-1">
                                                {song.title}
                                            </div>
                                            <div className="text-xs font-mono text-zinc-500 uppercase">
                                                {song.album || 'Single'}
                                            </div>
                                        </div>
                                        <Play className="w-4 h-4 text-zinc-700 group-hover:text-tbsm-red opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                            {songs.length === 0 && (
                                <div className="col-span-full text-center py-12 text-zinc-500 font-mono">
                                    No songs found for this vibe yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
