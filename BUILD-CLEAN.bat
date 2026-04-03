@echo off
REM ========================================
REM GreenBD - Clean Build (Kill all processes)
REM ========================================
echo ========================================
echo GreenBD - Clean Build
echo ========================================
echo.
cd /d "%~dp0"

echo [1/7] Killing all Java/Gradle processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
echo Waiting for processes to close...
timeout /t 3 /nobreak >nul

echo.
echo [2/7] Stopping Gradle daemon...
if exist "android\gradlew.bat" (
    cd android
    call gradlew.bat --stop 2>nul
    cd ..
)
timeout /t 2 /nobreak >nul

echo.
echo [3/7] Deleting android folder...
if exist "android" (
    rmdir /s /q "android" 2>nul
    timeout /t 2 /nobreak >nul
)

echo.
echo [4/7] Installing dependencies...
call npm install

echo.
echo [5/7] Creating fresh Android project...
call npx expo prebuild --platform android

echo.
echo [6/7] Configuring Android SDK...
if defined ANDROID_HOME (
    echo sdk.dir=%ANDROID_HOME:\=/% > android\local.properties
    echo SDK: %ANDROID_HOME%
) else if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo sdk.dir=%LOCALAPPDATA:\=/%/Android/Sdk > android\local.properties
    echo SDK: %LOCALAPPDATA%\Android\Sdk
) else (
    echo ERROR: Android SDK not found!
    pause
    exit /b 1
)

echo.
echo [7/7] Building APK...
cd android
call gradlew.bat assembleRelease --no-daemon

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS! APK Built
    echo ========================================
    echo.
    echo Location: %cd%\app\build\outputs\apk\release\app-release.apk
    echo.
    for %%A in ("app\build\outputs\apk\release\app-release.apk") do (
        set /a sizeMB=%%~zA / 1048576
        echo Size: !sizeMB! MB
    )
    echo.
    echo Transfer to your phone and install!
    echo ========================================
) else (
    echo ERROR: APK not found
)

cd ..
pause
exit /b 0
