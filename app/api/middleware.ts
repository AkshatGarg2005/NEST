import { NextRequest, NextResponse } from 'next/server';
import { auth as firebaseAuth } from '@/lib/firebase-admin';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, userId: string, token: any) => Promise<NextResponse>
) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid auth token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Verify Firebase token
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      
      if (!decodedToken) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid token' },
          { status: 401 }
        );
      }
      
      // Check if the user is email verified (optional)
      if (!decodedToken.email_verified && process.env.ENFORCE_EMAIL_VERIFICATION === 'true') {
        return NextResponse.json(
          { error: 'Unauthorized: Email not verified' },
          { status: 403 }
        );
      }
      
      // Proceed with the request handler
      return handler(req, decodedToken.uid, decodedToken);
      
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}