import { notFound } from 'next/navigation';
import Link from 'next/link';
import { albums } from '@/data/albums';
import { allSongs } from '@/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params;

  // Find the album
  // Decode URL component just in case (e.g. for 'न' character)
  const decodedSlug = decodeURIComponent(slug);
  const album = albums.find(a => a.slug === decodedSlug);

  if (!album) {
    notFound();
  }

  // Get full song objects
  const albumSongs = allSongs.filter(s => album.songs.includes(s.id));

  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-12 mb-24 border-b border-zinc-900 pb-12 text-center md:text-left">
        <div className="w-64 h-64 md:w-96 md:h-96 bg-zinc-900 border border-zinc-800 flex-shrink-0 shadow-2xl relative group">
          {album.coverArt ? (
            <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono">NO COVER</div>
          )}
          <div className="absolute inset-0 bg-tbsm-red/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-tbsm-red font-mono text-sm uppercase tracking-[0.3em]">Official Release</span>
            <span className="h-px bg-tbsm-red/30 flex-1"></span>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black font-oswald uppercase text-white tracking-tighter leading-[0.8] mb-6">
            {album.title}
          </h1>
          <div className="flex justify-center md:justify-start gap-12 font-mono text-zinc-500 uppercase tracking-widest text-sm">
            <p>Year: <span className="text-white">{album.releaseYear || "Unknown"}</span></p>
            <p>Tracks: <span className="text-white">{albumSongs.length}</span></p>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <section>
        <div className="grid gap-2">
          {albumSongs.map((song, idx) => (
            <Link
              key={song.id}
              href={`/song/${song.slug}`}
              className="group flex items-center gap-8 p-6 border-b border-zinc-900/50 hover:bg-zinc-900/20 hover:border-tbsm-red/30 transition-all"
            >
              <span className="text-lg font-mono text-zinc-600 group-hover:text-tbsm-red transition-colors w-12">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-bold font-oswald uppercase text-zinc-400 group-hover:text-white transition-colors tracking-tight">
                  {song.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-zinc-600 font-mono text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Listen
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-24 text-center">
        <Link href="/" className="text-zinc-500 hover:text-white font-mono uppercase tracking-widest text-xs border-b border-transparent hover:border-white transition-all pb-1">
          ← Back to Archive
        </Link>
      </div>
    </main>
  );
}
