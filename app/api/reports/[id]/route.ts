// app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const response = await axios.get(`${API_URL}/reports/${id}`, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Report API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch report' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const response = await axios.put(`${API_URL}/reports/${id}`, body, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Report API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to update report' },
      { status: error.response?.status || 500 }
    );
  }
}