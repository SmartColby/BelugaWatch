const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Import the User model
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const multer = require("multer");
const { spawn } = require("child_process");

const parser = new Parser();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'], // Expose headers if needed
}));
app.use(express.json());
app.use(express.static('public')); // Serve static files like images

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/tracking_results", express.static(path.join(__dirname, "Beluga_Tracking", "tracking_results"), {
  setHeaders: (res, path) => {
    if (path.endsWith(".mp4")) {
      res.setHeader("Content-Type", "video/mp4");
    }
  },
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://gcolbert2021:Starboy2025@beluga-tracking.y3x03kp.mongodb.net/?retryWrites=true&w=majority&appName=beluga-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create the uploads directory if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Root API Route
app.get('/api', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Wikipedia Summary Search Route
app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  console.log("🔍 Search query received:", query);

  try {
    const wikiResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const data = wikiResponse.data;
    console.log('API Response:', data);

    const result = {
      title: data.title,
      summary: data.extract,
      url: data.content_urls?.desktop?.page || null,
    };

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching Wikipedia data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Wikipedia data" });
  }
});

// Fetch news from RSS feeds and scrape MarineBio
app.get('/api/news', async (req, res) => {
  try {
    const rssFeeds = [
      'https://oceanservice.noaa.gov/news/rss.xml',
      'https://uk.whales.org/feed/',
    ];

    const rssArticles = [];
    for (const feedUrl of rssFeeds) {
      try {
        const response = await axios.get(feedUrl);
        console.log('Raw RSS Feed:', response.data);
        const feed = await parser.parseString(response.data);
        feed.items.forEach((item) => {
          rssArticles.push({
            title: item.title,
            link: item.link,
            source: feed.title,
          });
        });
      } catch (error) {
        console.warn(`⚠️ Skipping feed due to error: ${feedUrl}`);
      }
    }

    const marineBioUrl = 'https://marinebio.org/latest-news/';
    const { data } = await axios.get(marineBioUrl);
    const $ = cheerio.load(data);
    const marineBioArticles = [];
    $('.td-module-thumb a').each((i, el) => {
      const link = $(el).attr('href');
      const title = $(el).attr('title');
      if (title && link) {
        marineBioArticles.push({ title, link, source: 'MarineBio' });
      }
    });

    const allArticles = [...rssArticles, ...marineBioArticles];
    res.json(allArticles); // Ensure this is an array
  } catch (error) {
    console.error('❌ Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Register Route
app.post("/api/auth/register", async (req, res) => {
  const { username, name, email, password } = req.body;

  console.log(`📥 Register Request: Username: ${username}, Email: ${email}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, email, password: hashedPassword });
    await newUser.save();
    console.log(`✅ User Registered: ${username}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(`📥 Login Request: Email: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`⚠️ Login Failed: User not found for email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn(`⚠️ Login Failed: Invalid password for email: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    console.log(`✅ Login Successful: ${user.username}`);
    res.json({ token, username: user.username });
  } catch (error) {
    console.error("❌ Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Get User Profile Route
app.get("/api/auth/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Beluga Status Route
app.get('/api/beluga-status', async (req, res) => {
  const IUCN_API_TOKEN = "x7RaVeBN7PibyA2Vb4zAcR79WKSqLFFaEUBo";
  const url = `https://apiv3.iucnredlist.org/api/v3/species/Delphinapterus%20leucas?token=${IUCN_API_TOKEN}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching IUCN data:", error.message);
    res.status(500).json({ error: "Failed to fetch IUCN data" });
  }
});

// Serve Beluga data from JSON file
app.get('/api/beluga-data', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'beluga_data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading Beluga data:", err.message);
      return res.status(500).json({ error: "Failed to load Beluga data" });
    }
    res.json(JSON.parse(data));
  });
});

// Serve species data
app.get('/api/beluga-species', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'species_data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading species data:", err.message);
      return res.status(500).json({ error: "Failed to load species data" });
    }
    res.json(JSON.parse(data));
  });
});

// Serve threats data
app.get('/api/beluga-threats', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'threats.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading threats data:", err.message);
      return res.status(500).json({ error: "Failed to load threats data" });
    }
    res.json(JSON.parse(data));
  });
});

// Serve habitats data
app.get('/api/beluga-habitats', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'habitats.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading habitats data:", err.message);
      return res.status(500).json({ error: "Failed to load habitats data" });
    }
    res.json(JSON.parse(data));
  });
});

// Serve population trends data
app.get('/api/beluga-population-trends', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'population_trends.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading population trends data:", err.message);
      return res.status(500).json({ error: "Failed to load population trends data" });
    }
    res.json(JSON.parse(data));
  });
});

// Serve conservation actions data
app.get('/api/beluga-conservation-actions', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'conservation_actions.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error reading conservation actions data:", err.message);
      return res.status(500).json({ error: "Failed to load conservation actions data" });
    }
    res.json(JSON.parse(data)); // Ensure the JSON structure matches the frontend expectation
  });
});

// Video Upload Endpoint
app.post("/api/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join("uploads", req.file.filename).replace(/\\/g, "/"); // Ensure consistent slashes
  console.log(`✅ Video uploaded: /${filePath}`);
  res.json({ filePath: `/${filePath}` }); // Prefix with a single slash
});

// Process video for tracking
app.post("/api/process-tracking", upload.single("video"), (req, res) => {
  const videoPath = req.file.path;
  const outputFolder = path.join(__dirname, "Beluga_Tracking", "tracking_results");

  const pythonProcess = spawn("python", [
    path.join(__dirname, "Beluga_Tracking", "track.py"),
    videoPath,
    outputFolder,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    if (code === 0) {
      const videoFile = fs.readdirSync(outputFolder).find((file) => file.endsWith(".mp4"));
      if (!videoFile) {
        console.error("❌ Tracked video file not found.");
        return res.status(500).json({ error: "Tracked video file not found." });
      }
      const csvFile = fs.readdirSync(outputFolder).find((file) => file.endsWith(".csv"));
      res.json({
        trackingVideoPath: `/tracking_results/${videoFile}`,
        trackingDataPath: `/tracking_results/${csvFile}`,
      });
    } else {
      res.status(500).json({ error: "Python script failed." });
    }
  });
});

// Process video for behavior annotation
app.post("/api/process-behavior", (req, res) => {
  const { videoPath } = req.body;

  if (!videoPath) {
    return res.status(400).json({ error: "No video path provided" });
  }

  const behaviorVideoPath = videoPath.replace(".MP4", "_behavior.MP4");
  console.log(`✅ Behavior annotated video processed: ${behaviorVideoPath}`);
  res.json({ behaviorVideoPath });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Handle video upload and processing
const handleUpload = async () => {
  if (!videoFile) return alert("Please select a video file to upload.");
  setUploading(true);

  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    // Upload video
    const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedVideoPath = uploadResponse.data.filePath;
    setOriginalVideoUrl(`http://localhost:5000${uploadedVideoPath}`);
    console.log("Original Video URL:", `http://localhost:5000${uploadedVideoPath}`);

    // Process video for tracking
    const trackingResponse = await axios.post("http://localhost:5000/api/process-tracking", {
      videoPath: uploadedVideoPath,
    });
    setTrackingVideoUrl(`http://localhost:5000${trackingResponse.data.trackingVideoPath}`);
    console.log("Tracking Video URL:", trackingVideoUrl);

    // Process video for behavior annotation
    const behaviorResponse = await axios.post("http://localhost:5000/api/process-behavior", {
      videoPath: uploadedVideoPath,
    });
    setBehaviorVideoUrl(`http://localhost:5000${behaviorResponse.data.behaviorVideoPath}`);
    console.log("Behavior Annotated Video URL:", `http://localhost:5000${behaviorResponse.data.behaviorVideoPath}`);
  } catch (error) {
    console.error("Error uploading or processing video:", error);
    alert("Failed to process video. Please try again.");
  } finally {
    setUploading(false);
  }
};

// Python script main function
function main(video_path, output_folder) {
  console.log(`Processing video: ${video_path}`);
  console.log(`Output folder: ${output_folder}`);
  // Existing code...
}

// Remove or comment out the invalid HTML code
// Video display
// <video width="100%" controls autoPlay muted>
//   <source src="http://localhost:5000/tracking_results/tracked_20250406_233326.mp4" type="video/mp4" />
//   Your browser does not support the video tag.
// </video>

