import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Lightbulb, Volume2, Wrench, Plus, AlertTriangle } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Report issues or access services quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2 justify-center">
            <Droplets className="h-6 w-6" />
            <span>Report Water Issue</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 justify-center">
            <Lightbulb className="h-6 w-6" />
            <span>Report Power Outage</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 justify-center">
            <Volume2 className="h-6 w-6" />
            <span>Noise Complaint</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 justify-center">
            <Wrench className="h-6 w-6" />
            <span>Request Repair</span>
          </Button>
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span>More Actions</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

