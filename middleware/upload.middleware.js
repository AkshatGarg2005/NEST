import multer from "multer"
import { createError } from "../utils/error.util.js"

// Configure storage
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and audio files
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true)
  } else {
    cb(createError(400, "Only image and audio files are allowed"), false)
  }
}

// Configure upload
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
})

