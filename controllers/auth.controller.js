import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/user.model.js"
import { createError } from "../utils/error.util.js"
import { sendEmail } from "../utils/email.util.js"

// Register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(createError(400, "User with this email already exists"))
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      authMethod: "email",
      verificationToken,
      verificationTokenExpiry,
    })

    await newUser.save()

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
    })
  } catch (error) {
    next(error)
  }
}

// Login with email/password
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return next(createError(401, "Invalid credentials"))
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(createError(401, "Please verify your email before logging in"))
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return next(createError(401, "Invalid credentials"))
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })

    // Update last login
    user.lastLogin = Date.now()
    await user.save()

    // Remove password from response
    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: userWithoutPassword,
    })
  } catch (error) {
    next(error)
  }
}

// Firebase authentication
export const firebaseAuth = async (req, res, next) => {
  try {
    const { firebaseUid, email, emailVerified } = req.user
    const { name, phone, profilePicture } = req.body

    // Check if user already exists in our database
    let user = await User.findOne({ firebaseUid })

    if (user) {
      // User exists, update information
      user.name = name || user.name
      user.phone = phone || user.phone
      user.profilePicture = profilePicture || user.profilePicture
      user.lastLogin = Date.now()

      await user.save()
    } else {
      // Create new user
      user = new User({
        name,
        email,
        firebaseUid,
        phone,
        profilePicture,
        authMethod: "google",
        isVerified: emailVerified,
      })

      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// Refresh token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(createError(400, "Refresh token is required"))
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Find user
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Generate new JWT token
    const newToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(200).json({
      success: true,
      token: newToken,
    })
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(createError(401, "Invalid or expired refresh token"))
    }
    next(error)
  }
}

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 minutes

    await user.save()

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please click on the following link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
    })

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    })
  } catch (error) {
    next(error)
  }
}

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Hash token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(createError(400, "Invalid or expired reset token"))
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    next(error)
  }
}

// Verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    // Find user
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return next(createError(400, "Invalid or expired verification token"))
    }

    // Update user
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined

    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Logout
export const logout = async (req, res, next) => {
  try {
    // For JWT, we don't need to do anything on the server
    // The client should remove the token

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    next(error)
  }
}

