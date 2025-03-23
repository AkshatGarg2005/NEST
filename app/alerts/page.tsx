// app/alerts/page.tsx
"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, Clock, Info } from "lucide-react"
import api from "@/utils/api.util"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  priority: string
  read: boolean
  createdAt: string
}

export default function AlertsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [activeTab])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Sample mock notifications
      const mockNotifications: Notification[] = [
        {
          _id: "1",
          type: "emergency_alert",
          title: "Flash Flood Warning",
          message: "Flash flood warning issued for the Oak Creek area. Please avoid low-lying areas and stay indoors.",
          priority: "critical",
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          type: "report_status",
          title: "Water Leak Report Updated",
          message: "Your water leak report at Main Street has been updated to status: In Progress",
          priority: "normal",
          read: true,
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          _id: "3",
          type: "community_announcement",
          title: "Community Meeting",
          message: "Reminder: Community meeting will be held tomorrow at 7 PM in the Community Center.",
          priority: "low",
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          _id: "4",
          type: "report_status",
          title: "Noise Complaint Resolved",
          message: "Your noise complaint at Pine Street has been resolved.",
          priority: "normal", 
          read: false,
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
      
      try {
        const response = await api.get('/notifications')
        
        if (response?.data?.data) {
          setNotifications(response.data.data)
        } else {
          // Fall back to mock data if no real data
          setNotifications(mockNotifications)
          console.log("Using mock notifications due to API unavailability")
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Fall back to mock data on error
        setNotifications(mockNotifications)
        toast({
          title: "Connection Error",
          description: "Using sample data. Real API connection unavailable.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in notifications processing:", error)
      setError("Failed to load notifications. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      try {
        await api.put(`/notifications/${id}/read`)
        toast({
          title: "Success",
          description: "Notification marked as read",
        })
      } catch (error) {
        console.error("Error marking notification as read:", error)
        toast({
          title: "Error",
          description: "Failed to update on server. Updated locally only.",
          variant: "destructive",
        })
      }
      
      // Update local state regardless of API success
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      try {
        await api.put('/notifications/read-all')
        toast({
          title: "Success",
          description: "All notifications marked as read",
        })
      } catch (error) {
        console.error("Error marking all notifications as read:", error)
        toast({
          title: "Error",
          description: "Failed to update on server. Updated locally only.",
          variant: "destructive",
        })
      }
      
      // Update local state regardless of API success
      setNotifications(notifications.map(notif => ({ ...notif, read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "emergency") return notification.type === "emergency_alert"
    if (activeTab === "reports") return notification.type === "report_status"
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency_alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "report_status":
        return <Info className="h-5 w-5 text-blue-500" />
      case "community_announcement":
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500">High</Badge>
      case "normal":
        return <Badge>Normal</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Alerts & Notifications" text="Stay informed about important updates and emergencies" />

      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" onClick={markAllAsRead} className="ml-4">
          Mark All as Read
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading notifications...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
            <div className="flex justify-center mt-4">
              <Button onClick={fetchNotifications}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No notifications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification._id} className={notification.read ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && <Badge variant="secondary">New</Badge>}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground my-1">{notification.message}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification._id)}
                      className="self-end md:self-start"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}