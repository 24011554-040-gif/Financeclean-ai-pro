import os
from PIL import Image

repo_dir = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro'
img_files = [f for f in os.listdir(repo_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]

print("--- AGENT 4: IMAGE QUALITY REPORT ---")
for img_name in img_files:
    try:
        path = os.path.join(repo_dir, img_name)
        with Image.open(path) as img:
            width, height = img.size
            ratio = width / height
            
            status = "OK"
            if width < 1600 and "hero" in img_name.lower() or "mockup" in img_name.lower():
                status = "WARNING: Low Res for Hero/Mockup"
            if ratio < 1.0 and "hero" in img_name.lower():
                 status = "WARNING: Vertical image used where wide is expected"
                 
            print(f"{img_name}: {width}x{height} (Ratio: {ratio:.2f}) - {status}")
    except Exception as e:
        print(f"Error checking {img_name}: {e}")
