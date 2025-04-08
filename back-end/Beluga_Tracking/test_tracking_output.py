import os
import cv2
from track import main

# Define the input video path and output folder
VIDEO_PATH = r"C:\Users\giova\Documents\BelugaWatch\back-end\Beluga_Tracking\Beluga_tracking_10.MP4"
OUTPUT_FOLDER = r"C:\Users\giova\Documents\BelugaWatch\back-end\Beluga_Tracking\tracking_test_output"

# Ensure the output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

if __name__ == "__main__":
    print(f"Running tracking on video: {VIDEO_PATH}")
    print(f"Output will be saved in: {OUTPUT_FOLDER}")

    try:
        # Run the tracking process
        main(VIDEO_PATH, OUTPUT_FOLDER)

        # Find the tracked video file
        tracked_video_path = None
        for file in os.listdir(OUTPUT_FOLDER):
            if file.endswith(".mp4"):
                tracked_video_path = os.path.join(OUTPUT_FOLDER, file)
                break

        if not tracked_video_path:
            print("❌ Tracked video not found in the output folder.")
        else:
            print(f"✅ Tracked video saved at: {tracked_video_path}")

            # Display the tracked video
            cap = cv2.VideoCapture(tracked_video_path)
            if not cap.isOpened():
                print("❌ Unable to open the tracked video for display.")
            else:
                print("🎥 Displaying the tracked video. Press 'q' to exit.")
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    cv2.imshow("Tracked Video", frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                cap.release()
                cv2.destroyAllWindows()

        # Find the tracking data CSV file
        tracking_data_path = None
        for file in os.listdir(OUTPUT_FOLDER):
            if file.endswith(".csv"):
                tracking_data_path = os.path.join(OUTPUT_FOLDER, file)
                break

        if not tracking_data_path:
            print("❌ Tracking data CSV not found in the output folder.")
        else:
            print(f"✅ Tracking data CSV saved at: {tracking_data_path}")

    except Exception as e:
        print(f"❌ An error occurred: {e}")