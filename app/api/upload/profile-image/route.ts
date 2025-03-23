import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middleware';
import cloudinary from 'cloudinary';
import { storage } from '@/lib/firebase-admin';
import { updateProfile } from 'firebase/auth';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId, token) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      // Get file buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'nest_profile_images',
            public_id: `user_${userId}_${Date.now()}`,
            overwrite: true,
            transformation: [
              { width: 400, height: 400, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Write buffer to stream
        uploadStream.write(buffer);
        uploadStream.end();
      });
      
      // Return Cloudinary response
      return NextResponse.json({
        success: true,
        data: uploadResult
      });
      
    } catch (error: any) {
      console.error('Image upload error:', error);
      
      return NextResponse.json(
        { error: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }
  });
}