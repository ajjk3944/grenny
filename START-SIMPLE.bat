@echo off
REM ========================================
REM GreenBD - Simple Start (Same WiFi)
REM ========================================
echo.
echo ========================================
echo   GreenBD - Test on Your Android Phone
echo ========================================
echo.
echo REQUIREMENTS:
echo 1. Install "Expo Go" app on your phone (Play Store)
echo 2. Phone and PC must be on SAME WiFi network
echo.
echo Press any key to start...
pause
echo.
echo ========================================
echo Starting server...
echo ========================================
echo.
echo When server starts:
echo    1. Open Expo Go app on phone
echo    2. Your app will appear automatically
echo    OR
echo    3. Scan the QR code shown below
echo.
cd /d "%~dp0"
call npx expo start

pause
exit /b 0
