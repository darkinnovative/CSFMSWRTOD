# Dark Innovative - Object Detection & Tracking System
## Architecture & Design Documentation

---

## 🏗️ System Architecture

```
┌─────────────────┐
│  Raspberry Pi   │
│  + YOLOv5n      │
│  + Tracking     │
│  + Camera       │
└────────┬────────┘
         │ HTTP/HTTPS POST
         │ /api/detections
         ↓
┌──────────────────────┐
│   VPS Backend        │
│   (FastAPI)          │
│ 0.0.0.0:8000         │
│ ├─ SQLite DB         │
│ ├─ Image Storage     │
│ └─ Tracking State    │
└────────┬─────────────┘
         │ Reverse Proxy
         │ Port 80/443
         ↓
┌──────────────────────┐
│   Nginx              │
│   (Load Balancer)    │
│ Port 80/443          │
└────────┬─────────────┘
         │ Split Routes
         ├──────────────────────┐
         ↓                      ↓
   /api/* → Backend    / → Frontend
   /uploads/*          (Next.js on 3000)
```

---

## 🔌 Network Flow

### Detection Upload Flow

1. **Capture Phase** (Raspberry Pi)
   - Camera captures frame (30 FPS)
   - YOLOv5n processes frame (4-6 FPS avg on Pi 4)
   - Detects objects with confidence scores
   - Centroid tracking maintains object IDs

2. **Transmission Phase**
   - Encode detection to JSON
   - Crop detection area from frame
   - Compress to JPEG (~50-100KB)
   - POST to: `http://VPS_IP:8000/api/detections`
   - Payload: form-data with image file + metadata

3. **Storage Phase** (VPS Backend)
   - Validate detection data
   - Generate unique filename
   - Save image to `/backend/uploads/device-id/timestamp_object.jpg`
   - Insert database record
   - Update device status

4. **Display Phase** (Web Dashboard)
   - Frontend polls: `GET /api/detections/latest?limit=20`
   - Fetches stats: `GET /api/stats`
   - Displays in real-time dashboard
   - Shows images with thumbnails

---

## 💾 Database Schema

### DetectionEvent Table
```sql
CREATE TABLE detection_events (
    id INTEGER PRIMARY KEY,
    object_type VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(255),
    device_id VARCHAR(100) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for fast queries
CREATE INDEX idx_device_id ON detection_events(device_id);
CREATE INDEX idx_timestamp ON detection_events(timestamp);
CREATE INDEX idx_object_type ON detection_events(object_type);
```

### DeviceStatus Table
```sql
CREATE TABLE device_status (
    id INTEGER PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    last_heartbeat DATETIME DEFAULT CURRENT_TIMESTAMP,
    fps FLOAT DEFAULT 0.0,
    cpu_usage FLOAT DEFAULT 0.0,
    memory_usage FLOAT DEFAULT 0.0,
    model_type VARCHAR(50) DEFAULT 'yolov5n',
    is_online BOOLEAN DEFAULT TRUE
);
```

---

## 🌐 API Endpoints

### Detection Management

**POST /api/detections**
- Create detection with image upload
- Content-Type: multipart/form-data
- Response: Detection object with ID

**GET /api/detections**
- List detections with filtering
- Query params: device_id, limit, offset, object_type
- Response: Array of detections

**GET /api/detections/latest**
- Get N most recent detections
- Query params: limit (default 10, max 100)
- Response: Array of detections

**GET /api/detections/{id}**
- Get specific detection
- Response: Single detection object

**DELETE /api/detections/{id}**
- Delete specific detection
- Response: Success message

**DELETE /api/detections**
- Delete old detections
- Query params: days (older than N days)
- Response: Count of deleted records

### Statistics

**GET /api/stats**
- Overall system statistics
- Response: total_detections, detections_today, unique_objects, average_confidence, last_detection

**POST /api/stats/by-object**
- Detections grouped by object type
- Response: Array with {object_type, count, avg_confidence}

**POST /api/stats/by-device**
- Detections grouped by device
- Response: Array with {device_id, count, last_detection}

### Device Management

**POST /api/device/status**
- Update device health metrics
- Body: {device_id, fps, cpu_usage, memory_usage, model_type}
- Response: {message, device_id}

**GET /api/device/status**
- Get all device statuses
- Response: Array of device objects

### System

**GET /**
- Root endpoint with system info

**GET /health**
- Health check endpoint

**GET /api/info**
- System information and available endpoints

---

## 🔐 Security Considerations

### CORS Configuration
```python
# In main.py
allowed_origins = ["http://localhost:3000", "https://yourdomain.com"]
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins)
```

### Reverse Proxy (Nginx)
- Routes `/api/*` to backend (8000)
- Routes `/uploads/*` to static files
- Routes `/` to frontend (3000)
- Handles SSL/TLS termination
- Implements rate limiting (optional)

### Database Security
- Use environment variables for connection strings
- SQLite for development, PostgreSQL for production
- Regular backups of detection database
- Clean old records periodically

### API Security  
- Enable API authentication (API keys) for future upgrades
- Rate limiting on upload endpoints
- Input validation on all endpoints
- HTTPS for all external communication

### File Upload Security
- Limit file size (10MB default)
- Validate file types
- Store outside web root
- Serve via secure headers

---

## 📊 Performance Characteristics

### Backend Performance (FastAPI + SQLite)
- **Throughput:** ~100 requests/second
- **Latency:** 10-50ms per request
- **Concurrent connections:** 100+
- **Database queries:** Sub-millisecond for indexed columns
- **Memory usage:** ~100MB base + storage

### Frontend Performance (Next.js)
- **Page load:** < 2 seconds
- **Dashboard refresh:** 5 seconds (configurable)
- **Chart rendering:** < 500ms
- **Memory usage:** ~150MB in browser

### Edge Device (Raspberry Pi 4)
- **Processing:** 4-6 FPS (YOLOv5n)
- **CPU usage:** 80-95%
- **Memory:** 400-600MB
- **Upload rate:** ~1-3 detections/second
- **Network bandwidth:** 1-5 Mbps

---

## 🔄 Deployment Topology

### Single Server (All-in-One)
```
VPS Ubuntu 20.04
├─ Python 3.10 + FastAPI (port 8000)
├─ Node.js + Next.js (port 3000)
├─ Nginx (port 80/443)
├─ SQLite database
└─ /uploads storage
```

### Multi-Server (Recommended Production)
```
┌─────────────────────────────────────┐
│  Load Balancer (Nginx/HAProxy)      │
│  Port 80/443                        │
└─────────┬──────────┬────────────────┘
          │          │
    ┌─────┴──┐  ┌────┴──────┐
    ↓        ↓  ↓           ↓
Backend1  Backend2    Frontend1
(8000)    (8000)      (3000)
    ├────────┤
    └────┬───┘
         │
    PostgreSQL
    (Replicated)
```

---

## 🎯 Scalability Patterns

### Horizontal Scaling Backend
1. Deploy multiple FastAPI instances
2. Use PostgreSQL with connection pooling
3. Implement Redis for caching
4. Use queue system (RabbitMQ/Celery) for batch processing

### Horizontal Scaling Edge Devices
1. Deploy multiple Raspberry Pis
2. Each sends to same backend API
3. Dashboard aggregates all device data
4. Geographic clustering available via coordinates

### Database Scaling
- **SQLite:** Single file, ~100K records limit
- **PostgreSQL:** Unlimited, supports replication
- **Sharding:** By device_id for multi-region
- **Read replicas:** For analytics queries

---

## 🚀 Optimization Strategies

### Backend
- Implement Redis caching for stats
- Database connection pooling (pgbouncer)
- Async image processing (Celery)
- S3 storage for images instead of local

### Frontend
- Enable Next.js ISR (Incremental Static Regeneration)
- Implement service workers for offline
- Image lazy loading
- WebSocket for real-time updates instead of polling

### Edge Device
- Multi-threading for parallel processing
- Hardware acceleration (GPU, TPU if available)
- Frame skipping on high load
- Adaptive resolution based on CPU load

---

## 📈 Monitoring & Observability

### Metrics to Track
- Detection rate (detections/minute)
- Average confidence score
- Device connectivity status
- API response times
- Database query performance
- Storage usage
- Network bandwidth

### Logging Strategy
- Backend: Application logs → journalctl → ELK Stack
- Frontend: Browser console → Sentry
- Edge: Local logs → rsyslog → Remote server

### Alerting
- Device offline > 5 minutes
- Detection rate drop > 50%
- API error rate > 1%
- Database size > 80% capacity

---

## 🔄 Upgrade Path

### Development → Production
1. Replace SQLite with PostgreSQL
2. Add Redis caching layer
3. Implement Kubernetes orchestration
4. Add monitoring (Prometheus + Grafana)
5. Setup database backups
6. Configure CDN for static assets

### Legacy Support
- Maintain compatibility with older Pi models
- Provide CPU-only inference path
- Support lower frame rates
- Handle intermittent connectivity

---

## 📞 Architecture Questions

**Q: Why FastAPI over Django?**
A: Async support, automatic API documentation, lower overhead, better performance

**Q: Why Next.js over React SPA?**
A: Built-in SSR, API routes, better UX, simpler deployment

**Q: Why YOLOv5 over other models?**
A: Good accuracy/speed tradeoff, optimized for edge devices, active community

**Q: Can this scale to 1000s of devices?**
A: Yes, with PostgreSQL, Redis caching, and minor architecture changes

