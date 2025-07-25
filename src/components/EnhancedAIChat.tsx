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

    const responses = {
      resume: hasResumes > 0 ? [
        `I can see you have ${hasResumes} resume(s) uploaded! Here's my analysis:\n\n• Your current resume titles: ${documents.filter(d => d.type === 'resume').map(d => d.title).join(', ')}\n• Use action verbs to start each bullet point\n• Quantify your achievements with specific numbers\n• Tailor keywords to match your ${hasJobs} tracked jobs\n\nWould you like me to analyze how well your resume matches your saved jobs?`,
        `Great! I can analyze your uploaded resume(s). Based on your ${hasJobs} job applications, here are key areas to focus on:\n\n• Professional summary aligned with your target roles\n• Skills section matching job requirements\n• Experience section with measurable impacts\n• ATS-friendly formatting for better parsing\n\nShall I compare your resume against specific job postings you're tracking?`
      ] : [
        "I'd be happy to help you optimize your resume! Here are some key suggestions:\n\n• Use action verbs to start each bullet point\n• Quantify your achievements with specific numbers\n• Tailor keywords to match job descriptions\n• Keep it concise and focused on results\n\nUpload your resume so I can provide personalized feedback!",
        "Great question about resume optimization! Focus on these areas:\n\n• Professional summary that highlights your unique value\n• Skills section aligned with target roles\n• Experience section with measurable impacts\n• Clean, ATS-friendly formatting\n\nUpload your resume for a detailed analysis!"
      ],
      job: hasJobs > 0 ? [
        `I can see you're tracking ${hasJobs} job applications! Here's how I can help:\n\n• Analyze match scores for your saved jobs\n• Compare requirements against your ${hasResumes} resume(s)\n• Suggest improvements for better alignment\n• Prioritize applications based on fit\n\nWhich of your tracked jobs would you like me to analyze first?`,
        `Excellent! Based on your ${hasJobs} tracked jobs, I can help you:\n\n• Identify the best-fit opportunities\n• Gap analysis for missing qualifications\n• Tailor your application materials\n• Strategic application timing\n\nLet me know which job posting you'd like to focus on!`
      ] : [
        "Job matching is crucial for application success! Here's my approach:\n\n• Compare your skills with job requirements\n• Identify keyword gaps in your resume\n• Suggest specific improvements\n• Calculate compatibility score\n\nStart tracking jobs in the Job Tracker so I can provide personalized analysis!",
        "Excellent! Let me help you with job analysis. I can:\n\n• Identify must-have vs nice-to-have skills\n• Suggest how to address missing qualifications\n• Recommend resume adjustments\n• Provide application strategy tips\n\nWhat specific role are you targeting?"
      ],
      interview: hasJobs > 0 ? [
        `Interview prep for your ${hasJobs} applications! Here's my personalized approach:\n\n• Company research for your specific targets\n• STAR method examples from your resume\n• Practice questions tailored to your roles\n• Follow-up strategies for each application\n\nWhich company interview should we prepare for first?`,
        `Perfect timing! With your tracked applications, I can help you:\n\n• Customize prep for each company\n• Practice role-specific questions\n• Prepare examples from your experience\n• Plan strategic follow-up approaches\n\nWhich of your ${hasJobs} applications has an upcoming interview?`
      ] : [
        "Interview preparation is key to success! Here's what I recommend:\n\n• Research the company thoroughly\n• Prepare STAR method examples\n• Practice common behavioral questions\n• Prepare thoughtful questions to ask\n\nStart tracking your applications so I can provide company-specific prep!",
        "Great choice focusing on interview prep! Let me help you:\n\n• Review common questions for your field\n• Practice your elevator pitch\n• Prepare specific examples of achievements\n• Plan your follow-up strategy\n\nTell me about the role you're interviewing for!"
      ],
      general: [
        `I'm here to help with all aspects of your job search! I can see:\n\n📄 ${hasResumes} resume(s) and ${hasCoverLetters} cover letter(s)\n💼 ${hasJobs} job applications being tracked\n\nI can now provide personalized advice on:\n• Resume optimization based on your target roles\n• Job application strategy and prioritization\n• Interview preparation for specific companies\n• Document matching and improvement suggestions\n\nWhat would you like to work on first?`,
        `Thanks for reaching out! With access to your career data, I can help you:\n\n• Analyze and improve your ${hasResumes + hasCoverLetters} documents\n• Match your profile to your ${hasJobs} tracked opportunities\n• Provide data-driven career insights\n• Track your application progress strategically\n\nHow can I support your career goals today?`
      ]
    }

    const lowerMessage = userMessage.toLowerCase()
    let responseType: keyof typeof responses = "general"
    
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
      type: responseType === "general" ? "general" : "analysis"
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

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
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