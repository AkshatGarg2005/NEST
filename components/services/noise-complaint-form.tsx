// components/services/noise-complaint-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Camera, Upload, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/utils/api.util"

export function NoiseComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noiseType, setNoiseType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [noiseLevel, setNoiseLevel] = useState([5])
  const [image, setImage] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Calculate severity based on noise level
      let severity = "low"
      if (noiseLevel[0] > 7) severity = "high"
      else if (noiseLevel[0] > 3) severity = "medium"
      
      // First create the report
      const reportData = {
        title: `Noise Complaint: ${noiseType}`,
        description: `${description}\nNoise Level: ${noiseLevel[0]}/10`,
        category: "noise",
        subcategory: noiseType.toLowerCase(),
        severity,
        location: {
          type: "Point",
          coordinates: [0, 0], // You might want to get real coordinates
          address: location,
        },
      }
      
      const response = await api.post('/reports', reportData)
      const reportId = response.data.data._id
      
      // If there's an image, upload it
      if (image && reportId) {
        const formData = new FormData()
        formData.append('image', image)
        
        await api.post(`/reports/${reportId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      
      // If there's audio, upload it
      if (audio && reportId) {
        const formData = new FormData()
        formData.append('audio', audio)
        
        await api.post(`/reports/${reportId}/audio`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      
      toast({
        title: "Success",
        description: "Noise complaint submitted successfully",
      })
      
      // Reset form
      setNoiseType("")
      setLocation("")
      setDescription("")
      setNoiseLevel([5])
      setImage(null)
      setAudio(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
      console.error("Error submitting noise complaint:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Noise Complaint</CardTitle>
        <CardDescription>Submit details about noise disturbances in your area</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="noise-type">Noise Type</Label>
            <Select value={noiseType} onValueChange={setNoiseType}>
              <SelectTrigger id="noise-type">
                <SelectValue placeholder="Select noise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">Loud Music</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="vehicle">Vehicle Noise</SelectItem>
                <SelectItem value="alarm">Alarm</SelectItem>
                <SelectItem value="animal">Animal Noise</SelectItem>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="noise-level">Estimated Noise Level</Label>
              <span className="text-sm text-muted-foreground">
                {noiseLevel[0] <= 3 ? "Low" : noiseLevel[0] <= 7 ? "Medium" : "High"}
              </span>
            </div>
            <Slider id="noise-level" min={1} max={10} step={1} value={noiseLevel} onValueChange={setNoiseLevel} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Barely Audible</span>
              <span>Very Loud</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the noise issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Add Evidence (Optional)</Label>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload-noise")?.click()}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("photo-upload-noise")?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("audio-upload-noise")?.click()}
              >
                <Volume2 className="h-4 w-4" />
                Record Audio
              </Button>
              <Input
                id="photo-upload-noise"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0])
                  }
                }}
              />
              <Input
                id="audio-upload-noise"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAudio(e.target.files[0])
                  }
                }}
              />
            </div>
            {image && <p className="text-sm text-muted-foreground">Image selected: {image.name}</p>}
            {audio && <p className="text-sm text-muted-foreground">Audio selected: {audio.name}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={!noiseType || !location || !description || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}