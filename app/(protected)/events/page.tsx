// app/events/page.tsx
"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Users } from "lucide-react"
import api from "@/utils/api.util"
import { useToast } from "@/hooks/use-toast"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  location: {
    address: string
  }
  startDate: string
  endDate: string
  organizer: {
    name: string
  }
  attendees: Array<{
    user: string
    status: string
  }>
  maxAttendees?: number
  status: string
  isPublic: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  
  // New event form state
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventCategory, setEventCategory] = useState("community")
  const [eventAddress, setEventAddress] = useState("")
  const [eventStartDate, setEventStartDate] = useState<Date>(new Date())
  const [eventEndDate, setEventEndDate] = useState<Date>(new Date())
  const [eventMaxAttendees, setEventMaxAttendees] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [activeTab, selectedDate])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      let endpoint = '/events?'
      
      // Add filters based on active tab
      if (activeTab === "upcoming") {
        endpoint += 'status=scheduled&sort=startDate'
      } else if (activeTab === "past") {
        endpoint += 'status=completed&sort=-startDate'
      } else if (activeTab === "my") {
        endpoint += 'organizer=me'
      }
      
      // Add date filter if selected
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0]
        endpoint += `&date=${dateStr}`
      }
      
      // Mock data for development/testing
      const mockEvents: Event[] = [
        {
          _id: "1",
          title: "Community Cleanup",
          description: "Join us for our monthly neighborhood cleanup event!",
          category: "cleanup",
          location: { address: "Community Park, Main Street" },
          startDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          endDate: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(), // 3 days + 2 hours from now
          organizer: { name: "Neighborhood Association" },
          attendees: [{ user: "1", status: "going" }, { user: "2", status: "going" }],
          maxAttendees: 50,
          status: "scheduled",
          isPublic: true
        },
        {
          _id: "2",
          title: "Safety Workshop",
          description: "Learn essential safety tips for emergencies.",
          category: "safety",
          location: { address: "Community Center, 123 Oak Avenue" },
          startDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          endDate: new Date(Date.now() + 86400000 * 5 + 10800000).toISOString(), // 5 days + 3 hours from now
          organizer: { name: "Local Fire Department" },
          attendees: [{ user: "3", status: "going" }],
          status: "scheduled",
          isPublic: true
        },
        {
          _id: "3",
          title: "Park Maintenance",
          description: "Help maintain our local park's playground equipment.",
          category: "maintenance",
          location: { address: "Sunset Park, Pine Road" },
          startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          endDate: new Date(Date.now() - 86400000 * 2 + 14400000).toISOString(), // 2 days ago + 4 hours
          organizer: { name: "Parks Department" },
          attendees: [{ user: "1", status: "going" }, { user: "4", status: "going" }],
          maxAttendees: 30,
          status: "completed",
          isPublic: true
        }
      ];

      try {
        const response = await api.get(endpoint)
        if (response?.data?.data) {
          setEvents(response.data.data)
        } else {
          // Fall back to mock data if no real data
          setEvents(mockEvents.filter(event => {
            // Filter based on active tab
            if (activeTab === "upcoming") {
              return event.status === "scheduled"
            } else if (activeTab === "past") {
              return event.status === "completed"
            }
            return true
          }))
          console.log("Using mock data due to API unavailability")
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        // Fall back to mock data on error
        setEvents(mockEvents.filter(event => {
          // Filter based on active tab
          if (activeTab === "upcoming") {
            return event.status === "scheduled"
          } else if (activeTab === "past") {
            return event.status === "completed"
          }
          return true
        }))
        toast({
          title: "Connection Error",
          description: "Using sample data. Real API connection unavailable.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in events processing:", error)
      setError("Failed to load events. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true)
      
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        category: eventCategory,
        location: {
          type: "Point",
          coordinates: [0, 0], // You might want to get real coordinates
          address: eventAddress,
        },
        startDate: eventStartDate.toISOString(),
        endDate: eventEndDate.toISOString(),
        maxAttendees: eventMaxAttendees ? parseInt(eventMaxAttendees) : undefined,
        isPublic: true,
      }
      
      try {
        await api.post('/events', eventData)
        toast({
          title: "Success",
          description: "Event created successfully",
        })
      } catch (error) {
        console.error("Error creating event:", error)
        toast({
          title: "Error",
          description: "Failed to save event to server. Event created locally only.",
          variant: "destructive",
        })
        
        // Add event locally for demo/testing
        const newEvent: Event = {
          _id: Date.now().toString(),
          ...eventData,
          organizer: { name: "You" },
          attendees: [{ user: "currentUser", status: "going" }],
          status: "scheduled",
          isPublic: true,
        } as Event;
        
        setEvents([newEvent, ...events])
      }
      
      // Reset form and close dialog
      setEventTitle("")
      setEventDescription("")
      setEventCategory("community")
      setEventAddress("")
      setEventStartDate(new Date())
      setEventEndDate(new Date())
      setEventMaxAttendees("")
      setDialogOpen(false)
      
      // Refresh events list
      fetchEvents()
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const attendEvent = async (id: string) => {
    try {
      try {
        await api.post(`/events/${id}/attend`, { status: "going" })
        toast({
          title: "Success",
          description: "You're now attending this event",
        })
      } catch (error) {
        console.error("Error attending event:", error)
        toast({
          title: "Error",
          description: "Failed to register attendance on server. Updated locally only.",
          variant: "destructive",
        })
        
        // Update locally for demo/testing
        setEvents(events.map(event => 
          event._id === id 
            ? { 
                ...event, 
                attendees: [...event.attendees, { user: "currentUser", status: "going" }]
              } 
            : event
        ))
      }
      
      // Refresh events list
      fetchEvents()
    } catch (error) {
      console.error("Error attending event:", error)
      toast({
        title: "Error",
        description: "Failed to attend event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "cleanup":
        return <Badge className="bg-green-500">Cleanup</Badge>
      case "safety":
        return <Badge className="bg-red-500">Safety</Badge>
      case "community":
        return <Badge className="bg-blue-500">Community</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "in_progress":
        return <Badge variant="outline" className="bg-green-100 text-green-800">In Progress</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isUserAttending = (event: Event) => {
    // This is a simplification - would need to use the actual user ID
    return event.attendees.some(a => a.user === "currentUser" || a.status === "going")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Community Events" text="Discover and participate in neighborhood events">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new community event.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-category">Category</Label>
                <Select value={eventCategory} onValueChange={setEventCategory}>
                  <SelectTrigger id="event-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanup">Cleanup</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-address">Location</Label>
                <Input
                  id="event-address"
                  value={eventAddress}
                  onChange={(e) => setEventAddress(e.target.value)}
                  placeholder="Enter event location"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Input
                      type="datetime-local"
                      value={eventStartDate.toISOString().slice(0, 16)}
                      onChange={(e) => setEventStartDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Input
                      type="datetime-local"
                      value={eventEndDate.toISOString().slice(0, 16)}
                      onChange={(e) => setEventEndDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="max-attendees">Max Attendees (Optional)</Label>
                <Input
                  id="max-attendees"
                  type="number"
                  value={eventMaxAttendees}
                  onChange={(e) => setEventMaxAttendees(e.target.value)}
                  placeholder="Leave blank for unlimited"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Provide event details..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={!eventTitle || !eventCategory || !eventAddress || !eventDescription || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="my">My Events</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Loading events...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-red-500">{error}</p>
                <div className="flex justify-center mt-4">
                  <Button onClick={fetchEvents}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">No events found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{event.title}</h3>
                          {getCategoryBadge(event.category)}
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-muted-foreground my-2">{event.description}</p>
                        <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location.address}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="mx-2">to</span>
                            {new Date(event.endDate).toLocaleDateString()} {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {event.attendees.length} attendees
                            {event.maxAttendees && ` / ${event.maxAttendees} max`}
                          </div>
                        </div>
                      </div>
                      
                      {event.status === "scheduled" && !isUserAttending(event) && (
                        <Button onClick={() => attendEvent(event._id)}>
                          Attend
                        </Button>
                      )}
                      
                      {isUserAttending(event) && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Attending
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 3 scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                    <div key={event._id} className="flex items-start gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}