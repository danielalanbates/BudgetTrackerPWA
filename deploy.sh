#!/bin/bash
set -e

echo "Building PWA..."
npm run build

echo "Deploying to GitHub Pages..."
# Create temporary branch with only dist contents
git checkout --orphan temp-gh-pages
git rm -rf .
git add -f dist/
git commit -m "Deploy to GitHub Pages"
git branch -m gh-pages
git push origin gh-pages --force
git checkout main

echo ""
echo "✓ Deployed to GitHub Pages!"
echo ""
echo "Enable at: https://github.com/danielalanbates/BudgetTrackerPWA/settings/pages"
echo "Your app will be live at: https://danielalanbates.github.io/BudgetTrackerPWA/"
