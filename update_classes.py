import os
import re

repo_dir = '/Users/mac/Downloads/clean ai/Financeclean-ai-pro'
html_files = ["about.html", "contact.html", "pricing.html", "terms.html", "refund.html", "tool.html", "privacy.html"]

for file in html_files:
    file_path = os.path.join(repo_dir, file)
    if not os.path.exists(file_path): continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Navigation
    content = content.replace('<nav class="navbar">', '<nav class="nav" id="navbar">')
    content = content.replace('<a href="index.html" class="nav-brand">', '<a href="index.html" class="logo" style="text-decoration: none; color: white;">')
    content = content.replace('<ul class="nav-links">', '<div class="nav-items">')
    content = content.replace('</ul>', '</div>')
    content = re.sub(r'<li>(.*?)</li>', r'\1', content) # Remove <li> tags around links
    content = content.replace('class="btn-nav"', 'class="btn-primary"')
    
    # 2. Update Footer
    # Replace the legacy complex footer with the minimal global footer
    footer_pattern = re.compile(r'<footer>.*?</footer>', re.DOTALL)
    new_footer = """
    <footer>
        <div>&copy; 2026 FinanceClean AI. All rights reserved.</div>
        <div class="f-links">
            <a href="terms.html">Terms</a>
            <a href="privacy.html">Privacy</a>
            <a href="refund.html">Refunds</a>
        </div>
    </footer>
    <script>
        window.onscroll = function() {
            var nav = document.getElementById('navbar');
            if (window.pageYOffset > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };
    </script>
"""
    content = re.sub(footer_pattern, new_footer.strip(), content)
    
    # 3. Text adjustments for dark theme
    content = content.replace('var(--text-light)', 'var(--text-muted)')
    content = content.replace('var(--bg-body)', 'var(--bg)')
    content = content.replace('var(--primary-color)', 'var(--primary)')
    
    # 4. Container wrapper
    content = content.replace('<main class="container">', '<main class="container container-narrow">')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated HTML classes and structure across all pages.")
