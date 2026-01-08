import os
import glob
import re
import json

def audit():
    files = glob.glob("src/data/*.ts")
    files = [f for f in files if "index.ts" not in f and "albums.ts" not in f]
    files.sort()

    issues = []
    
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Check for vibe
        vibe_match = re.search(r'"vibe":\s*"(.*?)"', content)
        vibe = vibe_match.group(1) if vibe_match else None
        
        # Check for summary
        summary_match = re.search(r'"summary":\s*"(.*?)"', content)
        summary = summary_match.group(1) if summary_match else None
        
        # Check for lyrics
        # Look for "lyrics": [] or missing lyrics
        lyrics_match = re.search(r'"lyrics":\s*\[(.*?)\]', content, re.DOTALL)
        lyrics_content = lyrics_match.group(1).strip() if lyrics_match else None
        has_lyrics = lyrics_content != "" and lyrics_content is not None
        
        if not vibe or not summary or not has_lyrics:
            issues.append({
                "file": os.path.basename(file_path),
                "vibe": vibe,
                "summary": summary,
                "has_lyrics": has_lyrics
            })

    print(f"{'File':<30} | {'Vibe':<15} | {'Summary':<10} | {'Lyrics':<10}")
    print("-" * 75)
    for issue in issues:
        v_status = "✅" if issue["vibe"] else "❌"
        s_status = "✅" if issue["summary"] else "❌"
        l_status = "✅" if issue["has_lyrics"] else "❌"
        print(f"{issue['file']:<30} | {v_status:<15} | {s_status:<10} | {l_status:<10}")
    
    print("\nSummary:")
    print(f"Total files audited: {len(files)}")
    print(f"Files with issues: {len(issues)}")

if __name__ == "__main__":
    audit()
