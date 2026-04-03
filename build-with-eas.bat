@echo off
echo ========================================
echo GreenBD - Build APK with EAS (Cloud)
echo ========================================
echo.
echo This builds APK in the cloud (no Android SDK needed!)
echo You need: Expo account (free)
echo.
pause
cd /d "%~dp0"

echo Installing EAS CLI...
call npm install -g eas-cli

echo.
echo Logging in to Expo...
call eas login

echo.
echo Building APK (this takes 5-10 minutes)...
call eas build -p android --profile preview

echo.
echo ========================================
echo Build started in cloud!
echo.
echo When complete:
echo 1. Download APK from the link shown above
echo 2. Transfer to your phone
echo 3. Install it
echo ========================================
pause
