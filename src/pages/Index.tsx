import { Layout } from "@/components/Layout"
import { StatCard } from "@/components/StatCard"
import { JobCard } from "@/components/JobCard"
import { EnhancedAIChat } from "@/components/EnhancedAIChat"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useJobs } from "@/hooks/useJobs"
import { useDocuments } from "@/hooks/useDocuments"
import { useApplications } from "@/hooks/useApplications"
import { useNavigate } from "react-router-dom"
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Target,
  Plus,
  Search,
  Brain,
  Upload,
  Star
} from "lucide-react"

const Index = () => {
  const navigate = useNavigate()
  const { jobs } = useJobs()
  const { documents } = useDocuments()
  const { applications } = useApplications()

  // Calculate real stats
  const recentApplications = applications.slice(0, 3)
  const avgMatchScore = applications.length > 0 
    ? Math.round(applications.filter(a => a.match_score).reduce((acc, a) => acc + (a.match_score || 0), 0) / applications.filter(a => a.match_score).length) || 0
    : 0

  const stats = [
    {
      title: "Applications Sent",
      value: applications.length.toString(),
      description: "Total applications",
      icon: Briefcase,
      trend: "up" as const,
      trendValue: recentApplications.length > 0 ? `+${recentApplications.length} recent` : "0 recent"
    },
    {
      title: "Resume Match Score",
      value: avgMatchScore > 0 ? `${avgMatchScore}%` : "N/A",
      description: "Average across jobs",
      icon: Target,
      trend: avgMatchScore >= 70 ? "up" as const : avgMatchScore >= 50 ? "neutral" as const : "down" as const,
      trendValue: avgMatchScore > 0 ? "Calculated" : "Upload documents"
    },
    {
      title: "Documents",
      value: documents.length.toString(),
      description: "Resumes & Cover Letters",
      icon: FileText,
      trend: "neutral" as const,
      trendValue: documents.filter(d => d.type === "resume").length + " resumes"
    },
    {
      title: "Saved Jobs",
      value: jobs.length.toString(),
      description: "Total saved",
      icon: TrendingUp,
      trend: "up" as const,
      trendValue: jobs.filter(j => j.status === "applied").length + " applied"
    }
  ]

  const recentJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      postedDate: "2 days ago",
      description: "We're looking for a senior frontend developer to join our growing team. You'll work on cutting-edge React applications and help shape our product direction.",
      status: "applied" as const
    },
    {
      id: "2",
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$110k - $140k",
      type: "Full-time",
      postedDate: "1 week ago",
      description: "Join our product team to drive product strategy and work closely with engineering and design teams to build amazing user experiences.",
      status: "saved" as const
    },
    {
      id: "3",
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Contract",
      postedDate: "3 days ago",
      description: "We need a talented UX designer to help us create intuitive and beautiful user experiences for our client projects."
    }
  ]

  const quickActions = [
    {
      title: "Upload Resume",
      description: "Add a new resume version",
      icon: Upload,
      action: () => navigate("/documents"),
      color: "bg-blue-500"
    },
    {
      title: "Find Jobs",
      description: "Search for new opportunities",
      icon: Search,
      action: () => navigate("/job-search"),
      color: "bg-green-500"
    },
    {
      title: "AI Analysis",
      description: "Optimize your documents",
      icon: Brain,
      action: () => navigate("/ai-assistant"),
      color: "bg-purple-500"
    }
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Career Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your job search progress and optimize your applications with AI
            </p>
          </div>
          <Button variant="gradient" size="lg" onClick={() => navigate("/job-tracker")}>
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="card-elegant p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-[var(--shadow-elegant)]"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Recent Jobs */}
            <Card className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Recent Job Applications
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigate("/job-tracker")}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - AI Chat */}
          <div className="space-y-6">
            <EnhancedAIChat />
            
            {/* Recent Documents */}
            <Card className="card-elegant p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Documents
              </h3>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {doc.type === "resume" ? "Resume" : "Cover Letter"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No documents yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate("/documents")}
                    >
                      Upload First Document
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
