import os
import json
import argparse
import google.generativeai as genai
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini API
# The user will need to set GOOGLE_API_KEY environment variable
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

PROMPT_TEMPLATE = """
You are an expert in Indian Hip Hop, specifically the Delhi scene and the duo Seedhe Maut.
Your task is to analyze the following lyrics and provide a line-by-line breakdown for a fan website.

Song: {title}
Lyrics:
{lyrics}

For each line, provide:
1. The original line (exactly as provided).
2. A clear English translation that captures the vibe (not just literal).
3. A brief explanation of the meaning if it's not obvious.
4. Specific annotations for slang (like 'TBSM', 'Khatar', 'Nanchaku'), cultural references, or Delhi-specific locations/context.

Format your output as a JSON object matching this structure:
{{
  "id": "{id}",
  "title": "{title}",
  "slug": "{slug}",
  "album": "{album}",
  "lyrics": [
    {{
      "original": "line text",
      "translation": "English translation",
      "explanation": "Brief context",
      "annotations": [
        {{
          "text": "annotation text",
          "type": "cultural/slang/reference"
        }}
      ]
    }}
  ]
}}

Ensure the JSON is valid and the analysis is deep and accurate to Seedhe Maut's style.
"""

def analyze_song(title: str, lyrics: str, album: str = ""):
    model = genai.GenerativeModel('gemini-3-flash-preview')
    
    slug = title.lower().replace(" ", "-").replace("(", "").replace(")", "")
    song_id = slug.replace("-", "_")
    
    prompt = PROMPT_TEMPLATE.format(
        title=title,
        lyrics=lyrics,
        id=song_id,
        slug=slug,
        album=album
    )
    
    try:
        response = model.generate_content(prompt)
        content = response.text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Error analyzing {title}: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", required=True)
    parser.add_argument("--lyrics_file", required=True)
    parser.add_argument("--album", default="")
    args = parser.parse_args()
    
    with open(args.lyrics_file, "r") as f:
        lyrics_content = f.read()
        
    result = analyze_song(args.title, lyrics_content, args.album)
    
    if result:
        output_path = f"src/data/{result['id']}.ts"
        
        # Save as a TypeScript file for easy import
        with open(output_path, "w") as f:
            f.write("import { Song } from '../types';\n\n")
            f.write(f"export const {result['id']}: Song = ")
            f.write(json.dumps(result, indent=2))
            f.write(";\n")
            
        print(f"Successfully generated analysis and saved to {output_path}")
