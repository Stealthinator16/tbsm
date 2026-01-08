import os
import glob
import re
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = "gemini-2.0-flash-exp"

def fix_annotations_in_file(file_path):
    print(f"Processing {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract JSON data from TS file
    json_match = re.search(r'export const \w+: Song = ({.*});', content, re.DOTALL)
    if not json_match:
        print(f"Could not find song data in {file_path}")
        return

    data = json.loads(json_match.group(1))
    title = data.get("title", "Unknown Song")
    lyrics = data.get("lyrics", [])
    
    modified = False
    
    # Identify annotations missing meanings
    missing_info = []
    for line_idx, line in enumerate(lyrics):
        anns = line.get("annotations", [])
        for ann_idx, ann in enumerate(anns):
            if isinstance(ann, str) or not ann.get("meaning"):
                missing_info.append({
                    "line_idx": line_idx,
                    "ann_idx": ann_idx,
                    "keyword": ann if isinstance(ann, str) else ann.get("keyword") or ann.get("text"),
                    "context": line["original"]
                })

    if not missing_info:
        print(f"All annotations in {title} have meanings.")
        return

    print(f"Found {len(missing_info)} annotations missing meanings in {title}. Fetching from AI...")

    # AI Prompt to fix them
    prompt = f"""
    You are an expert in Indian Hip Hop and the duo Seedhe Maut.
    In the song "{title}", the following terms need definitions/meanings.
    
    Terms:
    {json.dumps(missing_info, indent=2)}
    
    Provide a concise meaning for each term based on the context of the song.
    Also, classify the "type" (e.g., "Slang", "Reference", "Culture", "Place").
    If the term is in Hindi, provide the English meaning clearly.
    
    Return a JSON array of objects with "line_idx", "ann_idx", "meaning", and "type".
    Example:
    [
      {{"line_idx": 0, "ann_idx": 0, "meaning": "Describing something as highly dangerous or impactful.", "type": "Slang"}}
    ]
    """

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        response_text = response.text
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        fixes = json.loads(response_text)
        
        # Apply Fixes
        for fix in fixes:
            l_idx = fix["line_idx"]
            a_idx = fix["ann_idx"]
            
            # Clean meaning
            meaning = fix["meaning"].strip()
            if meaning.startswith('"') and meaning.endswith('"'):
                meaning = meaning[1:-1].strip()
            if meaning.startswith('\"') and meaning.endswith('\"'):
                meaning = meaning[1:-1].strip()

            curr_ann = lyrics[l_idx]["annotations"][a_idx]
            if isinstance(curr_ann, str):
                lyrics[l_idx]["annotations"][a_idx] = {
                    "keyword": curr_ann,
                    "meaning": meaning,
                    "type": fix["type"]
                }
            else:
                curr_ann["meaning"] = meaning
                curr_ann["type"] = fix.get("type") or curr_ann.get("type") or "Slang"
            modified = True

    except Exception as e:
        print(f"Error fixing {title}: {e}")
        return

    if modified:
        # Write back
        var_name_match = re.search(r'export const (\w+): Song =', content)
        var_name = var_name_match.group(1)
        new_content = f"import {{ Song }} from '../types';\n\nexport const {var_name}: Song = {json.dumps(data, indent=2, ensure_ascii=False)};\n"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Fixed {title}")
        time.sleep(1)

def main():
    files = glob.glob("src/data/*.ts")
    files = [f for f in files if "index.ts" not in f and "albums.ts" not in f and "timeline.ts" not in f]
    files.sort()
    
    for f in files:
        fix_annotations_in_file(f)

if __name__ == "__main__":
    main()
