# Raspberry Pi Setup Guide

---

## 🛠️ Prerequisites

### Hardware
- Raspberry Pi 4 (2GB RAM minimum, 4GB+ recommended)
- 32GB microSD card (SSD preferred for better performance)
- USB Camera or Pi Camera v2
- Power supply (5V/3A minimum)
- Ethernet or WiFi connectivity

### Software
- Raspberry Pi OS (Bullseye or Bookworm)
- Fresh installation recommended

---

## 📦 Installation Steps

### Step 1: Prepare Raspberry Pi OS
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    libatlas-base-dev \
    libjasper-dev \
    libtiff5 \
    libjasper1 \
    libharfbuzz0b \
    libwebp6 \
    libopenjp2-7
```

### Step 2: Clone Project
```bash
# Navigate to home directory
cd /home/pi

# Clone repository
git clone https://your-repo-url/eyes .
# OR download and extract project zip

# Navigate to edge device directory
cd eyes/edge-device
```

### Step 3: Run Setup Script
```bash
# Make script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

This will:
- Update system packages
- Install Python dependencies
- Install PyTorch and OpenCV
- Create systemd service
- Setup auto-start

### Step 4: Configure Detector
```bash
# Edit configuration
nano config.env

# Update these fields:
# API_URL="http://<YOUR_VPS_PUBLIC_IP>:8000"
# DEVICE_ID="pi-front-door"  # or your preferred name

# Save (Ctrl+O, Enter, Ctrl+X)
```

### Step 5: Test Setup
```bash
# Run test script
chmod +x test.sh
./test.sh

# If all green, proceed to step 6
```

### Step 6: Initialize Database
```bash
# Download model (this may take a while on Raspberry Pi)
python3 -c "import torch; torch.hub.load('ultralytics/yolov5', 'yolov5n', pretrained=True)"

# This downloads ~27MB model
```

---

## 🚀 Running the Detector

### Manual Execution
```bash
# Basic run (local preview, no upload)
python3 detector.py --cpu --headless

# With uploads to VPS
python3 detector.py \
    --api-url http://YOUR_VPS_IP:8000 \
    --device-id pi-001 \
    --upload \
    --cpu \
    --headless

# With display (SSH with X11 forwarding)
python3 detector.py \
    --api-url http://YOUR_VPS_IP:8000 \
    --device-id pi-001 \
    --upload \
    --cpu
```

### Automatic Execution (Systemd Service)
```bash
# Update service file
sudo nano /etc/systemd/system/eyes-detector.service

# Change API_URL to your VPS IP
# Save and exit

# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start eyes-detector

# Enable auto-start on boot
sudo systemctl enable eyes-detector

# Check status
sudo systemctl status eyes-detector

# View logs
sudo journalctl -u eyes-detector -f
```

---

## ⚙️ Command Line Options

```
Usage: python3 detector.py [OPTIONS]

Options:
  --api-url TEXT              Backend API URL
                             Default: http://localhost:8000
  
  --device-id TEXT           Unique device identifier
                             Default: pi-default
  
  --model TEXT               YOLOv5 model size
                             Options: yolov5n (nano), yolov5s (small), yolov5m (medium)
                             Default: yolov5n (fastest for Pi)
  
  --camera-index INT         Camera index (0 for default)
                             Default: 0
  
  --width INT                Frame width (pixels)
                             Default: 640
  
  --height INT               Frame height (pixels)
                             Default: 480
  
  --fps INT                  Target frames per second
                             Default: 30
  
  --confidence-threshold FLOAT Minimum confidence (0.0-1.0)
                             Default: 0.45
  
  --tracking-distance INT    Max pixels for centroid tracking
                             Default: 50
  
  --cpu                      Use CPU only (Pi always uses CPU)
  
  --upload                   Enable upload to VPS backend
  
  --headless                 No display window (for background running)
```

### Example Commands

**Minimal Resources (Best for Pi Zero or older models):**
```bash
python3 detector.py \
    --api-url http://YOUR_VPS_IP:8000 \
    --device-id pi-001 \
    --model yolov5n \
    --width 416 \
    --height 416 \
    --fps 15 \
    --upload \
    --cpu \
    --headless
```

**Balanced Performance (Pi 4, 2GB):**
```bash
python3 detector.py \
    --api-url http://YOUR_VPS_IP:8000 \
    --device-id pi-001 \
    --model yolov5n \
    --width 640 \
    --height 480 \
    --fps 25 \
    --upload \
    --cpu \
    --headless
```

**High Performance (Pi 4, 4GB+):**
```bash
python3 detector.py \
    --api-url http://YOUR_VPS_IP:8000 \
    --device-id pi-001 \
    --model yolov5s \
    --width 640 \
    --height 480 \
    --fps 30 \
    --upload \
    --cpu
```

---

## 🔍 Verification & Testing

### Check Service Status
```bash
# Service status
systemctl status eyes-detector

# View recent logs
journalctl -u eyes-detector -n 20

# Follow live logs
journalctl -u eyes-detector -f

# Check errors only
journalctl -u eyes-detector -p err
```

### Monitor Performance
```bash
# Real-time system monitor
top

# Check temperature
vcgencmd measure_temp

# Check memory usage
free -h

# Check disk usage
df -h /
```

### Test Connectivity
```bash
# Ping VPS
ping YOUR_VPS_IP

# Test API endpoint
curl http://YOUR_VPS_IP:8000/health

# Test detection post
curl -X POST http://YOUR_VPS_IP:8000/api/detections \
  -F "object_type=test" \
  -F "confidence=0.95" \
  -F "device_id=pi-001"
```

---

## 🐛 Troubleshooting

### High CPU Usage
**Symptoms:** Pi becomes slow, fan running constantly

**Solutions:**
```bash
# Reduce frame resolution
--width 416 --height 416

# Reduce frame rate
--fps 15

# Use smaller model
--model yolov5n  # Use nano instead of small

# Monitor CPU
watch -n 1 'ps aux | grep detector'
```

### High Memory Usage
**Symptoms:** Process killed, OOM errors

**Solutions:**
```bash
# Reduce batch processing
# Increase cleanup frequency

# Monitor memory
watch -n 1 'free -h'

# Check Pi memory
cat /proc/meminfo | grep MemTotal
```

### Camera Not Detected
**Symptoms:** "Failed to read frame"

**Solutions:**
```bash
# Check camera connection
ls -la /dev/video*

# Test with legacy camera support
sudo raspi-config  # Enable Camera in Interfacing Options

# Try different camera index
--camera-index 1  # If /dev/video1 exists
```

### Network Upload Failures
**Symptoms:** "Upload failed" messages

**Solutions:**
```bash
# Check network
ping -c 5 YOUR_VPS_IP

# Test connectivity
curl http://YOUR_VPS_IP:8000/health

# Increase retry timeout
# Check VPS firewall rules
sudo ufw status
```

### Model Download Fails
**Symptoms:** Torch hub timeout

**Solutions:**
```bash
# Pre-download on PC, transfer via USB
# Or use alternative model source
# Increase timeout: export HF_HUB_TIMEOUT=300

# Download model manually
wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5n.pt
```

---

## 📊 Performance Benchmarks

### Raspberry Pi 4 (4GB) - YOLOv5n

| Resolution | FPS | CPU | Memory | Notes |
|-----------|-----|-----|--------|-------|
| 416x416   | 8-10 | 85% | 450MB | Stable, minimal lag |
| 480x480   | 6-8  | 90% | 480MB | Good balance |
| 640x480   | 4-6  | 95% | 550MB | Usable but warm |
| 640x640   | 2-4  | 98% | 600MB | Thermal throttling |

### Network Latency

| Connection | Upload Time | Typical Latency |
|-----------|------------|-----------------|
| WiFi 5GHz | 200-300ms | 50-100ms |
| WiFi 2.4GHz | 400-600ms | 100-200ms |
| Ethernet | 100-150ms | 10-50ms |

---

## 🔧 Advanced Configuration

### Custom Upload Location
```bash
# Modify detector.py
# Change: self.api_url = args.api_url
# To: self.api_url = "http://custom-server:port"
```

### Multiple Detectors
```bash
# Run multiple instances on same Pi
python3 detector.py --device-id pi-001-cam1 --camera-index 0 &
python3 detector.py --device-id pi-001-cam2 --camera-index 1 &

# Or use systemd with multiple services
# Copy eyes-detector.service to eyes-detector-2.service
# Update ExecStart with different --device-id and --camera-index
```

### Auto-Recovery
```bash
# Add to systemd service [Service] section:
StartLimitInterval=300
StartLimitBurst=3
```

---

## 📝 Maintenance

### Weekly
```bash
# Check logs for errors
journalctl -u eyes-detector --since "1 week ago" | grep ERROR

# Monitor disk usage
df -h /

# Restart service if needed
sudo systemctl restart eyes-detector
```

### Monthly
```bash
# Clean up old uploads on VPS
find /var/www/eyes/backend/uploads -mtime +30 -delete

# Check Pi health
vcgencmd measure_temp
vcgencmd get_throttled

# Update packages
sudo apt-get update && sudo apt-get upgrade -y
```

---

## 🚀 Optimization Tips

1. **Use Ethernet** for more stable uploads
2. **SSH into Pi** instead of using display to save resources
3. **Reduce resolution** to 416x416 for Pi 2GB models
4. **Disable display** (--headless) for background operation
5. **Monitor temperature** to prevent thermal throttling
6. **Schedule cleanup** of old uploads regularly

---

## 📞 Getting Help

**Check these locations for diagnostics:**
- `/var/log/eyes-detector.log` (if configured)
- `journalctl -u eyes-detector` (systemd logs)
- `/home/pi/eyes/edge-device/detector.py` (main script)

