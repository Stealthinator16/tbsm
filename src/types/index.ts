export interface Annotation {
  text?: string;
  keyword?: string;
  word?: string;
  meaning?: string;
  type: string;
}

export interface LyricLine {
  original: string;
  translation?: string;
  explanation?: string;
  annotations?: (Annotation | string)[];
  speaker?: string;
}

export interface Song {
  id: string;
  title: string;
  slug: string;
  album?: string;
  releaseDate?: string;
  summary?: string;
  type?: string;
  vibe?: string;
  lyrics: LyricLine[];
  credits?: {
    producedBy?: string[];
    writtenBy?: string[];
  };
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  releaseYear: number;
  coverArt: string;
  songs: string[]; // Array of song IDs
}
