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
    url?: string
    status?: "saved" | "applied" | "interviewing" | "rejected"
  }
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
}

export function JobCard({ job, onSave, onApply, onViewDetails }: JobCardProps) {
  const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "applied":
        return "secondary"
      case "interviewing":
        return "default"
      case "rejected":
        return "destructive"
      case "saved":
        return "outline"
      default:
        return "secondary"
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
            <Badge variant={getStatusVariant(job.status)}>
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