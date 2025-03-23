"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireVerified?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireVerified = true
}: ProtectedRouteProps) {
  const { user, firebaseUser, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    // Skip checks if authentication is still loading
    if (isLoading) return
    
    // If authentication is required but user is not logged in
    if (requireAuth && !firebaseUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    
    // If email verification is required but email is not verified
    if (requireAuth && requireVerified && firebaseUser && !firebaseUser.emailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email address to access this page",
        variant: "destructive",
      })
      router.push("/verification-sent")
      return
    }
    
  }, [isLoading, firebaseUser, requireAuth, requireVerified, router])
  
  // Show loading or nothing while authentication is checked
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  // If authentication is not required or user is properly authenticated, render children
  if (!requireAuth || (firebaseUser && (!requireVerified || firebaseUser.emailVerified))) {
    return <>{children}</>
  }
  
  // If we get here, we're redirecting, so return nothing
  return null
}