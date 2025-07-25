import { Layout } from "@/components/Layout"
import { StatCard } from "@/components/StatCard"
import { JobCard } from "@/components/JobCard"
import { AIChat } from "@/components/AIChat"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  // Sample data
  const stats = [
    {
      title: "Applications Sent",
      value: "12",
      description: "This month",
      icon: Briefcase,
      trend: "up" as const,
      trendValue: "+3"
    },
    {
      title: "Resume Match Score",
      value: "87%",
      description: "Average across jobs",
      icon: Target,
      trend: "up" as const,
      trendValue: "+12%"
    },
    {
      title: "Documents",
      value: "6",
      description: "Resumes & Cover Letters",
      icon: FileText,
      trend: "neutral" as const,
      trendValue: "2 new"
    },
    {
      title: "Interview Rate",
      value: "25%",
      description: "From applications",
      icon: TrendingUp,
      trend: "up" as const,
      trendValue: "+8%"
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
      action: "/upload-resume",
      color: "bg-blue-500"
    },
    {
      title: "Find Jobs",
      description: "Search for new opportunities",
      icon: Search,
      action: "/job-search",
      color: "bg-green-500"
    },
    {
      title: "AI Analysis",
      description: "Optimize your documents",
      icon: Brain,
      action: "/ai-assistant",
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
          <Button variant="gradient" size="lg">
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
                <Button variant="outline" size="sm">
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
            <AIChat />
            
            {/* Recent Documents */}
            <Card className="card-elegant p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Documents
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Senior_Dev_Resume_v3.docx", date: "2 hours ago", type: "Resume" },
                  { name: "TechCorp_Cover_Letter.docx", date: "1 day ago", type: "Cover Letter" },
                  { name: "Product_Manager_Resume.docx", date: "3 days ago", type: "Resume" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {doc.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
