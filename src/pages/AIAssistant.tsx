import { useState } from "react"
import { Layout } from "@/components/Layout"
import { EnhancedAIChat } from "@/components/EnhancedAIChat"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  FileText, 
  Target, 
  Upload,
  Download,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Edit
} from "lucide-react"

const AIAssistant = () => {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchScore, setMatchScore] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return
    
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70 // 70-100
      setMatchScore(score)
      setAnalysis({
        keywords: {
          matched: ["React", "JavaScript", "TypeScript", "Node.js"],
          missing: ["GraphQL", "Docker", "AWS", "Kubernetes"],
          suggestions: ["Add GraphQL experience", "Mention cloud platforms", "Include containerization skills"]
        },
        improvements: [
          "Add more specific achievements with metrics",
          "Include relevant certifications",
          "Highlight leadership experience",
          "Mention agile methodology experience"
        ],
        strengths: [
          "Strong technical skills alignment",
          "Relevant work experience",
          "Good educational background",
          "Active GitHub profile"
        ]
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const sampleJobDescription = `We are seeking a Senior Frontend Developer to join our dynamic team. 
  
Key Requirements:
- 5+ years of React development experience
- Proficiency in TypeScript and JavaScript
- Experience with GraphQL and REST APIs
- Knowledge of containerization (Docker)
- AWS cloud platform experience
- Strong problem-solving skills
- Bachelor's degree in Computer Science or related field

Preferred Qualifications:
- Experience with Kubernetes
- Knowledge of microservices architecture
- Previous leadership or mentoring experience
- Agile/Scrum methodology experience`

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient">AI Career Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get AI-powered insights to optimize your resume and cover letters for specific jobs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Analysis Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description Input */}
            <Card className="card-elegant p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Job Description Analysis
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setJobDescription(sampleJobDescription)}
                  >
                    Use Sample
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Paste the job description here to get AI-powered matching insights..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-48"
                />
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobDescription.trim()}
                    variant="gradient"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Match
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Job URL
                  </Button>
                </div>
              </div>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card className="card-elegant p-6">
                <div className="space-y-6">
                  {/* Match Score */}
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto relative">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="hsl(var(--primary))"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${matchScore * 3.14} 314`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{matchScore}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Match Score</h3>
                      <p className="text-muted-foreground">Your resume compatibility with this job</p>
                    </div>
                  </div>

                  {/* Analysis Tabs */}
                  <Tabs defaultValue="keywords" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="improvements">Improvements</TabsTrigger>
                      <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    </TabsList>

                    <TabsContent value="keywords" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Matched Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.matched.map((keyword: string) => (
                              <Badge key={keyword} className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.missing.map((keyword: string) => (
                              <Badge key={keyword} className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="improvements" className="space-y-3">
                      {analysis.improvements.map((improvement: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <p className="text-sm">{improvement}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="strengths" className="space-y-3">
                      {analysis.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <p className="text-sm">{strength}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button variant="default">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Resume
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Cover Letter
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Document Upload */}
            <Card className="card-elegant p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Document Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload Resume</p>
                  <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload Cover Letter</p>
                  <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - AI Chat */}
          <div className="space-y-6">
            <EnhancedAIChat isOpen={true} />
            
            {/* Quick Tips */}
            <Card className="card-elegant p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Tips
              </h3>
              <div className="space-y-3">
                {[
                  "Use action verbs to start bullet points",
                  "Quantify achievements with numbers",
                  "Tailor keywords to each job posting",
                  "Keep resume to 1-2 pages maximum",
                  "Use consistent formatting throughout"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AIAssistant