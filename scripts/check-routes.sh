#!/bin/bash
# scripts/check-routes.sh
# Verifies every DEANY lesson file has a matching reference in src/App.jsx
# Searches both root and src/ since lesson files exist in both locations

echo "🔍 Checking lesson routes..."
FAIL=0

# Find all DEANY lesson files in both root and src/
for file in $(find . -maxdepth 2 -name "DEANY*M*L*.jsx" 2>/dev/null | sort); do
  basename=$(basename "$file" .jsx)
  # Normalise: strip DEANY- or DEANY_ prefix, strip hyphens/underscores for matching
  searchterm=$(echo "$basename" | sed 's/[-_]//g')

  # Check if App.jsx references this file (by import or by component name)
  if ! grep -qi "$basename\|$searchterm" src/App.jsx 2>/dev/null; then
    echo "  ❌ MISSING ROUTE: $basename ($file)"
    FAIL=1
  else
    echo "  ✅ $basename"
  fi
done

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "✅ All lesson routes are registered."
else
  echo ""
  echo "❌ Some lesson routes are missing. Check src/App.jsx."
  exit 1
fi
