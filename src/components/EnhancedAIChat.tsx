import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  FileText, 
  Briefcase, 
  Target,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDocuments } from "@/hooks/useDocuments"
import { useJobs } from "@/hooks/useJobs"
import { supabase } from "@/integrations/supabase/client"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "suggestion" | "analysis" | "general"
}

interface AIChatProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function EnhancedAIChat({ isOpen = true }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your AI Career Assistant. I can help you optimize your resume, analyze job descriptions, and provide personalized career advice. What would you like to work on today?",
      sender: "ai",
      timestamp: new Date(),
      type: "general"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { documents } = useDocuments()
  const { jobs } = useJobs()

  useEffect(() => {
    // Update AI with available documents and jobs when they change
    if (documents.length > 0 || jobs.length > 0) {
      const contextMessage: Message = {
        id: Date.now().toString(),
        content: `I can now see your documents and job applications:\n\n📄 Documents: ${documents.length} (${documents.filter(d => d.type === 'resume').length} resumes, ${documents.filter(d => d.type === 'cover-letter').length} cover letters)\n💼 Jobs: ${jobs.length} applications tracked\n\nI can now provide personalized advice based on your actual data!`,
        sender: "ai",
        timestamp: new Date(),
        type: "analysis"
      }
      
      setMessages(prev => {
        // Don't add duplicate context messages
        if (prev.some(m => m.content.includes("I can now see your documents"))) {
          return prev
        }
        return [...prev, contextMessage]
      })
    }
  }, [documents, jobs])

  const quickActions = [
    {
      title: "Resume Review",
      description: "Analyze my resume",
      icon: FileText,
      prompt: "Can you review my resume and provide optimization suggestions?"
    },
    {
      title: "Job Match Analysis",
      description: "Compare job to my profile",
      icon: Target,
      prompt: "Help me analyze how well I match a job posting"
    },
    {
      title: "Interview Prep",
      description: "Prepare for interviews",
      icon: Briefcase,
      prompt: "Help me prepare for upcoming job interviews"
    }
  ]

  const generateAIResponse = (userMessage: string): Message => {
    const hasResumes = documents.filter(d => d.type === 'resume').length
    const hasCoverLetters = documents.filter(d => d.type === 'cover-letter').length
    const hasJobs = jobs.length

    // Extract document details for smarter responses
    const resumeDetails = documents.filter(d => d.type === 'resume').map(d => ({
      title: d.title,
      created: new Date(d.created_at).toLocaleDateString(),
      current: d.is_current
    }))

    const jobDetails = jobs.map(j => ({
      title: j.title,
      company: j.company,
      status: j.status,
      applied: j.applied_date ? new Date(j.applied_date).toLocaleDateString() : null
    }))

    const responses = {
      resume: hasResumes > 0 ? [
        `I've analyzed your ${hasResumes} resume(s)! Here's what I found:\n\n📄 Documents:\n${resumeDetails.map(r => `• ${r.title} (${r.created})${r.current ? ' - CURRENT' : ''}`).join('\n')}\n\n💡 AI Recommendations:\n• Match content to your ${hasJobs} tracked roles\n• Optimize for ATS scanning\n• Quantify achievements with numbers\n• Update skills based on target positions\n\nWant specific feedback on any document?`,
        `Perfect! I can see your resume portfolio:\n\n${resumeDetails.map(r => `📝 ${r.title}\n   Uploaded: ${r.created}\n   Status: ${r.current ? 'Current Version' : 'Archived'}`).join('\n\n')}\n\n🎯 Next Steps:\n• Cross-reference with your ${hasJobs} job applications\n• Identify keyword gaps\n• Enhance weak sections\n• Create targeted versions\n\nWhich resume needs optimization first?`
      ] : [
        "I'd love to analyze your resume! Upload it and I'll provide:\n\n🔍 Detailed Content Analysis\n• Keyword optimization suggestions\n• ATS compatibility check\n• Skills gap identification\n• Achievement quantification tips\n\n📊 Match Score vs Target Roles\n• Compare against job requirements\n• Highlight missing qualifications\n• Suggest improvements\n\nReady to upload your resume?",
        "Resume optimization is my specialty! I can help with:\n\n✨ Content Enhancement:\n• Action verbs and impact statements\n• Professional summary refinement\n• Skills section optimization\n• Experience bullet points\n\n🎯 Strategic Positioning:\n• Industry-specific customization\n• Role-targeted keywords\n• ATS-friendly formatting\n\nUpload your resume for personalized insights!"
      ],
      job: hasJobs > 0 ? [
        `Analyzing your ${hasJobs} job applications:\n\n💼 Current Opportunities:\n${jobDetails.slice(0,3).map(j => `• ${j.title} at ${j.company}\n  Status: ${j.status}${j.applied ? ` (Applied: ${j.applied})` : ''}`).join('\n')}\n${hasJobs > 3 ? `\n...and ${hasJobs - 3} more applications` : ''}\n\n🔍 Match Analysis:\n• Resume alignment: ${hasResumes > 0 ? 'Ready for comparison' : 'Upload resume first'}\n• Application strategy insights\n• Priority ranking recommendations\n\nWhich opportunity should we focus on?`,
        `Great job tracking ${hasJobs} applications! Here's my analysis:\n\n📈 Application Status:\n${Object.entries(jobs.reduce((acc, job) => { acc[job.status] = (acc[job.status] || 0) + 1; return acc }, {} as Record<string, number>)).map(([status, count]) => `• ${status}: ${count} ${count === 1 ? 'application' : 'applications'}`).join('\n')}\n\n🎯 AI Recommendations:\n• Prioritize by match score\n• Follow up on pending applications\n• Tailor documents for each role\n\nNeed help with any specific application?`
      ] : [
        "Start tracking jobs and I'll provide:\n\n📊 Smart Analytics:\n• Application success rates\n• Response time tracking\n• Match score calculations\n• Follow-up reminders\n\n🎯 Strategic Insights:\n• Best-fit opportunity identification\n• Application timing optimization\n• Document customization suggestions\n\nAdd your first job to get started!",
        "Job tracking unlocks powerful insights! I can help you:\n\n🔍 Opportunity Analysis:\n• Requirements vs skills comparison\n• Market positioning assessment\n• Competition analysis\n• Salary benchmarking\n\n📈 Application Strategy:\n• Priority ranking system\n• Follow-up scheduling\n• Success rate optimization\n\nReady to add some job opportunities?"
      ],
      interview: hasJobs > 0 ? [
        `Interview prep for your portfolio! Based on your applications:\n\n🎯 Company-Specific Prep:\n${jobDetails.slice(0,2).map(j => `• ${j.company} (${j.title})\n  Custom questions + research`).join('\n')}\n\n💪 STAR Method Examples:\n• From your ${hasResumes} uploaded resume(s)\n• Tailored to each role\n• Quantified achievements\n\n🗣️ Practice Areas:\n• Technical questions for your field\n• Behavioral scenarios\n• Questions to ask them\n\nWhich interview is coming up first?`,
        `Excellent! With ${hasJobs} tracked applications, I can provide:\n\n🏢 Company Research:\n• Recent news and developments\n• Culture and values alignment\n• Interview format expectations\n• Common questions for each role\n\n📝 Preparation Materials:\n• Custom answer frameworks\n• Achievement examples from your background\n• Strategic questions to ask\n\nWhich company interview should we prepare for?`
      ] : [
        "Interview mastery starts with preparation! I can help you:\n\n🎯 General Preparation:\n• Common behavioral questions\n• STAR method examples\n• Professional storytelling\n• Confidence building techniques\n\n🏢 Company Research:\n• Industry trends analysis\n• Role-specific preparation\n• Question frameworks\n• Follow-up strategies\n\nTell me about your upcoming interview!",
        "Let's ace that interview! My preparation includes:\n\n💼 Professional Presentation:\n• Elevator pitch refinement\n• Achievement storytelling\n• Weakness reframing\n• Salary negotiation prep\n\n🔍 Research & Strategy:\n• Company background deep-dive\n• Role requirements analysis\n• Interview format preparation\n• Post-interview follow-up\n\nWhat position are you interviewing for?"
      ],
      analysis: hasResumes > 0 && hasJobs > 0 ? [
        `📊 CAREER PORTFOLIO ANALYSIS\n\n📄 Documents: ${hasResumes} resume(s), ${hasCoverLetters} cover letter(s)\n💼 Applications: ${hasJobs} opportunities tracked\n\n🎯 SMART INSIGHTS:\n• Document-to-job match scores\n• Skills gap identification\n• Application success patterns\n• Optimization recommendations\n\n🚀 NEXT ACTIONS:\n• Prioritize highest-match opportunities\n• Update documents for better alignment\n• Schedule strategic follow-ups\n\nReady for detailed analysis?`,
        `🔍 COMPREHENSIVE CAREER REVIEW\n\nYour Data:\n${resumeDetails.map(r => `📝 ${r.title}`).join('\n')}\n${jobDetails.slice(0,3).map(j => `💼 ${j.title} at ${j.company}`).join('\n')}\n\n💡 AI RECOMMENDATIONS:\n• Cross-reference documents with target roles\n• Identify highest-probability opportunities\n• Optimize application materials\n• Track engagement metrics\n\nWhat specific analysis would be most helpful?`
      ] : [
        `Welcome to your AI Career Assistant! 🤖\n\nCurrent Status:\n📄 Documents: ${hasResumes + hasCoverLetters} uploaded\n💼 Jobs: ${hasJobs} tracked\n\n🚀 Getting Started:\n• Upload your resume and cover letters\n• Add job opportunities you're targeting\n• Get personalized optimization advice\n• Track your application success\n\nWhat would you like to work on first?`,
        `Ready to supercharge your job search! 🎯\n\nI can help you:\n📈 Strategic Planning:\n• Career goal alignment\n• Market opportunity analysis\n• Personal brand development\n• Application strategy optimization\n\n🔧 Tactical Execution:\n• Document optimization\n• Interview preparation\n• Follow-up management\n• Success tracking\n\nHow can I support your career goals today?`
      ]
    }

    const lowerMessage = userMessage.toLowerCase()
    let responseType: keyof typeof responses = "analysis"
    
    if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
      responseType = "resume"
    } else if (lowerMessage.includes("job") || lowerMessage.includes("match") || lowerMessage.includes("posting")) {
      responseType = "job"
    } else if (lowerMessage.includes("interview") || lowerMessage.includes("prep")) {
      responseType = "interview"
    }

    const responseArray = responses[responseType]
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)]

    return {
      id: Date.now().toString(),
      content: randomResponse,
      sender: "ai",
      timestamp: new Date(),
      type: "analysis"
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const chatMessages = [...messages, userMessage].slice(-10).map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }))

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: chatMessages,
          context: {
            documents,
            jobs,
          },
        },
      })

      if (error) throw error

      const aiText = (data as any)?.reply || "I'm sorry, I couldn't generate a response."
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: "ai",
        timestamp: new Date(),
        type: "analysis",
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (err: any) {
      console.error('AI chat error:', err)
      toast({
        title: "AI Error",
        description: err?.message || "Failed to generate AI response.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt)
    handleSendMessage()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "analysis": return <Target className="w-4 h-4" />
      case "suggestion": return <Sparkles className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  if (!isOpen) return null

  return (
    <Card className="card-elegant h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--gradient-primary)] rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Career Assistant</h3>
            <p className="text-sm text-muted-foreground">Always here to help optimize your career</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
              onClick={() => handleQuickAction(action.prompt)}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-center leading-tight">{action.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-[var(--gradient-primary)] text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "ai" && (
                      <div className="mt-0.5">
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {message.type && message.type !== "general" && (
                    <Badge variant="secondary" className="text-xs">
                      {message.type}
                    </Badge>
                  )}
                </div>
              </div>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-[var(--gradient-primary)] text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me about your career, resume, or job search..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            variant="default"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}