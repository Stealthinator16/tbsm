'use client';

import React from 'react';
import { timelineData } from '../../data/timeline';
import Link from 'next/link';
import { ArrowLeft, Calendar, Disc, Flag, Mic2 } from 'lucide-react';

export default function JourneyPage() {
    const getIcon = (type: string) => {
        switch (type) {
            case 'release': return <Disc className="w-5 h-5" />;
            case 'show': return <Mic2 className="w-5 h-5" />;
            case 'milestone': return <Flag className="w-5 h-5" />;
            default: return <Calendar className="w-5 h-5" />;
        }
    };

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
                        The Journey
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 pt-16 relative">
                {/* Central Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 transform md:-translate-x-1/2 z-0" />

                {timelineData.map((event, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={event.id} className={`relative z-10 mb-16 flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center`}>

                            {/* Date Marker (Mobile: Left, Desktop: Center) */}
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border-2 border-tbsm-red text-tbsm-red">
                                <div className="w-2 h-2 rounded-full bg-tbsm-red" />
                            </div>

                            {/* Spacer for the other side */}
                            <div className="hidden md:block w-1/2" />

                            {/* Content Card */}
                            <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                                <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg hover:border-zinc-600 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2 text-tbsm-red/80">
                                        {getIcon(event.type)}
                                        <span className="font-mono text-xs uppercase tracking-widest">{event.date}</span>
                                        <span className="h-px bg-zinc-800 flex-1" />
                                        <span className="font-mono text-[10px] uppercase text-zinc-500">{event.era}</span>
                                    </div>

                                    <h2 className="text-3xl font-bold font-oswald uppercase text-white mb-3 leading-none group-hover:text-tbsm-red transition-colors">
                                        {event.title}
                                    </h2>

                                    <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-4">
                                        {event.description}
                                    </p>

                                    {event.relatedSlug && (
                                        <Link href={`/song/${event.relatedSlug}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white hover:text-tbsm-red transition-colors">
                                            Listen <ArrowLeft className="w-3 h-3 rotate-180" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* End Marker */}
                <div className="relative z-10 flex justify-center pt-8">
                    <div className="px-6 py-2 bg-zinc-900 rounded-full border border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-500">
                        To Be Continued...
                    </div>
                </div>

            </div>
        </main>
    );
}
