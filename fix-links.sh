#!/bin/bash

# Fix all malformed links in area pages
for file in areas/*/index.html; do
    # Create a temporary file
    sed -i '' '
        s/href="\.\.\/\.\. class=/href="..\/..\/\" class=/g
    ' "$file"
done