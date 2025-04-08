const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const trackingResultsFolder = path.join(__dirname, "Beluga_Tracking", "tracking_results");
const outputFolder = path.join(__dirname, "Beluga_Tracking", "processed_videos");

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Process each .mp4 file in the tracking results folder
fs.readdir(trackingResultsFolder, (err, files) => {
  if (err) {
    console.error("❌ Error reading tracking results folder:", err.message);
    return;
  }

  const mp4Files = files.filter((file) => file.endsWith(".mp4"));

  if (mp4Files.length === 0) {
    console.log("No .mp4 files found in the tracking results folder.");
    return;
  }

  mp4Files.forEach((file) => {
    const inputPath = path.join(trackingResultsFolder, file);
    const outputPath = path.join(outputFolder, `processed_${file}`);

    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${outputPath}"`;

    console.log(`Processing: ${file}`);
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        return;
      }
      console.log(`✅ Successfully processed: ${file}`);
    });
  });
});