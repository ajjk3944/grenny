@echo off
REM ========================================
REM GreenBD - Easiest Way to Test on Phone
REM ========================================
echo.
echo ========================================
echo   GreenBD - Test on Your Android Phone
echo ========================================
echo.
echo EASIEST METHOD (No APK build needed!):
echo.
echo Step 1: On your Android phone
echo    - Open Play Store
echo    - Search "Expo Go"
echo    - Install it (it's free)
echo.
echo Step 2: Make sure phone and PC on same WiFi
echo.
echo Step 3: Press any key to start server...
pause
echo.
echo ========================================
echo Starting server...
echo ========================================
echo.
echo When QR code appears:
echo    1. Open Expo Go app on phone
echo    2. Tap "Scan QR code"
echo    3. Point camera at QR code below
echo    4. Your app will load instantly!
echo.
cd /d "%~dp0"

echo Installing ngrok package...
call npm install -g @expo/ngrok@^4.1.0

echo.
echo Starting Expo with tunnel...
call npx expo start --tunnel

pause
exit /b 0
