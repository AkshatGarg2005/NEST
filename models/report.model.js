import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["water", "electricity", "noise", "pothole", "cleanliness", "playground", "other"],
      index: true,
    },
    subcategory: {
      type: String,
      enum: [
        // Water subcategories
        "leak",
        "pressure",
        "quality",
        "outage",
        // Electricity subcategories
        "power_outage",
        "fluctuation",
        "streetlight",
        "wire",
        // Noise subcategories
        "music",
        "party",
        "construction",
        "vehicle",
        "alarm",
        "animal",
        // Pothole subcategories
        "road",
        "sidewalk",
        // Cleanliness subcategories
        "garbage",
        "graffiti",
        "debris",
        // Playground subcategories
        "swing",
        "slide",
        "equipment",
        "fence",
        // Other
        "other",
      ],
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Coordinates are required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
    },
    images: [
      {
        url: String,
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    audio: [
      {
        url: String,
        duration: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter is required"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    aiAnalysis: {
      confidence: Number, // AI confidence score for the report
      tags: [String], // AI-generated tags
      prediction: String, // AI prediction about the issue
      imageValidation: Boolean, // Whether AI validated the image
    },
    resolutionDetails: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      resolutionDate: Date,
      resolutionNotes: String,
    },
    estimatedResolutionTime: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
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

// Create indexes for geospatial and text search
reportSchema.index({ location: "2dsphere" })
reportSchema.index({ title: "text", description: "text" })

const Report = mongoose.model("Report", reportSchema)

export default Report

