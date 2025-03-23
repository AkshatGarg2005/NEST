// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    
    const response = await axios.get(`${API_URL}/notifications?${searchParams}`, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Notifications API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch notifications' },
      { status: error.response?.status || 500 }
    );
  }
}