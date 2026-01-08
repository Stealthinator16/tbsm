'use client';

import React, { useState } from 'react';
import { getProducerStats } from '../../utils/producers';
import Link from 'next/link';
import { ArrowLeft, Mic2, Disc, Code, BarChart3 } from 'lucide-react';

export default function LabPage() {
    const producers = getProducerStats();
    const [selectedProducer, setSelectedProducer] = useState<string | null>(null);

    // If we have producers, default select the first one if none selected
    if (!selectedProducer && producers.length > 0) {
        setSelectedProducer(producers[0].name);
    }

    const activeProducer = producers.find(p => p.name === selectedProducer);

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
                        The Lab
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 pt-12 flex flex-col md:flex-row gap-12">

                {/* Sidebar / List */}
                <div className="w-full md:w-1/3">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                        <Code className="w-4 h-4" /> Sound Architects
                    </h2>
                    <div className="space-y-2">
                        {producers.map((producer, idx) => (
                            <button
                                key={producer.name}
                                onClick={() => setSelectedProducer(producer.name)}
                                className={`w-full flex items-center justify-between p-4 rounded border transition-all duration-300 group ${selectedProducer === producer.name
                                        ? 'bg-zinc-900 border-tbsm-red shadow-[0_0_20px_-10px_rgba(220,38,38,0.5)]'
                                        : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`text-xl font-black font-oswald w-6 text-center ${selectedProducer === producer.name ? 'text-tbsm-red' : 'text-zinc-600'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold font-oswald uppercase tracking-wide ${selectedProducer === producer.name ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                            {producer.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono bg-black/50 px-2 py-1 rounded text-zinc-500">
                                    {producer.count}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-full md:w-2/3">
                    {activeProducer ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Header Card */}
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-tbsm-red/5 blur-[100px] rounded-full pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-tbsm-red mb-2">
                                        <BarChart3 className="w-4 h-4" />
                                        <span className="text-xs font-mono uppercase tracking-widest">Profile</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-black font-oswald uppercase tracking-tighter text-white mb-2">
                                        {activeProducer.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-zinc-400 font-mono text-sm uppercase tracking-wide">
                                        <span>{activeProducer.count} Tracks</span>
                                        <span className="h-4 w-px bg-zinc-700" />
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Discography Grid */}
                            <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                <Disc className="w-4 h-4" /> Production Discography
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeProducer.songs.map((song) => (
                                    <Link
                                        key={song.id}
                                        href={`/song/${song.slug}`}
                                        className="block group bg-zinc-900/20 border border-zinc-800 p-4 rounded hover:border-zinc-600 hover:bg-zinc-900/40 transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold font-oswald text-lg text-zinc-200 group-hover:text-tbsm-red transition-colors mb-1">
                                                    {song.title}
                                                </div>
                                                <div className="text-xs font-mono text-zinc-500 uppercase">
                                                    {song.album || 'Single'}
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                                                <ArrowLeft className="w-4 h-4 rotate-180 text-tbsm-red" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 font-mono uppercase tracking-widest">
                            Select a producer
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
