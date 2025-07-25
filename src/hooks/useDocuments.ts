import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface Document {
  id: string
  user_id: string
  title: string
  type: string
  content: string | null
  file_url: string | null
  version: number
  is_current: boolean
  created_at: string
  updated_at: string
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createDocument = async (docData: Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{ ...docData, user_id: user!.id }])
        .select()
        .single()

      if (error) throw error
      
      setDocuments(prev => [data, ...prev])
      toast({
        title: "Success",
        description: "Document added successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error creating document:', error)
      toast({
        title: "Error",
        description: "Failed to add document. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateDocument = async (docId: string, updates: Partial<Document>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', docId)
        .select()
        .single()

      if (error) throw error

      setDocuments(prev => prev.map(doc => doc.id === docId ? data : doc))
      toast({
        title: "Success",
        description: "Document updated successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error updating document:', error)
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteDocument = async (docId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)

      if (error) throw error

      setDocuments(prev => prev.filter(doc => doc.id !== docId))
      toast({
        title: "Success",
        description: "Document deleted successfully!",
      })
    } catch (error: any) {
      console.error('Error deleting document:', error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments
  }
}