import re

file_path = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the entire <style> block
content_no_style = re.sub(r'<style>[\s\S]*?</style>', '', content)

# 2. Add the <link> to our new style.css right before </head>
link_tag = '    <link rel="stylesheet" href="css/style.css">\n</head>'
content_linked = content_no_style.replace('</head>', link_tag)

# 3. Clean up generic HTML to match the new CSS classes if needed (index already mostly matches, but let's ensure footer and nav are clean)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_linked)

print("index.html updated to use global CSS.")
