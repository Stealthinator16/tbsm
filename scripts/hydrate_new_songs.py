"""
Hydrate the 30 new skeleton song files with lyrics from Genius + AI analysis from Gemini.

Usage:
  source .venv/bin/activate
  python scripts/hydrate_new_songs.py
  python scripts/hydrate_new_songs.py --no-ai        # Lyrics + speakers only, skip Gemini
  python scripts/hydrate_new_songs.py --max 5         # Process only first 5 songs
"""
import os
import re
import json
import time
import argparse
import lyricsgenius
import google.generativeai as genai
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()

# --- Config ---
token = os.environ.get("GENIUS_ACCESS_TOKEN")
if not token:
    raise ValueError("GENIUS_ACCESS_TOKEN not set in .env")

genius = lyricsgenius.Genius(token)
genius.verbose = False
genius.remove_section_headers = False
genius.timeout = 30
genius.retries = 3

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# The 30 new song files (id -> search query overrides where title won't match Genius)
NEW_SONGS = {
    "tofa": None,
    "saans_le": "Saans Le",
    "mmm": "MMM",
    "yaad": "Yaad",
    "do_guna": "Do Guna",
    "ball": "Ball",
    "dum_pishaach": "Dum Pishaach",
    "bure_din": "Bure Din",
    "kaanch_ke_ghar": "Kaanch Ke Ghar",
    "srk": "SRK",
    "namuna": "NAMUNA",
    "tt": "TT",
    "shutdown": "SHUTDOWN",
    "fire_in_the_booth": "Fire in the Booth",
    "tour_shit": "Tour Shit",
    "mudda": "MUDDA",
    "sensitive": "Sensitive",
    "jama_kar": "Jama Kar",
    "scalp_dem": "Scalp Dem",
    "chalo_chalein": "Chalo Chalein",
    "roshni": "Roshni",
    "class_sikh_maut_vol_2": "Class-Sikh Maut Vol. II",
    "hola_amigo": "Hola Amigo",
    "bhussi": "Bhussi",
    "holi_re_rasiya": "Holi Re Rasiya",
    "kodak": "KODAK",
    "bajenge": "Bajenge",
    "mehenga": "Mehenga",
    "sanki": "Sanki",
    "nevermind": "Nevermind",
    "seedhe_maut_interlude": "Seedhe Maut Interlude",
}

# --- Speaker parsing (from add_speaker_metadata.py) ---
HEADER_RE = re.compile(r'^\s*\[(.*?)(?:\:\s*(.*?))?\]\s*$')

def parse_lyrics_with_speakers(raw_lyrics):
    lines = raw_lyrics.split('\n')
    parsed = []
    current_speaker = "Seedhe Maut"

    for line in lines:
        clean = line.strip()
        if not clean:
            continue
        if clean.endswith(" Lyrics") and len(parsed) == 0:
            continue

        match = HEADER_RE.match(clean)
        if match:
            tag = match.group(1).strip()
            speaker = match.group(2).strip() if match.group(2) else None
            if speaker:
                current_speaker = speaker
            else:
                lower = tag.lower()
                if "calm" in lower:
                    current_speaker = "Calm"
                elif "encore" in lower or "abj" in lower:
                    current_speaker = "Encore ABJ"
                elif "chorus" in lower or "hook" in lower:
                    current_speaker = "Chorus"
            continue

        if clean.endswith("Embed"):
            clean = re.sub(r'\d*Embed$', '', clean).strip()
        if clean:
            parsed.append({"original": clean, "speaker": current_speaker})

    return parsed

# --- AI analysis (from analyze_lyrics.py) ---
PROMPT = """You are an expert in Indian Hip Hop, specifically the Delhi scene and the duo Seedhe Maut.
Analyze the following lyrics and provide a line-by-line breakdown.

Song: {title}
Album: {album}
Lyrics:
{lyrics}

For EACH line, provide:
1. "original" - the exact original line
2. "speaker" - who is rapping (Calm, Encore ABJ, Chorus, or guest artist name)
3. "translation" - clear English translation capturing the vibe
4. "explanation" - brief context/meaning (1-2 sentences)
5. "annotations" - array of objects with "keyword", "type", "meaning" for slang, cultural refs, wordplay

Also provide:
- "summary" - 2-3 sentence song overview
- "vibe" - one of: Aggressive, Chill, Introspective, Storytelling, Hype, Dark

Output valid JSON:
{{
  "lyrics": [ ... ],
  "summary": "...",
  "vibe": "..."
}}
"""

def analyze_with_gemini(title, raw_lyrics, album):
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = PROMPT.format(title=title, album=album, lyrics=raw_lyrics)

    try:
        response = model.generate_content(prompt)
        content = response.text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"  ❌ Gemini error for {title}: {e}")
        return None


def load_song_file(song_id):
    path = f"src/data/{song_id}.ts"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    json_start = content.find("= {") + 2
    json_end = content.rfind(";")
    data = json.loads(content[json_start:json_end])
    return data


def save_song_file(song_id, data):
    path = f"src/data/{song_id}.ts"
    with open(path, "w", encoding="utf-8") as f:
        f.write("import { Song } from '../types';\n\n")
        f.write(f"export const {song_id}: Song = ")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write(";\n")


def hydrate(skip_ai=False, max_songs=None):
    songs_to_process = list(NEW_SONGS.items())
    if max_songs:
        songs_to_process = songs_to_process[:max_songs]

    success = 0
    skipped = 0
    failed = 0

    for song_id, search_override in tqdm(songs_to_process, desc="Hydrating songs"):
        try:
            data = load_song_file(song_id)
            title = data.get("title", search_override or song_id)
            album = data.get("album", "")
            search_query = search_override or title

            # Skip if already has lyrics
            if data.get("lyrics") and len(data["lyrics"]) > 0:
                first = data["lyrics"][0].get("original", "")
                if first and first != "Lyrics pending ingestion..." and "coming soon" not in first.lower():
                    print(f"  ⏭️  {title} already has lyrics, skipping.")
                    skipped += 1
                    continue

            # Search Genius
            print(f"\n🔍 Searching Genius for: {search_query}...")
            song = genius.search_song(search_query, "Seedhe Maut")

            if not song:
                # Try without artist for collabs
                song = genius.search_song(search_query)

            if not song:
                print(f"  ⚠️  Not found on Genius: {search_query}")
                failed += 1
                continue

            raw_lyrics = song.lyrics
            print(f"  ✅ Found: {song.title} ({len(raw_lyrics)} chars)")

            # Get producer credits from Genius if available
            producers = []
            if hasattr(song, 'producer_artists') and song.producer_artists:
                producers = [p['name'] for p in song.producer_artists]

            if skip_ai:
                # Parse lyrics with speakers only
                parsed = parse_lyrics_with_speakers(raw_lyrics)
                lyrics_data = []
                for line in parsed:
                    lyrics_data.append({
                        "original": line["original"],
                        "speaker": line["speaker"],
                        "translation": "",
                        "explanation": "",
                        "annotations": []
                    })
                data["lyrics"] = lyrics_data
            else:
                # Full AI analysis
                print(f"  🤖 Running Gemini analysis...")
                ai_result = analyze_with_gemini(title, raw_lyrics, album)

                if ai_result:
                    data["lyrics"] = ai_result.get("lyrics", [])
                    if ai_result.get("summary"):
                        data["summary"] = ai_result["summary"]
                    if ai_result.get("vibe"):
                        data["vibe"] = ai_result["vibe"]
                else:
                    # Fallback to speaker-only parsing
                    print(f"  ⚠️  AI failed, falling back to speaker parsing...")
                    parsed = parse_lyrics_with_speakers(raw_lyrics)
                    data["lyrics"] = [
                        {"original": l["original"], "speaker": l["speaker"],
                         "translation": "", "explanation": "", "annotations": []}
                        for l in parsed
                    ]

            # Update credits if Genius had producer info
            if producers and not data.get("credits", {}).get("producedBy"):
                if "credits" not in data:
                    data["credits"] = {}
                data["credits"]["producedBy"] = producers

            save_song_file(song_id, data)
            success += 1
            print(f"  💾 Saved: {song_id}.ts")

            time.sleep(1)  # Rate limit

        except Exception as e:
            print(f"  ❌ Error processing {song_id}: {e}")
            failed += 1

    print(f"\n{'='*50}")
    print(f"✨ Done! Success: {success}, Skipped: {skipped}, Failed: {failed}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hydrate new song files with Genius lyrics + Gemini AI analysis")
    parser.add_argument("--no-ai", action="store_true", help="Skip Gemini AI, just fetch lyrics + speakers")
    parser.add_argument("--max", type=int, help="Limit number of songs to process")
    args = parser.parse_args()

    hydrate(skip_ai=args.no_ai, max_songs=args.max)
