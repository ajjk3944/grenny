@echo off
echo ========================================
echo GreenBD - Online APK Build
echo ========================================
echo.
echo Your Windows username has special characters
echo that prevent local builds.
echo.
echo Building online instead (takes 5-10 minutes)
echo.
pause
cd /d "%~dp0"

echo Installing EAS CLI...
call npm install -g eas-cli

echo.
echo Building APK online...
call eas build -p android --profile preview --non-interactive

echo.
echo ========================================
echo Download APK from the link above
echo and install on your phone!
echo ========================================
pause
