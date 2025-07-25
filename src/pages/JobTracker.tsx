import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  FileText,
  MessageSquare
} from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  status: "saved" | "applied" | "interviewing" | "offered" | "rejected"
  appliedDate?: string
  notes?: string
  resumeVersion?: string
  coverLetterVersion?: string
}

const JobTracker = () => {
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      status: "interviewing",
      appliedDate: "2024-01-15",
      notes: "Great culture fit, technical interview scheduled for next week",
      resumeVersion: "Senior_Dev_Resume_v3.docx",
      coverLetterVersion: "TechCorp_Cover_Letter.docx"
    },
    {
      id: "2",
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$110k - $140k",
      status: "applied",
      appliedDate: "2024-01-10",
      notes: "Applied through LinkedIn, waiting for response",
      resumeVersion: "Product_Manager_Resume.docx"
    },
    {
      id: "3",
      title: "Full Stack Developer",
      company: "BigTech Corp",
      location: "Seattle, WA",
      salary: "$130k - $160k",
      status: "rejected",
      appliedDate: "2024-01-05",
      notes: "Rejected after phone screening, feedback was good but looking for more backend experience"
    },
    {
      id: "4",
      title: "React Developer",
      company: "Medium Startup",
      location: "Austin, TX",
      salary: "$90k - $120k",
      status: "saved",
      notes: "Interesting company, need to research more before applying"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "saved": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      case "applied": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "interviewing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "offered": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status)
  }

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="card-elegant p-6 hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>

        {/* Application Details */}
        {job.appliedDate && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Applied on {new Date(job.appliedDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Documents */}
        {(job.resumeVersion || job.coverLetterVersion) && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Documents used:</p>
            <div className="flex gap-2">
              {job.resumeVersion && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {job.resumeVersion}
                </Badge>
              )}
              {job.coverLetterVersion && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {job.coverLetterVersion}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {job.notes && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Notes:
            </p>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {job.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" variant="ghost">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Job
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Job Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your job applications in one place
            </p>
          </div>
          <Button variant="gradient" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="card-elegant p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search jobs, companies, or notes..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Saved", count: getJobsByStatus("saved").length, color: "text-gray-600" },
            { label: "Applied", count: getJobsByStatus("applied").length, color: "text-blue-600" },
            { label: "Interviewing", count: getJobsByStatus("interviewing").length, color: "text-yellow-600" },
            { label: "Offered", count: getJobsByStatus("offered").length, color: "text-green-600" },
            { label: "Rejected", count: getJobsByStatus("rejected").length, color: "text-red-600" }
          ].map((stat) => (
            <Card key={stat.label} className="card-elegant p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Job Lists */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({getJobsByStatus("saved").length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({getJobsByStatus("applied").length})</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing ({getJobsByStatus("interviewing").length})</TabsTrigger>
            <TabsTrigger value="offered">Offered ({getJobsByStatus("offered").length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getJobsByStatus("rejected").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>

          {["saved", "applied", "interviewing", "offered", "rejected"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getJobsByStatus(status).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {getJobsByStatus(status).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No jobs in this category yet.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  )
}

export default JobTracker