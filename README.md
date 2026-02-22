# TBSM - The Seedhe Maut Archive

**Live at [tbsmx.vercel.app](https://tbsmx.vercel.app/)**

The complete Seedhe Maut discography with AI-powered line-by-line translations, cultural annotations, and lyrical analysis. Built for fans who want to understand every bar.

## What is this?

[Seedhe Maut](https://en.wikipedia.org/wiki/Seedhe_Maut) is a hip-hop duo from New Delhi, India, consisting of **Calm** and **Encore ABJ**. Their music is primarily in Hindi/Hinglish with dense wordplay, cultural references, slang, and code-switching between Hindi and English.

TBSM breaks down their entire catalogue - **154 songs** across **7 albums** and singles - with:

- **English translations** for every lyric line
- **Contextual explanations** breaking down meaning, wordplay, and references
- **Annotations** for Delhi slang, cultural references, mythological allusions, and Indian hip-hop scene context
- **Speaker identification** (Calm, Encore ABJ, Chorus, guest features)
- **Song summaries** and **vibe classifications**

## Features

### Song Pages
Every song gets a dedicated page with lyrics displayed line-by-line. Tap any line to see its translation, explanation, and annotations. Lyrics are color-coded by speaker.

### The Codex
A searchable dictionary of terms, slang, and cultural references extracted from across the discography. Search for any keyword to find its meaning and which songs it appears in.

### Vibe Matcher
Browse songs by mood - **Aggressive**, **Chill**, **Introspective**, **Storytelling**, **Hype**, or **Dark**. Each vibe category shows matching songs with a unique visual style.

### The Journey
A timeline of Seedhe Maut's career from 2015 to the present, covering releases, milestones, and key moments.

### Producers
A ranked list of all producers who've worked with Seedhe Maut, with track counts and credits.

### Album Pages
Browse the full discography organized by album with cover art, tracklists, and release info.

### Global Search
`Cmd+K` / `Ctrl+K` to search across all songs, albums, and codex entries.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static generation)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Testing**: Vitest + React Testing Library
- **Fonts**: Geist Sans, Geist Mono, Oswald

## Project Structure

```
src/
  app/
    page.tsx              # Home - album grid with global stats
    song/[slug]/          # Individual song pages
    album/[slug]/         # Album detail pages
    codex/                # Searchable slang/reference dictionary
    vibes/                # Mood-based song browser
    journey/              # Career timeline
    producers/            # Producer credits & rankings
  components/
    SongDisplay.tsx       # Main lyrics renderer with line selection
    AlbumSection.tsx      # Album card with tracklist
    SearchOverlay.tsx     # Global Cmd+K search
    GlobalStats.tsx       # Discography-wide statistics
    SongStats.tsx         # Per-song statistics
    MobileDrawer.tsx      # Mobile-friendly UI drawer
  data/
    index.ts              # Aggregates all song exports
    albums.ts             # Album metadata and tracklists
    timeline.ts           # Career timeline events
    *.ts                  # Individual song data (154 files)
  types/
    index.ts              # Song, Album, LyricLine, Annotation interfaces
  utils/
    codex.ts              # Term extraction and alias mapping
    vibes.ts              # Vibe filtering and statistics
    colors.ts             # Speaker color assignments
    analytics.ts          # Event tracking helpers
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npx vitest
```

Open [http://localhost:3000](http://localhost:3000) to browse the archive.

## Data Format

Each song follows the `Song` interface:

```typescript
interface Song {
  id: string;
  title: string;
  slug: string;
  album?: string;
  releaseDate?: string;
  summary?: string;
  vibe?: "Aggressive" | "Chill" | "Introspective" | "Storytelling" | "Hype" | "Dark";
  lyrics: LyricLine[];
  credits?: {
    producedBy?: string[];
    writtenBy?: string[];
  };
}

interface LyricLine {
  original: string;       // Original Hindi/Hinglish lyric
  translation?: string;   // English translation
  explanation?: string;   // Contextual meaning (1-2 sentences)
  annotations?: Annotation[];  // Notable terms and references
  speaker?: string;       // Who is rapping this line
}

interface Annotation {
  keyword?: string;       // The term being annotated
  type: string;          // Category: slang, cultural, wordplay, etc.
  meaning?: string;      // Explanation of the term
}
```

## Adding New Songs

1. Create a new file in `src/data/` following the `Song` interface
2. Export it from `src/data/index.ts`
3. Add its ID to the appropriate album in `src/data/albums.ts`
4. Optionally run the hydration script for automated lyrics + analysis:
   ```bash
   python scripts/hydrate_new_songs.py
   ```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic deployments.

## License

MIT License. See [LICENSE](LICENSE) for details.

Lyrics are the intellectual property of Seedhe Maut and their respective labels. This project is for educational and fan purposes.
