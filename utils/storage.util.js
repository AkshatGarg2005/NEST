import { Storage } from "@google-cloud/storage"
import { v4 as uuidv4 } from "uuid"

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
})

const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET)

// Upload file to cloud storage
export const uploadToCloudStorage = async (file, folder = "uploads") => {
  try {
    const fileName = `${folder}/${uuidv4()}-${file.originalname}`
    const fileUpload = bucket.file(fileName)

    const blobStream = fileUpload.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    })

    return new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(error)
      })

      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
        resolve(publicUrl)
      })

      blobStream.end(file.buffer)
    })
  } catch (error) {
    console.error("Error uploading to cloud storage:", error)
    throw error
  }
}

// Delete file from cloud storage
export const deleteFromCloudStorage = async (fileUrl) => {
  try {
    const fileName = fileUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1]

    if (!fileName) {
      throw new Error("Invalid file URL")
    }

    await bucket.file(fileName).delete()
    return true
  } catch (error) {
    console.error("Error deleting from cloud storage:", error)
    throw error
  }
}

