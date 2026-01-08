import os
import json
import argparse
import lyricsgenius
import google.generativeai as genai
from tqdm import tqdm
from analyze_lyrics import analyze_song
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Initialize Genius
token = os.environ.get("GENIUS_ACCESS_TOKEN")
if not token:
    raise ValueError("GENIUS_ACCESS_TOKEN not set in environment variables")

genius = lyricsgenius.Genius(token)
genius.verbose = False
genius.remove_section_headers = False
genius.timeout = 30
genius.retries = 3

# Initialize Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

def slugify(text):
    return text.lower().replace(" ", "-").replace("/", "-").replace("(", "").replace(")", "").replace("'", "").replace('"', "").strip("-")

def ingest_discography(artist_name="Seedhe Maut", max_songs=None, skip_ai=False):
    print(f"🚀 Initializing Album-by-Album Ingest (Skip AI: {skip_ai})")

    processed_songs = []
    albums_map = {} 
    
    try:
        with open("src/data/albums.ts", "r") as f:
            content = f.read()
            import re
            match = re.search(r'export const albums: Album\[\] = (.*\]);', content, re.DOTALL)
            if match:
                existing_albums = json.loads(match.group(1))
                for alb in existing_albums:
                    albums_map[alb['slug']] = alb
                    albums_map[alb['slug']]['songs'] = []
    except Exception as e:
        print(f"⚠️ Could not load albums structure: {e}")
        return

    # Process each album
    for album_slug, album_info in albums_map.items():
        if album_slug == "singles-&-features": continue
        
        print(f"\n📂 Processing Album: {album_info['title']}...")
        try:
            album = genius.search_album(album_info['title'], artist_name)
            if not album:
                print(f"  ⚠️ Album not found on Genius.")
                continue
            
            for track_tuple in tqdm(album.tracks, desc=f"  Tracks in {album_info['title']}"):
                if max_songs and len(processed_songs) >= max_songs: break
                
                # album.tracks is a list of tuples (track_number, song_object)
                _, song_meta = track_tuple
                full_song = genius.search_song(song_meta.title, artist_name)
                if not full_song: continue

                title = full_song.title
                slug = slugify(title)
                safe_id = slug.replace("-", "_")
                if safe_id and safe_id[0].isdigit(): safe_id = "_" + safe_id
                
                release_date = getattr(full_song, 'release_date', "")
                producers = [p['name'] for p in full_song.producer_artists] if hasattr(full_song, 'producer_artists') else []

                if skip_ai:
                    lines = full_song.lyrics.split('\n')
                    lyrics_data = []
                    for line in lines:
                        line = line.strip()
                        if line and not line.startswith('[') and not line.endswith(']'):
                            lyrics_data.append({"original": line})
                    
                    final_data = {
                        "id": safe_id,
                        "title": title,
                        "slug": slug,
                        "album": album_info['title'],
                        "releaseDate": str(release_date),
                        "lyrics": lyrics_data,
                        "credits": {
                            "producedBy": producers,
                            "writtenBy": [artist_name]
                        }
                    }
                else:
                    ai_result = analyze_song(title, full_song.lyrics, album_info['title'])
                    if not ai_result: continue
                    final_data = {
                        **ai_result,
                        "id": safe_id,
                        "title": title,
                        "slug": slug,
                        "album": album_info['title'],
                        "releaseDate": str(release_date),
                        "credits": { "producedBy": producers, "writtenBy": [artist_name] }
                    }

                with open(f"src/data/{safe_id}.ts", "w") as f:
                    f.write("import { Song } from '../types';\n\n")
                    f.write(f"export const {safe_id}: Song = ")
                    f.write(json.dumps(final_data, indent=2))
                    f.write(";\n")

                processed_songs.append(safe_id)
                album_info['songs'].append(safe_id)
            
            if max_songs and len(processed_songs) >= max_songs: break

        except Exception as e:
            print(f"  ❌ Error processing album {album_info['title']}: {e}")

    # Final Rebuild
    print("\n📦 Finalizing Database...")
    with open("src/data/albums.ts", "w") as f:
        f.write("import { Album } from '../types';\n\n")
        f.write(f"export const albums: Album[] = {json.dumps(list(albums_map.values()), indent=2)};\n")

    with open("src/data/index.ts", "w") as f:
        f.write("import { Song } from '../types';\n")
        for sid in processed_songs:
            f.write(f"import {{ {sid} }} from './{sid}';\n")
        f.write("\nexport const allSongs: Song[] = [\n")
        for sid in processed_songs:
            f.write(f"  {sid},\n")
        f.write("];\n\nexport function getSongBySlug(slug: string): Song | undefined { return allSongs.find(s => s.slug === slug); }\n")
    
    print(f"✨ SUCCESS! Ingested {len(processed_songs)} songs.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max", type=int, help="Limit number of songs")
    parser.add_argument("--no-ai", action="store_true")
    args = parser.parse_args()
    ingest_discography(max_songs=args.max, skip_ai=args.no_ai)
