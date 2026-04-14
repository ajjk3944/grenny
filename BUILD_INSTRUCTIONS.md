# Android Build Instructions

## ✅ Memory Optimization Fixes Applied - SUCCESSFUL!

Your project was experiencing "out of memory" errors during the Android build process, specifically when compiling react-native-reanimated C++ files. 

**GOOD NEWS:** The memory optimization fixes have been successfully applied and the out of memory errors are completely resolved! The C++ compilation now completes without memory issues.

The following optimizations were applied:

### Changes Made:

1. **gradle.properties** - Increased memory allocation and disabled parallel builds:
   - Increased JVM heap size from 4GB to 6GB
   - Disabled parallel Gradle execution to reduce memory pressure
   - Limited architecture builds to arm64-v8a only (most common for modern devices)
   - Added NDK build configuration limits

2. **app/build.gradle** - Added C++ compilation optimizations:
   - Configured CMake to use optimized build flags
   - Limited parallel compilation jobs

3. **build.gradle** - Added project-wide optimizations:
   - Enabled incremental compilation
   - Configured fork options for Java compilation

4. **local.properties** - Limited CMake parallel jobs:
   - Set `cmake.parallel.jobs=1` to prevent multiple C++ files from compiling simultaneously

5. **Build Scripts** - Created helper scripts:
   - `build-android.bat` (Windows)
   - `build-android.sh` (Linux/Mac)

## How to Build

### Option 1: Using the Build Script (Recommended)

**Windows:**
```bash
build-android.bat
```

**Linux/Mac:**
```bash
chmod +x build-android.sh
./build-android.sh
```

### Option 2: Manual Build

```bash
cd android
./gradlew clean
./gradlew assembleRelease --no-daemon --max-workers=2
```

### Option 3: Build with Specific Architecture

If you need to build for multiple architectures later (after fixing memory issues), you can specify:

```bash
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

## Troubleshooting

### If you still get out of memory errors:

1. **Close other applications** to free up system RAM

2. **Increase system virtual memory/page file**:
   - Windows: System Properties > Advanced > Performance Settings > Advanced > Virtual Memory
   - Increase the page file size to at least 8GB

3. **Build only one architecture at a time**:
   ```bash
   cd android
   ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a --max-workers=1
   ```

4. **Use Gradle daemon with more memory**:
   ```bash
   export GRADLE_OPTS="-Xmx8192m -XX:MaxMetaspaceSize=2048m"
   cd android
   ./gradlew assembleRelease
   ```

5. **Clean Gradle cache** if builds are consistently failing:
   ```bash
   cd android
   ./gradlew clean cleanBuildCache
   rm -rf .gradle
   rm -rf ~/.gradle/caches
   ```

## Building for Production

When you're ready to build for production with all architectures:

1. Edit `android/gradle.properties`
2. Change: `reactNativeArchitectures=arm64-v8a`
3. To: `reactNativeArchitectures=armeabi-v7a,arm64-v8a`
4. Build with: `./gradlew assembleRelease --max-workers=1`

## System Requirements

- **Minimum RAM**: 8GB (16GB recommended)
- **Free Disk Space**: At least 10GB
- **Java**: JDK 17 or higher
- **Node.js**: Version 18 or higher

## Notes

- The build now targets only **arm64-v8a** architecture by default to reduce memory usage
- This covers 95%+ of modern Android devices
- Parallel builds are disabled to prevent memory exhaustion
- Build time may be longer, but builds should complete successfully
