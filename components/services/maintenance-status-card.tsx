import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export function MaintenanceStatusCard() {
  // This would typically come from an API
  const maintenanceStatus = {
    totalRequests: 24,
    completed: 15,
    inProgress: 6,
    pending: 3,
    upcomingMaintenance: [
      {
        id: 1,
        type: "Road Resurfacing",
        location: "Maple Street (100-300 block)",
        scheduledDate: "March 25-27, 2025",
        details: "Complete road resurfacing project. Expect traffic delays.",
      },
      {
        id: 2,
        type: "Park Maintenance",
        location: "Central Community Park",
        scheduledDate: "March 30, 2025",
        details: "Playground equipment inspection and repairs.",
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Status</CardTitle>
        <CardDescription>Overview of maintenance requests and scheduled work</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3">
              <span className="text-2xl font-bold">{maintenanceStatus.totalRequests}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {maintenanceStatus.completed}
              </span>
              <span className="text-xs text-green-600 dark:text-green-400">Completed</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {maintenanceStatus.inProgress}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400">In Progress</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {maintenanceStatus.pending}
              </span>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Pending</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Upcoming Scheduled Maintenance</h3>
            <div className="space-y-3">
              {maintenanceStatus.upcomingMaintenance.map((maintenance) => (
                <div key={maintenance.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{maintenance.type}</h4>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <Clock className="mr-1 h-3 w-3" />
                      Scheduled
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{maintenance.location}</p>
                  <p className="text-sm text-muted-foreground mb-1">{maintenance.details}</p>
                  <p className="text-xs font-medium">Date: {maintenance.scheduledDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

