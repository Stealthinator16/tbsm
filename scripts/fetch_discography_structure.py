import os
import json
import lyricsgenius
from dotenv import load_dotenv

load_dotenv()

token = os.environ.get("GENIUS_ACCESS_TOKEN")
genius = lyricsgenius.Genius(token)
genius.verbose = True 

def fetch_structure():
    print("Fetching Seedhe Maut Albums...")
    artist = genius.search_artist("Seedhe Maut", max_songs=0, include_features=False)
    
    # Genius API doesn't have a direct "get all albums" endpoint in the wrapper easily,
    # so we often have to iterate songs or use the artist ID to get albums.
    # Let's use the artist ID to fetch albums specifically.
    
    # Check if artist.id exists directly or inside ._body
    artist_id = getattr(artist, 'id', None)
    if not artist_id and hasattr(artist, '_body'):
        artist_id = artist._body.get('id')
    
    if not artist_id:
        print("Could not find Artist ID")
        return

    print(f"Artist ID: {artist_id}")
    
    # Fetch albums (pages)
    albums_list = []
    page = 1
    while page:
        print(f"Fetching page {page} of albums...")
        response = genius.artist_albums(artist_id, page=page)
        if 'albums' in response and response['albums']:
            albums_list.extend(response['albums'])
            page = response['next_page']
        else:
            break
            
    print(f"Found {len(albums_list)} releases.")
    
    # Process and Clean
    clean_albums = []
    seen_names = set()
    
    for album_data in albums_list:
        name = album_data['name']
        if name in seen_names: continue
        seen_names.add(name)
        
        print(f"Fetching tracklist for {name}...")
        # Fetch full album details to get tracks
        full_album = genius.album(album_data['id'])
        
        album_slug = name.lower().replace(" ", "-").replace("(", "").replace(")", "").strip("-")
        
        songs = []
        if 'tracks' in full_album:
            for track_tuple in full_album['tracks']:
                # track_tuple is (track_number, song_dict)
                song_meta = track_tuple['song']
                song_title = song_meta['title']
                song_slug = song_title.lower().replace(" ", "-").replace("/", "-").replace("(", "").replace(")", "").replace("'", "").replace('"', "").strip("-")
                song_id = song_slug.replace("-", "_")
                if song_id and song_id[0].isdigit(): song_id = "_" + song_id
                songs.append(song_id)

        clean_albums.append({
            "id": album_slug,
            "title": name,
            "slug": album_slug,
            "releaseYear": int(album_data['release_date_components']['year']) if album_data['release_date_components'] else 0,
            "coverArt": album_data['cover_art_url'],
            "songs": songs
        })
        
    # Sort by Year (Newest First)
    clean_albums.sort(key=lambda x: x['releaseYear'], reverse=True)
    
    # Save to src/data/albums.ts
    output_path = "src/data/albums.ts"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("import { Album } from '../types';\n\n")
        f.write("export const albums: Album[] = ")
        f.write(json.dumps(clean_albums, indent=2, ensure_ascii=False))
        f.write(";\n")
        
    print(f"Saved structure to {output_path}")

if __name__ == "__main__":
    fetch_structure()
