import Link from 'next/link';
import { Album, Song } from '../types';

interface AlbumSectionProps {
  album: Album;
  songs: Song[];
}

export default function AlbumSection({ album, songs }: AlbumSectionProps) {
  // Only show section if it has songs or we want to show empty albums as placeholders
  console.log(`Rendering AlbumSection for ${album.title}: ${songs.length} songs`);
  if (songs.length === 0) return null;

  return (
    <section className="mb-24">
      <div className="flex items-end gap-8 mb-12 border-b border-zinc-900 pb-6">
        <Link href={`/album/${album.slug}`} className="block group">
          <div className="w-48 h-48 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-tbsm-red/50">
             {album.coverArt ? (
               <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-xs group-hover:text-tbsm-red transition-colors">NO COVER</div>
             )}
          </div>
        </Link>
        <div className="flex-1 pb-2">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-tbsm-red font-mono text-xs uppercase tracking-[0.3em]">Album</span>
            <span className="h-px bg-tbsm-red/30 flex-1"></span>
          </div>
          <Link href={`/album/${album.slug}`} className="block group w-fit">
            <h2 className="text-7xl font-black font-oswald uppercase text-white tracking-tighter leading-none mb-4 group-hover:text-tbsm-red transition-colors">
              {album.title}
            </h2>
          </Link>
          <p className="text-zinc-500 font-mono text-sm tracking-[0.5em] uppercase italic">{album.releaseYear || "Archive"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
        {songs.map((song, idx) => (
          <Link 
            key={song.id} 
            href={`/song/${song.slug}`}
            className="group flex items-baseline gap-4 py-2 border-b border-zinc-900/50 hover:border-tbsm-red/50 transition-all"
          >
            <span className="text-[10px] font-mono text-zinc-700 group-hover:text-tbsm-red transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
            <h3 className="text-lg font-bold font-oswald uppercase text-zinc-400 group-hover:text-white transition-colors truncate">
              {song.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
