#!/bin/bash
set -e

echo "Building PWA..."
npm run build

echo "Deploying to GitHub Pages..."
git add dist/
git commit -m "Deploy dist to GitHub Pages" || echo "No changes to commit"
git push origin main

echo ""
echo "✓ Build complete!"
echo ""
echo "To enable GitHub Pages:"
echo "1. Go to: https://github.com/danielalanbates/BudgetTrackerPWA/settings/pages"
echo "2. Under 'Build and deployment', select Source: Deploy from a branch"
echo "3. Branch: main, Folder: /dist"
echo "4. Click Save"
echo ""
echo "Once enabled, your app will be live at:"
echo "https://danielalanbates.github.io/BudgetTrackerPWA/"
