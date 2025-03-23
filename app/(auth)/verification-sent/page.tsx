"use client"

import Link from "next/link"
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { sendEmailVerification } from "firebase/auth"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function VerificationSentPage() {
  const { firebaseUser } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()
  
  const handleResendVerification = async () => {
    if (!firebaseUser) {
      toast({
        title: "Error",
        description: "No user found. Please try signing in again.",
        variant: "destructive",
      })
      return
    }
    
    setIsResending(true)
    try {
      await sendEmailVerification(firebaseUser)
      toast({
        title: "Success",
        description: "Verification email resent successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <AlertTriangle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold ml-2">N.E.S.T.</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to your email address
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Verification Email Sent</h3>
                <p className="text-sm text-muted-foreground">
                  Check your email for a verification link. If you don't see it, check your spam folder.
                </p>
              </div>
              <Button className="w-full" onClick={handleResendVerification} disabled={isResending}>
                {isResending ? "Resending..." : "Resend Email"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground">
              After verifying your email, you can log in to your account.
            </p>
            <Button variant="outline" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}