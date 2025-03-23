import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentComplaints = [
  {
    id: 1,
    type: "construction",
    location: "456 Elm Street",
    reportedBy: "Anonymous",
    reportedAt: "March 23, 2025, 8:15 AM",
    status: "in-progress",
    description: "Construction noise starting before permitted hours (7 AM)",
  },
  {
    id: 2,
    type: "music",
    location: "789 Oak Avenue, Apt 3B",
    reportedBy: "Multiple residents",
    reportedAt: "March 22, 2025, 11:45 PM",
    status: "resolved",
    description: "Loud music and party noise after quiet hours",
    resolvedAt: "March 23, 2025, 12:30 AM",
  },
  {
    id: 3,
    type: "alarm",
    location: "123 Pine Road",
    reportedBy: "Sarah L.",
    reportedAt: "March 21, 2025, 3:20 PM",
    status: "resolved",
    description: "Car alarm going off intermittently for over an hour",
    resolvedAt: "March 21, 2025, 4:45 PM",
  },
]

export function NoiseRecentComplaints() {
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
      case "music":
        return <Badge variant="secondary">Music</Badge>
      case "party":
        return <Badge variant="secondary">Party</Badge>
      case "construction":
        return <Badge variant="secondary">Construction</Badge>
      case "vehicle":
        return <Badge variant="secondary">Vehicle</Badge>
      case "alarm":
        return <Badge variant="secondary">Alarm</Badge>
      case "animal":
        return <Badge variant="secondary">Animal</Badge>
      default:
        return <Badge variant="secondary">Other</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Noise Complaints</CardTitle>
        <CardDescription>Recently reported noise issues in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentComplaints.map((complaint) => (
            <div key={complaint.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{complaint.location}</h3>
                  {getTypeBadge(complaint.type)}
                </div>
                {getStatusBadge(complaint.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div>
                  Reported by: {complaint.reportedBy} on {complaint.reportedAt}
                </div>
                {complaint.resolvedAt && <div>Resolved: {complaint.resolvedAt}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

