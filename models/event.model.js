import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["cleanup", "safety", "community", "maintenance", "other"],
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
        required: [true, "Coordinates are required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["going", "maybe", "not_going"],
          default: "going",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    maxAttendees: {
      type: Number,
    },
    image: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
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
eventSchema.index({ location: "2dsphere" })
// Create index for finding upcoming events
eventSchema.index({ startDate: 1 })

const Event = mongoose.model("Event", eventSchema)

export default Event

