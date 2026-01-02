const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục uploads cho vocabulary
const imageUploadDir = path.join(__dirname, "../../uploads/vocabulary/images");
const audioUploadDir = path.join(__dirname, "../../uploads/vocabulary/audio");

if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}
if (!fs.existsSync(audioUploadDir)) {
  fs.mkdirSync(audioUploadDir, { recursive: true });
}

// Storage cho images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, "word-img-" + uniqueSuffix + ext);
  },
});

// Storage cho audio
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, "word-audio-" + uniqueSuffix + ext);
  },
});

// Filter cho images
const imageFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedMimes.includes(mime) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp, svg)"), false);
  }
};

// Filter cho audio
const audioFilter = (req, file, cb) => {
  const allowedMimes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp3", "audio/x-wav"];
  const allowedExts = [".mp3", ".wav", ".ogg", ".webm"];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedMimes.includes(mime) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file audio (mp3, wav, ogg, webm)"), false);
  }
};

// Multer instances
const uploadWordImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const uploadWordAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = {
  uploadWordImage,
  uploadWordAudio,
};

