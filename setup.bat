@echo off
echo.
echo 🌱 GreenBD Setup Script
echo =======================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js is installed
echo.

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ npm is installed
echo.

echo 📦 Installing mobile app dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install mobile app dependencies
    exit /b 1
)

echo ✅ Mobile app dependencies installed
echo.

if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
) else (
    echo ℹ️  .env file already exists
)

echo.
echo 📦 Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install server dependencies
    exit /b 1
)

echo ✅ Server dependencies installed
echo.

if not exist .env (
    echo 📝 Creating server .env file from template...
    copy .env.example .env
    echo ✅ Server .env file created. Please update it with your configuration.
) else (
    echo ℹ️  Server .env file already exists
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env files with your configuration
echo 2. Setup PostgreSQL database
echo 3. Run 'cd server && npx prisma migrate dev' to setup database
echo 4. Run 'npm start' to start the mobile app
echo 5. Run 'cd server && npm run dev' to start the backend server
echo.
echo For more information, see README.md
pause
