import { useState, useRef } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useDocuments } from "@/hooks/useDocuments"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { 
  Upload, 
  FileText, 
  ArrowLeft
} from "lucide-react"

const UploadCoverLetter = () => {
  const { createDocument } = useDocuments()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your cover letter.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Create document record
      await createDocument({
        title: title.trim(),
        type: "cover-letter",
        content: description.trim() || null,
        file_url: urlData.publicUrl,
        version: 1,
        is_current: true
      })

      toast({
        title: "Success",
        description: "Cover letter uploaded successfully!",
      })

      navigate("/documents")
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload cover letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Documents
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gradient">Upload Cover Letter</h1>
          <p className="text-muted-foreground mt-2">
            Upload your cover letter and get AI-powered suggestions for improvement
          </p>
        </div>

        {/* Upload Form */}
        <Card className="card-elegant p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Cover Letter Title *</Label>
              <Input
                id="title"
                placeholder="e.g., TechCorp Cover Letter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any notes about this cover letter..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Cover Letter File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file"
                />
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Drop your cover letter here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOC, and DOCX files
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>

            {uploading && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Uploading your cover letter...</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default UploadCoverLetter