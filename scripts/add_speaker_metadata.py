import os
import glob
import re
import json
import lyricsgenius
import time
from dotenv import load_dotenv

load_dotenv()

def get_genius_client():
    token = os.environ.get("GENIUS_ACCESS_TOKEN")
    if not token:
        print("⚠️ GENIUS_ACCESS_TOKEN not set.")
        return None
    genius = lyricsgenius.Genius(token)
    genius.verbose = False
    # IMPORTANT: We want section headers this time to parse speakers!
    genius.remove_section_headers = False 
    return genius

def parse_lyrics_with_speakers(raw_lyrics):
    """
    Parses Genius lyrics into a list of objects with 'original' text and 'speaker'.
    """
    # Remove standard Genius "Lyrics" prefix if it exists
    lines = raw_lyrics.split('\n')
    parsed_data = []
    current_speaker = "Seedhe Maut" # Default
    
    # Robust regex for headers like [Verse 1: Calm] or [Chorus]
    header_regex = re.compile(r'^\s*\[(.*?)(?:\:\s*(.*?))?\]\s*$')

    for line in lines:
        clean_line = line.strip()
        if not clean_line:
            continue

        # Skip the "123 Lyrics" line that Genius sometimes adds at the top
        if clean_line.endswith(" Lyrics") and len(parsed_data) == 0:
            continue

        # Check if it's a header
        match = header_regex.match(clean_line)
        if match:
            tag_type = match.group(1).strip()
            speaker_part = match.group(2).strip() if match.group(2) else None

            if speaker_part:
                current_speaker = speaker_part
            else:
                # Fallback: Check if the tag_type itself contains artist name
                lower_tag = tag_type.lower()
                if "calm" in lower_tag:
                    current_speaker = "Calm"
                elif "encore" in lower_tag or "abj" in lower_tag:
                    current_speaker = "Encore ABJ"
                elif "chorus" in lower_tag or "hook" in lower_tag:
                    current_speaker = "Chorus"
            continue # DO NOT add the header line itself to lyrics
        
        # Clean up Genius-specific "Embed" tag at the end of the last line
        if clean_line.endswith("Embed"):
            clean_line = re.sub(r'\d*Embed$', '', clean_line).strip()

        if clean_line:
            parsed_data.append({
                "original": clean_line,
                "speaker": current_speaker
            })
            
    return parsed_data

def process_files():
    genius = get_genius_client()
    if not genius: return

    files = glob.glob("src/data/*.ts")
    files = [f for f in files if "index.ts" not in f and "albums.ts" not in f]
    
    print(f"Found {len(files)} song files to update.")
    
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            title_match = re.search(r'"title": "(.*?)",', content)
            if not title_match: continue
            title = title_match.group(1)
            
            if "(skit)" in title.lower(): continue

            print(f"Processing: {title}...")
            song = genius.search_song(title, "Seedhe Maut")
            if not song:
                print(f"  ⚠️ Not found on Genius.")
                continue
                
            new_lyrics_data = parse_lyrics_with_speakers(song.lyrics)
            
            json_start = content.find("= {") + 2
            json_end = content.rfind(";")
            
            if json_start == 1 or json_end == -1:
                print("  ❌ Could not parse file structure.")
                continue
                
            current_json_str = content[json_start:json_end]
            try:
                data = json.loads(current_json_str)
            except:
                print("  ❌ JSON decode error.")
                continue

            updated_lyrics = []
            for line_obj in new_lyrics_data:
                updated_lyrics.append({
                    "original": line_obj['original'],
                    "speaker": line_obj['speaker'],
                    "translation": "",
                    "explanation": "",
                    "annotations": []
                })
            
            data['lyrics'] = updated_lyrics
            
            var_name_match = re.search(r'export const (.*?): Song =', content)
            var_name = var_name_match.group(1)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write("import { Song } from '../types';\n\n")
                f.write(f"export const {var_name}: Song = ")
                f.write(json.dumps(data, indent=2))
                f.write(";\n")
                
            print(f"  ✅ Updated speakers for {title}")
            time.sleep(0.5)

        except Exception as e:
            print(f"  ❌ Error: {e}")

if __name__ == "__main__":
    process_files()