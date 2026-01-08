
import { allSongs } from '../data';
import { Song } from '../types';

export const VIBES = [
    'Aggressive',
    'Chill',
    'Introspective',
    'Storytelling'
] as const;

export type ViibeType = typeof VIBES[number];

export function getSongsByVibe(vibe: string): Song[] {
    return allSongs.filter(song => song.vibe === vibe);
}

export function getAllVibes() {
    return VIBES;
}

// Add a helper to get recent vibe counts if needed
export function getVibeStats() {
    const stats: Record<string, number> = {};
    VIBES.forEach(v => {
        stats[v] = allSongs.filter(s => s.vibe === v).length;
    });
    return stats;
}
