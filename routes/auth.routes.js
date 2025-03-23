import express from "express"
import {
  register,
  login,
  firebaseAuth,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
} from "../controllers/auth.controller.js"
import { verifyFirebaseToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Register new user
router.post("/register", register)

// Login with email/password
router.post("/login", login)

// Firebase authentication
router.post("/firebase", verifyFirebaseToken, firebaseAuth)

// Refresh token
router.post("/refresh-token", refreshToken)

// Forgot password
router.post("/forgot-password", forgotPassword)

// Reset password
router.post("/reset-password/:token", resetPassword)

// Verify email
router.get("/verify-email/:token", verifyEmail)

// Logout
router.post("/logout", logout)

export default router

