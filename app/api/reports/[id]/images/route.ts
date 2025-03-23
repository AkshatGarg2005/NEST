// app/api/reports/[id]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    // Convert File to buffer
    const buffer = Buffer.from(await image.arrayBuffer());
    
    // Create form data for the API request
    const apiFormData = new FormData();
    apiFormData.append('image', buffer, {
      filename: image.name,
      contentType: image.type,
    });
    
    const response = await axios.post(
      `${API_URL}/reports/${id}/images`,
      apiFormData,
      {
        headers: { 
          Authorization: request.headers.get('Authorization') || '',
          ...apiFormData.getHeaders(),
        }
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Image Upload API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to upload image' },
      { status: error.response?.status || 500 }
    );
  }
}