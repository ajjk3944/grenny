@echo off
REM ========================================
REM Kill Gradle processes and build APK
REM Purpose: Stop all Gradle processes and build clean APK
REM ========================================
echo ========================================
echo GreenBD - Clean Build
echo ========================================
echo.
echo [1/5] Stopping all Java/Gradle processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/5] Cleaning Gradle cache...
cd /d "%~dp0"
if exist "android\.gradle" (
    rmdir /s /q "android\.gradle" 2>nul
)
if exist "%USERPROFILE%\.gradle\daemon" (
    rmdir /s /q "%USERPROFILE%\.gradle\daemon" 2>nul
)

echo.
echo [3/5] Installing dependencies...
call npm install

echo.
echo [4/5] Creating Android project (without clean)...
call npx expo prebuild --platform android

echo.
echo [5/5] Building APK...
cd android
call gradlew.bat assembleRelease

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS! APK Built
    echo ========================================
    echo.
    echo Location: %cd%\app\build\outputs\apk\release\app-release.apk
    echo.
    echo Transfer this to your Android phone and install!
    echo ========================================
) else (
    echo.
    echo ERROR: APK not found
)

cd ..
pause
exit /b 0
