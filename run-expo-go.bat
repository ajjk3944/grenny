@echo off
REM ========================================
REM Run GreenBD with Expo Go
REM Purpose: Test app on phone without building APK
REM ========================================
echo ========================================
echo GreenBD - Expo Go Method
echo ========================================
echo.
echo STEPS:
echo.
echo 1. Install "Expo Go" app from Play Store on your phone
echo    (Search: Expo Go)
echo.
echo 2. Make sure your phone and PC are on SAME WiFi
echo.
echo 3. When QR code appears below:
echo    - Open Expo Go app
echo    - Tap "Scan QR code"
echo    - Scan the QR code
echo    - Your app will load!
echo.
echo ========================================
echo Starting development server...
echo ========================================
echo.
cd /d "%~dp0"
call npx expo start --tunnel

pause
exit /b 0
