
import { allSongs } from '../data';
import { Song, Annotation } from '../types';

export interface CodexEntry {
    keyword: string;
    type: string;
    count: number;
    meaning?: string;
    aliases: string[];
    // A map of song IDs to the specific line/context if needed, but for now just a list of songs
    songs: {
        id: string;
        title: string;
        slug: string;
        context: string; // The line where it appears
    }[];
}

const ALIAS_MAP: Record<string, string> = {
    'बन्दी': 'Bandi',
    'बन्दी (bandi)': 'Bandi',
    'girl': 'Bandi',
    'girlfriend': 'Bandi',
    'paisa nasha pyaar': 'PNP',
    'tehalka bhai seedhe maut': 'TBSM',
    'tbsm': 'TBSM',
    'encore': 'Encore ABJ',
    'encore abj': 'Encore ABJ',
    'calm': 'Calm',
    'siddhant': 'Calm',
    'sez': 'Sez on the Beat',
    'sez on the beat': 'Sez on the Beat',
    'nanchaku': 'Nanchaku',
    'shaktimaan': 'Shaktimaan',
};

export function getAllAnnotations(): CodexEntry[] {
    const codexMap = new Map<string, CodexEntry>();

    allSongs.forEach((song) => {
        song.lyrics.forEach((line) => {
            if (line.annotations && line.annotations.length > 0) {
                line.annotations.forEach((note: any) => {
                    const rawKeyword = note.keyword || note.text;
                    if (!rawKeyword) return;

                    const keyword = rawKeyword.trim();
                    const normalizedKey = keyword.toLowerCase();

                    // Alias redirection
                    const primaryKeyword = ALIAS_MAP[normalizedKey] || keyword;
                    const primaryNormalized = primaryKeyword.toLowerCase();

                    if (!codexMap.has(primaryNormalized)) {
                        codexMap.set(primaryNormalized, {
                            keyword: primaryKeyword,
                            type: note.type || 'General',
                            meaning: note.meaning,
                            count: 0,
                            aliases: [],
                            songs: []
                        });
                    }

                    const entry = codexMap.get(primaryNormalized)!;
                    entry.count++;

                    if (!entry.meaning && note.meaning) {
                        entry.meaning = note.meaning;
                    }

                    // Add unique alias if it's different from primary
                    if (keyword !== primaryKeyword && !entry.aliases.includes(keyword)) {
                        entry.aliases.push(keyword);
                    }

                    // Add song entry
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

    // Convert map to array and sort by count (descending)
    return Array.from(codexMap.values()).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.keyword.localeCompare(b.keyword);
    });
}
