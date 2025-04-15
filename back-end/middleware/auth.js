const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticate;

const authenticate = require("./middleware/auth");

// Example of a protected route
app.get("/api/protected", authenticate, async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    res.json({ message: `Hello, ${req.user.username}! This is a protected route.`, profile: response.data });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});