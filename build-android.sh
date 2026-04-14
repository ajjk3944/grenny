#!/bin/bash

# Android Build Script with Memory Optimization
# This script helps build the Android app with reduced memory usage

echo "Starting Android build with memory optimizations..."

# Set environment variables to limit memory usage
export GRADLE_OPTS="-Xmx6144m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError"
export _JAVA_OPTIONS="-Xmx4096m"

# Limit number of parallel Gradle workers
export GRADLE_MAX_PARALLEL_FORKS=1

# Navigate to android directory
cd android

# Clean previous builds
echo "Cleaning previous builds..."
./gradlew clean

# Build release APK with limited parallelism
echo "Building release APK..."
./gradlew assembleRelease --no-daemon --max-workers=2 --parallel=false

echo "Build complete!"
