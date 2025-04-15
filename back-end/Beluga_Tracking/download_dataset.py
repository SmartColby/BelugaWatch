import os
from roboflow import Roboflow

# Define save path
SAVE_PATH = "C:/Users/giova/Documents/BelugaWatch/back-end/Beluga_Tracking/beluga-whale-annotated-data-10"

# Ensure the directory exists
os.makedirs(SAVE_PATH, exist_ok=True)

# Initialize Roboflow API
rf = Roboflow(api_key="2vvBJUKCOr8cOCG1Ca6k")

# Load dataset version
project = rf.workspace("dawsons-workspace").project("beluga-whale-annotated-data")
version = project.version(10)

# Download dataset
dataset = version.download("yolov8", location=SAVE_PATH)

print(f"Dataset version 10 downloaded to: {dataset.location}")

# Check if data.yaml exists
yaml_path = os.path.join(SAVE_PATH, "data.yaml")
if not os.path.exists(yaml_path):
    raise FileNotFoundError(f"❌ data.yaml not found at {yaml_path}. Download might have failed.")
else:
    print(f"data.yaml found at: {yaml_path}")
