#!/bin/bash

# Fix all malformed links in area pages
for file in areas/*/index.html; do
  # Create a temporary file
  awk '{
    gsub(/href="\.\.\/\.\. class="/, "href=\"..\/..\/\" class=\"");
    print;
  }' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done