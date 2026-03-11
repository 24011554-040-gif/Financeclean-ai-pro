from PIL import Image

paths = [
    '/Users/mac/.gemini/antigravity/brain/3fb760fb-0787-4f91-b9dc-78f720cefab7/elite_dashboard_hero_1773190795529.png',
    '/Users/mac/.gemini/antigravity/brain/3fb760fb-0787-4f91-b9dc-78f720cefab7/elite_analytics_mockup_1773190832513.png'
]

targets = [
    '/Users/mac/Downloads/clean ai/Financeclean-ai-pro/assets/img/mockup_premium_wide.png',
    '/Users/mac/Downloads/clean ai/Financeclean-ai-pro/assets/img/mockup_dashboard_wide.png'
]

import os
os.makedirs('/Users/mac/Downloads/clean ai/Financeclean-ai-pro/assets/img', exist_ok=True)

target_ratio = 16 / 9

for source_path, target_path in zip(paths, targets):
    try:
        with Image.open(source_path) as img:
            width, height = img.size
            
            # The generated images are often square with padding. 
            # Let's crop to a 16:9 ratio focusing on the center.
            new_height = int(width / target_ratio)
            
            if new_height < height:
                # Crop top and bottom equally
                top = (height - new_height) // 2
                bottom = top + new_height
                img_cropped = img.crop((0, top, width, bottom))
            else:
                # Image is already wider than 16:9, crop sides (unlikely for DALL-E 1:1)
                new_width = int(height * target_ratio)
                left = (width - new_width) // 2
                right = left + new_width
                img_cropped = img.crop((left, 0, right, height))
            
            img_cropped.save(target_path, quality=95)
            print(f"Cropped and saved to {target_path} - Size: {img_cropped.size}")
            
    except Exception as e:
        print(f"Error processing {source_path}: {e}")
