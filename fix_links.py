#!/usr/bin/env python3
import os
from bs4 import BeautifulSoup

def fix_links(file_path):
    with open(file_path, 'r') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Fix all malformed links
    for link in soup.find_all('a'):
        href = link.get('href')
        if href and href.startswith('../../ class='):
            link['href'] = '../../'
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as f:
        f.write(str(soup.prettify()))

# Process all area pages
for root, dirs, files in os.walk('areas'):
    for file in files:
        if file == 'index.html':
            file_path = os.path.join(root, file)
            fix_links(file_path) 