@echo off
echo ========================================
echo GreenBD - Local APK Build
echo ========================================
echo.
echo This builds APK locally on your PC
echo Requirements: Android Studio or Android SDK installed
echo.
pause
echo.
cd /d "%~dp0"

echo Checking for Android folder...
if not exist "android" (
    echo Creating Android native project...
    call npx expo prebuild --platform android
)

echo.
echo Building release APK...
cd android
call gradlew.bat assembleRelease

echo.
echo ========================================
echo BUILD COMPLETE!
echo.
echo APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo Next Steps:
echo 1. Copy app-release.apk to your phone
echo 2. Open it on your phone
echo 3. Enable "Install from unknown sources" if asked
echo 4. Install and run!
echo ========================================
cd ..
pause
