import os
import glob
import re
import json
import argparse
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

PROMPT_TEMPLATE = """
You are an expert in Indian Hip Hop (Desi Hip Hop) and the duo Seedhe Maut.
You are provided with a list of lyric lines from the song "{title}" by Seedhe Maut.
The lines are already segmented.

Your task is to enrich each line with:
1. "translation": A clear English translation capturing the vibe.
2. "explanation": A context-aware explanation of the line, slang, or double entendre. Keep it concise.
3. "annotations": A list of specific keywords/slang in the line and their type (optional).

Input Lyrics Data:
{lyrics_json}

Return the EXACT same JSON array structure, but with "translation", "explanation", and "annotations" fields filled in.
Do not change the "original" text or "speaker" fields.
Ensure the output is valid JSON.
"""


def process_file(file_path, model_name="gemini-3-flash-preview"):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract Title
        title_match = re.search(r'"title": "(.*?)",', content)
        if not title_match:
            print(f"Skipping {file_path}: No title found")
            return
        title = title_match.group(1)

        # Extract JSON content
        match = re.search(r'export const \w+: Song = ({[\s\S]*});', content)
        if not match:
            match = re.search(r'export const \w+: Song = ({[\s\S]*})', content)
        
        if not match:
             print(f"Skipping {file_path}: Could not parse JSON structure")
             return

        json_str = match.group(1)
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            json_str_clean = re.sub(r',\s*([\]}])', r'\1', json_str)
            try:
                data = json.loads(json_str_clean)
            except:
                print(f"Skipping {file_path}: Invalid JSON in file")
                return

        lyrics = data.get("lyrics", [])
        if not lyrics:
            print(f"Skipping {file_path}: No lyrics found")
            return
            
        processed_count = sum(1 for line in lyrics[:5] if line.get("translation"))
        if processed_count > 2:
            print(f"Skipping {title}: Already appears processed")
            return

        print(f"Processing: {title} ({len(lyrics)} lines)...")

        # Optimization: Send only original and speaker to save tokens
        simplified_lyrics = [{"original": l["original"], "speaker": l.get("speaker", "")} for l in lyrics]

        model = genai.GenerativeModel(model_name)
        prompt = PROMPT_TEMPLATE.format(title=title, lyrics_json=json.dumps(simplified_lyrics))
        
        # Retry logic
        max_retries = 3
        retry_delay = 10
        response_text = ""
        
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                response_text = response.text
                break
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    print(f"  Rate limit hit. Retrying in {retry_delay}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(retry_delay)
                    retry_delay *= 2 # Exponential backoff
                else:
                    raise e
        
        if not response_text:
            print(f"Failed to get response for {title} after retries.")
            return

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        enriched_lyrics = json.loads(response_text)
        
        # Verify length matches
        if len(enriched_lyrics) != len(lyrics):
            print(f"Warning: {title} line count mismatch (Input: {len(lyrics)}, Output: {len(enriched_lyrics)})")
            # We could try to align them, or just accept the AI's version if it looks good.
            # Ideally we want to strictly preserve the original, so let's try to merge 
            # based on index if counts match, else just use the new one IF originals match?
            # For now, let's trust the AI output but warn.
        
        data["lyrics"] = enriched_lyrics
        
        # Write back
        # Construct the file content again
        var_name_match = re.search(r'export const (\w+): Song =', content)
        var_name = var_name_match.group(1)
        
        new_content = f"import {{ Song }} from '../types';\n\nexport const {var_name}: Song = {json.dumps(data, indent=2)};\n"
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
            
        print(f"✅ Updated {title}")
        time.sleep(2) # Rate limit niceness

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Limit number of files to process")
    parser.add_argument("--file", type=str, help="Specific file to process")
    args = parser.parse_args()

    files = []
    if args.file:
        files = [args.file]
    else:
        files = glob.glob("src/data/*.ts")
        files = [f for f in files if "index.ts" not in f and "albums.ts" not in f]
        # Sort for consistency
        files.sort()

    if args.limit > 0:
        files = files[:args.limit]

    print(f"Found {len(files)} files to process.")
    
    for f in files:
        process_file(f)
