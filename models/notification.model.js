import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "report_status",
        "emergency_alert",
        "community_announcement",
        "comment",
        "upvote",
        "assignment",
        "resolution",
        "prediction",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ["Report", "Event", "User", "Forum", "System"],
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "critical"],
      default: "normal",
    },
    read: {
      type: Boolean,
      default: false,
    },
    sentVia: [
      {
        type: String,
        enum: ["app", "email", "sms", "push"],
        default: ["app"],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Create TTL index for notification expiration
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification

