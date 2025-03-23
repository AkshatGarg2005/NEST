import Report from "../models/report.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { createError } from "../utils/error.util.js"
import { analyzeImage } from "../utils/ai.util.js"
import { uploadToCloudStorage } from "../utils/storage.util.js"

// Create a new report
export const createReport = async (req, res, next) => {
  try {
    const { title, description, category, subcategory, severity, location } = req.body

    // Create new report
    const newReport = new Report({
      title,
      description,
      category,
      subcategory,
      severity,
      location,
      reporter: req.user.id,
    })

    // Save report
    await newReport.save()

    // Notify admins and moderators
    const adminsAndModerators = await User.find({
      role: { $in: ["admin", "moderator"] },
      "notificationPreferences.app": true,
    })

    const notifications = adminsAndModerators.map((user) => ({
      recipient: user._id,
      type: "report_status",
      title: "New Report Submitted",
      message: `A new ${category} report has been submitted: ${title}`,
      relatedTo: {
        model: "Report",
        id: newReport._id,
      },
      priority: severity === "critical" ? "high" : "normal",
    }))

    if (notifications.length > 0) {
      await Notification.insertMany(notifications)

      // Send real-time notification via Socket.io
      adminsAndModerators.forEach((user) => {
        req.io.to(user._id.toString()).emit("new_report", {
          reportId: newReport._id,
          title: newReport.title,
          category: newReport.category,
          severity: newReport.severity,
        })
      })
    }

    res.status(201).json({
      success: true,
      data: newReport,
    })
  } catch (error) {
    next(error)
  }
}

// Get all reports (with filtering)
export const getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt", category, status, severity, reporter, search } = req.query

    // Build query
    const query = {}

    if (category) query.category = category
    if (status) query.status = status
    if (severity) query.severity = severity
    if (reporter) query.reporter = reporter

    // Text search
    if (search) {
      query.$text = { $search: search }
    }

    // Execute query with pagination
    const reports = await Report.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .populate("reporter", "name email profilePicture")
      .populate("assignedTo", "name email profilePicture")

    // Get total count
    const total = await Report.countDocuments(query)

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get reports by category
export const getReportsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query

    // Execute query with pagination
    const reports = await Report.find({ category })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .populate("reporter", "name email profilePicture")
      .populate("assignedTo", "name email profilePicture")

    // Get total count
    const total = await Report.countDocuments({ category })

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get reports by status
export const getReportsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query

    // Execute query with pagination
    const reports = await Report.find({ status })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .populate("reporter", "name email profilePicture")
      .populate("assignedTo", "name email profilePicture")

    // Get total count
    const total = await Report.countDocuments({ status })

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get nearby reports
export const getNearbyReports = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000, limit = 10 } = req.query

    if (!longitude || !latitude) {
      return next(createError(400, "Longitude and latitude are required"))
    }

    // Find reports near the specified location
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
          },
          $maxDistance: Number.parseInt(maxDistance), // in meters
        },
      },
    })
      .limit(Number.parseInt(limit))
      .populate("reporter", "name email profilePicture")
      .populate("assignedTo", "name email profilePicture")

    res.status(200).json({
      success: true,
      data: reports,
    })
  } catch (error) {
    next(error)
  }
}

// Get a specific report
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params

    const report = await Report.findById(id)
      .populate("reporter", "name email profilePicture")
      .populate("assignedTo", "name email profilePicture")
      .populate("comments.user", "name email profilePicture")

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    next(error)
  }
}

// Update a report
export const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description, severity, status } = req.body

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Check if user is authorized to update
    if (report.reporter.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return next(createError(403, "You are not authorized to update this report"))
    }

    // Update fields
    if (title) report.title = title
    if (description) report.description = description
    if (severity) report.severity = severity

    // Only admins and moderators can update status
    if (status && ["admin", "moderator"].includes(req.user.role)) {
      report.status = status

      // If status changed to resolved, add resolution details
      if (status === "resolved" && report.status !== "resolved") {
        report.resolutionDetails = {
          resolvedBy: req.user.id,
          resolutionDate: Date.now(),
        }

        // Notify reporter
        const notification = new Notification({
          recipient: report.reporter,
          type: "report_status",
          title: "Report Resolved",
          message: `Your report "${report.title}" has been resolved.`,
          relatedTo: {
            model: "Report",
            id: report._id,
          },
        })

        await notification.save()

        // Send real-time notification
        req.io.to(report.reporter.toString()).emit("report_resolved", {
          reportId: report._id,
          title: report.title,
        })
      }
    }

    // Save updated report
    await report.save()

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    next(error)
  }
}

// Delete a report
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Check if user is authorized to delete
    if (report.reporter.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return next(createError(403, "You are not authorized to delete this report"))
    }

    // Delete report
    await report.remove()

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Upvote a report
export const upvoteReport = async (req, res, next) => {
  try {
    const { id } = req.params

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Check if user already upvoted
    if (report.upvotes.includes(req.user.id)) {
      // Remove upvote
      report.upvotes = report.upvotes.filter((userId) => userId.toString() !== req.user.id)
    } else {
      // Add upvote
      report.upvotes.push(req.user.id)

      // If this is the 5th upvote, notify admins and moderators
      if (report.upvotes.length === 5) {
        const adminsAndModerators = await User.find({
          role: { $in: ["admin", "moderator"] },
          "notificationPreferences.app": true,
        })

        const notifications = adminsAndModerators.map((user) => ({
          recipient: user._id,
          type: "upvote",
          title: "Popular Report",
          message: `Report "${report.title}" has received 5 upvotes.`,
          relatedTo: {
            model: "Report",
            id: report._id,
          },
          priority: "normal",
        }))

        if (notifications.length > 0) {
          await Notification.insertMany(notifications)

          // Send real-time notification
          adminsAndModerators.forEach((user) => {
            req.io.to(user._id.toString()).emit("popular_report", {
              reportId: report._id,
              title: report.title,
              upvotes: report.upvotes.length,
            })
          })
        }
      }
    }

    // Save report
    await report.save()

    res.status(200).json({
      success: true,
      data: {
        upvotes: report.upvotes,
        count: report.upvotes.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Add a comment to a report
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { text } = req.body

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Add comment
    const comment = {
      user: req.user.id,
      text,
    }

    report.comments.push(comment)

    // Save report
    await report.save()

    // Populate user info for the new comment
    const populatedReport = await Report.findById(id).populate("comments.user", "name email profilePicture")

    const newComment = populatedReport.comments[populatedReport.comments.length - 1]

    // Notify report creator if the commenter is not the creator
    if (report.reporter.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: report.reporter,
        type: "comment",
        title: "New Comment on Your Report",
        message: `Someone commented on your report "${report.title}".`,
        relatedTo: {
          model: "Report",
          id: report._id,
        },
      })

      await notification.save()

      // Send real-time notification
      req.io.to(report.reporter.toString()).emit("new_comment", {
        reportId: report._id,
        title: report.title,
        comment: text,
      })
    }

    res.status(201).json({
      success: true,
      data: newComment,
    })
  } catch (error) {
    next(error)
  }
}

// Assign a report to a user (admin/moderator only)
export const assignReport = async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Find user to assign
    const user = await User.findById(userId)

    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Update report
    report.assignedTo = userId
    report.status = "in-progress"

    // Save report
    await report.save()

    // Notify assigned user
    const notification = new Notification({
      recipient: userId,
      type: "assignment",
      title: "Report Assigned to You",
      message: `You have been assigned to handle report "${report.title}".`,
      relatedTo: {
        model: "Report",
        id: report._id,
      },
      priority: report.severity === "critical" ? "high" : "normal",
    })

    await notification.save()

    // Send real-time notification
    req.io.to(userId.toString()).emit("report_assigned", {
      reportId: report._id,
      title: report.title,
      severity: report.severity,
    })

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    next(error)
  }
}

// Resolve a report (admin/moderator only)
export const resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params
    const { resolutionNotes } = req.body

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Update report
    report.status = "resolved"
    report.resolutionDetails = {
      resolvedBy: req.user.id,
      resolutionDate: Date.now(),
      resolutionNotes,
    }

    // Save report
    await report.save()

    // Notify reporter
    const notification = new Notification({
      recipient: report.reporter,
      type: "resolution",
      title: "Your Report Has Been Resolved",
      message: `Your report "${report.title}" has been resolved.`,
      relatedTo: {
        model: "Report",
        id: report._id,
      },
    })

    await notification.save()

    // Send real-time notification
    req.io.to(report.reporter.toString()).emit("report_resolved", {
      reportId: report._id,
      title: report.title,
      resolutionNotes,
    })

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    next(error)
  }
}

// Upload image for a report
export const uploadReportImage = async (req, res, next) => {
  try {
    const { id } = req.params
    const file = req.file

    if (!file) {
      return next(createError(400, "No image file provided"))
    }

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Check if user is authorized
    if (report.reporter.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return next(createError(403, "You are not authorized to upload images to this report"))
    }

    // Upload file to cloud storage
    const imageUrl = await uploadToCloudStorage(file, `reports/${id}/images`)

    // Analyze image with AI if it's a pothole or cleanliness report
    let imageValidation = false
    if (["pothole", "cleanliness"].includes(report.category)) {
      const analysis = await analyzeImage(imageUrl, report.category)
      imageValidation = analysis.isValid

      // Update AI analysis
      report.aiAnalysis = {
        ...report.aiAnalysis,
        imageValidation,
        confidence: analysis.confidence,
        tags: analysis.tags,
      }
    }

    // Add image to report
    report.images.push({
      url: imageUrl,
      caption: req.body.caption || "",
      uploadedAt: Date.now(),
    })

    // Save report
    await report.save()

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        imageValidation,
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Upload audio for a report
export const uploadReportAudio = async (req, res, next) => {
  try {
    const { id } = req.params
    const file = req.file

    if (!file) {
      return next(createError(400, "No audio file provided"))
    }

    // Find report
    const report = await Report.findById(id)

    if (!report) {
      return next(createError(404, "Report not found"))
    }

    // Check if user is authorized
    if (report.reporter.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return next(createError(403, "You are not authorized to upload audio to this report"))
    }

    // Upload file to cloud storage
    const audioUrl = await uploadToCloudStorage(file, `reports/${id}/audio`)

    // Add audio to report
    report.audio.push({
      url: audioUrl,
      duration: req.body.duration || 0,
      uploadedAt: Date.now(),
    })

    // Save report
    await report.save()

    res.status(200).json({
      success: true,
      data: {
        audioUrl,
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}

