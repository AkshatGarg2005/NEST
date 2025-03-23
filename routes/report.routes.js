import express from "express"
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  upvoteReport,
  addComment,
  getReportsByCategory,
  getNearbyReports,
  getReportsByStatus,
  assignReport,
  resolveReport,
  uploadReportImage,
  uploadReportAudio,
} from "../controllers/report.controller.js"
import { checkRole } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Create a new report
router.post("/", createReport)

// Get all reports (with filtering)
router.get("/", getReports)

// Get reports by category
router.get("/category/:category", getReportsByCategory)

// Get reports by status
router.get("/status/:status", getReportsByStatus)

// Get nearby reports
router.get("/nearby", getNearbyReports)

// Get a specific report
router.get("/:id", getReportById)

// Update a report
router.put("/:id", updateReport)

// Delete a report
router.delete("/:id", deleteReport)

// Upvote a report
router.post("/:id/upvote", upvoteReport)

// Add a comment to a report
router.post("/:id/comments", addComment)

// Assign a report to a user (admin/moderator only)
router.post("/:id/assign", checkRole(["admin", "moderator"]), assignReport)

// Resolve a report (admin/moderator only)
router.post("/:id/resolve", checkRole(["admin", "moderator"]), resolveReport)

// Upload image for a report
router.post("/:id/images", upload.single("image"), uploadReportImage)

// Upload audio for a report
router.post("/:id/audio", upload.single("audio"), uploadReportAudio)

export default router

