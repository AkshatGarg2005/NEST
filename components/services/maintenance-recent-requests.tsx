import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentRequests = [
  {
    id: 1,
    type: "pothole",
    location: "123 Elm Street",
    reportedBy: "John D.",
    reportedAt: "March 22, 2025, 3:45 PM",
    status: "in-progress",
    description: "Large pothole in the middle of the road",
    priority: "high",
  },
  {
    id: 2,
    type: "streetlight",
    location: "Corner of Oak and 5th",
    reportedBy: "Sarah M.",
    reportedAt: "March 21, 2025, 8:15 PM",
    status: "pending",
    description: "Streetlight not working for the past 3 days",
    priority: "medium",
  },
  {
    id: 3,
    type: "playground",
    location: "Central Park playground",
    reportedBy: "Michael T.",
    reportedAt: "March 20, 2025, 2:30 PM",
    status: "resolved",
    description: "Broken swing and damaged slide",
    priority: "high",
    resolvedAt: "March 21, 2025, 11:15 AM",
  },
]

export function MaintenanceRecentRequests() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Resolved
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "pothole":
        return <Badge variant="secondary">Pothole</Badge>
      case "streetlight":
        return <Badge variant="secondary">Streetlight</Badge>
      case "sidewalk":
        return <Badge variant="secondary">Sidewalk</Badge>
      case "playground":
        return <Badge variant="secondary">Playground</Badge>
      default:
        return <Badge variant="secondary">Other</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Maintenance Requests</CardTitle>
        <CardDescription>Recently reported maintenance issues in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div key={request.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{request.location}</h3>
                  {getTypeBadge(request.type)}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(request.priority)}
                  {getStatusBadge(request.status)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div>
                  Reported by: {request.reportedBy} on {request.reportedAt}
                </div>
                {request.resolvedAt && <div>Resolved: {request.resolvedAt}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

