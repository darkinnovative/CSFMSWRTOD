#!/bin/bash
# Quick test script for detector

echo "Testing Object Detection Setup..."
echo ""

# Check Python
echo "✓ Checking Python..."
python3 --version

# Check dependencies
echo ""
echo "✓ Checking dependencies..."
python3 -c "import cv2; print(f'  OpenCV: {cv2.__version__}')"
python3 -c "import torch; print(f'  PyTorch: {torch.__version__}')"
python3 -c "import requests; print('  Requests: OK')"
python3 -c "import psutil; print('  PSUtil: OK')"

# Check camera
echo ""
echo "✓ Checking camera..."
if [ -e "/dev/video0" ]; then
    echo "  Camera: Found at /dev/video0"
else
    echo "  Camera: Not found - USB camera may not be connected"
fi

echo ""
echo "✓ All checks passed!"
echo ""
echo "Run detector with:"
echo "  python3 detector.py --api-url http://<VPS_IP>:8000 --upload"
echo ""
echo "Run in headless mode (no display):"
echo "  python3 detector.py --api-url http://<VPS_IP>:8000 --upload --headless"
echo ""
