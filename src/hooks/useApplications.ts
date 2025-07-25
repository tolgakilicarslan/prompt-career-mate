import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface Application {
  id: string
  user_id: string
  job_id: string
  document_id: string | null
  cover_letter_id: string | null
  match_score: number | null
  ai_analysis: any
  created_at: string
  updated_at: string
  // Joined fields from jobs table
  job?: {
    title: string
    company: string
    location: string | null
    salary_range: string | null
  }
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title, company, location, salary_range)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createApplication = async (appData: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'job'>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{ ...appData, user_id: user!.id }])
        .select(`
          *,
          job:jobs(title, company, location, salary_range)
        `)
        .single()

      if (error) throw error
      
      setApplications(prev => [data, ...prev])
      toast({
        title: "Success",
        description: "Application added successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error creating application:', error)
      toast({
        title: "Error",
        description: "Failed to add application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateApplication = async (appId: string, updates: Partial<Application>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', appId)
        .select(`
          *,
          job:jobs(title, company, location, salary_range)
        `)
        .single()

      if (error) throw error

      setApplications(prev => prev.map(app => app.id === appId ? data : app))
      toast({
        title: "Success",
        description: "Application updated successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error updating application:', error)
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteApplication = async (appId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId)

      if (error) throw error

      setApplications(prev => prev.filter(app => app.id !== appId))
      toast({
        title: "Success",
        description: "Application deleted successfully!",
      })
    } catch (error: any) {
      console.error('Error deleting application:', error)
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    applications,
    isLoading,
    createApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: fetchApplications
  }
}