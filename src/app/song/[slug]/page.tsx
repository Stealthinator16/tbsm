import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allSongs, getSongBySlug } from '@/data';
import SongDisplay from '@/components/SongDisplay';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSongs.map(song => ({ slug: song.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) return {};
  return {
    title: `${song.title} — TBSM`,
    description: song.summary || `Lyrics and analysis for ${song.title} by Seedhe Maut.`,
  };
}

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  return (
    <main className="min-h-screen py-20 px-4">
      <SongDisplay song={song} />
    </main>
  );
}
