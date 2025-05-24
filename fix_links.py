#!/usr/bin/env python3
import os
import re

def fix_links(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fix all malformed links
    content = re.sub(r'<a([^>]*?)href="\.\.\/\.\. class="([^"]*?)"([^>]*?)>', r'<a\1href="../../" class="\2"\3>', content)
    content = re.sub(r'<a([^>]*?)href="\.\.\/\.\. class=([^"]*?)"([^>]*?)>', r'<a\1href="../../" class=\2"\3>', content)
    
    with open(file_path, 'w') as f:
        f.write(content)

# Process all area pages
for root, dirs, files in os.walk('areas'):
    for file in files:
        if file == 'index.html':
            file_path = os.path.join(root, file)
            fix_links(file_path) 