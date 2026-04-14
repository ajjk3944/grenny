@echo off
REM ========================================
REM Android SDK Setup Fix
REM Purpose: Configure Android SDK path for GreenBD app build
REM Author: GreenBD Team
REM Date: 2026-04-03
REM ========================================
echo ========================================
echo Android SDK Setup Fix
echo ========================================
echo.
echo You need Android SDK installed. Choose option:
echo.
echo [1] I have Android Studio installed
echo [2] I need to install Android Studio
echo [3] Create local.properties manually
echo.
set /p "choice=Enter choice (1, 2, or 3): "

if "%choice%"=="1" goto find_sdk
if "%choice%"=="2" goto install_studio
if "%choice%"=="3" goto manual_setup
echo Invalid choice
exit /b 1

REM ========================================
REM Subroutine: find_sdk
REM Purpose: Locate Android SDK in common installation paths
REM Returns: Sets SDK_PATH variable
REM ========================================
:find_sdk
echo.
echo Common Android SDK locations:
echo.
if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo Found: %LOCALAPPDATA%\Android\Sdk
    set "SDK_PATH=%LOCALAPPDATA%\Android\Sdk"
    goto create_properties
)
echo.
echo SDK not found in common locations.
echo Please enter your Android SDK path:
set /p "SDK_PATH=SDK Path: "
goto create_properties

REM ========================================
REM Subroutine: create_properties
REM Purpose: Create local.properties file with SDK path
REM Returns: Exit code 0 on success
REM ========================================
:create_properties
echo.
echo Creating local.properties file...
cd /d "%~dp0"
echo sdk.dir=%SDK_PATH:\=/% > android\local.properties
echo.
echo Setting ANDROID_HOME environment variable...
setx ANDROID_HOME "%SDK_PATH%"
echo.
echo ========================================
echo Setup Complete!
echo.
echo local.properties created at:
echo %cd%\android\local.properties
echo.
echo ANDROID_HOME set to:
echo %SDK_PATH%
echo.
echo Now run: setup-and-build.bat again
echo ========================================
goto end

REM ========================================
REM Subroutine: install_studio
REM Purpose: Guide user to download Android Studio
REM Returns: Exit code 0
REM ========================================
:install_studio
echo.
echo ========================================
echo Download Android Studio from:
echo https://developer.android.com/studio
echo.
echo After installation:
echo 1. Open Android Studio
echo 2. Go to Settings ^> Languages ^& Frameworks ^> Android SDK
echo 3. Note the SDK Location path
echo 4. Run this script again and choose option 1
echo ========================================
start https://developer.android.com/studio
goto end

REM ========================================
REM Subroutine: manual_setup
REM Purpose: Manually configure SDK path
REM Returns: Exit code 0 on success
REM ========================================
:manual_setup
echo.
echo Enter your Android SDK path:
echo Example: %LOCALAPPDATA%\Android\Sdk
set /p "SDK_PATH=SDK Path: "
cd /d "%~dp0"
echo sdk.dir=%SDK_PATH:\=/% > android\local.properties
setx ANDROID_HOME "%SDK_PATH%"
echo.
echo Done! Now run setup-and-build.bat again
goto end

REM ========================================
REM Subroutine: end
REM Purpose: Clean exit point
REM Returns: Exit code 0
REM ========================================
:end
pause
exit /b 0
