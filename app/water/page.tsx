import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WaterIssueForm } from "@/components/services/water-issue-form"
import { WaterStatusCard } from "@/components/services/water-status-card"
import { WaterTipsCard } from "@/components/services/water-tips-card"
import { WaterRecentIssues } from "@/components/services/water-recent-issues"

export default function WaterPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Water Services" text="Report and track water-related issues in your neighborhood" />

      <div className="grid gap-6 md:grid-cols-2">
        <WaterStatusCard />
        <WaterTipsCard />
      </div>

      <div className="mt-6">
        <WaterIssueForm />
      </div>

      <div className="mt-6">
        <WaterRecentIssues />
      </div>
    </DashboardShell>
  )
}

