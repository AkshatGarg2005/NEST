import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NoiseComplaintForm } from "@/components/services/noise-complaint-form"
import { NoiseRecentComplaints } from "@/components/services/noise-recent-complaints"
import { NoiseGuidelinesCard } from "@/components/services/noise-guidelines-card"

export default function NoisePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Noise Complaints" text="Report and track noise-related issues in your neighborhood" />

      <div className="grid gap-6 md:grid-cols-2">
        <NoiseGuidelinesCard />
        <NoiseRecentComplaints />
      </div>

      <div className="mt-6">
        <NoiseComplaintForm />
      </div>
    </DashboardShell>
  )
}

