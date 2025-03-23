import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Lightbulb, Volume2, Wrench } from "lucide-react"

const updates = [
  {
    id: 1,
    title: "Water Leak Fixed",
    description: "The water leak on Maple Street has been repaired.",
    time: "2 hours ago",
    status: "resolved",
    type: "water",
  },
  {
    id: 2,
    title: "Power Outage Reported",
    description: "Power outage affecting Oak Avenue. Crews dispatched.",
    time: "4 hours ago",
    status: "in-progress",
    type: "electricity",
  },
  {
    id: 3,
    title: "Noise Complaint",
    description: "Noise complaint filed for Pine Street construction site.",
    time: "Yesterday",
    status: "pending",
    type: "noise",
  },
  {
    id: 4,
    title: "Playground Swing Repaired",
    description: "The broken swing at Central Park has been fixed.",
    time: "2 days ago",
    status: "resolved",
    type: "maintenance",
  },
]

export function RecentUpdates() {
  const getIcon = (type: string) => {
    switch (type) {
      case "water":
        return <Droplets className="h-4 w-4" />
      case "electricity":
        return <Lightbulb className="h-4 w-4" />
      case "noise":
        return <Volume2 className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      default:
        return null
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>Latest activity in your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
              <div className="mt-0.5 rounded-full bg-muted p-1">{getIcon(update.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{update.title}</h3>
                  {getStatusBadge(update.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{update.description}</p>
                <p className="text-xs text-muted-foreground">{update.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

