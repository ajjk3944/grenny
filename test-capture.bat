@echo off
echo Testing Part 6: Capture ^& Submit Flow
echo ======================================
echo.

echo Checking required files...
if exist "src\store\submissionStore.ts" (echo ✓ src\store\submissionStore.ts) else (echo ✗ src\store\submissionStore.ts)
if exist "src\app\(tabs)\capture.tsx" (echo ✓ src\app\(tabs)\capture.tsx) else (echo ✗ src\app\(tabs)\capture.tsx)
if exist "src\app\capture\_layout.tsx" (echo ✓ src\app\capture\_layout.tsx) else (echo ✗ src\app\capture\_layout.tsx)
if exist "src\app\capture\submit.tsx" (echo ✓ src\app\capture\submit.tsx) else (echo ✗ src\app\capture\submit.tsx)
if exist "src\app\capture\success.tsx" (echo ✓ src\app\capture\success.tsx) else (echo ✗ src\app\capture\success.tsx)
if exist "src\utils\media.ts" (echo ✓ src\utils\media.ts) else (echo ✗ src\utils\media.ts)
if exist "src\hooks\useSubmissionLimits.ts" (echo ✓ src\hooks\useSubmissionLimits.ts) else (echo ✗ src\hooks\useSubmissionLimits.ts)
if exist "src\components\capture\PermissionScreen.tsx" (echo ✓ src\components\capture\PermissionScreen.tsx) else (echo ✗ src\components\capture\PermissionScreen.tsx)

echo.
echo Checking dependencies...
findstr /C:"expo-camera" package.json >nul && echo [32m✓[0m expo-camera || echo [31m✗[0m expo-camera
findstr /C:"expo-image-picker" package.json >nul && echo [32m✓[0m expo-image-picker || echo [31m✗[0m expo-image-picker
findstr /C:"expo-image-manipulator" package.json >nul && echo [32m✓[0m expo-image-manipulator || echo [31m✗[0m expo-image-manipulator
findstr /C:"expo-location" package.json >nul && echo [32m✓[0m expo-location || echo [31m✗[0m expo-location
findstr /C:"expo-haptics" package.json >nul && echo [32m✓[0m expo-haptics || echo [31m✗[0m expo-haptics
findstr /C:"expo-av" package.json >nul && echo [32m✓[0m expo-av || echo [31m✗[0m expo-av
findstr /C:"expo-speech-recognition" package.json >nul && echo [32m✓[0m expo-speech-recognition || echo [31m✗[0m expo-speech-recognition
findstr /C:"expo-file-system" package.json >nul && echo [32m✓[0m expo-file-system || echo [31m✗[0m expo-file-system

echo.
echo Part 6 implementation check complete!
echo.
echo To test the capture flow:
echo 1. Run: npm start
echo 2. Open the app on a physical device (camera required)
echo 3. Tap the center capture button
echo 4. Grant camera and location permissions
echo 5. Take a photo or video
echo 6. Fill in category and summary
echo 7. Submit and verify success screen
pause
