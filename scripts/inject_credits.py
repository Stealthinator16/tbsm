
import os
import re
import json

# Mapping of Album/Song to Producers
PRODUCER_MAP = {
    "Bayaan": ["Sez on the Beat"],
    "Nayaab": ["Sez on the Beat"], # Default for Nayaab
    "Lunch Break": ["Calm"], # Default for Lunch Break
    "Songs": {
        "nanchaku": ["KSHMR"],
        "namastute": ["Sez on the Beat"],
        "shaktimaan": ["Sez on the Beat"],
        "101": ["Sez on the Beat"],
        "seedhe-maut-anthem": ["Sez on the Beat"],
        "khatta-flow": ["Calm", "Toh Pata Nahi"], # Checking facts... usually Calm produces these
        "kohra": ["Calm"],
        "nalla-freestyle": ["Calm"],
        "fanne-khan": ["Calm"],
        "focused-sedated": ["Calm"],
        "red": ["Calm"],
        "hosh-mei-aa": ["Lambodrive"],
        "hausla": ["Calm"],
        "kavi": ["Calm"],
        "joint-in-the-booth": ["Calm"]
    }
}

# Explicit overrides for tracks in albums that might differ
OVERRIDES = {
    # Nayaab exceptions if any (mostly Sez)
    "anaadi": ["Sez on the Beat"],
    
    # Lunch Break exceptions (Collaborations)
    "swah": ["Calm"],
    "champion": ["Calm"],
    "peace-of-mind": ["Calm"],
    "gandi-aulaad": ["Calm"],
    "chalta-reh": ["Calm"],
    "lukka-chippi": ["Calm"],
    "brand-new": ["Calm"],
    "kehna-chahte-hain": ["Calm"],
    "kya-challa": ["Calm"],
    "jua": ["Calm"]
}

def inject_credits(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract Song JSON
        match = re.search(r'export const \w+: Song = ({[\s\S]*});', content)
        if not match:
            # Try without semicolon
            match = re.search(r'export const \w+: Song = ({[\s\S]*})', content)
            
        if not match:
            print(f"Skipping {file_path}: Could not parse JSON structure")
            return

        json_str = match.group(1)
        # Clean trailing commas for valid JSON
        json_str_clean = re.sub(r',\s*([\]}])', r'\1', json_str)
        
        try:
            data = json.loads(json_str_clean)
        except:
             # If strict JSON fails, try manual regex extraction for properties to avoid rewriting whole file if possible?
             # No, better to regex replace the credits part or insert it.
             pass
        
        # Let's use string manipulation to insert credits to avoid JSON formatting issues breaking the TS file
        # We need to determine the producer first
        slug = ""
        album = ""
        
        slug_match = re.search(r'"slug": "(.*?)",', content)
        if slug_match:
            slug = slug_match.group(1)
            
        album_match = re.search(r'"album": "(.*?)",', content)
        if album_match:
            album = album_match.group(1)
            
        producers = []
        
        # 1. Check Specific Song Overrides/Map
        if slug in PRODUCER_MAP["Songs"]:
            producers = PRODUCER_MAP["Songs"][slug]
        elif slug in OVERRIDES:
            producers = OVERRIDES[slug]
        # 2. Check Album Defaults
        elif album in PRODUCER_MAP:
             producers = PRODUCER_MAP[album]
        # 3. Default fallback for others?
        else:
            # If no info, maybe skip or set "Unknown"
            # Let's try to assume Calm for singles post-2022 if unsure, or just skip
            pass

        if not producers:
            print(f"Skipping {slug}: No producer info found.")
            return

        # Check if credits already exist
        if '"credits":' in content:
            # If exists, we might want to update it, but parsing is hard. 
            # Let's assume if it exists we check if it has producers.
            print(f"Skipping {slug}: Credits already exist.")
            return

        print(f"Updating {slug} with producers: {producers}")
        
        # Insert credits before "lyrics": [
        credits_json = f',\n  "credits": {{\n    "producedBy": {json.dumps(producers)}\n  }}'
        
        # We look for the line before lyrics key, usually "vibe" or "type" or "summary" or just "album"
        # Safest bet: find "lyrics": [ and insert before it
        
        new_content = content.replace('"lyrics": [', f'"credits": {{\n    "producedBy": {json.dumps(producers)}\n  }},\n  "lyrics": [')
        
        if new_content == content:
            print("  Failed to replace content.")
            return
            
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("  Saved.")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    import glob
    files = glob.glob("src/data/*.ts")
    print(f"Found {len(files)} files.")
    for f in files:
        if "index.ts" in f or "albums.ts" in f or "timeline.ts" in f: 
            continue
        inject_credits(f)
