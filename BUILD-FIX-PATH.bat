@echo off
REM ========================================
REM GreenBD - Build with Path Fix
REM ========================================
echo ========================================
echo GreenBD - Building with Path Fix
echo ========================================
echo.
cd /d "%~dp0"

echo [1/6] Killing processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/6] Cleaning android folder...
if exist "android" (
    rmdir /s /q "android" 2>nul
    timeout /t 2 /nobreak >nul
)

echo.
echo [3/6] Installing dependencies...
call npm install

echo.
echo [4/6] Creating Android project...
call npx expo prebuild --platform android

echo.
echo [5/6] Configuring SDK with escaped path...
REM Use short path (8.3 format) to avoid special characters
for %%I in ("%LOCALAPPDATA%\Android\Sdk") do set "SDK_SHORT=%%~sI"
echo sdk.dir=%SDK_SHORT:\=/% > android\local.properties
echo SDK configured: %SDK_SHORT%

echo.
echo [6/6] Building APK...
cd android
call gradlew.bat assembleRelease --no-daemon

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo APK: %cd%\app\build\outputs\apk\release\app-release.apk
    echo.
    echo Install on your phone!
    echo ========================================
) else (
    echo ERROR: APK not found
)

cd ..
pause
exit /b 0
