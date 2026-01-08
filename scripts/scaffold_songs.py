import os
import json
import lyricsgenius
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()

token = os.environ.get("GENIUS_ACCESS_TOKEN")
genius = lyricsgenius.Genius(token)
genius.verbose = False

def slugify(text):
    return text.lower().replace(" ", "-").replace("/", "-").replace("(", "").replace(")", "").replace("'", "").replace('"', "").strip("-")

def scaffold():
    # Album list we verified earlier
    album_names = [
        "DL91 FM", "Kshama", "SHAKTI", "Lunch Break", 
        "Nayaab", "‘न’ (Mixtape)", "Bayaan", "2 Ka Pahada - EP"
    ]

    all_song_ids = []
    
    for alb_name in album_names:
        print(f"🔍 Searching for album: {alb_name}...")
        album = genius.search_album(alb_name, "Seedhe Maut")
        
        if not album:
            print(f"  ❌ Album not found: {alb_name}")
            continue

        print(f"  ✅ Found {len(album.tracks)} tracks.")
        
        for track_tuple in album.tracks:
            # track_tuple is (track_number, song_object)
            _, song_meta = track_tuple
            song_title = song_meta.title
            
            song_slug = slugify(song_title)
            song_id = song_slug.replace("-", "_")
            if song_id and song_id[0].isdigit(): song_id = "_" + song_id
            
            path = f"src/data/{song_id}.ts"
            if os.path.exists(path):
                all_song_ids.append(song_id)
                continue
            
            # Create skeleton
            song_data = {
                "id": song_id,
                "title": song_title,
                "slug": song_slug,
                "album": alb_name,
                "lyrics": [{"original": "Lyrics pending ingestion..."}]
            }
            
            with open(path, "w", encoding="utf-8") as f:
                f.write("import { Song } from '../types';\n\n")
                f.write(f"export const {song_id}: Song = {json.dumps(song_data, indent=2, ensure_ascii=False)};\n")
            
            all_song_ids.append(song_id)

    # Rebuild index.ts
    print(f"Rebuilding index with {len(all_song_ids)} songs...")
    unique_ids = sorted(list(set(all_song_ids)))
    
    with open("src/data/index.ts", "w", encoding="utf-8") as f:
        f.write("import { Song } from '../types';\n")
        for sid in unique_ids:
            f.write(f"import {{ {sid} }} from './{sid}';\n")
        f.write("\nexport const allSongs: Song[] = [\n")
        for sid in unique_ids:
            f.write(f"  {sid},\n")
        f.write("];\n\nexport function getSongBySlug(slug: string): Song | undefined { return allSongs.find(s => s.slug === slug); }\n")

if __name__ == "__main__":
    scaffold()
