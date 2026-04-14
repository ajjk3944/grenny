@echo off
REM ========================================
REM Complete Android Build Process
REM Purpose: Full clean build with all steps
REM ========================================
echo ========================================
echo GreenBD - Complete Build
echo ========================================
echo.
cd /d "%~dp0"

echo [1/6] Killing Java processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/6] Removing old Android folder...
if exist "android" (
    rmdir /s /q "android"
    timeout /t 2 /nobreak >nul
)

echo.
echo [3/6] Installing npm packages...
call npm install

echo.
echo [4/6] Creating fresh Android project...
call npx expo prebuild --platform android

if not exist "android\gradlew.bat" (
    echo.
    echo ERROR: Gradle wrapper not created!
    echo Trying alternative method...
    echo.
    echo [4b/6] Using expo run:android to generate project...
    call npx expo run:android --no-build-cache
)

echo.
echo [5/6] Checking for gradlew.bat...
if exist "android\gradlew.bat" (
    echo Found gradlew.bat - proceeding with build
    cd android
    call gradlew.bat assembleRelease
    cd ..
) else (
    echo.
    echo ERROR: gradlew.bat still not found
    echo.
    echo Please try cloud build instead:
    echo Run: build-with-eas.bat
    pause
    exit /b 1
)

echo.
echo [6/6] Checking for APK...
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS! APK Built Successfully
    echo ========================================
    echo.
    echo APK Location:
    echo %cd%\android\app\build\outputs\apk\release\app-release.apk
    echo.
    for %%A in ("android\app\build\outputs\apk\release\app-release.apk") do echo Size: %%~zA bytes
    echo.
    echo Next: Transfer to your Android phone and install!
    echo ========================================
) else (
    echo.
    echo Build failed or APK not found
    echo.
    echo Try cloud build instead: build-with-eas.bat
)

pause
exit /b 0
