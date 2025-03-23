"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ElectricityUsageCard() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Sample data for the chart
        const data = [30, 45, 60, 70, 55, 40, 35, 50, 65, 75, 60, 45]
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        // Chart dimensions
        const width = chartRef.current.width
        const height = chartRef.current.height
        const padding = 40
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.strokeStyle = "#9ca3af"
        ctx.stroke()

        // Draw data points and lines
        const maxValue = Math.max(...data)
        const barWidth = chartWidth / data.length

        // Draw bars
        data.forEach((value, index) => {
          const x = padding + index * barWidth
          const barHeight = (value / maxValue) * chartHeight
          const y = height - padding - barHeight

          // Draw bar
          ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
          ctx.fillRect(x, y, barWidth - 5, barHeight)

          // Draw label
          ctx.fillStyle = "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15)

          // Draw value
          ctx.fillStyle = "#6b7280"
          ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
        })

        // Draw title
        ctx.fillStyle = "#111827"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Monthly Electricity Usage (kWh)", width / 2, 20)
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Electricity Usage</CardTitle>
        <CardDescription>Monitor your community's electricity consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <canvas ref={chartRef} width={400} height={200} className="w-full" />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Current Month Usage</p>
            <p className="text-muted-foreground">45 kWh (↓ 15% from last month)</p>
          </div>
          <div>
            <p className="font-medium">Neighborhood Average</p>
            <p className="text-muted-foreground">62 kWh</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

