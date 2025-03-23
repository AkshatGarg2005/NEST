import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ElectricityStatusCard } from "@/components/services/electricity-status-card"
import { ElectricityUsageCard } from "@/components/services/electricity-usage-card"
import { ElectricityIssueForm } from "@/components/services/electricity-issue-form"
import { ElectricityRecentIssues } from "@/components/services/electricity-recent-issues"

export default function ElectricityPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Electricity Services"
        text="Report and track electricity-related issues in your neighborhood"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ElectricityStatusCard />
        <ElectricityUsageCard />
      </div>

      <div className="mt-6">
        <ElectricityIssueForm />
      </div>

      <div className="mt-6">
        <ElectricityRecentIssues />
      </div>
    </DashboardShell>
  )
}

