import os
import json
import lyricsgenius
from dotenv import load_dotenv

load_dotenv()
token = os.environ.get("GENIUS_ACCESS_TOKEN")
genius = lyricsgenius.Genius(token)

print("Fetching one album to inspect...")
# Use a known album ID if possible, or search
# From my previous run, DL91 FM was the first. Let's search for it.
album = genius.search_album("DL91 FM", "Seedhe Maut")
print(f"Type of album: {type(album)}")
print(f"Attributes: {dir(album)}")
if hasattr(album, 'tracks'):
    print(f"Number of tracks: {len(album.tracks)}")
    print(f"Type of first track: {type(album.tracks[0])}")
    print(f"Content of first track: {album.tracks[0]}")
