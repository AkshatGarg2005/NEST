import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EmergencyButton } from "@/components/emergency-button"
import { RecentUpdates } from "@/components/dashboard/recent-updates"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { CommunityAnnouncements } from "@/components/dashboard/community-announcements"
import { SearchBar } from "@/components/search-bar"
import { IssueMap } from "@/components/dashboard/issue-map"

export default function Home() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Welcome to N.E.S.T." text="Your Neighborhood Emergency & Safety Tool">
        <EmergencyButton />
      </DashboardHeader>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <CommunityAnnouncements />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <RecentUpdates />
        <IssueMap />
      </div>
    </DashboardShell>
  )
}

