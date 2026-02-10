import Link from 'next/link';
import { allSongs } from '@/data';
import { albums } from '@/data/albums';
import AlbumSection from '@/components/AlbumSection';
import GlobalStats from '@/components/GlobalStats';

export default function Home() {
  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto relative z-10">
      <header className="mb-32 flex flex-col items-center justify-center relative">
        <h1
          className="text-7xl md:text-[12rem] leading-[0.8] font-black tracking-tighter text-tbsm-red font-oswald glitch mix-blend-difference"
          data-text="TBSM"
        >
          TBSM
        </h1>
        <p className="mt-8 text-zinc-500 text-lg font-mono uppercase tracking-[0.5em] text-center">
          The Seedhe Maut Archive
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
          <Link href="/journey" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300 text-center">
            The Journey
          </Link>

          <Link href="/vibes" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300 text-center">
            Vibe Matcher
          </Link>
          <Link href="/codex" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300 text-center">
            The Codex
          </Link>
          <Link href="/producers" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300 text-center">
            Producers
          </Link>
        </div>
      </header>

      <div className="space-y-12">
        {albums.map(album => {
          const albumSongs = album.songs
            .map(id => allSongs.find(s => s.id === id))
            .filter(Boolean) as typeof allSongs;

          return <AlbumSection key={album.id} album={album} songs={albumSongs} />;
        })}
      </div>

      <GlobalStats songs={allSongs} />
    </main>
  );
}
