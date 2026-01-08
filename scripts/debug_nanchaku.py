import re

def debug_nanchaku():
    with open("src/data/nanchaku.ts", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find the line with the header
    lines = content.split('\n')
    target_line = None
    for line in lines:
        if "[Verse 1: Encore ABJ]" in line:
            # Extract just the string content inside quotes
            # Line format: "original": "[Verse 1: Encore ABJ]",
            match = re.search(r'"original": "(.*?)"', line)
            if match:
                target_line = match.group(1)
                break
    
    if not target_line:
        print("Could not find the target line in nanchaku.ts")
        return

    print(f"Target line content: '{target_line}'")
    print(f"Character codes: {[ord(c) for c in target_line]}")
    
    # Test regex
    regex_pattern = r'^\s*\[(.*?)(?:\:\s*(.*?))?\]\s*$' # Corrected escaping for backslashes in regex
    regex = re.compile(regex_pattern)
    
    match = regex.match(target_line)
    print(f"Regex '{regex_pattern}' match: {match}")
    if match:
        print(f"Groups: {match.groups()}")
    else:
        print("NO MATCH")

if __name__ == "__main__":
    debug_nanchaku()
