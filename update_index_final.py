import re

file_path = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace image paths to point to /assets/img
content = content.replace('src="logo.png"', 'src="assets/img/logo.png"')
content = content.replace('href="favicon.png"', 'href="assets/img/favicon.png"')

# Update Hero Image
content = content.replace('src="mockup_premium_wide.png"', 'src="assets/img/mockup_premium_wide.png"')

# Update secondary mockup image
content = content.replace('src="mockup_dashboard_wide.png"', 'src="assets/img/mockup_dashboard_wide.png"')

# Update third image 
content = content.replace('src="hero_wide.png"', 'src="assets/img/hero_wide.png"')

# Typography & Readability (Agent 7) upgrades
content = content.replace('<span class="section-tag">Core Capabilities</span>', '<span class="section-tag" style="text-transform: uppercase; letter-spacing: 1px;">Capabilities</span>')
content = content.replace('<h2>Built for precision, engineered for scale.</h2>', '<h2 class="page-title">Built for precision.<br>Engineered for scale.</h2>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html with new asset paths and typography.")
