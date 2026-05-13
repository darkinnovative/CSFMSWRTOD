# Dark Innovative - Quick Reference Guide
## Common Commands & Configuration

---

## 🚀 Quick Start Commands

### Development (Local)

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
# http://localhost:8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# http://localhost:3000

# Detector (new terminal)
cd edge-device
pip install -r requirements.txt
python3 detector.py --api-url http://localhost:8000 --upload --cpu
```

### Production (Docker)

```bash
# Build and deploy
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production (VPS)

```bash
# Start backend
cd /var/www/eyes/backend
source venv/bin/activate
gunicorn --workers 4 --bind 127.0.0.1:8000 main:app

# Start frontend
cd /var/www/eyes/frontend
npm start

# View logs
sudo journalctl -u eyes-backend -f
sudo journalctl -u eyes-frontend -f

# Restart services
sudo systemctl restart eyes-backend
sudo systemctl restart eyes-frontend
```

---

## 📝 Environment Variables

### Backend (.env)
```
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
DATABASE_URL=sqlite:///./detections.db
# or PostgreSQL:
# DATABASE_URL=postgresql://user:pass@host/dbname
WORKERS=4
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
# or production:
# NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Edge Device (config.env)
```
API_URL=http://your-vps-ip:8000
DEVICE_ID=pi-001
MODEL_SIZE=yolov5n
CONFIDENCE_THRESHOLD=0.45
CAMERA_WIDTH=640
CAMERA_HEIGHT=480
CAMERA_FPS=30
USE_CPU=true
UPLOAD_ENABLED=true
```

---

## 🔌 API Quick Reference

### Create Detection
```bash
curl -X POST http://localhost:8000/api/detections \
  -F "object_type=person" \
  -F "confidence=0.95" \
  -F "device_id=pi-001" \
  -F "file=@image.jpg"
```

### Get Recent Detections
```bash
curl http://localhost:8000/api/detections/latest?limit=20
```

### Get Statistics
```bash
curl http://localhost:8000/api/stats
```

### Get Device Status
```bash
curl http://localhost:8000/api/device/status
```

### Update Device Status
```bash
curl -X POST http://localhost:8000/api/device/status \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "pi-001",
    "fps": 5.2,
    "cpu_usage": 85,
    "memory_usage": 55,
    "model_type": "yolov5n"
  }'
```

---

## 🐍 Python Commands

### Test Backend Import
```python
python3 -c "from main import app; print('✓ Backend OK')"
```

### Initialize Database
```python
python3 -c "from app.database.database import init_db; init_db(); print('✓ DB initialized')"
```

### Check Dependencies
```python
python3 -c "import fastapi, sqlalchemy, torch; print('✓ All dependencies')"
```

---

## 📦 Node Commands

### Frontend Build
```bash
cd frontend
npm run build       # Production build
npm start          # Start production server
npm run dev        # Development
npm run lint       # Check code style
npm test           # Run tests (if configured)
```

---

## 🔍 Monitoring & Logs

### Backend Logs
```bash
# Local
python3 main.py  # See output directly

# Production
sudo journalctl -u eyes-backend -n 50      # Last 50 lines
sudo journalctl -u eyes-backend -f         # Follow live
sudo journalctl -u eyes-backend -p err     # Errors only
```

### Frontend Logs
```bash
# Local
npm run dev  # See terminal output

# Production
sudo journalctl -u eyes-frontend -f
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
top              # Process monitor
htop             # Enhanced top
free -h          # Memory usage
df -h            # Disk usage
iftop            # Network traffic
```

---

## 🛠️ Troubleshooting Commands

### Check Service Status
```bash
# Systemd services
sudo systemctl status eyes-backend
sudo systemctl status eyes-frontend

# Docker containers
docker-compose ps
docker-compose logs backend
```

### Test Connectivity
```bash
ping your-vps-ip
curl http://your-vps-ip:8000/health
curl http://your-vps-ip:3000

# DNS
nslookup yourdomain.com

# Port status
sudo lsof -i :8000
sudo lsof -i :3000
sudo netstat -tlnp | grep :8000
```

### Restart Services
```bash
# Systemd
sudo systemctl restart eyes-backend
sudo systemctl restart eyes-frontend

# Docker
docker-compose restart backend
docker-compose restart frontend

# Manual
pkill -f "python.*main.py"  # Kill backend
pkill -f "npm start"         # Kill frontend
```

### Clear Data
```bash
# SQLite database
rm backend/detections.db

# Uploads
rm -rf backend/uploads/*

# Frontend cache
rm -rf frontend/.next

# Docker volumes
docker-compose down -v
```

---

## 🔧 Configuration Tuning

### Raspberry Pi Performance
```bash
# Reduce resolution for faster processing
python3 detector.py --width 320 --height 240

# Lower FPS for lower CPU usage
python3 detector.py --fps 15

# Use smaller model
python3 detector.py --model yolov5n

# Combined (testing)
python3 detector.py --width 320 --height 240 --fps 15 --cpu --headless
```

### Backend Performance
```python
# In config.py - increase workers
WORKERS=8  # More = better concurrency, higher memory

# Connection pooling (for PostgreSQL)
from sqlalchemy.pool import QueuePool
engine = create_engine(..., poolclass=QueuePool, pool_size=20)
```

### Database Cleanup
```bash
# Delete detections older than 30 days
curl -X DELETE "http://localhost:8000/api/detections?days=30"

# Or SQL directly
sqlite3 backend/detections.db "DELETE FROM detection_events WHERE timestamp < datetime('now', '-30 days');"
```

---

## 📊 Performance Monitoring

### Backend Stats
```bash
# Process info
ps aux | grep main.py

# API response time
time curl http://localhost:8000/api/stats

# Load testing
ab -n 100 -c 10 http://localhost:8000/api/detections/latest
```

### Database Stats
```bash
# SQLite size
du -h backend/detections.db

# Record count
sqlite3 backend/detections.db "SELECT COUNT(*) FROM detection_events;"

# Size by device
sqlite3 backend/detections.db "SELECT device_id, COUNT(*) FROM detection_events GROUP BY device_id;"
```

### Network Bandwidth
```bash
# Monitor in real-time (requires iftop)
sudo iftop -i eth0

# Check specific port usage
nethogs
```

---

## 🔐 Security Checks

### Firewall Status
```bash
sudo ufw status
sudo ufw status verbose

# Add rule
sudo ufw allow 8000/tcp
```

### SSL Certificate
```bash
# Check validity
openssl s_client -connect yourdomain.com:443

# Verify expiration
sudo certbot renew --dry-run
```

### API Authentication
```bash
# Test with headers
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/stats
```

---

## 📚 File Locations

### Configuration Files
- Backend config: `backend/config.py`
- Environment: `backend/.env`
- Nginx: `/etc/nginx/sites-available/eyes`
- Systemd: `/etc/systemd/system/eyes-*.service`

### Database
- SQLite: `backend/detections.db`
- Uploads: `backend/uploads/`

### Logs
- Backend: `/var/log/eyes-backend.log` (if configured)
- Nginx: `/var/log/nginx/`
- Systemd: `journalctl -u eyes-backend`

### Application
- Backend: `/var/www/eyes/backend/`
- Frontend: `/var/www/eyes/frontend/`
- Edge: `/home/pi/eyes/edge-device/`

---

## 🔄 Upgrade Procedure

### Update Backend
```bash
cd backend
source venv/bin/activate
git pull  # or download updates
pip install -r requirements.txt --upgrade
sudo systemctl restart eyes-backend
```

### Update Frontend
```bash
cd frontend
git pull
npm install
npm run build
sudo systemctl restart eyes-frontend
```

### Update Edge Device
```bash
cd edge-device
git pull
pip install -r requirements.txt --upgrade
sudo systemctl restart eyes-detector
```

---

## 🚀 Deployment Checklist

- [ ] Environment files configured
- [ ] Firewall rules applied
- [ ] SSL certificate valid
- [ ] Database initialized
- [ ] Services started
- [ ] Health checks passing
- [ ] API responding
- [ ] Frontend accessible
- [ ] Detector uploading
- [ ] Logs rotating
- [ ] Backups scheduled
- [ ] Monitoring enabled

---

## 📞 Useful Links

- **API Documentation:** http://localhost:8000/docs
- **FastAPI:** https://fastapi.tiangolo.com/
- **Next.js:** https://nextjs.org/docs
- **YOLOv5:** https://github.com/ultralytics/yolov5
- **Raspberry Pi:** https://www.raspberrypi.org/documentation/
- **Docker:** https://docs.docker.com/

---

