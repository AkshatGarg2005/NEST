import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK if it hasn't been initialized already
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    // Check if we have service account credentials
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }
    
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw error;
    }
  }
  
  return admin;
}

// Export Firebase Admin services
export const firebaseAdmin = getFirebaseAdmin();
export const auth = firebaseAdmin.auth();
export const firestore = firebaseAdmin.firestore();
export const storage = firebaseAdmin.storage();