import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function WaterStatusCard() {
  // This would typically come from an API
  const waterStatus = {
    status: "normal", // normal, advisory, outage
    pressure: "Normal",
    quality: "Good",
    lastUpdated: "March 23, 2025, 1:30 PM",
    advisories: [],
    outages: [
      {
        id: 1,
        location: "Maple Street (100-200 block)",
        startTime: "March 23, 2025, 10:00 AM",
        estimatedResolution: "March 23, 2025, 4:00 PM",
        reason: "Scheduled maintenance",
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Water System Status
          {waterStatus.status === "normal" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Normal
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <AlertCircle className="mr-1 h-3 w-3" />
              {waterStatus.status === "advisory" ? "Advisory" : "Outage"}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Current water system status in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Water Pressure</p>
              <p className="text-sm text-muted-foreground">{waterStatus.pressure}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Water Quality</p>
              <p className="text-sm text-muted-foreground">{waterStatus.quality}</p>
            </div>
          </div>

          {waterStatus.outages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Outages</h3>
              {waterStatus.outages.map((outage) => (
                <div key={outage.id} className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">{outage.location}</p>
                  <p className="text-muted-foreground">Reason: {outage.reason}</p>
                  <p className="text-muted-foreground">Started: {outage.startTime}</p>
                  <p className="text-muted-foreground">Estimated resolution: {outage.estimatedResolution}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">Last updated: {waterStatus.lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  )
}

