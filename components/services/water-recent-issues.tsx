import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentIssues = [
  {
    id: 1,
    type: "leak",
    location: "123 Maple Street",
    reportedBy: "John D.",
    reportedAt: "March 22, 2025, 3:45 PM",
    status: "resolved",
    description: "Water leaking from fire hydrant",
    resolvedAt: "March 22, 2025, 5:30 PM",
  },
  {
    id: 2,
    type: "pressure",
    location: "456 Oak Avenue",
    reportedBy: "Sarah M.",
    reportedAt: "March 22, 2025, 10:15 AM",
    status: "in-progress",
    description: "Very low water pressure in entire building",
  },
  {
    id: 3,
    type: "quality",
    location: "789 Pine Road",
    reportedBy: "Michael T.",
    reportedAt: "March 21, 2025, 2:30 PM",
    status: "pending",
    description: "Water has unusual odor and color",
  },
]

export function WaterRecentIssues() {
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "leak":
        return <Badge variant="secondary">Leak</Badge>
      case "pressure":
        return <Badge variant="secondary">Pressure</Badge>
      case "quality":
        return <Badge variant="secondary">Quality</Badge>
      case "outage":
        return <Badge variant="secondary">Outage</Badge>
      default:
        return <Badge variant="secondary">Other</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Water Issues</CardTitle>
        <CardDescription>Recently reported water issues in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentIssues.map((issue) => (
            <div key={issue.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{issue.location}</h3>
                  {getTypeBadge(issue.type)}
                </div>
                {getStatusBadge(issue.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div>
                  Reported by: {issue.reportedBy} on {issue.reportedAt}
                </div>
                {issue.resolvedAt && <div>Resolved: {issue.resolvedAt}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

