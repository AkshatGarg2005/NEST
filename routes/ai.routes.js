import express from "express"
import {
  getChatbotResponse,
  analyzeReportImage,
  getPredictions,
  generatePredictions,
} from "../controllers/ai.controller.js"
import { checkRole } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Get chatbot response
router.post("/chat", getChatbotResponse)

// Analyze report image
router.post("/analyze-image", upload.single("image"), analyzeReportImage)

// Get AI predictions
router.get("/predictions", getPredictions)

// Generate new predictions (admin only)
router.post("/generate-predictions", checkRole(["admin"]), generatePredictions)

export default router

