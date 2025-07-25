import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/AuthForm"
import { useAuth } from "@/contexts/AuthContext"

const Auth = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <AuthForm onAuthSuccess={() => navigate("/")} />
}

export default Auth