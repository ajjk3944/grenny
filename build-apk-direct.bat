@echo off
echo ========================================
echo GreenBD - Build APK Directly
echo ========================================
echo.
echo Building APK without Expo Go...
echo This will create an installable APK file
echo.
cd /d "%~dp0"

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building Android APK...
call npx expo run:android --variant release

echo.
echo ========================================
echo APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo Transfer this APK to your phone and install it!
echo ========================================
pause
