# Dark Innovative - Network Architecture & Deployment Guide
## Complete Networking Explanation & Firewall Configuration

---

## 🌍 Network Overview

```
┌─────────────────────────────────────┐
│   Home/Office Network               │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Raspberry Pi (192.168.x.y) │   │
│   │  ├─ Camera                  │   │
│   │  ├─ YOLOv5 Detector         │   │
│   │  └─ Tracking                │   │
│   └──────────────┬──────────────┘   │
│                  │                  │
│   Home Router    │ WiFi/Ethernet    │
│   (192.168.1.1)  │                  │
└──────────────────┼──────────────────┘
                   │
                   │ Internet
                   │ POST /api/detections
                   ↓
        ┌──────────────────────┐
        │   VPS Public IP      │
        │   (e.g. 77.88.99.1) │
        │                      │
        │   Ubuntu 20.04 LTS   │
        │   ┌────────────────┐ │
        │   │    Nginx       │ │
        │   │  (Port 80/443) │ │
        │   └────────┬───────┘ │
        │            │         │
        │   ┌────────┴────────┐ │
        │   ↓                 ↓ │
        │  /api/*          /    │
        │   ↓                 ↓ │
        │ Backend         Frontend
        │ (8000)         (3000)
        │  │   API            │ Dashboard
        │  ✓ SQLite        Next.js
        │  ✓ Uploads       React
        │                      │
        └──────────────────────┘
```

---

## 🔌 Network Connectivity

### Raspberry Pi → VPS Communication

**Protocol:** HTTP/HTTPS  
**Direction:** Outbound (Pi initiates)  
**Frequency:** Real-time (1-3 requests/second)  
**Payload Size:** 50-200KB per request

#### Request Flow
```
1. Pi captures frame (for 200ms)
2. YOLOv5 processes (150-250ms)
3. Detections found → encode to JSON
4. Crop detection area → compress to JPEG (~80KB)
5. POST to http://VPS_IP:8000/api/detections
6. Wait for response (50-500ms depending on network)
7. Continue to next frame
```

#### Upload Payload Example
```
POST http://77.88.99.1:8000/api/detections

Multipart Form Data:
  object_type: "person"
  confidence: 0.95
  device_id: "pi-001"
  timestamp: "2024-01-15T10:30:00Z"
  latitude: "40.7128"
  longitude: "-74.0060"
  file: <binary JPEG data, ~80KB>

Response (JSON):
{
  "id": 1523,
  "object_type": "person",
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00",
  "image_path": "uploads/pi-001/person_20240115_103000.jpg",
  "device_id": "pi-001"
}
```

### Browser → VPS Communication

**Protocol:** HTTP/HTTPS  
**Direction:** Bidirectional  
**Frequency:** Every 5 seconds (polling)

#### Frontend Polling Sequence
```
1. Browser: GET /api/detections/latest?limit=20
   Response: Array of 20 latest detections

2. Browser: GET /api/stats
   Response: {total, today, avg_confidence, etc}

3. Browser: GET /api/device/status
   Response: Array of device health metrics

4. Browser: GET /uploads/pi-001/person_*.jpg
   Response: Image file (for preview)

5. Wait 5 seconds → repeat
```

---

## 🔒 Firewall & Port Configuration

### VPS Firewall (Ubuntu UFW)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (critical!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow backend access (from Raspberry Pi only)
sudo ufw allow from ANY to ANY port 8000 proto tcp

# Status
sudo ufw status
```

### Port Mapping

| Port | Service | Protocol | Purpose | Source |
|------|---------|----------|---------|--------|
| **22** | SSH | TCP | Remote administration | Your IP |
| **80** | HTTP | TCP | Web traffic | Any (redirects to 443) |
| **443** | HTTPS | TCP | Encrypted web traffic | Any |
| **8000** | Backend | TCP | API endpoint (internal/Nginx) | Raspberry Pi + Nginx |
| **3000** | Frontend | TCP | Next.js (internal only) | Localhost only |
| **5432** | PostgreSQL | TCP | Database (internal only) | Localhost only |

### Network Access Control

**Recommended Setup:**
```bash
# Block all by default
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Whitelist only necessary ports
sudo ufw allow 22/tcp from 203.0.113.0/24  # Your office IP
sudo ufw allow 80/tcp from any
sudo ufw allow 443/tcp from any
sudo ufw allow 8000/tcp from any  # For Raspberry Pi uploads

# Rate limiting
sudo ufw limit 22/tcp  # Limit SSH attempts
```

---

## 📍 Raspberry Pi Network Configuration

### Connect to WiFi (Headless)

**Edit `/boot/wpa_supplicant.conf`:**
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
    ssid="Your_WiFi_SSID"
    psk="Your_WiFi_Password"
    key_mgmt=WPA-PSK
}
```

### Static IP Configuration

**Edit `/etc/dhcpcd.conf`:**
```bash
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

### Test Connectivity

```bash
# Check IP
hostname -I

# Ping gateway
ping 192.168.1.1

# Ping VPS
ping 77.88.99.1

# Test DNS
nslookup your-domain.com

# Check default route
ip route show
```

---

## 🌐 DNS & Domain Setup

### Using Domain Name (Recommended)

**Benefits:**
- Easy to remember
- HTTPS certificate friendly
- Works behind dynamic IPs
- Professional appearance

### DNS A Record Configuration

**Provider:** GoDaddy, Namecheap, etc.

```
Type: A
Name: eyes (or subdomain)
Value: 77.88.99.1 (your VPS IP)
TTL: 3600 (1 hour)
```

**Result:** `eyes.yourdomain.com` → `77.88.99.1`

### Raspberry Pi Configuration

**Update `/edge-device/config.env`:**
```
API_URL="http://eyes.yourdomain.com"
# or with HTTPS
API_URL="https://eyes.yourdomain.com"
```

---

## 🔐 SSL/HTTPS Setup

### Automatic (Let's Encrypt + Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d eyes.yourdomain.com

# Auto-renewal (automatic with systemd)
sudo systemctl enable certbot.timer
```

### Nginx HTTPS Configuration

**Update `nginx.conf`:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name eyes.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name eyes.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/eyes.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eyes.yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of server block ...
}
```

### Raspberry Pi HTTPS Upload

```bash
# If using self-signed cert, disable verification (dev only)
python3 detector.py \
    --api-url https://eyes.yourdomain.com \
    --upload

# Production: proper certificate required
```

---

## 🔄 Network Security Best Practices

### Rate Limiting

**Nginx configuration:**
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=10r/m;

location /api/detections {
    limit_req zone=upload_limit burst=5 nodelay;
    ...
}
```

### CORS Security

**Backend `main.py`:**
```python
# Restrict to specific origins
allowed_origins = [
    "http://localhost:3000",
    "https://eyes.yourdomain.com",
    "https://yourdomain.com"
]

app.add_middleware(CORSMiddleware, allow_origins=allowed_origins)
```

### API Authentication (Future)

**Token-based approach:**
```python
# Add to /api/detections POST
def verify_api_key(api_key: str):
    if not api_key in VALID_KEYS:
        raise HTTPException(status_code=401)

# Raspberry Pi usage
headers = {"Authorization": f"Bearer {API_KEY}"}
requests.post(url, headers=headers)
```

---

## 🧪 Network Testing

### Connectivity Tests

```bash
# From Raspberry Pi:
ping 77.88.99.1              # Basic connectivity
ping eyes.yourdomain.com     # DNS resolution

# From VPS:
sudo ufw status              # Check firewall
netstat -tlnp | grep 8000    # Check port 8000
curl http://localhost:8000/health  # Backend health

# From browser:
http://eyes.yourdomain.com   # Frontend access
http://eyes.yourdomain.com/docs  # API docs
```

### Load Testing

```bash
# From local machine:
ab -n 1000 -c 10 http://eyes.yourdomain.com/api/stats
# 1000 requests, 10 concurrent

# Monitor VPS:
top               # CPU/Memory
iostat 1 5        # Disk I/O
iftop             # Network traffic
```

---

## 📊 Network Performance Optimization

### Bandwidth Optimization

**Current:** ~1 Mbps per device  
**Optimizations:**

1. **Image Compression**
   - JPEG quality: 80 (default)
   - Resolution: 640x480
   - Size: ~50-150KB per detection

2. **Upload Batching**
   - Bundle 5-10 detections per request
   - Reduces overhead by 40%

3. **Selective Upload**
   - Only upload high-confidence (>0.8)
   - Skip low-quality frames
   - Reduces bandwidth by 60-70%

### Latency Optimization

1. **Keep-Alive Connections**
   ```python
   session = requests.Session()  # Reuse connection
   session.post(url, ...)
   ```

2. **Parallel Uploads**
   - Multiple thread upload queue
   - 10-20% latency improvement

3. **CDN for Static Assets**
   - Uploads served via CloudFlare
   - Geographically distributed

---

## 🚨 Troubleshooting Network Issues

### Raspberry Pi Can't Reach VPS

**Diagnosis:**
```bash
# Check local network
ping 192.168.1.1

# Check internet
ping 8.8.8.8

# Check VPS DNS
nslookup eyes.yourdomain.com

# Check specific port
curl -v http://77.88.99.1:8000

# Check firewall
ip rule list
```

**Solutions:**
1. Check router port forwarding
2. Verify VPS firewall allows port 8000
3. Check VPS is actually running
4. Try direct IP instead of domain
5. Check network bandwidth

### Slow Uploads

**Diagnosis:**
```bash
# Check connection speed
speedtest-cli

# Check latency
ping -c 10 77.88.99.1

# Monitor network
iftop

# Check disk I/O on VPS
iostat 1
```

**Solutions:**
1. Reduce image resolution
2. Increase JPEG compression
3. Skip frames or batch uploads
4. Use wired connection on Pi
5. Check VPS resources

### Certificate Errors

**Symptoms:** `SSL: CERTIFICATE_VERIFY_FAILED`

**Solutions:**
```bash
# Update certificates
sudo certbot renew

# Check certificate validity
openssl s_client -connect eyes.yourdomain.com:443

# For self-signed (dev only)
requests.post(..., verify=False)  # ⚠️ Not for production
```

---

## 📈 Monitoring Network Health

### Real-time Monitoring

```bash
# On VPS
watch -n 1 'netstat -an | grep :8000'
watch -n 1 'tail -20 /var/log/nginx/access.log'

# On Raspberry Pi
watch -n 1 'curl http://localhost:8000/api/device/status'
```

### Bandwidth Monitoring

```bash
# Install iftop
sudo apt-get install iftop

# Monitor in real-time
sudo iftop -n

# Interface-specific
sudo iftop -i wlan0
```

### Network Latency

```bash
# Measure RTT
ping -c 100 VPS_IP | tail -n 1

# More detailed with mtr
mtr -r -c 100 VPS_IP
```

---

## 🎯 Network Scaling

### Single Device → 10 Devices

**No changes needed** - VPS can handle

### 10 Devices → 100 Devices

**Recommendations:**
1. Upgrade to PostgreSQL
2. Add load balancer (HAProxy)
3. Implement request batching
4. Add Redis caching
5. Separate backend instances

### 100+ Devices

**Enterprise setup:**
1. Kubernetes cluster
2. Database replication
3. Multi-region deployment
4. CDN for uploads
5. Message queue (RabbitMQ)
6. Analytics pipeline (Kafka)

---

## 📞 Network Troubleshooting Checklist

- [ ] VPS public IP accessible
- [ ] Firewall allows ports 80, 443, 8000
- [ ] DNS resolves to VPS IP
- [ ] Raspberry Pi can ping VPS
- [ ] Backend responds on :8000
- [ ] Frontend accessible on :3000
- [ ] Nginx reverse proxy working
- [ ] HTTPS certificate valid
- [ ] Upload latency < 1 second
- [ ] No packet loss
- [ ] Database connection stable
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] API authentication active
- [ ] Backup located on separate server

---

