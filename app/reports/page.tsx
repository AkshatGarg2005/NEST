// app/reports/page.tsx
"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplets, Lightbulb, Volume2, Wrench, Search, ThumbsUp, MessageSquare } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"

interface Report {
  _id: string
  title: string
  description: string
  category: string
  subcategory: string
  severity: string
  status: string
  location: {
    address: string
  }
  createdAt: string
  reporter: {
    name: string
  }
  upvotes: string[]
  comments: any[]
}

// Mock data to use when API fails
const MOCK_REPORTS: Report[] = [
  {
    _id: "1",
    title: "Water Leak on Main Street",
    description: "There's a significant water leak near the corner of Main and 5th.",
    category: "water",
    subcategory: "leak",
    severity: "high",
    status: "pending",
    location: {
      address: "123 Main St"
    },
    createdAt: new Date().toISOString(),
    reporter: {
      name: "John Doe"
    },
    upvotes: ["user1", "user2"],
    comments: []
  },
  {
    _id: "2",
    title: "Power Outage in Oak District",
    description: "Entire neighborhood has lost power after the storm.",
    category: "electricity",
    subcategory: "outage",
    severity: "critical",
    status: "in-progress",
    location: {
      address: "Oak Avenue District"
    },
    createdAt: new Date().toISOString(),
    reporter: {
      name: "Sarah Smith"
    },
    upvotes: ["user1"],
    comments: [{user: "user3", text: "I'm experiencing this too!"}]
  },
  {
    _id: "3",
    title: "Noise Complaint - Loud Music",
    description: "Neighbor playing extremely loud music past midnight.",
    category: "noise",
    subcategory: "music",
    severity: "medium",
    status: "resolved",
    location: {
      address: "456 Pine Rd, Apt 3B"
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    reporter: {
      name: "Mike Johnson"
    },
    upvotes: [],
    comments: []
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [activeTab, searchQuery, categoryFilter, statusFilter, currentPage])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Skip actual API call and just use mock data
      // This can be uncommented when your backend is ready
      /*
      let endpoint = '/reports?'
      
      // Add pagination
      endpoint += `page=${currentPage}&limit=10`
      
      // Add filters based on active tab
      if (activeTab === "my") {
        endpoint += '&reporter=me'
      } else if (activeTab !== "all") {
        endpoint += `&category=${activeTab}`
      }
      
      // Add category filter
      if (categoryFilter && categoryFilter !== "all") {
        endpoint += `&category=${categoryFilter}`
      }
      
      // Add status filter
      if (statusFilter && statusFilter !== "all") {
        endpoint += `&status=${statusFilter}`
      }
      
      // Add search query
      if (searchQuery) {
        endpoint += `&search=${searchQuery}`
      }
      
      const response = await api.get(endpoint)
      setReports(response.data.data || [])
      
      // Set pagination info
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1)
      }
      */
      
      // Filter mock data based on filters
      let filteredReports = [...MOCK_REPORTS]
      
      // Filter by active tab
      if (activeTab !== "all") {
        filteredReports = filteredReports.filter(report => report.category === activeTab)
      }
      
      // Filter by category
      if (categoryFilter !== "all") {
        filteredReports = filteredReports.filter(report => report.category === categoryFilter)
      }
      
      // Filter by status
      if (statusFilter !== "all") {
        filteredReports = filteredReports.filter(report => report.status === statusFilter)
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredReports = filteredReports.filter(report => 
          report.title.toLowerCase().includes(query) || 
          report.description.toLowerCase().includes(query)
        )
      }
      
      setReports(filteredReports)
      setTotalPages(1) // Just one page for mock data
      
    } catch (error) {
      console.error("Error fetching reports:", error)
      setError("Failed to load reports. Using sample data instead.")
      setReports(MOCK_REPORTS)
      setTotalPages(1)
      
      toast({
        title: "Error",
        description: "Failed to load reports. Using sample data instead.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const upvoteReport = async (id: string) => {
    try {
      // Update local state to simulate upvote 
      const updatedReports = reports.map(report => {
        if (report._id === id) {
          return {
            ...report,
            upvotes: [...report.upvotes, "currentUser"]
          }
        }
        return report
      })
      
      setReports(updatedReports)
      
      toast({
        title: "Success",
        description: "Report upvoted successfully.",
      })
    } catch (error) {
      console.error("Error upvoting report:", error)
      toast({
        title: "Error",
        description: "Failed to upvote report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "water":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "electricity":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case "noise":
        return <Volume2 className="h-4 w-4 text-purple-500" />
      case "maintenance":
        return <Wrench className="h-4 w-4 text-green-500" />
      default:
        return <Wrench className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Low</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "high":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>
      case "critical":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Reports" text="View and track community reports and issues" />

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="noise">Noise</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
          <TabsTrigger value="noise">Noise</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="my">My Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading reports...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
            <div className="flex justify-center mt-4">
              <Button onClick={fetchReports}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No reports found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report._id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex gap-3">
                    <div className="mt-1">{getCategoryIcon(report.category)}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{report.title}</h3>
                        {getStatusBadge(report.status)}
                        {getSeverityBadge(report.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground my-1">{report.description}</p>
                      <div className="flex flex-col md:flex-row md:items-center text-xs text-muted-foreground">
                        <span className="md:mr-3">Location: {report.location.address}</span>
                        <span className="md:mr-3">Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                        <span>By: {report.reporter?.name || "Anonymous"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end md:self-start">
                    <Button variant="ghost" size="icon" onClick={() => upvoteReport(report._id)} title="Upvote">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="ml-1">{report.upvotes?.length || 0}</span>
                    </Button>
                    <Button variant="ghost" size="icon" title="Comments">
                      <MessageSquare className="h-4 w-4" />
                      <span className="ml-1">{report.comments?.length || 0}</span>
                    </Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reports.length > 0 && !isLoading && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber = i + 1;
                
                // If we have more than 5 pages, adjust the displayed page numbers
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNumber = currentPage - 3 + i;
                  }
                  if (pageNumber > totalPages) {
                    pageNumber = totalPages - (5 - i - 1);
                  }
                }
                
                if (pageNumber <= 0) return null;
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </DashboardShell>
  )
}