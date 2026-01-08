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

# We'll use 2.0 Flash as the most capable fast model available
MODEL_NAME = "gemini-2.0-flash-exp"

PROMPT_TEMPLATE = """
You are an expert in Indian Hip Hop (Desi Hip Hop) and the duo Seedhe Maut.
You are analyzing the song "{title}" by Seedhe Maut.

Input Metadata:
{metadata_json}

Input Lyrics (Sample):
{lyrics_sample}

Task:
1. "vibe": Provide a short, 1-2 word descriptor of the song's vibe. Choose from EXACTLY these: ["Aggressive", "Chill", "Introspective", "Storytelling", "Hype", "Dark"].
2. "brief": A short 1-2 sentence summary of what the song is about.
3. "annotations": Enrich the lyrics with annotations. Focus on:
    - "text": The exact text from the lyric line to annotate.
    - "keyword": The main keyword/subject.
    - "type": Classify it (e.g., "Slang", "Metaphor", "Reference", "Cultural").
    - "meaning": A descriptive explanation of the meaning. 
      IMPORTANT: This field is mandatory. Do NOT just say "Slang". Explain WHAT the slang means in plain English.

Return a JSON object with this structure:
{{
  "vibe": "String",
  "summary": "String",
  "lyric_updates": [
    {{
      "line_index": 0, // Index of the line in the original array
      "annotations": [
        {{ "text": "...", "keyword": "...", "type": "...", "meaning": "..." }}
      ]
    }}
  ]
}}

Only return annotations for lines that actually need them (slang, metaphors, deep references). Do NOT annotate every single line.
Ensure valid JSON output.
"""

def parse_ts_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract Title
    title_match = re.search(r'"title": "(.*?)",', content)
    title = title_match.group(1) if title_match else "Unknown"

    # Extract JSON content
    match = re.search(r'export const \w+: Song = ({[\s\S]*});', content)
    if not match:
        match = re.search(r'export const \w+: Song = ({[\s\S]*})', content)
    
    if match:
        json_str = match.group(1)
        # Loose JSON parsing (TS file might have comments or trailing commas)
        # Basic cleanup
        json_str_clean = re.sub(r'//.*', '', json_str)
        json_str_clean = re.sub(r',\s*([\]}])', r'\1', json_str_clean)
        try:
            data = json.loads(json_str_clean)
            return content, data, title
        except:
            pass
            
    return content, None, title

def process_file(file_path):
    try:
        content, data, title = parse_ts_file(file_path)
        if not data:
            print(f"Skipping {file_path}: Could not parse")
            # Fallback for empty files or weird formatting?
            return

        print(f"Processing: {title}...")

        lyrics = data.get("lyrics", [])
        if not lyrics:
            return

        # Prepare prompt inputs
        metadata = {
            "title": title,
            "album": data.get("album", ""),
            "existing_vibe": data.get("vibe", ""),
            "existing_summary": data.get("summary", "")
        }
        
        lyrics_text_only = [l["original"] for l in lyrics]
        
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = PROMPT_TEMPLATE.format(
            title=title, 
            metadata_json=json.dumps(metadata),
            lyrics_sample=json.dumps(lyrics_text_only)
        )

        response = model.generate_content(prompt)
        response_text = response.text
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        try:
            enriched_data = json.loads(response_text)
        except Exception as e:
            print(f"Failed to parse AI response for {title}: {e}")
            print("Response text was:")
            print(response_text[:500] + "...") 
            return
        
        # Merge Data
        data["vibe"] = enriched_data.get("vibe") or data.get("vibe") or "TBD"
        data["summary"] = enriched_data.get("summary") or enriched_data.get("brief") or data.get("summary") or ""
        
        updates = enriched_data.get("lyric_updates", [])
        updates_map = {u["line_index"]: u["annotations"] for u in updates}
        
        for idx, line in enumerate(lyrics):
            if idx in updates_map:
                new_anns = updates_map[idx]
                if not line.get("annotations"):
                    line["annotations"] = []
                
                # Normalize legacy strings to objects
                current_anns_objs = []
                for a in line["annotations"]:
                    if isinstance(a, str):
                        current_anns_objs.append({"text": a, "type": "Legacy"})
                    else:
                        current_anns_objs.append(a)
                
                # Append unique new annotations
                for new_ann in new_anns:
                    is_dup = False
                    for existing in current_anns_objs:
                        # Loose check
                        e_key = existing.get("keyword") or existing.get("text") or existing.get("word") or ""
                        n_key = new_ann.get("keyword") or new_ann.get("text") or ""
                        if e_key.lower() == n_key.lower():
                            is_dup = True
                            break
                    
                    if not is_dup:
                        line["annotations"].append(new_ann)

        # Write back
        var_name_match = re.search(r'export const (\w+): Song =', content)
        var_name = var_name_match.group(1)
        
        new_file_content = f"import {{ Song }} from '../types';\n\nexport const {var_name}: Song = {json.dumps(data, indent=2, ensure_ascii=False)};\n"
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_file_content)
            
        print(f"✅ Updated {title}")
        time.sleep(1) 

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--only-missing", action="store_true", help="Only process files missing vibe or summary")
    parser.add_argument("--file", help="Process a specific file")
    args = parser.parse_args()
    
    if args.file:
        files = [args.file]
    else:
        files = glob.glob("src/data/*.ts")
        files = [f for f in files if "index.ts" not in f and "albums.ts" not in f]
    
    files.sort()
    
    print(f"Found {len(files)} song files.")
    for f in files:
        if args.only_missing:
            with open(f, "r", encoding="utf-8") as file_handle:
                content = file_handle.read()
                has_vibe = re.search(r'"vibe":\s*"(.*?)"', content)
                has_summary = re.search(r'"summary":\s*"(.*?)"', content)
                has_lyrics = re.search(r'"lyrics":\s*\[(.*?)\]', content, re.DOTALL)
                
                # If everything is already there, skip
                if has_vibe and has_vibe.group(1) and has_summary and has_summary.group(1) and has_lyrics and has_lyrics.group(1).strip():
                    continue
        
        process_file(f)
