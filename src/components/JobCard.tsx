import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, MapPin, DollarSign, Clock, ExternalLink } from "lucide-react"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    salary?: string
    type: string
    postedDate: string
    description: string
    status?: "saved" | "applied" | "interviewing" | "rejected"
  }
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
}

export function JobCard({ job, onSave, onApply, onViewDetails }: JobCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "interviewing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "saved": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default: return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  }

  return (
    <Card className="card-elegant p-6 hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
              {job.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
          {job.status && (
            <Badge className={getStatusColor(job.status)}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          )}
        </div>

        {/* Job details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="secondary">{job.type}</Badge>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.postedDate}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            size="sm" 
            variant="default"
            onClick={() => onApply?.(job.id)}
          >
            Quick Apply
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onSave?.(job.id)}
          >
            Save Job
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onViewDetails?.(job.id)}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </Card>
  )
}