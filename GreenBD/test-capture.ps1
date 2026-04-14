Write-Host "Testing Part 6: Capture & Submit Flow" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking required files..." -ForegroundColor Yellow
$files = @(
    "src\store\submissionStore.ts",
    "src\app\(tabs)\capture.tsx",
    "src\app\capture\_layout.tsx",
    "src\app\capture\submit.tsx",
    "src\app\capture\success.tsx",
    "src\utils\media.ts",
    "src\hooks\useSubmissionLimits.ts",
    "src\components\capture\PermissionScreen.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (missing)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$deps = @(
    "expo-camera",
    "expo-image-picker",
    "expo-image-manipulator",
    "expo-location",
    "expo-haptics",
    "expo-av",
    "expo-speech-recognition",
    "expo-file-system"
)

$packageJson = Get-Content "package.json" -Raw

foreach ($dep in $deps) {
    if ($packageJson -match $dep) {
        Write-Host "✓ $dep" -ForegroundColor Green
    } else {
        Write-Host "✗ $dep (not installed)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Part 6 implementation check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To test the capture flow:" -ForegroundColor Cyan
Write-Host "1. Run: npm start"
Write-Host "2. Open the app on a physical device (camera required)"
Write-Host "3. Tap the center capture button"
Write-Host "4. Grant camera and location permissions"
Write-Host "5. Take a photo or video"
Write-Host "6. Fill in category and summary"
Write-Host "7. Submit and verify success screen"
