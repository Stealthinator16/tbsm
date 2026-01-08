
import { allSongs } from '../data';
import { Song } from '../types';

export interface ProducerStat {
    name: string;
    count: number;
    songs: Song[];
    topVibe?: string; // Dominant vibe
}

export function getProducerStats(): ProducerStat[] {
    const producerMap = new Map<string, ProducerStat>();

    allSongs.forEach((song) => {
        if (song.credits?.producedBy) {
            song.credits.producedBy.forEach((producerName) => {
                // Normalize name
                const name = producerName.trim();

                if (!producerMap.has(name)) {
                    producerMap.set(name, {
                        name,
                        count: 0,
                        songs: [],
                    });
                }

                const stats = producerMap.get(name)!;
                stats.count++;
                stats.songs.push(song);
            });
        }
    });

    // Sort by count (descending)
    return Array.from(producerMap.values()).sort((a, b) => b.count - a.count);
}
