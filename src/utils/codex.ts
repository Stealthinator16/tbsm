
import { allSongs } from '../data';
import { Song, Annotation } from '../types';

export interface CodexEntry {
    keyword: string;
    type: string;
    count: number;
    // A map of song IDs to the specific line/context if needed, but for now just a list of songs
    songs: {
        id: string;
        title: string;
        slug: string;
        context: string; // The line where it appears
    }[];
}

export function getAllAnnotations(): CodexEntry[] {
    const codexMap = new Map<string, CodexEntry>();

    allSongs.forEach((song) => {
        song.lyrics.forEach((line) => {
            if (line.annotations && line.annotations.length > 0) {
                line.annotations.forEach((note: any) => {
                    // Normalize keyword (lowercase, trim)
                    // The annotation object might vary slightly depending on AI output, 
                    // usually it has 'keyword' and 'type' (or 'text' and 'type' in earlier versions?)
                    // Let's handle both 'keyword' and 'text'.

                    const rawKeyword = note.keyword || note.text;
                    if (!rawKeyword) return;

                    const keyword = rawKeyword.trim();
                    const normalizedKey = keyword.toLowerCase();

                    if (!codexMap.has(normalizedKey)) {
                        codexMap.set(normalizedKey, {
                            keyword: keyword, // Keep the first casing we find as display
                            type: note.type || 'General',
                            count: 0,
                            songs: []
                        });
                    }

                    const entry = codexMap.get(normalizedKey)!;
                    entry.count++;

                    // Avoid duplicate song entries for the same term in the same song?
                    // Or maybe we want to show every occurrence.
                    // Let's show unique songs per term for now to keep it clean.
                    const songExists = entry.songs.find(s => s.id === song.id);
                    if (!songExists) {
                        entry.songs.push({
                            id: song.id,
                            title: song.title,
                            slug: song.slug,
                            context: line.original
                        });
                    }
                });
            }
        });
    });

    // Convert map to array and sort by count (descending) then alphabetical
    return Array.from(codexMap.values()).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.keyword.localeCompare(b.keyword);
    });
}
