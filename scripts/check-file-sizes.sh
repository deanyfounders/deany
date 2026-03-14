#!/bin/bash
# scripts/check-file-sizes.sh
# Flags JSX files over 250 lines that likely need decomposition
# Searches both root and src/

echo "🔍 Checking component file sizes..."

OVERSIZE=""
find . -maxdepth 2 -name "*.jsx" ! -path "./node_modules/*" ! -path "./dist/*" | while read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 250 ]; then
    echo "  ⚠️  $file: $lines lines (limit: 250)"
  fi
done

# Summary
COUNT=$(find . -maxdepth 2 -name "*.jsx" ! -path "./node_modules/*" ! -path "./dist/*" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 250 ] && echo "$1"' _ {} \; | wc -l)

if [ "$COUNT" -eq 0 ]; then
  echo "  ✅ All files are under 250 lines."
else
  echo ""
  echo "  $COUNT file(s) over limit. Consider splitting — see component-refactor skill."
fi
