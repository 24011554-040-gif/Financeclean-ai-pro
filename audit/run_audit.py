import os
import re
import json

repo_dir = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro'
html_files = [f for f in os.listdir(repo_dir) if f.endswith('.html')]

report = {
    "total_pages": len(html_files),
    "pages": html_files,
    "issues": []
}

for file in html_files:
    file_path = os.path.join(repo_dir, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Check title
        if '<title>' not in content:
            report['issues'].append(f"{file}: Missing <title> tag")
            
        # Check CSS link consistency (looking for global styles)
        if '<style>' in content:
            report['issues'].append(f"{file}: Contains inline <style> block. Should be moved to global CSS.")
            
        # Theming checks (specifically background colors in inline styles)
        if re.search(r'style="[^"]*background[^"]*(#ffffff|white)[^"]*"', content, re.IGNORECASE):
             report['issues'].append(f"{file}: Potential white background found in inline style.")
             
        # Image checks
        img_tags = re.findall(r'<img[^>]+>', content)
        for img in img_tags:
            if 'src=' not in img:
                report['issues'].append(f"{file}: Image missing src attribute: {img}")
            import re
            src_match = re.search(r'src="([^"]+)"', img)
            if src_match:
                src = src_match.group(1)
                if src.startswith('http'):
                     report['issues'].append(f"{file}: External image link found: {src}")
                 
with open('/Users/mac/Downloads/clean ai/Financeclean-ai-pro/audit/report.json', 'w') as f:
    json.dump(report, f, indent=2)

print("Audit complete.")
