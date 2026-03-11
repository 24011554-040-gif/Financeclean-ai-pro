import os
import re

repo_dir = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro'
html_files = ["about.html", "contact.html", "pricing.html", "terms.html", "refund.html", "tool.html", "privacy.html"]

for file in html_files:
    file_path = os.path.join(repo_dir, file)
    if not os.path.exists(file_path): continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Logo and Favicon paths (Agent 9)
    content = content.replace('src="logo.png"', 'src="assets/img/logo.png"')
    content = content.replace('href="favicon.png"', 'href="assets/img/favicon.png"')
    
    # 2. Add loading="lazy" to images (Agent 8)
    # Exclude the hero/logo images from lazy loading typically, but for standard imgs it's good.
    content = re.sub(r'(<img *(?!.*?loading="lazy")[^>]*)(>)', r'\1 loading="lazy"\2', content)

    # Convert specific images like profile_pic to assets/img
    content = content.replace('src="profile_pic_circular.png"', 'src="assets/img/profile_pic_circular.png"')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated paths and performance tags across all secondary pages.")
