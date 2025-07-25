import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  Target,
  Search
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "resume" | "cover-letter"
  createdDate: string
  lastModified: string
  fileSize: string
  matchScore?: number
  usageCount: number
  isStarred: boolean
}

const Documents = () => {
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Senior_Developer_Resume_v3.docx",
      type: "resume",
      createdDate: "2024-01-15",
      lastModified: "2024-01-16",
      fileSize: "125 KB",
      matchScore: 87,
      usageCount: 5,
      isStarred: true
    },
    {
      id: "2",
      name: "Product_Manager_Resume.docx",
      type: "resume",
      createdDate: "2024-01-10",
      lastModified: "2024-01-12",
      fileSize: "118 KB",
      matchScore: 73,
      usageCount: 2,
      isStarred: false
    },
    {
      id: "3",
      name: "TechCorp_Cover_Letter.docx",
      type: "cover-letter",
      createdDate: "2024-01-14",
      lastModified: "2024-01-14",
      fileSize: "92 KB",
      matchScore: 91,
      usageCount: 1,
      isStarred: true
    },
    {
      id: "4",
      name: "Generic_Cover_Letter.docx",
      type: "cover-letter",
      createdDate: "2024-01-08",
      lastModified: "2024-01-09",
      fileSize: "85 KB",
      matchScore: 65,
      usageCount: 3,
      isStarred: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === "all" || doc.type === selectedTab
    return matchesSearch && matchesTab
  })

  const getTypeColor = (type: string) => {
    return type === "resume" 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
  }

  const getMatchScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card className="card-elegant p-6 hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{doc.name}</h3>
              <p className="text-sm text-muted-foreground">{doc.fileSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            <Badge className={getTypeColor(doc.type)}>
              {doc.type === "resume" ? "Resume" : "Cover Letter"}
            </Badge>
          </div>
        </div>

        {/* Match Score */}
        {doc.matchScore && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Target className="w-4 h-4" />
                Match Score
              </span>
              <span className={`text-sm font-bold ${getMatchScoreColor(doc.matchScore)}`}>
                {doc.matchScore}%
              </span>
            </div>
            <Progress value={doc.matchScore} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {new Date(doc.createdDate).toLocaleDateString()}</span>
          </div>
          <div>
            Used in {doc.usageCount} applications
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="default">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="ghost">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
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
            <h1 className="text-3xl font-bold text-gradient">Documents</h1>
            <p className="text-muted-foreground mt-2">
              Manage your resumes and cover letters with AI optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button variant="gradient" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload Cover Letter
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="card-elegant p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Total Documents", 
              value: documents.length, 
              color: "text-blue-600",
              icon: FileText
            },
            { 
              label: "Resumes", 
              value: documents.filter(d => d.type === "resume").length, 
              color: "text-green-600",
              icon: FileText
            },
            { 
              label: "Cover Letters", 
              value: documents.filter(d => d.type === "cover-letter").length, 
              color: "text-purple-600",
              icon: FileText
            },
            { 
              label: "Avg Match Score", 
              value: Math.round(documents.reduce((acc, doc) => acc + (doc.matchScore || 0), 0) / documents.length) + "%", 
              color: "text-yellow-600",
              icon: Target
            }
          ].map((stat) => (
            <Card key={stat.label} className="card-elegant p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Document Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="resume">Resumes ({documents.filter(d => d.type === "resume").length})</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letters ({documents.filter(d => d.type === "cover-letter").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No documents found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search term" : "Upload your first document to get started"}
                </p>
                <Button variant="default">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Documents