import { useState, useRef } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useDocuments } from "@/hooks/useDocuments"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
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

const Documents = () => {
  const { documents, isLoading, createDocument, deleteDocument } = useDocuments()
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "resume" | "cover-letter") => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      console.log('Starting file upload:', file.name, file.type, file.size)
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('File uploaded successfully:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      console.log('Got public URL:', urlData.publicUrl)

      // Create document record
      const docData = {
        title: file.name.split('.')[0],
        type: type,
        content: null,
        file_url: urlData.publicUrl,
        version: 1,
        is_current: true
      }

      console.log('Creating document record:', docData)
      
      await createDocument(docData)

      toast({
        title: "Success",
        description: `${type === 'resume' ? 'Resume' : 'Cover letter'} uploaded successfully!`,
      })
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === "all" || doc.type === selectedTab
    return matchesSearch && matchesTab
  })

  const getTypeColor = (type: string) => {
    return type === "resume" 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
  }

  const DocumentCard = ({ doc }: { doc: any }) => (
    <Card className="card-elegant p-6 hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{doc.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(doc.type)}>
              {doc.type === "resume" ? "Resume" : "Cover Letter"}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Version {doc.version}</span>
          </div>
          <div>
            {doc.is_current ? "Current version" : "Archived"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {doc.file_url && (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => window.open(doc.file_url!, '_blank')}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
          {doc.file_url && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const link = document.createElement('a')
                link.href = doc.file_url!
                link.download = doc.title
                link.click()
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => deleteDocument(doc.id)}
          >
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, "resume")}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
            <Button 
              variant="gradient" 
              size="lg"
              onClick={() => {
                // Create a new input for cover letter
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf,.doc,.docx'
                input.onchange = (e) => handleFileUpload(e as any, 'cover-letter')
                input.click()
              }}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Cover Letter"}
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
              label: "Current Version", 
              value: documents.filter(d => d.is_current).length, 
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
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
                <Button 
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Document"}
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