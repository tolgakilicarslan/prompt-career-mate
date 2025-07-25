import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useJobs } from "@/hooks/useJobs"
import { useToast } from "@/hooks/use-toast"
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
  MessageSquare,
  Edit,
  Trash2
} from "lucide-react"

const JobTracker = () => {
  const { jobs, isLoading, createJob, updateJob, deleteJob } = useJobs()
  const { toast } = useToast()
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // New job form state
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    job_url: "",
    salary_range: "",
    status: "saved" as const,
    notes: "",
    applied_date: null as string | null
  })

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    return filteredJobs.filter(job => job.status === status)
  }

  const handleAddJob = async () => {
    if (!newJob.title || !newJob.company) {
      toast({
        title: "Missing required fields",
        description: "Please enter at least a job title and company",
        variant: "destructive"
      })
      return
    }

    try {
      await createJob(newJob)
      setNewJob({
        title: "",
        company: "",
        location: "",
        description: "",
        job_url: "",
        salary_range: "",
        status: "saved",
        notes: "",
        applied_date: null
      })
      setIsAddJobDialogOpen(false)
      toast({
        title: "Job added successfully",
        description: "Your job has been added to the tracker"
      })
    } catch (error) {
      toast({
        title: "Failed to add job",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  const handleUpdateJob = async (jobId: string, updates: any) => {
    try {
      await updateJob(jobId, updates)
      setEditingJob(null)
      toast({
        title: "Job updated successfully"
      })
    } catch (error) {
      toast({
        title: "Failed to update job",
        variant: "destructive"
      })
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    
    try {
      await deleteJob(jobId)
      toast({
        title: "Job deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Failed to delete job",
        variant: "destructive"
      })
    }
  }

  const JobCard = ({ job }: { job: any }) => (
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
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setEditingJob(job)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          {job.job_url && (
            <Button size="sm" variant="ghost" asChild>
              <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Job
              </a>
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDeleteJob(job.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
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
          <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Job</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    placeholder="e.g. TechCorp"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={newJob.salary_range}
                    onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})}
                    placeholder="e.g. $100k - $150k"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newJob.status} onValueChange={(value: any) => setNewJob({...newJob, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job_url">Job URL</Label>
                  <Input
                    id="job_url"
                    value={newJob.job_url}
                    onChange={(e) => setNewJob({...newJob, job_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    placeholder="Job description..."
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newJob.notes}
                    onChange={(e) => setNewJob({...newJob, notes: e.target.value})}
                    placeholder="Personal notes about this job..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsAddJobDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddJob}>
                  Add Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="card-elegant p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search jobs, companies, or notes..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            <TabsTrigger value="all">All ({filteredJobs.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({getJobsByStatus("saved").length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({getJobsByStatus("applied").length})</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing ({getJobsByStatus("interviewing").length})</TabsTrigger>
            <TabsTrigger value="offered">Offered ({getJobsByStatus("offered").length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getJobsByStatus("rejected").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
            {!isLoading && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? "No jobs match your search." : "No jobs added yet. Click 'Add Job' to get started!"}
                </p>
              </div>
            )}
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

        {/* Edit Job Dialog */}
        {editingJob && (
          <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Job</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editingJob.company}
                    onChange={(e) => setEditingJob({...editingJob, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingJob.status} onValueChange={(value) => setEditingJob({...editingJob, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-salary">Salary Range</Label>
                  <Input
                    id="edit-salary"
                    value={editingJob.salary_range || ""}
                    onChange={(e) => setEditingJob({...editingJob, salary_range: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingJob.notes || ""}
                    onChange={(e) => setEditingJob({...editingJob, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setEditingJob(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateJob(editingJob.id, editingJob)}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}

export default JobTracker