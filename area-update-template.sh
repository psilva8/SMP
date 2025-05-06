#!/bin/bash

# This script adds the area-fix.js script reference to all area pages

# Navigate to the areas directory
cd areas

# Find all index.html files in subdirectories and add the fix script
for file in */index.html; do
  # Check if the file already contains the fix script
  if ! grep -q "area-fix.js" "$file"; then
    echo "Adding fix script to $file"
    
    # Insert the script reference before the closing body tag
    sed -i '' 's|</body>|    <!-- Script to fix star ratings display -->\n    <script src="/area-fix.js"></script>\n</body>|' "$file"
  else
    echo "Fix script already present in $file"
  fi
done

echo "Done! All area pages have been updated." 