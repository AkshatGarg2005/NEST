// lib/cloudinary-client.ts
// This is a browser-safe client for Cloudinary operations

/**
 * Upload a file to Cloudinary via our API route
 */
export async function uploadToCloudinary(file: File, folder = 'uploads') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
  
    try {
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload to Cloudinary');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }
  
  /**
   * Get a Cloudinary URL with transformations
   */
  export function getCloudinaryUrl(publicId: string, {
    width,
    height,
    crop = 'fill',
    ...options
  }: {
    width?: number;
    height?: number;
    crop?: string;
    [key: string]: any;
  } = {}) {
    if (!publicId) return '';
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined');
      return '';
    }
  
    // Build transformation string
    const transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    
    // Add any other transformations passed in options
    Object.entries(options).forEach(([key, value]) => {
      if (value) transformations.push(`${key}_${value}`);
    });
  
    const transformationString = transformations.length > 0 
      ? transformations.join(',') + '/' 
      : '';
  
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
  }