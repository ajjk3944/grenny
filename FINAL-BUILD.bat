@echo off
echo ========================================
echo GreenBD - Final Clean Build
echo ========================================
echo.
echo Fixing all dependency issues and building...
echo.
cd /d "%~dp0"

echo [1/4] Cleaning everything...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f "package-lock.json"
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Installing fixed dependencies...
call npm install

echo.
echo [3/4] Building APK online...
call eas build -p android --profile preview --non-interactive

echo.
echo [4/4] Done!
echo Download APK from the link above
pause
