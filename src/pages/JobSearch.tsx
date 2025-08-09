import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { JobCard } from "@/components/JobCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase, Filter, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    document.title = "Job Search | AI Career Assistant";
    const desc = "AI-powered job search with filters and smart matching.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/job-search";
  }, []);

  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          query: searchTerm,
          location: location || undefined,
          jobType: jobType || undefined,
          page
        }
      })

      if (error) throw error

      if (page === 1) {
        setJobs(data.jobs || [])
      } else {
        setJobs(prev => [...prev, ...(data.jobs || [])])
      }
      
      setCurrentPage(page)
      setHasMore(data.hasMore || false)
      
      toast({
        title: "Search completed",
        description: `Found ${data.jobs?.length || 0} jobs`
      })
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveJob = (jobId: string) => {
    console.log("Saving job:", jobId)
    // Add save job logic
  }

  const handleApplyJob = (jobId: string) => {
    console.log("Applying to job:", jobId)
    // Add apply job logic
  }

  const handleViewDetails = (jobId: string) => {
    console.log("Viewing job details:", jobId)
    // Add view details logic
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient">Job Search</h1>
          <p className="text-muted-foreground mt-2">
            Find your next opportunity with AI-powered job matching
          </p>
        </div>

        {/* Search Section */}
        <Card className="card-elegant p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => handleSearch()} 
                disabled={isLoading}
                variant="default"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            <Card className="card-elegant p-4">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Experience Level</h4>
                  <div className="space-y-2">
                    {["Entry Level", "Mid Level", "Senior Level", "Executive"].map((level) => (
                      <label key={level} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Company Size</h4>
                  <div className="space-y-2">
                    {["Startup (1-10)", "Small (11-50)", "Medium (51-200)", "Large (201+)"].map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Salary Range</h4>
                  <div className="space-y-2">
                    {["$50k - $75k", "$75k - $100k", "$100k - $150k", "$150k+"].map((range) => (
                      <label key={range} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{jobs.length} Jobs Found</h2>
                <Badge variant="secondary">{jobs.filter(j => j.type?.toLowerCase() === "remote").length} Remote</Badge>
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="date">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job}
                  onSave={handleSaveJob}
                  onApply={handleApplyJob}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && jobs.length > 0 && (
              <div className="text-center pt-6">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => handleSearch(currentPage + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Load More Jobs
                </Button>
              </div>
            )}

            {jobs.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Use the search bar above to find job opportunities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default JobSearch