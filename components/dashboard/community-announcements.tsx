import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const announcements = [
  {
    id: 1,
    title: "Scheduled Water Maintenance",
    description: "Water supply will be interrupted on March 25th from 10 AM to 2 PM for scheduled maintenance.",
    date: "Mar 23, 2025",
    type: "maintenance",
  },
  {
    id: 2,
    title: "Community Cleanup Event",
    description: "Join us this Saturday for our monthly neighborhood cleanup. Meet at the park entrance at 9 AM.",
    date: "Mar 27, 2025",
    type: "event",
  },
  {
    id: 3,
    title: "New Security Measures",
    description: "Additional security cameras will be installed at community entrances next week.",
    date: "Mar 30, 2025",
    type: "security",
  },
]

export function CommunityAnnouncements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Announcements</CardTitle>
        <CardDescription>Latest updates from your neighborhood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{announcement.title}</h3>
                <Badge
                  variant={
                    announcement.type === "maintenance"
                      ? "outline"
                      : announcement.type === "event"
                        ? "secondary"
                        : "default"
                  }
                >
                  {announcement.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{announcement.description}</p>
              <p className="text-xs text-muted-foreground">{announcement.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

