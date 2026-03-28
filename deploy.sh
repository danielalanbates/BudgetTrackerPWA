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
echo "Live URLs:"
echo "  Public (demo data): https://danielalanbates.github.io/BudgetTrackerPWA/"
echo "  With login (real data): https://autobudgeteer.batesai.org/"
echo ""
echo "Backend API deployed separately to batesai-website repo"
