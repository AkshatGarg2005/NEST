import admin from "firebase-admin"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { createError } from "../utils/error.util.js"

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
})

// Verify Firebase token
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "No token provided"))
    }

    const token = authHeader.split(" ")[1]
    const decodedToken = await admin.auth().verifyIdToken(token)

    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    }

    next()
  } catch (error) {
    next(createError(401, "Invalid or expired token"))
  }
}

// Verify JWT token (for non-Firebase auth)
export const verifyJwtToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "No token provided"))
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    next(createError(401, "Invalid or expired token"))
  }
}

// Combined token verification (tries both Firebase and JWT)
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "No token provided"))
  }

  const token = authHeader.split(" ")[1]

  // Try Firebase token first
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)

    // Find user in our database
    const user = await User.findOne({ firebaseUid: decodedToken.uid })
    if (!user) {
      return next(createError(404, "User not found"))
    }

    req.user = {
      id: user._id,
      firebaseUid: decodedToken.uid,
      email: user.email,
      role: user.role,
    }

    return next()
  } catch (firebaseError) {
    // If Firebase verification fails, try JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find user in our database
      const user = await User.findById(decoded.id)
      if (!user) {
        return next(createError(404, "User not found"))
      }

      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
      }

      return next()
    } catch (jwtError) {
      return next(createError(401, "Invalid or expired token"))
    }
  }
}

// Check if user has required role
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Authentication required"))
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, "You do not have permission to perform this action"))
    }

    next()
  }
}

