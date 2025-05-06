#!/bin/bash

# This script adds the image-fix.js script reference to all area pages

# Navigate to the areas directory
cd areas

# Find all index.html files in subdirectories and add the fix script
for file in */index.html; do
  # Check if the file already contains the image-fix.js script
  if ! grep -q "image-fix.js" "$file"; then
    echo "Adding image fix script to $file"
    
    # Update placeholder URL if needed
    sed -i '' 's|https://via.placeholder.com/400x250?text=SMP+Clinic|https://via.placeholder.com/400x200/cccccc/666666?text=SMP+Clinic|g' "$file"
    
    # Insert the script reference before the closing body tag
    # Check if area-fix.js is already there
    if grep -q "area-fix.js" "$file"; then
      # Add after area-fix.js script
      sed -i '' 's|<script src="/area-fix.js"></script>|<script src="/area-fix.js"></script>\n    <!-- Script to fix image loading -->\n    <script src="/image-fix.js"></script>|' "$file"
    else
      # Add before closing body tag
      sed -i '' 's|</body>|    <!-- Script to fix image loading -->\n    <script src="/image-fix.js"></script>\n</body>|' "$file"
    fi
  else
    echo "Image fix script already present in $file"
  fi
done

echo "Done! All area pages have been updated." 