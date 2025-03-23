"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!isLoading && user) {
      router.push('/')
    }
  }, [isLoading, user, router])
  
  // If still loading or user is logged in, show nothing while redirecting
  if (isLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  // Otherwise, render auth pages
  return children
}