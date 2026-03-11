import os
import re

repo_dir = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro'
html_files = ["about.html", "contact.html", "pricing.html", "terms.html", "refund.html", "tool.html", "privacy.html"]

link_tag = '    <link rel="stylesheet" href="css/style.css">\n</head>'

for file in html_files:
    file_path = os.path.join(repo_dir, file)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Strip the <style> tag
        content_no_style = re.sub(r'<style>[\s\S]*?</style>', '', content)
        
        # 2. Add the global CSS link
        content_linked = content_no_style.replace('</head>', link_tag)
        
        # 3. Add the font link if missing
        font_tag = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
        if 'fonts.googleapis.com/css2?family=Inter' not in content_linked:
             content_linked = content_linked.replace('<link rel="stylesheet" href="css/style.css">', f'{font_tag}\n    <link rel="stylesheet" href="css/style.css">')

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content_linked)
        print(f"Updated {file}")

print("All HTML files refactored.")
