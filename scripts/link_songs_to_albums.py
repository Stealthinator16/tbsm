import os
import json
import re
import glob

def link_songs():
    print("Linking songs to albums...")
    
    # 1. Read all song files to build a map of Album Name -> [Song IDs]
    song_files = glob.glob("src/data/*.ts")
    album_to_songs = {}
    
    for file_path in song_files:
        filename = os.path.basename(file_path)
        if filename in ["index.ts", "albums.ts"]:
            continue
        
        with open(file_path, "r") as f:
            content = f.read()
            
            # Extract Album Name
            # Looking for: "album": "Album Name"
            album_match = re.search(r'"album":\s*"(.*?)",', content)
            if not album_match:
                 # Try single quotes
                 album_match = re.search(r'\'album\':\s*\'(.*?)\'', content)
            
            # Extract ID
            id_match = re.search(r'"id":\s*"(.*?)",', content)
            if not id_match:
                id_match = re.search(r'\'id\':\s*\'(.*?)\'', content)
                
            if album_match and id_match:
                album_name = album_match.group(1)
                song_id = id_match.group(1)
                
                if album_name not in album_to_songs:
                    album_to_songs[album_name] = []
                
                album_to_songs[album_name].append(song_id)

    # 2. Update albums.ts
    with open("src/data/albums.ts", "r") as f:
        content = f.read()
        
    # We know the format is:
    # import ...
    #
    # export const albums: Album[] = [ ... ];
    
    prefix = "export const albums: Album[] = "
    suffix = ";\n"
    
    start_idx = content.find(prefix)
    if start_idx == -1:
        print("Could not find start of array")
        return
        
    start_idx += len(prefix)
    # Find the last semicolon
    end_idx = content.rfind(";")
    
    if end_idx == -1:
        print("Could not find end of array")
        return
        
    json_str = content[start_idx:end_idx].strip()
    
    try:
        albums = json.loads(json_str)
    except Exception as e:
        print(f"JSON Error: {e}")
        # print(json_str[:100])
        return

    # Update the songs list for each album
    total_linked = 0
    for album in albums:
        title = album['title']
        if title in album_to_songs:
            # Sort songs? Maybe not necessary, but good for consistency. 
            # Ideally we'd sort by track number but we don't have that easily handy right here
            # without parsing more. Let's just link them for now.
            album['songs'] = album_to_songs[title]
            total_linked += len(album['songs'])
            print(f"Linked {len(album['songs'])} songs to {title}")
        else:
            print(f"No songs found for {title}")

    # Write back
    with open("src/data/albums.ts", "w", encoding="utf-8") as f:
        f.write("import { Album } from '../types';\n\n")
        f.write("export const albums: Album[] = ")
        f.write(json.dumps(albums, indent=2, ensure_ascii=False))
        f.write(";\n")
        
    print(f"Successfully linked {total_linked} songs across {len(albums)} albums.")

if __name__ == "__main__":
    link_songs()
