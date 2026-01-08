import os
import argparse
import lyricsgenius

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
        song = genius.search_song(track.song.title, artist_name)
        if song:
            filename = f"{output_dir}/{song.title.lower().replace(' ', '_').replace('/', '-')}.txt"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(song.lyrics)
            print(f"Saved: {song.title}")
        else:
            print(f"Could not find lyrics for: {track.song.title}")
            
    print(f"\nAll lyrics saved to {output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--album", required=True, help="Name of the album to fetch")
    args = parser.parse_args()
    
    fetch_album_lyrics(args.album)
