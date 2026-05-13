# Dark Innovative - Object Detection & Tracking System
## Complete Production Setup Guide

---

## 📋 Prerequisites

### VPS Requirements
- Ubuntu 20.04 or 22.04 LTS
- Minimum 2GB RAM (4GB recommended)
- 20GB storage (for database + uploads)
- Public static IP
- Root or sudo access

### Local Requirements
- Raspberry Pi 4 (2GB+ RAM recommended)
- Raspbian OS
- USB Camera or Pi Camera
- Network connectivity (WiFi or Ethernet)

---

## 🚀 VPS Deployment Steps

### Step 1: Update System
```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl wget git build-essential
```

### Step 2: Install Python & Node.js
```bash
# Python 3.10+
sudo apt-get install -y python3 python3-pip python3-venv python3-dev

# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
python3 --version
npm --version
```

### Step 3: Clone Project & Setup
```bash
# Create application directory
mkdir -p /var/www/eyes
cd /var/www/eyes

# Clone repository (or upload files)
git clone https://your-repo-url/eyes .
# OR download and extract project zip

# Set permissions
sudo chown -R $USER:$USER /var/www/eyes
chmod -R 755 /var/www/eyes
```

### Step 4: Setup Backend (FastAPI)
```bash
cd /var/www/eyes/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Test backend
python3 main.py
# Should output: "Uvicorn running on http://0.0.0.0:8000"
# Press Ctrl+C to stop
```

### Step 5: Setup Frontend (Next.js)
```bash
cd /var/www/eyes/frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://your-vps-ip:8000" > .env.local

# Build for production
npm run build

# Test frontend
npm start
# Should be available at http://localhost:3000
# Press Ctrl+C to stop
```

### Step 6: Install & Configure Nginx
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/eyes > /dev/null <<'EOF'
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name _;

    # Redirect HTTP to HTTPS (optional, requires SSL)
    # return 301 https://$server_name$request_uri;

    # Backend API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }

    # Uploads directory
    location /uploads/ {
        alias /var/www/eyes/backend/uploads/;
        expires 30d;
    }

    # API documentation
    location /docs {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }

    location /openapi.json {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }

    # Health check
    location /health {
        proxy_pass http://backend;
    }

    # Frontend (catch all)
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/eyes /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 7: Setup Systemd Services

**Backend Service:**
```bash
sudo tee /etc/systemd/system/eyes-backend.service > /dev/null <<'EOF'
[Unit]
Description=Eyes Backend (FastAPI)
After=network.target

[Service]
Type=notify
User=your-username
WorkingDirectory=/var/www/eyes/backend
Environment="PATH=/var/www/eyes/backend/venv/bin"
ExecStart=/var/www/eyes/backend/venv/bin/gunicorn \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    main:app
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

**Frontend Service:**
```bash
sudo tee /etc/systemd/system/eyes-frontend.service > /dev/null <<'EOF'
[Unit]
Description=Eyes Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/var/www/eyes/frontend
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### Step 8: Start Services
```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Enable services (auto-start on reboot)
sudo systemctl enable eyes-backend
sudo systemctl enable eyes-frontend

# Start services
sudo systemctl start eyes-backend
sudo systemctl start eyes-frontend

# Check status
sudo systemctl status eyes-backend
sudo systemctl status eyes-frontend

# View logs
sudo journalctl -u eyes-backend -f
sudo journalctl -u eyes-frontend -f
```

### Step 9: Enable HTTPS (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Update Nginx configuration
sudo tee /etc/nginx/sites-available/eyes > /dev/null <<'EOF'
# ... existing config ...
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of config ...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
EOF

# Restart Nginx
sudo systemctl restart nginx

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Step 10: Configure Firewall
```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS, and detection port
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp  # For direct backend access if needed

# Check rules
sudo ufw status
```

---

## 🐳 Docker Deployment (Alternative)

See `docker-compose.yml` in the project root.

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🍃 Raspberry Pi Deployment

See [RASPBERRY_PI_SETUP.md](./RASPBERRY_PI_SETUP.md)

---

## 🧪 Testing Deployment

### Test Backend
```bash
# Health check
curl http://your-vps-ip/health

# API docs
curl http://your-vps-ip/api/info

# Check database
curl http://your-vps-ip/api/stats
```

### Test Frontend
```bash
# Open in browser
http://your-vps-ip
```

### Test End-to-End
1. Start Raspberry Pi detector
2. Ensure network connectivity
3. Check dashboard for incoming detections

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# Backend logs
sudo journalctl -u eyes-backend -n 100 -f

# Frontend logs
sudo journalctl -u eyes-frontend -n 100 -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Database Cleanup
```bash
# Delete detections older than 30 days
curl -X DELETE "http://localhost:8000/api/detections?days=30"
```

### Performance Tuning
```bash
# Adjust Gunicorn workers (backend)
# Edit /etc/systemd/system/eyes-backend.service
# Change: --workers 4
# Formula: (2 × CPU_cores) + 1

# Monitor system resources
sudo htop
```

---

## 🔧 Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u eyes-backend -n 50

# Test database connection
cd /var/www/eyes/backend && python3 -c "from app.database.database import init_db; init_db(); print('DB OK')"

# Check port availability
sudo netstat -tlnp | grep 8000
```

### Frontend not loading
```bash
# Check logs
sudo journalctl -u eyes-frontend -n 50

# Test Node.js
node --version && npm --version
```

### Cannot upload detections from Pi
```bash
# Check network connectivity
ping your-vps-ip

# Check firewall
sudo ufw status

# Test API endpoint
curl -X POST http://your-vps-ip:8000/api/detections \
  -F "object_type=test" \
  -F "confidence=0.95" \
  -F "device_id=test-pi"
```

### High resource usage
```bash
# Check what's using resources
sudo top
sudo du -sh /var/www/eyes/backend/uploads

# Reduce gunicorn workers
# Clean old uploads
find /var/www/eyes/backend/uploads -mtime +30 -delete
```

---

## 📈 Performance Optimization

### Backend
- Use PostgreSQL instead of SQLite for production
- Enable caching for stats queries
- Configure connection pooling
- Use Redis for session management

### Frontend
- Enable Next.js image optimization
- Use CDN for static assets
- Implement request debouncing

### Edge Device
- Use YOLOv5s or YOLOv5m for Raspberry Pi 4
- Enable GPU acceleration if available
- Adjust frame resolution (640x480 or lower)
- Implement adaptive frame rate based on CPU load

---

## 📝 Environment Variables

### Backend (.env)
```
DEBUG=False
ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com
DATABASE_URL=sqlite:///./detections.db
WORKERS=4
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-domain.com
```

---

## ✅ Deployment Checklist

- [ ] VPS provisioned with required specs
- [ ] System updated and secured
- [ ] Python and Node.js installed
- [ ] Project cloned/uploaded
- [ ] Backend running and tested
- [ ] Frontend running and tested
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Systemd services configured
- [ ] Firewall configured
- [ ] Raspberry Pi detector running
- [ ] Database initialized
- [ ] Monitoring enabled
- [ ] Backups configured

---

## 📞 Support

For issues, check logs first using journalctl or docker-compose logs.
