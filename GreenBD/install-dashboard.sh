#!/bin/bash

# GreenBD Dashboard Installation Script
# This script installs the required dependencies for Part 5

echo "🌱 GreenBD Dashboard Installation"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the GreenBD directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "📱 Next steps:"
    echo "1. Run 'npm start' to start the development server"
    echo "2. Scan the QR code with Expo Go app"
    echo "3. Navigate to the Dashboard tab"
    echo ""
    echo "📚 Documentation:"
    echo "- PART_5_SUMMARY.md - Feature overview"
    echo "- DASHBOARD_SETUP.md - Setup guide"
    echo "- QUICK_REFERENCE.md - Quick reference"
    echo ""
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above."
    exit 1
fi
