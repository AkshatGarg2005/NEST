import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../middleware';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId, token) => {
    try {
      // Make a request to your backend API (optional)
      // This example assumes your backend has a user profile endpoint
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${req.headers.get('Authorization')?.split('Bearer ')[1]}`,
        },
      });
      
      return NextResponse.json({
        success: true,
        data: response.data.data || {
          id: userId,
          email: token.email,
          name: token.name || 'User',
          role: 'resident', // Default role
          profilePicture: token.picture || '',
        },
      });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Fall back to basic user data from Firebase token
      return NextResponse.json({
        success: true,
        data: {
          id: userId,
          email: token.email,
          name: token.name || 'User',
          role: 'resident', // Default role
          profilePicture: token.picture || '',
        },
      });
    }
  });
}

// POST /api/users - Create or update user profile
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId, token) => {
    try {
      const body = await req.json();
      
      // Include Firebase UID when sending data to backend
      const userData = {
        ...body,
        firebaseUid: userId,
      };
      
      // Send data to backend
      try {
        const response = await axios.post(`${API_URL}/users`, userData, {
          headers: {
            Authorization: `Bearer ${req.headers.get('Authorization')?.split('Bearer ')[1]}`,
          },
        });
        
        return NextResponse.json({
          success: true,
          data: response.data.data,
        });
      } catch (backendError: any) {
        // If backend call fails, we still create a basic user record
        console.error('Backend user creation error:', backendError);
        
        return NextResponse.json({
          success: true,
          data: {
            id: userId,
            email: userData.email || token.email,
            name: userData.name || token.name || 'User',
            role: 'resident',
            profilePicture: userData.profilePicture || token.picture || '',
          },
          message: 'User created in Firebase but backend sync failed',
        });
      }
    } catch (error: any) {
      console.error('User creation error:', error);
      
      return NextResponse.json(
        { error: error.message || 'Failed to create user' },
        { status: 500 }
      );
    }
  });
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, userId, token) => {
    try {
      const body = await req.json();
      
      // Send data to backend
      const response = await axios.put(`${API_URL}/users/profile`, body, {
        headers: {
          Authorization: `Bearer ${req.headers.get('Authorization')?.split('Bearer ')[1]}`,
        },
      });
      
      return NextResponse.json({
        success: true,
        data: response.data.data,
      });
    } catch (error: any) {
      console.error('User update error:', error);
      
      return NextResponse.json(
        { error: error.message || 'Failed to update user profile' },
        { status: 500 }
      );
    }
  });
}