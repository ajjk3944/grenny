@echo off
echo ========================================
echo GreenBD - Android Installation Guide
echo ========================================
echo.
echo Choose your method:
echo.
echo [1] EASIEST - Expo Go (No build needed)
echo [2] Build APK for direct install
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" goto expo_go
if "%choice%"=="2" goto build_apk

:expo_go
echo.
echo ========================================
echo Method 1: Using Expo Go (Recommended)
echo ========================================
echo.
echo Step 1: Install Expo Go on your Android phone
echo    - Open Play Store
echo    - Search "Expo Go"
echo    - Install it
echo.
echo Step 2: Starting development server...
cd /d "%~dp0"
call npm start
goto end

:build_apk
echo.
echo ========================================
echo Method 2: Build APK
echo ========================================
echo.
echo This will build an APK you can install directly
echo Building preview APK...
cd /d "%~dp0"
call npm run build:preview-apk
echo.
echo After build completes:
echo 1. Download APK from the link provided
echo 2. Transfer to your phone
echo 3. Install it (enable "Install from unknown sources")
goto end

:end
pause
