
import os
import re
import json

# Vibe Mapping
VIBE_MAP = {
    "Aggressive": [
        "101", "namastute", "nanchaku", "shaktimaan", "khatta-flow", "champions", 
        "el-matador", "gandi-aulaad", "khoon", "kilas", "kranti", "maar-kaat", "toh-kya",
        "red", "seedhe-maut-anthem", "swah"
    ],
    "Introspective": [
        "focused-sedated", "maina", "kavi", "kohra", "pankh", "raat-ki-raani", 
        "rahat", "chidiya-udd", "hosh-mei-aa", "kyu", "gehraiyaan"
    ],
    "Chill": [
        "nalla-freestyle", "hausla", "hoshiyaar", "nazarbhattu-freestyle", 
        "joint-in-the-booth", "ice", "luck-chippi", "peace-of-mind", "brand-new",
        "do-guna", "kehna-chahte-hain", "no-enema"
    ],
    "Storytelling": [
        "bayaan", "meri-baggi", "pnp", "us-din", "rajdhani", "choti-soch",
        "dum-ghutte", "kya-challa", "asal-g"
    ]
}

def inject_vibe(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract Slug to match
        slug_match = re.search(r'"slug": "(.*?)",', content)
        if not slug_match:
            return
        slug = slug_match.group(1)
        
        # Determine Vibe
        vibe = None
        for category, slugs in VIBE_MAP.items():
            if slug in slugs:
                vibe = category
                break
        
        # Heuristic for Bayaan Era if not matched (mostly Storytelling/Introspective)
        if not vibe and '"album": "Bayaan"' in content:
            vibe = "Storytelling"

        if not vibe:
            print(f"Skipping {slug}: No vibe mapped.")
            return

        # Check if vibe already exists
        if '"vibe":' in content:
            # print(f"Skipping {slug}: Vibe already exists.")
            return

        print(f"Updating {slug} with vibe: {vibe}")
        
        # Insert vibe before "lyrics": [
        # Using string replacement to ensure we don't break TS export
        new_content = content.replace('"lyrics": [', f'"vibe": "{vibe}",\n  "lyrics": [')
        
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
        inject_vibe(f)
