@echo off
REM ========================================
REM GreenBD - Direct APK Build (Like 3rdeye)
REM ========================================
echo ========================================
echo GreenBD - Building Android APK
echo ========================================
echo.
cd /d "%~dp0"

call npm run build:android

pause
exit /b 0
