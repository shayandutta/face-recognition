const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 5001 || process.env.PORT;

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).json({ error: "No file uploaded." });
  }

  console.log("Received file:", req.file);

  const fileUrl = `https://face-recognition-lovat.vercel.app/${req.file.filename}`;
  res.status(200).json({ fileName: req.file.filename, filePath: fileUrl });
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
