// components/services/electricity-issue-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/utils/api.util"

export function ElectricityIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueType, setIssueType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // First create the report
      const reportData = {
        title: `Electricity Issue: ${issueType}`,
        description,
        category: "electricity",
        subcategory: issueType.toLowerCase(),
        severity: issueType === "outage" || issueType === "wire" ? "high" : "medium",
        location: {
          type: "Point",
          coordinates: [0, 0], // You might want to get real coordinates
          address: location,
        },
      }
      
      const response = await api.post('/reports', reportData)
      
      // If there's an image, upload it
      if (image && response.data.data._id) {
        const formData = new FormData()
        formData.append('image', image)
        
        await api.post(`/reports/${response.data.data._id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      
      toast({
        title: "Success",
        description: "Electricity issue report submitted successfully",
      })
      
      // Reset form
      setIssueType("")
      setLocation("")
      setDescription("")
      setImage(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Electricity Issue</CardTitle>
        <CardDescription>Submit details about electricity-related problems in your area</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outage">Power Outage</SelectItem>
                <SelectItem value="fluctuation">Voltage Fluctuation</SelectItem>
                <SelectItem value="streetlight">Streetlight Issue</SelectItem>
                <SelectItem value="wire">Downed Wire</SelectItem>
                <SelectItem value="billing">Billing Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter address or location description"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Add Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload-electricity")?.click()}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload-electricity")?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Input
                id="photo-upload-electricity"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0])
                  }
                }}
              />
            </div>
            {image && <p className="text-sm text-muted-foreground">Image selected: {image.name}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={!issueType || !location || !description || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}