// components/auth-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import api from "@/utils/api.util"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  profilePicture?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (userData: any, profileImage?: File) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  uploadProfilePicture: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        // Create user object from firebase user
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'resident',
          profilePicture: firebaseUser.photoURL || undefined
        }
        
        // Try to get additional user data from server (if available)
        try {
          const response = await api.get("/users/profile")
          if (response.data?.data) {
            // If server responds, use that data
            setUser(response.data.data)
          } else {
            // Otherwise use basic firebase data
            setUser(userData)
          }
        } catch (error) {
          // If API call fails, still use the Firebase data
          console.log("Using basic Firebase user data (server unavailable)")
          setUser(userData)
        }
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })
    
    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Additional API calls can be made here if needed
      toast({
        title: "Success",
        description: "You have been logged in successfully"
      })
      
      return userCredential.user
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    }
  }
  
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Additional API calls can be made here if needed
      toast({
        title: "Success",
        description: "You have been logged in successfully with Google"
      })
      
      return result.user
    } catch (error: any) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const register = async (userData: any, profileImage?: File) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )
      
      // Update the profile with additional data
      await updateProfile(userCredential.user, {
        displayName: userData.name
      })
      
      // No email verification - removed this step
      // await sendEmailVerification(userCredential.user)
      
      // Try to store additional user data in backend if available
      try {
        await api.post("/users", {
          firebaseUid: userCredential.user.uid,
          ...userData
        })
      } catch (error) {
        console.log("Backend API unavailable, user created in Firebase only")
      }
      
      // Upload profile image if provided
      if (profileImage) {
        try {
          const formData = new FormData()
          formData.append('file', profileImage)
          
          const response = await api.post('/upload/profile-image', formData)
          
          if (response.data?.secure_url) {
            await updateProfile(userCredential.user, {
              photoURL: response.data.secure_url
            })
          }
        } catch (imageError) {
          console.error("Failed to upload profile image:", imageError)
          // Continue with registration even if image upload fails
        }
      }
      
      return userCredential.user
    } catch (error: any) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }
  
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  // Upload profile picture
  const uploadProfilePicture = async (file: File) => {
    try {
      if (!firebaseUser) throw new Error("User not authenticated")
      
      // Try to upload to server
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await api.post('/upload/profile-image', formData)
        
        if (response.data?.secure_url) {
          // Update Firebase profile
          await updateProfile(firebaseUser, {
            photoURL: response.data.secure_url
          })
          
          // Update local state
          if (user) {
            setUser({
              ...user,
              profilePicture: response.data.secure_url
            })
          }
          
          return response.data.secure_url
        }
      } catch (error) {
        console.error("Server upload failed, trying Firebase only approach")
      }
      
      // If server upload fails, use a data URL approach (temporary)
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        photoURL: dataUrl
      })
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          profilePicture: dataUrl
        })
      }
      
      return dataUrl
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        uploadProfilePicture
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}