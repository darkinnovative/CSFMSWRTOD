#!/bin/bash

echo "🚀 Starting deployment..."

# Kill any existing processes
pkill -f "uvicorn" || true
pkill -f "npm" || true

# Deploy backend
echo "📦 Deploying backend..."
cd backend
pip install -r requirements.txt
python -m alembic upgrade head
python -m alembic revision head
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Deploy frontend
echo "🎨 Deploying frontend..."
cd frontend
npm ci
npm run build
nohup npm start &

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Health checks
echo "🔍 Checking service health..."
if curl -f http://localhost:8000/health; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1

if curl -f http://localhost:3000; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1

echo "✅ Deployment completed!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
