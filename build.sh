#!/bin/bash

# Budget Tracker PWA - Build and Deploy Script
# Builds the PWA and copies to iCloud Drive for syncing

set -e

PROJECT_DIR="/Users/daniel/Library/Application Support/BatesAI/data/software-developer-a/temporary/code/BudgetTrackerPWA"
ICLOUD_DIR="/Users/daniel/Library/Mobile Documents/com~apple~CloudDocs/BatesAI/BudgetTrackerPWA"

echo "Building Budget Tracker PWA..."
cd "$PROJECT_DIR"
npm run build

echo "Copying build to iCloud Drive..."
mkdir -p "$ICLOUD_DIR/build"
rm -rf "$ICLOUD_DIR/build"/*
cp -r "$PROJECT_DIR/dist/"* "$ICLOUD_DIR/build/"

echo ""
echo "✓ Build complete!"
echo ""
echo "Files location: $ICLOUD_DIR/build/"
echo ""
echo "To test on iPhone:"
echo "1. Deploy the 'build' folder to your web server"
echo "2. Open the URL in Safari on iPhone"
echo "3. Tap Share → Add to Home Screen"
echo ""
