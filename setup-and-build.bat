@echo off
REM ========================================
REM GreenBD - Complete Setup and Build
REM ========================================
echo ========================================
echo GreenBD - Complete Setup and Build
echo ========================================
echo.
echo This will:
echo 1. Install all dependencies
echo 2. Create Android native project
echo 3. Configure Android SDK
echo 4. Build APK file
echo.
echo Requirements:
echo - Node.js installed
echo - Android SDK or Android Studio installed
echo.
set /p "continue=Continue? (y/n): "
if /i not "%continue%"=="y" exit

cd /d "%~dp0"

echo.
echo [1/5] Installing npm packages...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Creating Android native project...
call npx expo prebuild --platform android --clean
if errorlevel 1 (
    echo ERROR: prebuild failed
    pause
    exit /b 1
)

echo.
echo [3/5] Configuring Android SDK...
if defined ANDROID_HOME (
    echo sdk.dir=%ANDROID_HOME:\=/% > android\local.properties
    echo SDK configured: %ANDROID_HOME%
) else if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo sdk.dir=%LOCALAPPDATA:\=/%/Android/Sdk > android\local.properties
    echo SDK configured: %LOCALAPPDATA%\Android\Sdk
) else (
    echo ERROR: Android SDK not found!
    echo Please run: fix-android-sdk.bat first
    pause
    exit /b 1
)

echo.
echo [4/5] Building release APK...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ERROR: Build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [5/5] Locating APK...
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
    echo Next Steps:
    echo 1. Transfer app-release.apk to your Android phone
    echo 2. On phone, open the APK file
    echo 3. Allow installation from unknown sources
    echo 4. Install and enjoy GreenBD!
    echo ========================================
) else (
    echo ERROR: APK file not found
)

pause
exit /b 0
