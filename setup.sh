#!/bin/bash

echo "🌱 GreenBD Setup Script"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install mobile app dependencies
echo "📦 Installing mobile app dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install mobile app dependencies"
    exit 1
fi

echo "✅ Mobile app dependencies installed"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "ℹ️  .env file already exists"
fi

echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo "✅ Server dependencies installed"
echo ""

# Setup server environment file
if [ ! -f .env ]; then
    echo "📝 Creating server .env file from template..."
    cp .env.example .env
    echo "✅ Server .env file created. Please update it with your configuration."
else
    echo "ℹ️  Server .env file already exists"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Setup PostgreSQL database"
echo "3. Run 'cd server && npx prisma migrate dev' to setup database"
echo "4. Run 'npm start' to start the mobile app"
echo "5. Run 'cd server && npm run dev' to start the backend server"
echo ""
echo "For more information, see README.md"
