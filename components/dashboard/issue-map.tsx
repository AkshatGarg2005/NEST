"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function IssueMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This would be replaced with actual map initialization code
    // like Google Maps or Leaflet
    if (mapRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = 200
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a simple placeholder map
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some "streets"
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 2

        // Horizontal streets
        for (let i = 1; i < 4; i++) {
          ctx.beginPath()
          ctx.moveTo(0, i * 50)
          ctx.lineTo(canvas.width, i * 50)
          ctx.stroke()
        }

        // Vertical streets
        for (let i = 1; i < 6; i++) {
          ctx.beginPath()
          ctx.moveTo(i * (canvas.width / 6), 0)
          ctx.lineTo(i * (canvas.width / 6), canvas.height)
          ctx.stroke()
        }

        // Draw some "issue" markers
        const markers = [
          { x: canvas.width * 0.2, y: 75, color: "#ef4444" }, // Red for emergency
          { x: canvas.width * 0.5, y: 150, color: "#3b82f6" }, // Blue for water
          { x: canvas.width * 0.8, y: 50, color: "#f59e0b" }, // Yellow for electricity
        ]

        markers.forEach((marker) => {
          ctx.fillStyle = marker.color
          ctx.beginPath()
          ctx.arc(marker.x, marker.y, 8, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(marker.x, marker.y, 8, 0, Math.PI * 2)
          ctx.stroke()
        })
      }

      return () => {
        if (mapRef.current && canvas.parentNode === mapRef.current) {
          mapRef.current.removeChild(canvas)
        }
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Map</CardTitle>
        <CardDescription>View active issues in your area</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[200px] w-full rounded-md bg-muted" />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>Emergency</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span>Water</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            <span>Electricity</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>Resolved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

