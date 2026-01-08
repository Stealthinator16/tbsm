import os
import argparse
import lyricsgenius
from dotenv import load_dotenv

load_dotenv()

# Setup Genius API
# The user needs a GENIUS_ACCESS_TOKEN env variable
genius = lyricsgenius.Genius(os.environ.get("GENIUS_ACCESS_TOKEN"))
genius.verbose = False # Turn off status messages
genius.remove_section_headers = False # Keep [Chorus], [Verse] etc.

def fetch_album_lyrics(album_name: str, artist_name: str = "Seedhe Maut"):
    print(f"Searching for album '{album_name}' by {artist_name}...")
    
    # Search for the album
    album = genius.search_album(album_name, artist_name)
    
    if not album:
        print(f"Could not find album '{album_name}'")
        return

    print(f"Found album: {album.name}")
    print(f"Fetching lyrics for {len(album.tracks)} tracks...")
    
    # Create directory for the album
    safe_album_name = album_name.lower().replace(" ", "_")
    output_dir = f"scripts/lyrics/{safe_album_name}"
    os.makedirs(output_dir, exist_ok=True)
    
    for track in album.tracks:
        try:
            # Handle different versions of lyricsgenius
            if isinstance(track, tuple) and len(track) > 1:
                track_obj = track[1]
                if hasattr(track_obj, 'title'):
                    title = track_obj.title
                else:
                    title = str(track_obj)
            elif hasattr(track, 'song'):
                title = track.song.title
            elif hasattr(track, 'title'):
                title = track.title
            else:
                title = str(track)
                
            print(f"Fetching: {title}...")
            song = genius.search_song(title, artist_name)
        except Exception as e:
            print(f"Error fetching track: {e}")
            continue

        if song:
            filename = f"{output_dir}/{song.title.lower().replace(' ', '_').replace('/', '-')}.txt"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(song.lyrics)
            print(f"Saved: {song.title}")
        else:
            print(f"Could not find lyrics for: {title}")
            
    print(f"\nAll lyrics saved to {output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--album", required=True, help="Name of the album to fetch")
    args = parser.parse_args()
    
    fetch_album_lyrics(args.album)
