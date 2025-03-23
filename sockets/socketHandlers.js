import User from "../models/user.model.js"

export const setupSocketHandlers = (io, redisClient) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error("Authentication error"))
      }

      // Verify token (simplified for example)
      const userId = await redisClient.get(`socket:auth:${token}`)

      if (!userId) {
        return next(new Error("Authentication error"))
      }

      // Attach user ID to socket
      socket.userId = userId
      next()
    } catch (error) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.userId}`)

    // Join user's personal room for targeted messages
    socket.join(socket.userId)

    // Update user's online status
    await User.findByIdAndUpdate(socket.userId, { isOnline: true })

    // Handle joining specific rooms (e.g., for specific reports or areas)
    socket.on("join_room", (room) => {
      socket.join(room)
      console.log(`User ${socket.userId} joined room: ${room}`)
    })

    // Handle leaving rooms
    socket.on("leave_room", (room) => {
      socket.leave(room)
      console.log(`User ${socket.userId} left room: ${room}`)
    })

    // Handle emergency alerts
    socket.on("emergency_alert", async (data) => {
      try {
        const { location, type, description } = data

        // Store emergency alert in Redis for quick access
        const alertId = `emergency:${Date.now()}`
        await redisClient.hset(alertId, {
          userId: socket.userId,
          type,
          description,
          location: JSON.stringify(location),
          timestamp: Date.now(),
        })

        // Set expiration (24 hours)
        await redisClient.expire(alertId, 24 * 60 * 60)

        // Find users in the vicinity (simplified)
        // In a real app, you'd query MongoDB for users near the location

        // Broadcast to all users (in a real app, you'd target specific users)
        io.emit("emergency_notification", {
          id: alertId,
          type,
          location,
          timestamp: Date.now(),
        })

        console.log(`Emergency alert sent by user ${socket.userId}`)
      } catch (error) {
        console.error("Error handling emergency alert:", error)
      }
    })

    // Handle user typing in chat
    socket.on("typing", (data) => {
      const { chatId, isTyping } = data

      // Broadcast to others in the chat room
      socket.to(chatId).emit("user_typing", {
        userId: socket.userId,
        isTyping,
      })
    })

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.userId}`)

      // Update user's online status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: Date.now(),
      })
    })
  })
}

