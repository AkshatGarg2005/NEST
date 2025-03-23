import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentIssues = [
  {
    id: 1,
    type: "outage",
    location: "Oak Avenue (300-500 block)",
    reportedBy: "Multiple residents",
    reportedAt: "March 23, 2025, 12:30 PM",
    status: "in-progress",
    description: "Complete power outage affecting multiple households",
  },
  {
    id: 2,
    type: "streetlight",
    location: "Corner of Elm St and 5th Ave",
    reportedBy: "Jane S.",
    reportedAt: "March 22, 2025, 9:15 PM",
    status: "pending",
    description: "Streetlight flickering and occasionally going out",
  },
  {
    id: 3,
    type: "fluctuation",
    location: "123 Cedar Lane",
    reportedBy: "Robert K.",
    reportedAt: "March 21, 2025, 4:30 PM",
    status: "resolved",
    description: "Lights dimming and appliances resetting",
    resolvedAt: "March 21, 2025, 6:15 PM",
  },
]

export function ElectricityRecentIssues() {
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
      case "outage":
        return <Badge variant="secondary">Outage</Badge>
      case "fluctuation":
        return <Badge variant="secondary">Fluctuation</Badge>
      case "streetlight":
        return <Badge variant="secondary">Streetlight</Badge>
      case "wire":
        return <Badge variant="secondary">Downed Wire</Badge>
      default:
        return <Badge variant="secondary">Other</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Electricity Issues</CardTitle>
        <CardDescription>Recently reported electricity issues in your neighborhood</CardDescription>
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

