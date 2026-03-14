#!/bin/bash
# scripts/lint-tokens.sh
# Finds hardcoded hex colours in JSX files (all colours must come from Tailwind config)
# Searches both root and src/ since lesson files exist in both locations

echo "🔍 Checking for hardcoded colours in JSX..."

RESULTS=$(find . -maxdepth 2 -name "*.jsx" ! -path "./node_modules/*" ! -path "./dist/*" -exec grep -Hn '#[0-9A-Fa-f]\{3,8\}' {} \; 2>/dev/null | grep -v '// lint-ignore' | grep -v 'tailwind.config')

if [ -z "$RESULTS" ]; then
  echo "  ✅ No hardcoded hex colours found."
  exit 0
else
  echo "  ❌ Found hardcoded colours (must use Tailwind config tokens):"
  echo ""
  echo "$RESULTS" | while IFS= read -r line; do
    echo "  $line"
  done
  echo ""
  echo "  Fix: Replace with Deany tokens (text-deany-navy, bg-deany-cream, etc.)"
  echo "  If intentional, add '// lint-ignore' on the same line."
  exit 1
fi
