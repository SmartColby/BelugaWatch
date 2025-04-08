import sys
import os
import cv2
import pandas as pd
from ultralytics import YOLO
import datetime

print("OpenCV version:", cv2.__version__)
print(f"Pandas version: {pd.__version__}")
cap = cv2.VideoCapture(0)  # Test with your webcam
if not cap.isOpened():
    print("Error: Unable to access the camera")
else:
    print("Camera is working")
cap.release()

def main(video_path, output_folder):
    # === Config ===
    MODEL_PATH = r"C:\Users\giova\Documents\BelugaWatch\back-end\Beluga_Tracking\yolov8n.pt"
    TRACKER_PATH = r"C:\Users\giova\Documents\BelugaWatch\back-end\Beluga_Tracking\bytetrack_whales.yaml"

    # === Load model ===
    model = YOLO(MODEL_PATH)

    # === Setup video ===
    cap = cv2.VideoCapture(video_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # Total number of frames in the video

    if not cap.isOpened():
        print("Error: Unable to open video.")
        return

    print(f"Video Resolution: {width}x{height}")
    print(f"FPS: {fps}")
    print(f"Total Frames: {total_frames}")

    # === Setup outputs ===
    os.makedirs(output_folder, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    video_output_path = os.path.join(output_folder, f"tracked_{timestamp}.mp4")
    csv_output_path = os.path.join(output_folder, f"tracking_data_{timestamp}.csv")

    # Use H.264 codec for better compatibility
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Use 'mp4v' for .mp4 files
    out = cv2.VideoWriter(video_output_path, fourcc, fps, (width, height))

    tracking_data = []
    processed_frames = 0  # Counter for processed frames

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("End of video.")
            break

        # Run YOLO tracking
        results = model.track(frame, persist=True, tracker=TRACKER_PATH)

        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])  # Class index
                track_id = int(box.id[0]) if box.id is not None else -1

                # Map class index to class name
                class_name = "Adult" if cls == 0 else "Calf"

                # Draw bounding box
                color = (0, 255, 0) if class_name == "Adult" else (255, 0, 0)  # Green for Adult, Blue for Calf
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"ID: {track_id} ({class_name})", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                # Save tracking data
                tracking_data.append([track_id, class_name, x1, y1, x2, y2])

        out.write(frame)
        processed_frames += 1

        # Print progress
        print(f"Processing frame {processed_frames}/{total_frames} ({(processed_frames / total_frames) * 100:.2f}%)")

    # Save tracking data to CSV
    df = pd.DataFrame(tracking_data, columns=["Track_ID", "Class", "X1", "Y1", "X2", "Y2"])
    df.to_csv(csv_output_path, index=False)

    print(f"✅ Video saved as: {video_output_path}")
    print(f"✅ Tracking data saved as: {csv_output_path}")

    cap.release()
    out.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    video_path = sys.argv[1]
    output_folder = sys.argv[2]
    print(f"Video Path: {video_path}")
    print(f"Output Folder: {output_folder}")
    main(video_path, output_folder)
