@echo off
REM ========================================
REM Simple APK Build (Skip prebuild)
REM Purpose: Build APK using existing android folder
REM ========================================
echo ========================================
echo GreenBD - Simple Build
echo ========================================
echo.
echo This will build APK from existing Android project
echo.
pause

cd /d "%~dp0"

echo.
echo Stopping Gradle daemons...
cd android
call gradlew.bat --stop
timeout /t 3 /nobreak >nul

echo.
echo Building release APK...
call gradlew.bat assembleRelease

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo APK: %cd%\app\build\outputs\apk\release\app-release.apk
    echo.
    for %%A in ("app\build\outputs\apk\release\app-release.apk") do echo Size: %%~zA bytes
    echo.
    echo Install this on your Android phone!
    echo ========================================
) else (
    echo.
    echo Build failed - check errors above
)

cd ..
pause
exit /b 0
