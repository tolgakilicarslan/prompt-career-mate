import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages = [], context = {} }: { messages?: ChatMessage[]; context?: any } = await req.json()

    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!apiKey) {
      console.error('GOOGLE_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Server misconfigured: GOOGLE_API_KEY is missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build contextual prompt
    const systemPreamble = `You are an expert AI career assistant. Provide concise, actionable guidance. 
Prioritize clarity, bullet points, and step-by-step suggestions. 
Use the provided user context (documents and jobs) when relevant. If context is missing, ask a clarifying question.`

    const docs = Array.isArray(context?.documents) ? context.documents : []
    const jobs = Array.isArray(context?.jobs) ? context.jobs : []

    const docsSummary = docs.slice(0, 5).map((d: any, i: number) => `#${i + 1} ${d.title || 'Untitled'} [${d.type || 'document'}]${d.is_current ? ' (current)' : ''}`).join('\n') || 'None'
    const jobsSummary = jobs.slice(0, 5).map((j: any, i: number) => `#${i + 1} ${j.title || 'Role'} at ${j.company || 'Company'} (status: ${j.status || 'unknown'})`).join('\n') || 'None'

    const conversation = (messages as ChatMessage[]).slice(-10).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')

    const finalPrompt = `${systemPreamble}\n\nUSER CONTEXT\nDocuments:\n${docsSummary}\n\nJobs:\n${jobsSummary}\n\nCONVERSATION\n${conversation}\n\nRespond as the assistant with helpful, specific advice.`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: finalPrompt }]
            }
          ]
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', response.status, errText)
      return new Response(
        JSON.stringify({ error: 'Failed to generate content from Gemini' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Extract text safely
    let reply = 'Sorry, I could not generate a response.'
    try {
      const candidate = data?.candidates?.[0]
      const parts = candidate?.content?.parts
      if (Array.isArray(parts) && parts.length > 0 && typeof parts[0]?.text === 'string') {
        reply = parts.map((p: any) => p.text).join('\n')
      } else if (typeof candidate?.content?.text === 'string') {
        reply = candidate.content.text
      }
    } catch (e) {
      console.error('Error extracting Gemini response:', e)
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})