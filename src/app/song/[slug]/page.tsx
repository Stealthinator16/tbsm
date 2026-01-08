import { notFound } from 'next/navigation';
import { getSongBySlug } from '@/data';
import SongDisplay from '@/components/SongDisplay';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  // DEBUG: Check if data is fresh
  if (song.lyrics.length > 0) {
    console.log(`[DEBUG] Song: ${song.title}`);
    console.log(`[DEBUG] First Lyric: ${JSON.stringify(song.lyrics[0])}`);
    console.log(`[DEBUG] Second Lyric: ${JSON.stringify(song.lyrics[1])}`);
  }

  return (
    <main className="min-h-screen py-20 px-4">
      <SongDisplay song={song} />
    </main>
  );
}
