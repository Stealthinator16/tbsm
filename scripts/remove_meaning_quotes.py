import os
import glob
import re
import json

def clean_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract JSON data
    json_match = re.search(r'export const \w+: Song = ({.*});', content, re.DOTALL)
    if not json_match:
        return

    data = json.loads(json_match.group(1))
    modified = False

    for line in data.get("lyrics", []):
        # Clean explanation
        if "explanation" in line:
            exp = line["explanation"].strip()
            # Handle both normal and literal escaped quotes
            while (exp.startswith('"') and exp.endswith('"')) or (exp.startswith('\\"') and exp.endswith('\\"')):
                if exp.startswith('\\"'):
                    exp = exp[2:-2].strip()
                else:
                    exp = exp[1:-1].strip()
            if exp != line["explanation"]:
                line["explanation"] = exp
                modified = True

        for ann in line.get("annotations", []):
            if isinstance(ann, dict) and "meaning" in ann:
                m = ann["meaning"].strip()
                while (m.startswith('"') and m.endswith('"')) or (m.startswith('\\"') and m.endswith('\\"')):
                    if m.startswith('\\"'):
                        m = m[2:-2].strip()
                    else:
                        m = m[1:-1].strip()
                if m != ann["meaning"]:
                    ann["meaning"] = m
                    modified = True

    if modified:
        var_name_match = re.search(r'export const (\w+): Song =', content)
        var_name = var_name_match.group(1)
        # Use json.dumps with ensure_ascii=False to preserve Unicode (Hindi)
        new_json = json.dumps(data, indent=2, ensure_ascii=False)
        new_content = f"import {{ Song }} from '../types';\n\nexport const {var_name}: Song = {new_json};\n"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Cleaned {file_path}")

def main():
    files = glob.glob("src/data/*.ts")
    # Exclusion list same as before
    files = [f for f in files if "index.ts" not in f and "albums.ts" not in f and "timeline.ts" not in f]
    for f in files:
        clean_file(f)

if __name__ == "__main__":
    main()
