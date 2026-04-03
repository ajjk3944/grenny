@echo off
echo ========================================
echo GreenBD - Online APK Build
echo ========================================
echo.
echo This builds APK online (No Android Studio needed!)
echo.
echo Requirements:
echo - Expo account (free at expo.dev)
echo - Internet connection
echo.
pause
cd /d "%~dp0"

echo.
echo Installing EAS CLI...
call npm install -g eas-cli

echo.
echo Building APK online...
call eas build -p android --profile preview --local=false

echo.
echo ========================================
echo When build completes:
echo 1. Download APK from the link above
echo 2. Transfer to your phone
echo 3. Install it
echo ========================================
pause
