"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function EmergencyButton() {
  const [open, setOpen] = useState(false)
  const [emergencyType, setEmergencyType] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setOpen(false)
    // Reset form
    setEmergencyType("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg" className="gap-2 animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          S.O.S
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Alert
          </DialogTitle>
          <DialogDescription>
            Please provide details about the emergency. Help will be dispatched immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="emergency-type">Emergency Type</label>
            <Select value={emergencyType} onValueChange={setEmergencyType}>
              <SelectTrigger id="emergency-type">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="crime">Crime in Progress</SelectItem>
                <SelectItem value="flood">Flooding</SelectItem>
                <SelectItem value="gas">Gas Leak</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              placeholder="Provide details about the emergency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!emergencyType || isSubmitting}>
            {isSubmitting ? "Sending Alert..." : "Send Emergency Alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

