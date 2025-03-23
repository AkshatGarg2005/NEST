// app/api/cloudinary/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - this runs server-side only
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a temporary file path using Node's native path and os modules
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    const tempFilePath = path.join(os.tmpdir(), file.name);
    
    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tempFilePath, 
        { 
          folder,
          resource_type: 'auto'
        },
        (error, result) => {
          // Remove temp file
          fs.unlinkSync(tempFilePath);
          
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload to Cloudinary' },
      { status: 500 }
    );
  }
}