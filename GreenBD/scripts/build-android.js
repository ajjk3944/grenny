const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 Building GreenBD Android APK...\n');

const androidPath = path.join(__dirname, '../android');
const apkPath = path.join(androidPath, 'app/build/outputs/apk/release/app-release.apk');

async function buildAndroid() {
  try {
    // Step 1: Kill Java processes
    console.log('1️⃣ Stopping Java/Gradle processes...');
    try {
      execSync('taskkill /F /IM java.exe', { stdio: 'ignore' });
      execSync('taskkill /F /IM javaw.exe', { stdio: 'ignore' });
    } catch (e) {
      // Ignore if no processes found
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Processes stopped\n');

    // Step 2: Install dependencies
    console.log('2️⃣ Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');

    // Step 3: Create Android project if not exists
    if (!fs.existsSync(androidPath) || !fs.existsSync(path.join(androidPath, 'gradlew.bat'))) {
      console.log('3️⃣ Creating Android native project...');
      execSync('npx expo prebuild --platform android', { stdio: 'inherit' });
      console.log('✅ Android project created\n');
    } else {
      console.log('3️⃣ Android project already exists\n');
    }

    // Step 4: Build APK with Gradle
    console.log('4️⃣ Building APK with Gradle...');
    const isWindows = process.platform === 'win32';
    const gradleCmd = isWindows ? 'gradlew.bat' : './gradlew';
    
    execSync(`${gradleCmd} assembleRelease --no-daemon`, {
      stdio: 'inherit',
      cwd: androidPath
    });
    console.log('✅ APK built\n');

    // Step 5: Check APK
    if (fs.existsSync(apkPath)) {
      const stats = fs.statSync(apkPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('🎉 Android build complete!');
      console.log('📦 APK location: android/app/build/outputs/apk/release/app-release.apk');
      console.log(`📊 Size: ${sizeMB} MB`);
      console.log('\n✨ Transfer this APK to your phone and install!');
    } else {
      console.log('❌ APK not found at expected location');
    }

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run the build
buildAndroid();
