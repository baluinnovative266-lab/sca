import os

def create_svg(path, color, icon_text):
    svg_content = f"""<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="{color}" />
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white">{icon_text}</text>
</svg>"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(svg_content)

careers = {
    "software": ("#3B82F6", ["💻", "⌨️", "🚀", "🛡️"]),
    "data": ("#10B981", ["📊", "📈", "🧮", "🧬"]),
    "design": ("#EC4899", ["🎨", "📐", "💡", "✨"]),
    "management": ("#F59E0B", ["👔", "🤝", "🎯", "💼"]),
    "student": ("#6366F1", ["🎓", "📚", "✍️", "🏫"])
}

base_dir = "c:/Users/j pardha saradhi/Desktop/projectexpo/frontend/public/avatars"

for folder, (color, icons) in careers.items():
    for i, icon in enumerate(icons, 1):
        # We named them .png in the backend mapping for consistency, but we'll use .svg content or just rename them
        # Actually, let's keep them as .png extension but with SVG content? No, that's bad.
        # I'll update the backend to use .svg
        create_svg(f"{base_dir}/{folder}/{i}.svg", color, icon)

print("SVG avatars generated successfully.")
