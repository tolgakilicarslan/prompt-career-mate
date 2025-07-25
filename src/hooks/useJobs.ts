import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface Job {
  id: string
  user_id: string
  title: string
  company: string
  location: string | null
  description: string | null
  job_url: string | null
  salary_range: string | null
  status: string
  applied_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchJobs()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createJob = async (jobData: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{ ...jobData, user_id: user!.id }])
        .select()
        .single()

      if (error) throw error
      
      setJobs(prev => [data, ...prev])
      toast({
        title: "Success",
        description: "Job added successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: "Failed to add job. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single()

      if (error) throw error

      setJobs(prev => prev.map(job => job.id === jobId ? data : job))
      toast({
        title: "Success",
        description: "Job updated successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error updating job:', error)
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error

      setJobs(prev => prev.filter(job => job.id !== jobId))
      toast({
        title: "Success",
        description: "Job deleted successfully!",
      })
    } catch (error: any) {
      console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    jobs,
    isLoading,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs: fetchJobs
  }
}