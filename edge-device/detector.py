#!/usr/bin/env python3
"""
Raspberry Pi Object Detection and Tracking Script
Uses YOLOv5 or TFLite models for real-time detection
"""
import cv2
import torch
import numpy as np
import requests
import time
import json
import logging
import argparse
import os
from pathlib import Path
from datetime import datetime
from threading import Thread
from queue import Queue
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class ObjectDetector:
    """Object detection using YOLOv5"""

    def __init__(self, model_name="yolov5n", device="cpu"):
        """
        Initialize YOLOv5 model.
        
        Args:
            model_name: Model size (yolov5n, yolov5s, yolov5m, etc.)
            device: Device to use (cpu, cuda, etc.)
        """
        logger.info(f"Loading {model_name} model...")
        self.device = device
        self.model = torch.hub.load("ultralytics/yolov5", model_name)
        self.model.to(device)
        self.model.conf = 0.45  # Confidence threshold
        logger.info("Model loaded successfully")

    def detect(self, frame):
        """
        Detect objects in frame.
        
        Args:
            frame: Input frame (numpy array)
            
        Returns:
            List of detections with boxes and confidences
        """
        results = self.model(frame)
        detections = []

        # Parse results
        for *box, conf, cls in results.xyxy[0].cpu().detach().numpy():
            detection = {
                "box": box,
                "confidence": float(conf),
                "class": int(cls),
                "class_name": results.names[int(cls)],
                "x1": int(box[0]),
                "y1": int(box[1]),
                "x2": int(box[2]),
                "y2": int(box[3]),
            }
            detections.append(detection)

        return detections, results


class SimpleTracker:
    """Simple centroid-based tracking"""

    def __init__(self, max_distance=50):
        """
        Initialize tracker.
        
        Args:
            max_distance: Maximum distance to match centroids
        """
        self.tracks = {}
        self.next_id = 0
        self.max_distance = max_distance

    def update(self, detections):
        """
        Update tracks with new detections.
        
        Args:
            detections: List of detections
            
        Returns:
            Tracked detections with IDs
        """
        centroids = np.array(
            [
                [
                    (d["x1"] + d["x2"]) / 2,
                    (d["y1"] + d["y2"]) / 2,
                ]
                for d in detections
            ]
        )

        if len(centroids) == 0:
            self.tracks = {}
            return detections

        # Match with existing tracks
        tracked = []
        used_indices = set()

        for track_id, (last_centroid, _) in list(self.tracks.items()):
            if len(centroids) == 0:
                del self.tracks[track_id]
                continue

            distances = np.linalg.norm(centroids - last_centroid, axis=1)
            closest_idx = np.argmin(distances)

            if distances[closest_idx] < self.max_distance:
                used_indices.add(closest_idx)
                detection = detections[closest_idx].copy()
                detection["track_id"] = track_id
                tracked.append(detection)
                new_centroid = centroids[closest_idx]
                self.tracks[track_id] = (new_centroid, detection["class_name"])
            else:
                del self.tracks[track_id]

        # Add new tracks
        for i, centroid in enumerate(centroids):
            if i not in used_indices:
                track_id = self.next_id
                self.next_id += 1
                detection = detections[i].copy()
                detection["track_id"] = track_id
                tracked.append(detection)
                self.tracks[track_id] = (centroid, detection["class_name"])

        return tracked


class DetectionUploader:
    """Upload detections to VPS backend"""

    def __init__(self, api_url, device_id="pi-default", device_location=None):
        """
        Initialize uploader.
        
        Args:
            api_url: Backend API URL
            device_id: Identifier for this device
            device_location: Tuple of (latitude, longitude)
        """
        self.api_url = api_url
        self.device_id = device_id
        self.device_location = device_location
        self.upload_queue = Queue()

    def upload_detection(self, detection, frame):
        """
        Upload detection to backend.
        
        Args:
            detection: Detection dictionary
            frame: Frame for image capture
            
        Returns:
            Success status
        """
        try:
            # Prepare payload
            timestamp = datetime.utcnow().isoformat()
            
            files = {}
            data = {
                "object_type": detection["class_name"],
                "confidence": detection["confidence"],
                "device_id": self.device_id,
                "timestamp": timestamp,
            }

            if self.device_location:
                data["latitude"] = self.device_location[0]
                data["longitude"] = self.device_location[1]

            # Crop and compress detection area
            img_data = self._crop_detection(frame, detection)
            files["file"] = ("detection.jpg", img_data, "image/jpeg")

            # Upload with retry logic
            response = self._upload_with_retry(data, files)

            if response:
                logger.info(
                    f"Uploaded: {detection['class_name']} "
                    f"(conf: {detection['confidence']:.2f})"
                )
                return True
            return False

        except Exception as e:
            logger.error(f"Upload error: {e}")
            return False

    def _crop_detection(self, frame, detection, padding=20):
        """Crop and compress detection area."""
        x1 = max(0, detection["x1"] - padding)
        y1 = max(0, detection["y1"] - padding)
        x2 = min(frame.shape[1], detection["x2"] + padding)
        y2 = min(frame.shape[0], detection["y2"] + padding)

        crop = frame[y1:y2, x1:x2]

        # Compress to JPEG
        _, img_encoded = cv2.imencode(".jpg", crop, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return img_encoded.tobytes()

    def _upload_with_retry(self, data, files, max_retries=3):
        """Upload with retry logic."""
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    f"{self.api_url}/api/detections",
                    data=data,
                    files=files,
                    timeout=10,
                )
                return response.status_code == 200
            except requests.exceptions.RequestException as e:
                logger.warning(f"Upload attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
        return False

    def upload_device_status(self, fps, cpu_usage, memory_usage, model="yolov5n"):
        """Upload device status to backend."""
        try:
            data = {
                "device_id": self.device_id,
                "fps": fps,
                "cpu_usage": cpu_usage,
                "memory_usage": memory_usage,
                "model_type": model,
            }
            response = requests.post(
                f"{self.api_url}/api/device/status",
                json=data,
                timeout=10,
            )
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Status upload failed: {e}")
            return False


class SystemMonitor:
    """Monitor system resources"""

    @staticmethod
    def get_cpu_usage():
        """Get CPU usage percentage."""
        return psutil.cpu_percent(interval=1)

    @staticmethod
    def get_memory_usage():
        """Get memory usage percentage."""
        return psutil.virtual_memory().percent


class ObjectDetectionPipeline:
    """Main detection pipeline"""

    def __init__(self, args):
        """Initialize pipeline."""
        self.args = args
        self.detector = ObjectDetector(
            model_name=args.model, device="cpu" if args.cpu else "cuda"
        )
        self.tracker = SimpleTracker(max_distance=args.tracking_distance)
        self.uploader = DetectionUploader(
            api_url=args.api_url, device_id=args.device_id
        )

        # FPS tracking
        self.frame_count = 0
        self.start_time = time.time()

    def run(self):
        """Main loop."""
        # Initialize camera
        cap = cv2.VideoCapture(self.args.camera_index)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.args.width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.args.height)
        cap.set(cv2.CAP_PROP_FPS, self.args.fps)

        logger.info("Starting detection loop...")

        try:
            status_upload_counter = 0

            while True:
                ret, frame = cap.read()
                if not ret:
                    logger.error("Failed to read frame")
                    break

                # Run detection
                detections, _ = self.detector.detect(frame)

                # Track objects
                tracked = self.tracker.update(detections)

                # Draw on frame
                frame = self._draw_detections(frame, tracked)

                # Upload detections
                if self.args.upload:
                    for detection in tracked:
                        if detection["confidence"] >= self.args.confidence_threshold:
                            self.uploader.upload_detection(detection, frame)

                # Upload status periodically
                status_upload_counter += 1
                if status_upload_counter >= 100:
                    fps = self._calculate_fps()
                    cpu_usage = SystemMonitor.get_cpu_usage()
                    memory_usage = SystemMonitor.get_memory_usage()
                    self.uploader.upload_device_status(
                        fps, cpu_usage, memory_usage, model=self.args.model
                    )
                    logger.info(
                        f"FPS: {fps:.2f} | CPU: {cpu_usage:.1f}% | Memory: {memory_usage:.1f}%"
                    )
                    status_upload_counter = 0

                # Display frame if not headless
                if not self.args.headless:
                    cv2.imshow("Object Detection", frame)

                # Exit on 'q'
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

                self.frame_count += 1

        finally:
            cap.release()
            cv2.destroyAllWindows()
            logger.info("Pipeline stopped")

    def _draw_detections(self, frame, detections):
        """Draw detections on frame."""
        for detection in detections:
            x1, y1, x2, y2 = (
                detection["x1"],
                detection["y1"],
                detection["x2"],
                detection["y2"],
            )
            conf = detection["confidence"]
            label = f"{detection['class_name']} {conf:.2f}"

            # Draw box
            color = (0, 255, 0) if conf > 0.8 else (0, 255, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # Draw label
            cv2.putText(
                frame,
                label,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2,
            )

            # Draw track ID if available
            if "track_id" in detection:
                track_label = f"ID: {detection['track_id']}"
                cv2.putText(
                    frame,
                    track_label,
                    (x1, y2 + 20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    2,
                )

        return frame

    def _calculate_fps(self):
        """Calculate current FPS."""
        elapsed = time.time() - self.start_time
        fps = self.frame_count / elapsed if elapsed > 0 else 0
        return fps


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Object Detection and Tracking System for Raspberry Pi"
    )
    parser.add_argument(
        "--api-url", default="http://localhost:8000", help="Backend API URL"
    )
    parser.add_argument(
        "--device-id", default="pi-default", help="Device identifier"
    )
    parser.add_argument(
        "--model", default="yolov5n", help="YOLOv5 model size (n, s, m, l, x)"
    )
    parser.add_argument(
        "--camera-index", type=int, default=0, help="Camera index"
    )
    parser.add_argument(
        "--width", type=int, default=640, help="Frame width"
    )
    parser.add_argument(
        "--height", type=int, default=480, help="Frame height"
    )
    parser.add_argument(
        "--fps", type=int, default=30, help="Target FPS"
    )
    parser.add_argument(
        "--confidence-threshold",
        type=float,
        default=0.5,
        help="Confidence threshold",
    )
    parser.add_argument(
        "--tracking-distance",
        type=int,
        default=50,
        help="Max tracking distance",
    )
    parser.add_argument(
        "--cpu", action="store_true", help="Use CPU only"
    )
    parser.add_argument(
        "--upload", action="store_true", help="Upload detections to backend"
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run in headless mode (no display)",
    )

    args = parser.parse_args()

    logger.info(f"Starting with API URL: {args.api_url}")
    logger.info(f"Device ID: {args.device_id}")

    pipeline = ObjectDetectionPipeline(args)
    pipeline.run()


if __name__ == "__main__":
    main()
