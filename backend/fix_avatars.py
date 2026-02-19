import os

def create_svg(path, color, label):
    svg_content = f"""<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="{color}" />
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white" font-weight="bold">{label}</text>
</svg>"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:
        with open(path, "w", encoding='utf-8') as f:
            f.write(svg_content)
        return True
    except Exception as e:
        print(f"Error creating {path}: {e}")
        return False

careers = {
    "software": ("#3B82F6", ["JS", "PY", "TS", "C#"]),
    "data": ("#10B981", ["DB", "AI", "ML", "SQL"]),
    "design": ("#EC4899", ["UX", "UI", "FIG", "VUE"]),
    "management": ("#F59E0B", ["PM", "AG", "OP", "LD"]),
    "student": ("#6366F1", ["ST", "ED", "LN", "AI"])
}

base_dir = r"c:\Users\j pardha saradhi\Desktop\projectexpo\frontend\public\avatars"

for folder, (color, labels) in careers.items():
    print(f"Generating for {folder}...")
    for i, label in enumerate(labels, 1):
        target_path = os.path.join(base_dir, folder, f"{i}.svg")
        if create_svg(target_path, color, label):
            print(f" Created: {target_path}")

print("Generation complete.")
