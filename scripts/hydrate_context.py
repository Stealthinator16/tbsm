import os
import glob
import re
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini API
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

PROMPT_TEMPLATE = """
You are an expert in Indian Hip Hop, specifically the Delhi scene and the duo Seedhe Maut.
Your task is to analyze the following lyrics and provide a comprehensive breakdown for a fan website.

Song: {title}
Album: {album}
Lyrics (with Speaker attribution):
{lyrics_json}

Provide:
1. A concise 'summary' (backstory, meaning, cultural impact).
2. A 'type' classification (e.g., Diss, Storytelling, Flex, Conscious, Experimental).
3. A 'vibe' classification (e.g., Aggressive, Chill, Melancholic, High-energy).
4. For EVERY line, provide an English 'translation' and a cultural 'explanation'.
5. Add specific 'annotations' for slang, locations, or references.

IMPORTANT: Preserve the 'original' text and the 'speaker' for every line exactly as provided.

Format your output as a JSON object matching this structure:
{
  "summary": "...",
  "type": "...",
  "vibe": "...",
  "lyrics": [
    {
      "original": "...",
      "speaker": "...",
      "translation": "...",
      "explanation": "...",
      "annotations": [{"text": "...", "type": "..."}]
    }
  ]
}

Ensure the JSON is valid and deep in its analysis.
"""

def hydrate_song(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract data
        json_start = content.find("= {") + 2
        json_end = content.rfind(";")
        data = json.loads(content[json_start:json_end])
        
        # Skip if already has summary (unless forced)
        if data.get('summary') and len(data['lyrics'][0].get('translation', '')) > 0:
            print(f"  ⏭️ Skipping {data['title']} (Already hydrated)")
            return True

        print(f"  🧠 Analyzing {data['title']}...")
        
        # Prepare lyrics for prompt (just the necessary bits)
        lyrics_subset = [{"original": l['original'], "speaker": l.get('speaker', 'Seedhe Maut')} for l in data['lyrics']]
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = PROMPT_TEMPLATE.format(
            title=data['title'],
            album=data.get('album', 'Unknown'),
            lyrics_json=json.dumps(lyrics_subset, ensure_ascii=False)
        )
        
        response = model.generate_content(prompt)
        ai_text = response.text
        
        # Extract JSON
        if "```json" in ai_text:
            ai_text = ai_text.split("```json")[1].split("```")[0].strip()
        elif "```" in ai_text:
            ai_text = ai_text.split("```")[1].split("```")[0].strip()
            
        ai_result = json.loads(ai_text)
        
        # Update existing data
        data['summary'] = ai_result.get('summary', '')
        data['type'] = ai_result.get('type', 'Track')
        data['vibe'] = ai_result.get('vibe', 'Unknown')
        
        # Map AI lyrics back to preserve structure (ID, slug, credits etc)
        # Note: AI might return different number of lines if not careful, 
        # but we asked it to preserve every line.
        ai_lyrics = ai_result.get('lyrics', [])
        
        for i, line in enumerate(data['lyrics']):
            if i < len(ai_lyrics):
                line['translation'] = ai_lyrics[i].get('translation', '')
                line['explanation'] = ai_lyrics[i].get('explanation', '')
                line['annotations'] = ai_lyrics[i].get('annotations', [])
        
        # Save back
        var_name_match = re.search(r'export const (.*?): Song =', content)
        var_name = var_name_match.group(1)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("import { Song } from '../types';\n\n")
            f.write(f"export const {var_name}: Song = ")
            f.write(json.dumps(data, indent=2, ensure_ascii=False))
            f.write(";\n")
            
        return True
    except Exception as e:
        print(f"  ❌ Error hydrating {file_path}: {e}")
        return False

def main():
    print("🚀 Starting Discography Hydration...")
    files = glob.glob("src/data/*.ts")
    files = [f for f in files if "index.ts" not in f and "albums.ts" not in f]
    
    # Sort files to be deterministic
    files.sort()
    
    success_count = 0
    for i, file_path in enumerate(files):
        print(f"[{i+1}/{len(files)}] Processing {os.path.basename(file_path)}")
        if hydrate_song(file_path):
            success_count += 1
            # Respect Rate Limits (Free tier is ~15 requests/min or 2 per min for deep models)
            # 1.5 Flash is 15 RPM. 10s sleep is safe.
            time.sleep(12)
        else:
            # Backoff on error
            time.sleep(5)

    print(f"✨ Hydration Complete. Successfully updated {success_count} songs.")

if __name__ == "__main__":
    main()
