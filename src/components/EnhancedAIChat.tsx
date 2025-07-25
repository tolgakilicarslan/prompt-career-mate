import { useState } from "react"
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
    const responses = {
      resume: [
        "I'd be happy to help you optimize your resume! Here are some key suggestions:\n\n• Use action verbs to start each bullet point\n• Quantify your achievements with specific numbers\n• Tailor keywords to match job descriptions\n• Keep it concise and focused on results\n\nWould you like me to analyze a specific section?",
        "Great question about resume optimization! Focus on these areas:\n\n• Professional summary that highlights your unique value\n• Skills section aligned with target roles\n• Experience section with measurable impacts\n• Clean, ATS-friendly formatting\n\nUpload your resume for a detailed analysis!"
      ],
      job: [
        "Job matching is crucial for application success! Here's my approach:\n\n• Compare your skills with job requirements\n• Identify keyword gaps in your resume\n• Suggest specific improvements\n• Calculate compatibility score\n\nPaste a job description and I'll analyze it for you!",
        "Excellent! Let me help you with job analysis. I can:\n\n• Identify must-have vs nice-to-have skills\n• Suggest how to address missing qualifications\n• Recommend resume adjustments\n• Provide application strategy tips\n\nWhat specific role are you targeting?"
      ],
      interview: [
        "Interview preparation is key to success! Here's what I recommend:\n\n• Research the company thoroughly\n• Prepare STAR method examples\n• Practice common behavioral questions\n• Prepare thoughtful questions to ask\n\nWhat type of interview are you preparing for?",
        "Great choice focusing on interview prep! Let me help you:\n\n• Review common questions for your field\n• Practice your elevator pitch\n• Prepare specific examples of achievements\n• Plan your follow-up strategy\n\nTell me about the role you're interviewing for!"
      ],
      general: [
        "I'm here to help with all aspects of your job search! I can assist with:\n\n• Resume and cover letter optimization\n• Job search strategy\n• Interview preparation\n• Salary negotiation tips\n• Career planning advice\n\nWhat specific challenge are you facing?",
        "Thanks for reaching out! As your AI career assistant, I can help you:\n\n• Analyze and improve your application materials\n• Match your profile to job opportunities\n• Provide industry-specific advice\n• Track your application progress\n\nHow can I support your career goals today?"
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