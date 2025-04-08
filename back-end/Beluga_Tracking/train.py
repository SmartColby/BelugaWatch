import os
import cv2
from ultralytics import YOLO

# Define dataset path
DATASET_DIR = "data/beluga_dataset"
DATA_YAML_PATH = "C:/Users/giova/Documents/BelugaWatch/back-end/Beluga_Tracking/beluga-whale-annotated-data-10/data.yaml"

# Ensure the dataset exists before training
if not os.path.exists(DATA_YAML_PATH):
    raise FileNotFoundError(f"Dataset YAML file not found at {DATA_YAML_PATH}. "
                            "Make sure the dataset is downloaded correctly.")

# Load YOLOv8 model
model = YOLO("yolov8m.pt")  

# Train the model
if __name__ == "__main__":  # Ensures safe multiprocessing
    model.train(
        data=DATA_YAML_PATH,
        epochs=200,
        imgsz=640,
        batch=8,
        device="cpu"  # Use CPU instead of CUDA
    )

    # Tracking results
    cap = cv2.VideoCapture(0)  # Open video capture
    TRACKER_PATH = "tracker.yaml"  # Define tracker path

    fourcc = cv2.VideoWriter_fourcc(*'XVID')  # Define codec
    out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640, 480))  # Initialize video writer

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame. Exiting...")
            break

        results = model.track(frame, persist=True, tracker=TRACKER_PATH)
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        out.write(frame)  # Ensure this is after drawing the bounding boxes
        cv2.imshow("Test Frame", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()
