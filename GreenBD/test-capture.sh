#!/bin/bash

echo "Testing Part 6: Capture & Submit Flow"
echo "======================================"
echo ""

echo "Checking required files..."
files=(
  "src/store/submissionStore.ts"
  "src/app/(tabs)/capture.tsx"
  "src/app/capture/_layout.tsx"
  "src/app/capture/submit.tsx"
  "src/app/capture/success.tsx"
  "src/utils/media.ts"
  "src/hooks/useSubmissionLimits.ts"
  "src/components/capture/PermissionScreen.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file (missing)"
  fi
done

echo ""
echo "Checking dependencies..."
deps=(
  "expo-camera"
  "expo-image-picker"
  "expo-image-manipulator"
  "expo-location"
  "expo-haptics"
  "expo-av"
  "expo-speech-recognition"
  "expo-file-system"
)

for dep in "${deps[@]}"; do
  if grep -q "\"$dep\"" package.json; then
    echo "✓ $dep"
  else
    echo "✗ $dep (not installed)"
  fi
done

echo ""
echo "Part 6 implementation check complete!"
echo ""
echo "To test the capture flow:"
echo "1. Run: npm start"
echo "2. Open the app on a physical device (camera required)"
echo "3. Tap the center capture button"
echo "4. Grant camera and location permissions"
echo "5. Take a photo or video"
echo "6. Fill in category and summary"
echo "7. Submit and verify success screen"
