import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, AlertTriangle, Info } from "lucide-react"

export function WaterTipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Conservation Tips</CardTitle>
        <CardDescription>Help conserve water in your community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Fix Leaky Faucets</h3>
              <p className="text-sm text-muted-foreground">A dripping faucet can waste up to 3,000 gallons per year.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Shorter Showers</h3>
              <p className="text-sm text-muted-foreground">
                Reducing shower time by 2 minutes can save up to 1,750 gallons per person annually.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Water Plants in Morning</h3>
              <p className="text-sm text-muted-foreground">
                Watering early reduces evaporation and helps plants absorb more moisture.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-950">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Water Restriction Notice</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Odd-even watering schedule in effect until further notice.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Report water waste</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
              More tips
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

