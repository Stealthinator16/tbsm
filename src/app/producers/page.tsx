import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProducerStats } from '../../utils/producers';

export const metadata: Metadata = {
  title: 'Producers — TBSM',
  description: 'Every producer behind Seedhe Maut tracks, ranked by number of productions.',
};

export default function ProducersPage() {
  const producers = getProducerStats();

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
            Producers
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        {/* Stats */}
        <div className="flex gap-8 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <div className="text-4xl font-black font-oswald text-white">{producers.length}</div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Producers</div>
          </div>
          <div>
            <div className="text-4xl font-black font-oswald text-white">
              {producers.reduce((sum, p) => sum + p.count, 0)}
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Total Credits</div>
          </div>
        </div>

        {/* Producer Grid */}
        <div className="grid grid-cols-1 gap-4">
          {producers.map((producer, idx) => (
            <div key={producer.name} className="group bg-zinc-900/20 border border-zinc-900 rounded-lg p-6 hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-mono text-zinc-600 w-8">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-2xl font-bold font-oswald uppercase tracking-wide text-white group-hover:text-tbsm-red transition-colors">
                    {producer.name}
                  </h2>
                </div>
                <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded">
                  {producer.count} {producer.count === 1 ? 'Track' : 'Tracks'}
                </div>
              </div>

              {/* Songs List */}
              <div className="space-y-2 pl-12">
                <div className="text-[10px] font-mono uppercase text-zinc-600 tracking-widest mb-2">Productions</div>
                {producer.songs.slice(0, 5).map(song => (
                  <div key={song.id} className="border-l-2 border-zinc-800 pl-3 py-1">
                    <Link href={`/song/${song.slug}`} className="text-sm font-bold text-zinc-300 hover:text-white transition-colors block">
                      {song.title}
                    </Link>
                    <span className="text-xs text-zinc-600 font-mono">{song.album || 'Single'}</span>
                  </div>
                ))}
                {producer.songs.length > 5 && (
                  <div className="text-xs text-zinc-600 italic pl-3 pt-1">
                    + {producer.songs.length - 5} more tracks
                  </div>
                )}
              </div>
            </div>
          ))}

          {producers.length === 0 && (
            <div className="text-center py-20 text-zinc-500 font-mono uppercase tracking-widest">
              No producer credits found yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
