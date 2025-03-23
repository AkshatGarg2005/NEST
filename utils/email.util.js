import nodemailer from "nodemailer"

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Send email
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Send notification email
export const sendNotificationEmail = async (user, notification) => {
  try {
    // Only send if user has email notifications enabled
    if (!user.notificationPreferences.email) {
      return null
    }

    let subject = "N.E.S.T. Notification"
    let content = notification.message

    // Customize email based on notification type
    switch (notification.type) {
      case "emergency_alert":
        subject = "🚨 EMERGENCY ALERT: " + notification.title
        content = `
          <h2>Emergency Alert</h2>
          <p>${notification.message}</p>
          <p>Please take appropriate action immediately.</p>
        `
        break
      case "report_status":
        subject = "Report Status Update: " + notification.title
        content = `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          <p>View more details on the N.E.S.T. platform.</p>
        `
        break
      default:
        content = `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
        `
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
            <h1 style="color: #333;">N.E.S.T.</h1>
            <p>Neighborhood Emergency & Safety Tool</p>
          </div>
          <div style="padding: 20px;">
            ${content}
          </div>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            <p>You received this email because you have notifications enabled on N.E.S.T.</p>
            <p>To update your notification preferences, visit your profile settings.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    console.error("Error sending notification email:", error)
    // Don't throw error, just log it
    return null
  }
}

