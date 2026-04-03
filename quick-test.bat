@echo off
echo ========================================
echo GreenBD - Quick Test on Android
echo ========================================
echo.
echo EASIEST METHOD:
echo.
echo 1. Install "Expo Go" app from Play Store on your phone
echo 2. Make sure phone and PC are on same WiFi
echo 3. Starting server now...
echo.
echo When QR code appears:
echo    - Open Expo Go app on your phone
echo    - Scan the QR code
echo    - App will load on your phone!
echo.
echo ========================================
cd /d "%~dp0"
call npx expo start
pause
