# Dark Innovative
## Construction Site & Fleet Management System

A complete production-ready platform for real-time tracking of construction sites, vehicles, employees, and traffic with secure authentication and comprehensive analytics.

**Live Demo Credentials:**
- Email: `admin@darkinnovative.com`
- Password: `password`

---

## ✨ Features

### Core Features
- 🏗️ **Construction Site Tracking** - Real-time GPS monitoring, status management, manager assignment
- 🚗 **Vehicle Fleet Management** - Gate passes, entry/exit tracking, traffic monitoring, performance analytics
- 👥 **Employee Tracking** - Check-in/out system, location tracking, attendance records, department management
- 🚦 **Traffic Analytics** - Real-time vehicle counting, congestion detection, speed monitoring
- 🔐 **Secure Authentication** - JWT-based login, role-based access control (Admin, Manager, Employee)
- 📊 **Comprehensive Dashboard** - Real-time analytics, charts, statistics, multi-tab interface
- 🏢 **Multi-page Public Website** - Professional branding with Home, About, Contact, Company pages
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🌐 **Multi-tenant Support** - Company-based organization with site-level tracking

### Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL/SQLite (Database)
- JWT Authentication
- Passlib with bcrypt (Password hashing)

**Frontend:**
- Next.js 14.2 (React framework)
- TypeScript
- Tailwind CSS
- Recharts (Data visualization)
- Lucide React (Icons)
- Axios (HTTP client)

**Deployment:**
- Docker & Docker Compose
- Nginx (Reverse proxy)
- Ubuntu 20.04+

---

## 📄 Pages

| Page | URL | Purpose | Auth Required |
|------|-----|---------|---|
| Home | `/` | Landing page with features | ❌ |
| About | `/about` | Company information | ❌ |
| Contact | `/contact` | Contact form and info | ❌ |
| Company | `/company` | Company details | ❌ |
| Login | `/login` | Authentication | ❌ |
| Dashboard | `/dashboard` | Main tracking interface | ✅ |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- Python 3.8+
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and set SECRET_KEY

# Initialize database and start server
python3 main.py

# Backend runs on http://localhost:8000
# API Docs available at http://localhost:8000/docs
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional - uses localhost:8000 by default)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

### Access Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started" button → "Login"
3. Use demo credentials:
   - Email: `admin@darkinnovative.com`
   - Password: `password`

---

## 📊 Dashboard Features

### Construction Sites Tab
- Real-time site monitoring
- GPS location tracking
- Project status (Active, Paused, Completed)
- Manager assignment
- Site statistics (total, active, completed)

### Vehicles Tab
- Fleet status overview
- Gate pass management
- Entry/exit tracking
- Vehicle type distribution
- Real-time GPS tracking
- Performance analytics

### Employees Tab
- Employee attendance tracking
- Check-in/out times
- Location monitoring
- Department assignment
- Attendance statistics
- Daily attendance charts

### Traffic Analytics Tab
- Real-time vehicle counting
- Speed distribution analysis
- Congestion level monitoring
- Peak hours detection
- Historical trend analysis

---

## 🗄️ Database Models

### Users & Authentication
- `User` - User accounts with roles (admin, manager, employee)
- `Company` - Organization management

### Tracking
- `ConstructionSite` - Project site tracking
- `Vehicle` - Fleet management
- `Employee` - Staff tracking
- `GatePass` - Vehicle access control
- `TrafficVehicle` - Traffic analytics data
- `DetectionEvent` - Original object detection data
- `DeviceStatus` - Edge device monitoring

---

## 📁 Project Structure

```
eyes/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── models.py          # SQLAlchemy ORM models
│   │   │   └── database.py        # DB connection
│   │   ├── schemas/
│   │   │   ├── auth.py             # Authentication schemas
│   │   │   └── detection.py        # Detection schemas
│   │   ├── routes/
│   │   │   ├── auth.py             # Auth endpoints
│   │   │   └── detections.py       # Detection API
│   │   └── __init__.py
│   ├── main.py                     # FastAPI app entry
│   ├── requirements.txt            # Python dependencies
│   └── .env.example               # Environment template
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Home page
│   │   ├── login/page.tsx         # Login page
│   │   ├── dashboard/page.tsx     # Main dashboard
│   │   ├── about/page.tsx         # About page
│   │   ├── contact/page.tsx       # Contact page
│   │   ├── company/page.tsx       # Company page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navigation.tsx         # Navigation bar
│   │   ├── Footer.tsx             # Footer
│   │   ├── Header.tsx             # Dashboard header
│   │   └── ...other components
│   ├── package.json               # NPM dependencies
│   └── .env.local                 # Environment variables
│
├── docker-compose.yml             # Production deployment
├── Dockerfile                     # Container configuration
└── README.md                      # This file
```

---

## 🔑 Authentication

### Login Flow
1. User enters email and password on `/login`
2. Backend validates credentials against User table
3. JWT token generated and stored in localStorage
4. User redirected to `/dashboard`
5. Dashboard checks for token on load
6. Protected routes redirect to `/login` if token missing

### Demo User
- **Email:** admin@darkinnovative.com
- **Password:** password
- **Role:** Admin
- **Company:** Dark Innovative Demo

---

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login (returns JWT token)
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout (frontend clears token)

### Detection API
- `POST /api/detections` - Create detection record
- `GET /api/detections` - List all detections
- `GET /api/detections/latest` - Get latest detections
- `POST /api/stats/by-object` - Statistics by object type
- `GET /api/stats` - System statistics
- `GET /api/device/status` - Device health status

### System
- `GET /` - Root endpoint info
- `GET /health` - Health check
- `GET /api/info` - System information

---

## 🚀 Production Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Frontend: http://your-domain.com
# Backend API: http://your-domain.com/api
# API Docs: http://your-domain.com/docs
```

### Environment Variables

**Backend (.env):**
```
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/dark_innovative
SECRET_KEY=your-super-secret-key-change-this-in-production
WORKERS=4
MAX_UPLOAD_SIZE=10485760
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📝 Configuration

### Tailwind CSS
Global styles defined in `frontend/app/globals.css` using Tailwind utility classes.

### API Client
All API requests go through Axios with automatic localhost fallback for development.

### Database Initialization
Database tables automatically created on backend startup via SQLAlchemy `Base.metadata.create_all()`.

---

## 🧪 Testing

### Frontend Build Test
```bash
cd frontend
npm run build
```

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Frontend Health Test
```bash
curl http://localhost:3000
```

---

## 📚 API Documentation

Interactive API documentation available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🛠️ Development

### Run in Development Mode

**Backend (with hot reload):**
```bash
cd backend
python3 main.py
```

**Frontend (with hot reload):**
```bash
cd frontend
npm run dev
```

### Make Changes
- Backend changes auto-reload via Uvicorn
- Frontend changes auto-reload via Next.js dev server

---

## 📋 Troubleshooting

### Backend Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Frontend Build Issues
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

### Database Issues
```bash
# Reset SQLite database
cd backend
rm detections.db
python3 main.py  # Recreates database
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💼 Support

For issues, questions, or suggestions:
- Email: support@darkinnovative.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/eyes/issues)

---

**Happy tracking! 🚀**

### Frontend (Next.js)

**Responsibilities:**
- Real-time dashboard
- Statistics visualization
- Detection log display
- Device monitoring

**Features:**
- Auto-refresh every 5 seconds
- Charts with Recharts
- Responsive design (Tailwind CSS)
- TypeScript type safety

**Components:**
- Header navigation
- Stats cards with KPIs
- Detection log table
- Device status grid

### Edge Device (Raspberry Pi)

**Responsibilities:**
- Video capture from camera
- Real-time object detection
- Simple tracking
- Upload to VPS backend

**Features:**
- YOLOv5 model support
- Centroid-based tracking
- Network retry logic
- System health monitoring
- Headless operation

**Performance:**
- 4-6 FPS on Pi 4 (baseline)
- ~200ms inference latency
- 550MB memory usage
- Configurable resolution/FPS

---

## 📦 Installation & Setup

### Prerequisites

**VPS:**
- Ubuntu 20.04+
- 2GB RAM minimum
- Python 3.10+
- Node.js 18+

**Raspberry Pi:**
- Pi 4 (2GB+ RAM)
- Raspbian OS
- USB Camera or Pi Camera
- NetworkConnection

### Complete Setup (All Components)

1. **Clone or download project**
   ```bash
   git clone https://your-repo/eyes.git
   cd eyes
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Edge Device**
   ```bash
   cd ../edge-device
   pip install -r requirements.txt
   ```

5. **Start Services (Local)**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   python3 main.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   
   # Terminal 3 - Detector (if Pi available)
   cd edge-device
   python3 detector.py --upload
   ```

---

## ⚙️ Configuration

### Backend Configuration

Create `.env` file in `/backend`:
```
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
DATABASE_URL=sqlite:///./detections.db
WORKERS=4
MAX_UPLOAD_SIZE=10485760
```

### Frontend Configuration

Create `.env.local` file in `/frontend`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Edge Device Configuration

Edit `config.env` in `/edge-device`:
```
API_URL=http://YOUR_VPS_IP:8000
DEVICE_ID=pi-001
MODEL_SIZE=yolov5n
CONFIDENCE_THRESHOLD=0.45
CAMERA_WIDTH=640
CAMERA_HEIGHT=480
CAMERA_FPS=30
```

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://yourdomain.com`

### Authentication
Currently no authentication required. Add API keys before production use.

### Detection Endpoints

#### Create Detection
```
POST /api/detections
Content-Type: multipart/form-data

Form Data:
  object_type: string (required)
  confidence: float (0.0-1.0, required)
  device_id: string (optional, default: "pi-default")
  latitude: float (optional)
  longitude: float (optional)
  file: binary/image (optional)

Response (201):
{
  "id": 1,
  "object_type": "person",
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00",
  "image_path": "uploads/pi-001/person_20240115_103000.jpg",
  "device_id": "pi-001"
}
```

#### List Detections
```
GET /api/detections?device_id=pi-001&limit=50&offset=0&object_type=person

Response (200):
[
  {
    "id": 1,
    "object_type": "person",
    "confidence": 0.95,
    ...
  },
  ...
]
```

#### Get Statistics
```
GET /api/stats

Response (200):
{
  "total_detections": 1523,
  "detections_today": 87,
  "unique_objects": 12,
  "average_confidence": 0.82,
  "last_detection": "2024-01-15T10:30:00"
}
```

#### Update Device Status
```
POST /api/device/status
Content-Type: application/json

{
  "device_id": "pi-001",
  "fps": 5.2,
  "cpu_usage": 85.3,
  "memory_usage": 55.2,
  "model_type": "yolov5n"
}

Response (200):
{
  "message": "Device status updated",
  "device_id": "pi-001"
}
```

---

## 🔍 Troubleshooting

### Backend Issues

**Backend not starting:**
```bash
# Check Python version
python3 --version  # Should be 3.10+

# Check dependencies
pip list | grep fastapi

# Try direct run with verbose output
python3 -c "from main import app; print('OK')"
```

**Database locked:**
```bash
# Remove SQLite lock file
rm detections.db-journal

# Or use PostgreSQL for production
```

**Port 8000 already in use:**
```bash
# Kill existing process
sudo lsof -i :8000
sudo kill -9 <PID>

# Or run on different port
uvicorn main:app --port 8001
```

### Frontend Issues

**Frontend not connecting to backend:**
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
cat frontend/.env.local

# Test API connectivity
curl http://localhost:8000/health

# Check CORS configuration
```

**Build errors:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Edge Device Issues

**Detector not uploading:**
```bash
# Check network
ping <VPS_IP>

# Test API endpoint
curl -X POST http://<VPS_IP>:8000/api/detections \
  -F "object_type=test" \
  -F "confidence=0.95" \
  -F "device_id=test"

# View logs
tail -f /var/log/eyes-detector.log
```

**High CPU/Memory:**
```bash
# Reduce resolution
--width 320 --height 240

# Reduce FPS
--fps 15

# Use smaller model
--model yolov5n
```

**Camera not found:**
```bash
# Check connected cameras
ls -la /dev/video*

# Enable camera in raspi-config
sudo raspi-config
# Select Interface Options → Camera → Enable
```

---

## 🤝 Contributing

### Code Style
- Backend: PEP 8 (use `black` formatter)
- Frontend: ESLint + Prettier
- Edge: PEP 8

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation

### Commit Messages
```
type: description

Optional detailed explanation

- Bullet point if multiple changes
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`

### Testing
```bash
# Backend
cd backend
pytest tests/

# Frontend
cd frontend
npm test

# Edge Device
cd edge-device
pytest tests/
```

---

## 📈 Performance Optimization

### Backend
- SQLite limited to ~100K records; use PostgreSQL for production
- Enable caching: Redis for stats
- Use connection pooling for database

### Frontend
- Enable ISR (Incremental Static Regeneration) for stats page
- Lazy load detection images
- Implement WebSocket for real-time updates

### Edge Device
- Reduce resolution to 320x240 for 2x FPS
- Skip 25% of frames with minimal accuracy loss
- Use INT8 quantization (+60% speed)

See [R_AND_D.md](R_AND_D.md) for detailed benchmarks.

---

## 📋 Checklist for Production

- [ ] Update all `.env` files with production values
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure database backups
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Configure rate limiting
- [ ] Add API authentication
- [ ] Setup centralized logging (ELK)
- [ ] Configure CDN for static assets
- [ ] Test failover and recovery
- [ ] Document custom procedures
- [ ] Setup incident alerts
- [ ] Test edge device failover

---

## 📞 Support & Resources

- **API Docs:** http://localhost:8000/docs
- **GitHub Issues:** https://github.com/your-repo/eyes/issues
- **Docs:** See `/docs` folder
- **Community:** [Your community link]

---

## 📜 License

[Your License Here]

---

## 👥 Authors

- Senior Full-Stack Engineer
- IoT Specialist
- Team Members

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready

