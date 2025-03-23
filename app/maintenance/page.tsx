import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MaintenanceRequestForm } from "@/components/services/maintenance-request-form"
import { MaintenanceStatusCard } from "@/components/services/maintenance-status-card"
import { MaintenanceRecentRequests } from "@/components/services/maintenance-recent-requests"

export default function MaintenancePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Maintenance Requests" text="Report and track maintenance issues in your neighborhood" />

      <div className="mb-6">
        <MaintenanceStatusCard />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MaintenanceRequestForm />
        <MaintenanceRecentRequests />
      </div>
    </DashboardShell>
  )
}

