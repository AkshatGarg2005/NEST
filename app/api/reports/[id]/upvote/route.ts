// app/api/reports/[id]/upvote/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const response = await axios.post(`${API_URL}/reports/${id}/upvote`, {}, {
      headers: { 
        Authorization: request.headers.get('Authorization') || '' 
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Upvote API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to upvote report' },
      { status: error.response?.status || 500 }
    );
  }
}