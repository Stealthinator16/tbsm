import os
import glob
import re
import json
import lyricsgenius
from analyze_lyrics import analyze_song
from dotenv import load_dotenv

load_dotenv()

def get_genius_client():
    token = os.environ.get("GENIUS_ACCESS_TOKEN")
    if not token:
        print("⚠️ GENIUS_ACCESS_TOKEN not set. Skipping Genius fetch.")
        return None
    genius = lyricsgenius.Genius(token)
    genius.verbose = False
    return genius

import time

def ingest_missing():
    print("🚀 Starting ingestion for missing lyrics...")
    
    genius = get_genius_client()
    if not genius:
        return

    # Find files with pending lyrics
    files = glob.glob("src/data/*.ts")
    pending_files = []

    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "Lyrics pending ingestion..." in content:
                pending_files.append(file_path)

    print(f"Found {len(pending_files)} files with pending lyrics.")

    for file_path in pending_files:
        try:
            # Extract metadata from existing file
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            title_match = re.search(r'"title": "(.*?)",', content)
            album_match = re.search(r'"album": "(.*?)",', content)
            
            if not title_match:
                print(f"⚠️ Could not parse title from {file_path}")
                continue
                
            title = title_match.group(1)
            album = album_match.group(1) if album_match else ""
            
            print(f"\nProcessing: {title} (Album: {album})")
            
            # Fetch from Genius
            song = genius.search_song(title, "Seedhe Maut")
            if not song:
                # Try with album name if strictly title fails? Or maybe loose search?
                # For now, strict title search is safer to avoid wrong songs.
                print(f"  ❌ Song not found on Genius: {title}")
                continue
                
            print(f"  ✅ Found on Genius. Fetching lyrics...")
            
            # Skip AI Analysis and use raw lyrics
            # Note: analyze_song returned a specific structure. We need to mimic that.
            
            # Simple line splitting for lyrics
            raw_lyrics = song.lyrics
            lines = raw_lyrics.split('\n')
            lyrics_data = []
            for line in lines:
                line = line.strip()
                if line and not line.startswith('[') and not line.endswith(']'):
                    lyrics_data.append({
                        "original": line,
                        "translation": "",
                        "explanation": "",
                        "annotations": []
                    })
            
            # Construct the result object manually
            result = {
                "id": var_name if 'var_name' in locals() else os.path.basename(file_path).replace(".ts", ""),
                "title": title,
                "slug": title.lower().replace(" ", "-").replace("(", "").replace(")", "").replace("'", "").replace('"', "").strip("-"),
                "album": album,
                "releaseDate": getattr(song, 'release_date', ""),
                "lyrics": lyrics_data,
                "credits": {
                    "producedBy": [p['name'] for p in song.producer_artists] if hasattr(song, 'producer_artists') else [],
                    "writtenBy": ["Seedhe Maut"]
                }
            }

            # We need to preserve the filename's variable name
            # The file structure is: export const variable_name: Song = { ... }
            # Let's extract the variable name from the original file
            var_name_match = re.search(r'export const (.*?): Song =', content)
            var_name = var_name_match.group(1) if var_name_match else os.path.basename(file_path).replace(".ts", "")
            
            # Ensure ID matches variable name for consistency
            result["id"] = var_name
            
            # Write back to file
            with open(file_path, "w", encoding="utf-8") as f:
                f.write("import { Song } from '../types';\n\n")
                f.write(f"export const {var_name}: Song = ")
                f.write(json.dumps(result, indent=2))
                f.write(";\n")
                
            print(f"  💾 Saved updated {file_path}")
            
            # Reduced sleep as we are not hitting Gemini API
            time.sleep(1)
            
        except Exception as e:
            print(f"  ❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    ingest_missing()
