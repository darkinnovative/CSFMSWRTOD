#!/bin/bash
# Quick start script for local development

set -e

echo "=========================================="
echo "Eyes - Quick Start Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check dependencies
echo "🔍 Checking dependencies..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} Python 3 $(python3 --version | awk '{print $2}')"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm $(npm --version)"

echo ""
echo "📦 Installing dependencies..."

# Backend setup
echo -e "${YELLOW}→${NC} Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
deactivate
cd ..
echo -e "${GREEN}✓${NC} Backend ready"

# Frontend setup
echo -e "${YELLOW}→${NC} Setting up frontend..."
cd frontend
npm install -q
cd ..
echo -e "${GREEN}✓${NC} Frontend ready"

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Start services:"
echo ""
echo "📌 Backend (Terminal 1):"
echo "   cd backend && source venv/bin/activate && python3 main.py"
echo ""
echo "📌 Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "📌 Detector (Terminal 3 - if Pi available):"
echo "   cd edge-device && python3 detector.py --upload"
echo ""
echo "Dashboard: http://localhost:3000"
echo "API Docs:  http://localhost:8000/docs"
echo ""
