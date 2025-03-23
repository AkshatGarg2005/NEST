// components/auth-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import api from "@/utils/api.util"
// Import the client-side Cloudinary helper instead of the full SDK
import { uploadToCloudinary } from "@/lib/cloudinary-client"

interface User {
  id: string
  name: string
  email: string
  role: string
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  uploadProfilePicture: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    
    if (token) {
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile")
      setUser(response.data.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      
      setUser(response.data.user)
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      await api.post("/auth/register", userData)
      // After registration, typically navigate to login or verification page
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
    router.push("/login")
  }

  // Upload profile picture using our client-side helper
  const uploadProfilePicture = async (file: File) => {
    try {
      const result = await uploadToCloudinary(file, 'profiles');
      
      if (user && result.secure_url) {
        // Update user profile with new image URL
        await api.put('/users/profile', { 
          profilePicture: result.secure_url 
        });
        
        // Update local state
        setUser({
          ...user,
          profilePicture: result.secure_url
        });
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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