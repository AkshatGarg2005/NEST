import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chatbot/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="AI Assistant" text="Get help with community issues and emergency information" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChatInterface />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
              <CardDescription>Frequently asked questions you can ask the AI</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="rounded-md bg-muted p-2">How do I report a water leak?</li>
                <li className="rounded-md bg-muted p-2">What are the quiet hours in our neighborhood?</li>
                <li className="rounded-md bg-muted p-2">Is there a power outage in my area?</li>
                <li className="rounded-md bg-muted p-2">How do I report a pothole?</li>
                <li className="rounded-md bg-muted p-2">When is the next community event?</li>
                <li className="rounded-md bg-muted p-2">How do I contact emergency services?</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

