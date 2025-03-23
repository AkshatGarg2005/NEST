import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Clock, AlertTriangle, Info } from "lucide-react"

export function NoiseGuidelinesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Ordinance Guidelines</CardTitle>
        <CardDescription>Community noise regulations and quiet hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Quiet Hours</h3>
              <p className="text-sm text-muted-foreground">
                10:00 PM - 7:00 AM (Weekdays)
                <br />
                11:00 PM - 8:00 AM (Weekends)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
              <Volume2 className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Acceptable Noise Levels</h3>
              <p className="text-sm text-muted-foreground">
                Daytime: 65 dB maximum
                <br />
                Nighttime: 55 dB maximum
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
              <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Construction Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday-Friday: 7:00 AM - 7:00 PM
                <br />
                Saturday: 8:00 AM - 5:00 PM
                <br />
                Sunday: Not permitted
              </p>
            </div>
          </div>

          <div className="rounded-md bg-muted p-3">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">Reporting Process</h3>
                <p className="text-sm text-muted-foreground">
                  1. Submit a complaint through this portal
                  <br />
                  2. Community officers will investigate
                  <br />
                  3. First offense: Warning
                  <br />
                  4. Repeated offenses: Fines starting at $100
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>For emergencies, call 911</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
              Full ordinance
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

