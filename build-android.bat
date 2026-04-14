@echo off
REM Android Build Script with Memory Optimization for Windows
REM This script helps build the Android app with reduced memory usage

echo Starting Android build with memory optimizations...

REM Set environment variables to limit memory usage
set GRADLE_OPTS=-Xmx6144m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError
set _JAVA_OPTIONS=-Xmx4096m

REM Limit number of parallel Gradle workers
set GRADLE_MAX_PARALLEL_FORKS=1

REM Navigate to android directory
cd android

REM Clean previous builds
echo Cleaning previous builds...
call gradlew.bat clean

REM Build release APK with limited parallelism
echo Building release APK...
call gradlew.bat assembleRelease --no-daemon --max-workers=2

echo Build complete!
cd ..
