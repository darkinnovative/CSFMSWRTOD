#!/bin/bash
# Docker deployment script

set -e

echo "=========================================="
echo "Eyes - Docker Deployment"
echo "=========================================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "✓ Docker $(docker --version)"
echo "✓ Docker Compose $(docker-compose --version)"
echo ""

# Build and start
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Services running:"
echo "  • Backend:     http://localhost:8000"
echo "  • Frontend:    http://localhost:3000"
echo "  • API Docs:    http://localhost:8000/docs"
echo "  • Database:    postgres:5432"
echo "  • Redis:       localhost:6379"
echo "  • Nginx:       http://localhost"
echo ""
echo "View logs:"
echo "  docker-compose logs -f [service]"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo ""
