// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    let endpoint = '';
    
    switch (action) {
      case 'login':
        endpoint = '/auth/login';
        break;
      case 'register':
        endpoint = '/auth/register';
        break;
      case 'refreshToken':
        endpoint = '/auth/refresh-token';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Auth API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Authentication failed' },
      { status: error.response?.status || 500 }
    );
  }
}