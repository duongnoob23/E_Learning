const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();

// Basic middleware
app.use(express.json());

// Thêm helmet
app.use(helmet());

// Thêm cors
app.use(cors());

// Thêm compression
app.use(compression());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Simple server is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}`);
});
