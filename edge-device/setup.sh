#!/bin/bash
# Raspberry Pi Setup Script
# This script sets up YOLOv5 detection on Raspberry Pi

set -e

echo "=========================================="
echo "Eyes - Raspberry Pi Setup Script"
echo "=========================================="

# Update system
echo "[1/6] Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
echo "[2/6] Installing dependencies..."
sudo apt-get install -y \
    python3-pip \
    python3-dev \
    libatlas-base-dev \
    libjasper-dev \
    libharfbuzz0b \
    libwebp6 \
    libtiff5 \
    libjasper1 \
    libharfbuzz0b \
    libwebp6 \
    libtiff5 \
    libjasper1 \
    libjpeg-dev \
    zlib1g-dev \
    libopenjp2-7 \
    libtiff5 \
    libjasper1 \
    libharfbuzz0b \
    libwebp6 \
    libopenmpi-dev \
    libomp-dev

# Install Python packages
echo "[3/6] Installing Python packages..."
pip3 install --upgrade pip setuptools wheel
pip3 install -r requirements.txt

# Optional: Setup GPU acceleration (if available)
echo "[4/6] Setting up optional acceleration..."
# Uncomment if using GPU:
# pip3 install nvidia-jetpack

# Create systemd service
echo "[5/6] Creating systemd service..."
sudo tee /etc/systemd/system/eyes-detector.service > /dev/null <<EOF
[Unit]
Description=Eyes Object Detection Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/python3 $(pwd)/detector.py --api-url http://<VPS_IP>:8000 --device-id pi-001 --upload --cpu
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create startup script
echo "[6/6] Creating startup script..."
sudo tee /usr/local/bin/eyes-detector > /dev/null <<'EOFSCRIPT'
#!/bin/bash
cd /home/pi/eyes/edge-device
python3 detector.py "$@"
EOFSCRIPT

sudo chmod +x /usr/local/bin/eyes-detector

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update VPS_IP in /etc/systemd/system/eyes-detector.service"
echo "2. Run: sudo systemctl daemon-reload"
echo "3. Start service: sudo systemctl start eyes-detector"
echo "4. Enable auto-start: sudo systemctl enable eyes-detector"
echo "5. Check logs: sudo journalctl -u eyes-detector -f"
echo ""
echo "Manual run: python3 detector.py --api-url http://<VPS_IP>:8000 --upload --headless"
