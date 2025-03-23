// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    
    const response = await axios.get(`${API_URL}/reports?${searchParams}`, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Reports API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch reports' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await axios.post(`${API_URL}/reports`, body, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Reports API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to create report' },
      { status: error.response?.status || 500 }
    );
  }
}