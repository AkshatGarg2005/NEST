import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function ElectricityStatusCard() {
  // This would typically come from an API
  const electricityStatus = {
    status: "outage", // normal, advisory, outage
    lastUpdated: "March 23, 2025, 1:45 PM",
    outages: [
      {
        id: 1,
        location: "Oak Avenue (300-500 block)",
        startTime: "March 23, 2025, 12:30 PM",
        estimatedResolution: "March 23, 2025, 3:30 PM",
        reason: "Equipment failure",
        affectedHouseholds: 120,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Electricity System Status
          {electricityStatus.status === "normal" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Normal
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              <AlertCircle className="mr-1 h-3 w-3" />
              Outage
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Current electricity system status in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {electricityStatus.outages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Outages</h3>
              {electricityStatus.outages.map((outage) => (
                <div key={outage.id} className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">{outage.location}</p>
                  <p className="text-muted-foreground">Reason: {outage.reason}</p>
                  <p className="text-muted-foreground">Started: {outage.startTime}</p>
                  <p className="text-muted-foreground">Estimated restoration: {outage.estimatedResolution}</p>
                  <p className="text-muted-foreground">Affected households: {outage.affectedHouseholds}</p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-950">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Conservation Request</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Please reduce electricity usage between 4-7 PM today due to high demand.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Last updated: {electricityStatus.lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  )
}

