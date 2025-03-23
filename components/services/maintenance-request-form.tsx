// components/services/maintenance-request-form.tsx
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

export function MaintenanceRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestType, setRequestType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Map priority to severity
      const severityMap: Record<string, string> = {
        low: "low",
        medium: "medium",
        high: "high"
      }
      
      // First create the report
      const reportData = {
        title: `Maintenance Request: ${requestType}`,
        description,
        category: "maintenance",
        subcategory: requestType.toLowerCase(),
        severity: severityMap[priority] || "medium",
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
        description: "Maintenance request submitted successfully",
      })
      
      // Reset form
      setRequestType("")
      setLocation("")
      setDescription("")
      setPriority("")
      setImage(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
      console.error("Error submitting maintenance request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Maintenance Request</CardTitle>
        <CardDescription>Report infrastructure or facility issues in your neighborhood</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="request-type">Request Type</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger id="request-type">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="streetlight">Streetlight</SelectItem>
                <SelectItem value="sidewalk">Sidewalk Damage</SelectItem>
                <SelectItem value="playground">Playground Equipment</SelectItem>
                <SelectItem value="trash">Trash/Debris</SelectItem>
                <SelectItem value="graffiti">Graffiti</SelectItem>
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
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Not urgent</SelectItem>
                <SelectItem value="medium">Medium - Needs attention</SelectItem>
                <SelectItem value="high">High - Safety concern</SelectItem>
              </SelectContent>
            </Select>
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
                onClick={() => document.getElementById("photo-upload-maintenance")?.click()}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload-maintenance")?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Input
                id="photo-upload-maintenance"
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
          <Button type="submit" disabled={!requestType || !location || !description || !priority || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}