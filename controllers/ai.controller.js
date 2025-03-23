import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import Report from "../models/report.model.js"
import Prediction from "../models/prediction.model.js"
import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"
import { createError } from "../utils/error.util.js"
import { analyzeImage } from "../utils/ai.util.js"
import { uploadToCloudStorage } from "../utils/storage.util.js"

// Get chatbot response
export const getChatbotResponse = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return next(createError(400, "Message is required"))
    }

    // Prepare conversation history for the AI
    const formattedHistory = conversationHistory
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    // System prompt for the AI
    const systemPrompt = `
      You are an AI assistant for the N.E.S.T. (Neighborhood Emergency & Safety Tool) platform.
      Your role is to help users with community issues, report problems, and provide information about services.
      
      Available services:
      - Water issues (leaks, pressure, quality, outages)
      - Electricity issues (outages, fluctuations, streetlights, downed wires)
      - Noise complaints (music, parties, construction, vehicles, alarms)
      - Maintenance requests (potholes, sidewalks, playground equipment, trash)
      
      Be helpful, concise, and guide users to the appropriate reporting forms when needed.
      If there's an emergency situation, advise users to use the SOS button or call emergency services.
      
      Current date: ${new Date().toLocaleDateString()}
    `

    // Generate response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `${formattedHistory}\nUser: ${message}`,
    })

    res.status(200).json({
      success: true,
      data: {
        response: text,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Analyze report image
export const analyzeReportImage = async (req, res, next) => {
  try {
    const { category } = req.query
    const file = req.file

    if (!file) {
      return next(createError(400, "No image file provided"))
    }

    if (!category) {
      return next(createError(400, "Category is required"))
    }

    // Upload file to cloud storage
    const imageUrl = await uploadToCloudStorage(file, "analysis")

    // Analyze image with AI
    const analysis = await analyzeImage(imageUrl, category)

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        analysis,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get AI predictions
export const getPredictions = async (req, res, next) => {
  try {
    const { type, status = "active", minProbability = 0.5, page = 1, limit = 10 } = req.query

    // Build query
    const query = { status }

    if (type) query.type = type
    if (minProbability) query.probability = { $gte: Number.parseFloat(minProbability) }

    // Execute query with pagination
    const predictions = await Prediction.find(query)
      .sort("-probability")
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .populate("relatedReports", "title category status")

    // Get total count
    const total = await Prediction.countDocuments(query)

    res.status(200).json({
      success: true,
      data: predictions,
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

// Generate new predictions (admin only)
export const generatePredictions = async (req, res, next) => {
  try {
    // This would be a complex operation in a real system
    // Here we'll simulate generating predictions based on historical data

    // Get historical reports for analysis
    const reports = await Report.find({
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // Last 90 days
    }).select("category subcategory location severity status createdAt")

    // Group reports by location and category
    const locationGroups = {}

    reports.forEach((report) => {
      const locationKey = report.location.coordinates.join(",")

      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = {
          coordinates: report.location.coordinates,
          address: report.location.address,
          categories: {},
        }
      }

      if (!locationGroups[locationKey].categories[report.category]) {
        locationGroups[locationKey].categories[report.category] = {
          count: 0,
          reports: [],
        }
      }

      locationGroups[locationKey].categories[report.category].count += 1
      locationGroups[locationKey].categories[report.category].reports.push(report._id)
    })

    // Generate predictions for locations with multiple reports of the same category
    const predictions = []

    for (const locationKey in locationGroups) {
      const location = locationGroups[locationKey]

      for (const category in location.categories) {
        const categoryData = location.categories[category]

        // Only generate predictions for locations with at least 3 reports of the same category
        if (categoryData.count >= 3) {
          // Calculate probability based on number of reports
          const probability = Math.min(0.5 + categoryData.count * 0.1, 0.95)

          // Determine severity based on reports
          let severity = "medium"
          if (probability > 0.8) severity = "high"
          if (probability > 0.9) severity = "critical"

          // Create prediction
          const prediction = new Prediction({
            type: category,
            location: {
              type: "Point",
              coordinates: location.coordinates,
              address: location.address,
              radius: 500, // 500 meters radius
            },
            probability,
            severity,
            confidence: probability - 0.1,
            factors: [
              { name: "historical_reports", weight: 0.8 },
              { name: "frequency", weight: 0.6 },
            ],
            historicalData: {
              reportCount: categoryData.count,
              timeFrame: "last_90_days",
              pattern: "recurring",
            },
            predictedTimeFrame: {
              start: new Date(),
              end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
            },
            relatedReports: categoryData.reports,
          })

          predictions.push(prediction)
        }
      }
    }

    // Save predictions
    if (predictions.length > 0) {
      await Prediction.insertMany(predictions)

      // Notify admins about new predictions
      const admins = await User.find({
        role: "admin",
        "notificationPreferences.app": true,
      })

      const notifications = admins.map((admin) => ({
        recipient: admin._id,
        type: "prediction",
        title: "New AI Predictions Generated",
        message: `${predictions.length} new predictions have been generated based on historical data.`,
        relatedTo: {
          model: "System",
          id: admin._id, // Using admin ID as a placeholder
        },
        priority: "normal",
      }))

      if (notifications.length > 0) {
        await Notification.insertMany(notifications)

        // Send real-time notification
        admins.forEach((admin) => {
          req.io.to(admin._id.toString()).emit("new_predictions", {
            count: predictions.length,
          })
        })
      }
    }

    res.status(200).json({
      success: true,
      message: `Generated ${predictions.length} new predictions`,
      data: predictions,
    })
  } catch (error) {
    next(error)
  }
}

