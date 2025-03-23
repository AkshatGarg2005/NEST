import mongoose from "mongoose"

const predictionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["outage", "pothole", "water_leak", "noise", "cleanliness"],
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: String,
      radius: Number, // Radius of the affected area in meters
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    factors: [
      {
        name: String,
        weight: Number,
      },
    ],
    historicalData: {
      reportCount: Number,
      timeFrame: String, // e.g., "last_30_days", "last_year"
      pattern: String, // e.g., "seasonal", "weather_related", "recurring"
    },
    predictedTimeFrame: {
      start: Date,
      end: Date,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    status: {
      type: String,
      enum: ["active", "verified", "resolved", "false_positive"],
      default: "active",
    },
    relatedReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    notificationSent: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create index for geospatial queries
predictionSchema.index({ location: "2dsphere" })
// Create index for finding active predictions
predictionSchema.index({ status: 1 })

const Prediction = mongoose.model("Prediction", predictionSchema)

export default Prediction

