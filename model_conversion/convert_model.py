from ultralytics import YOLO

# Load your YOLOv8 model
model = YOLO('path_to_your_backend/data/yolo11n.pt')  # Adjust the path as necessary

# Export the model to TensorFlow.js format
model.export(format='tfjs', imgsz=640, half=False, int8=False)
