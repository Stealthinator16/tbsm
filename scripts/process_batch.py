import os
import argparse
import json
import glob
from analyze_lyrics import analyze_song

def update_index_file(song_ids):
    index_path = "src/data/index.ts"
    
    # Read existing content
    if os.path.exists(index_path):
        with open(index_path, "r") as f:
            content = f.read()
    else:
        content = "import { Song } from '../types';\n\nexport const allSongs: Song[] = [];\n\nexport function getSongBySlug(slug: string): Song | undefined {\n  return allSongs.find(s => s.slug === slug);\n}\n"

    # Generate new imports and array entries
    imports = []
    array_entries = []
    
    for sid in song_ids:
        imports.append(f"import {{ {sid} }} from './{sid}';")
        array_entries.append(sid)
        
    # Reconstruct the file content
    # This is a bit naive (overwrites everything) but works for this scale
    new_content = ""
    
    # Add imports
    for imp in imports:
        if imp not in content:
            new_content += imp + "\n"
    
    # Keep existing imports that we didn't just add (if we want to be safe, but for now let's just rewrite)
    # Actually, safer approach: Just read the file, remove the allSongs array, and rewrite it.
    
    # Let's just create a clean slate of imports based on what files exist in src/data
    # This is safer than appending duplicate lines
    all_ts_files = glob.glob("src/data/*.ts")
    valid_ids = []
    
    final_content = "import { Song } from '../types';\n"
    
    for ts_file in all_ts_files:
        basename = os.path.basename(ts_file)
        if basename == "index.ts" or basename == "albums.ts":
            continue
            
        sid = basename.replace(".ts", "")
        valid_ids.append(sid)
        final_content += f"import {{ {sid} }} from './{sid}';\n"
        
    final_content += "\nexport const allSongs: Song[] = [\n"
    for sid in valid_ids:
        final_content += f"  {sid},\n"
    final_content += "];\n\n"
    
    final_content += "export function getSongBySlug(slug: string): Song | undefined {\n"
    final_content += "  return allSongs.find(s => s.slug === slug);\n"
    final_content += "}\n"
    
    with open(index_path, "w") as f:
        f.write(final_content)
    
    print(f"Updated {index_path} with {len(valid_ids)} songs.")

def process_batch(directory: str, album_name: str):
    print(f"Processing songs in {directory} for album '{album_name}'...")
    
    files = glob.glob(os.path.join(directory, "*.txt"))
    processed_ids = []
    
    for file_path in files:
        filename = os.path.basename(file_path)
        title = filename.replace(".txt", "").replace("_", " ").title()
        
        print(f"Analyzing {title}...")
        
        with open(file_path, "r") as f:
            lyrics = f.read()
            
        result = analyze_song(title, lyrics, album_name)
        
        if result:
            sid = result['id']
            output_path = f"src/data/{sid}.ts"
            
            with open(output_path, "w") as f:
                f.write("import { Song } from '../types';\n\n")
                f.write(f"export const {sid}: Song = ")
                f.write(json.dumps(result, indent=2))
                f.write(";\n")
                
            processed_ids.append(sid)
            print(f"Saved {sid}.ts")
            
    # Update index.ts
    update_index_file(processed_ids)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", required=True, help="Directory containing raw lyric text files")
    parser.add_argument("--album", required=True, help="Album name for context")
    args = parser.parse_args()
    
    process_batch(args.dir, args.album)
