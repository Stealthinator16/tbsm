import { allSongs } from '@/data';
import { albums } from '@/data/albums';
import AlbumSection from '@/components/AlbumSection';
import GlobalStats from '@/components/GlobalStats';

export default function Home() {
  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto relative z-10">
      <header className="mb-32 flex flex-col items-center justify-center relative">
        <h1
          className="text-[12rem] leading-[0.8] font-black tracking-tighter text-tbsm-red font-oswald glitch mix-blend-difference"
          data-text="TBSM"
        >
          TBSM
        </h1>
        <p className="mt-8 text-zinc-500 text-lg font-mono uppercase tracking-[0.5em] text-center">
          The Seedhe Maut Archive
        </p>

        <div className="mt-12 flex gap-6">
          <a href="/journey" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300">
            The Journey
          </a>

          <a href="/vibes" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300">
            Vibe Matcher
          </a>
          <a href="/codex" className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300">
            The Codex
          </a>
        </div>
      </header>

      <div className="space-y-12">
        {albums.map(album => {
          // Filter songs that belong to this album
          const albumSongs = allSongs.filter(song =>
            // Normalize comparison
            song.album?.toLowerCase() === album.title.toLowerCase() ||
            album.songs.includes(song.id)
          );

          console.log(`Album: ${album.title}, Songs found: ${albumSongs.length}`);

          return <AlbumSection key={album.id} album={album} songs={albumSongs} />;
        })}
      </div>

      <GlobalStats songs={allSongs} />
    </main>
  );
}
