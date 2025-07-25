import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobSearchParams {
  query: string
  location?: string
  jobType?: string
  page?: number
}

interface JobResult {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: string
  type: string
  postedDate: string
  url?: string
  source: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location, jobType, page = 1 }: JobSearchParams = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Searching for jobs: ${query} in ${location || 'any location'}`)

    // In a real implementation, you would integrate with job APIs like:
    // - Indeed API
    // - LinkedIn API
    // - Glassdoor API
    // - RemoteOK API
    // - AngelList API

    // For now, we'll generate realistic mock data based on the search
    const mockJobs: JobResult[] = generateMockJobs(query, location, jobType, page)

    return new Response(
      JSON.stringify({
        jobs: mockJobs,
        total: mockJobs.length,
        page,
        hasMore: page < 3
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error searching jobs:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateMockJobs(query: string, location?: string, jobType?: string, page = 1): JobResult[] {
  const companies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla',
    'Stripe', 'Airbnb', 'Uber', 'SpaceX', 'OpenAI', 'Anthropic', 'GitHub',
    'Shopify', 'Zoom', 'Slack', 'Notion', 'Figma', 'Linear'
  ]

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
    'Boston, MA', 'Denver, CO', 'Remote', 'Los Angeles, CA', 'Chicago, IL'
  ]

  const jobTitles = {
    developer: ['Senior Software Engineer', 'Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'React Developer'],
    designer: ['Senior Product Designer', 'UX Designer', 'UI/UX Designer', 'Visual Designer', 'Design Systems Lead'],
    manager: ['Product Manager', 'Engineering Manager', 'Technical Program Manager', 'Data Product Manager'],
    data: ['Data Scientist', 'Machine Learning Engineer', 'Data Engineer', 'Research Scientist'],
    marketing: ['Marketing Manager', 'Growth Marketing Manager', 'Content Marketing Manager', 'Digital Marketing Specialist']
  }

  const getRelevantTitles = (searchQuery: string): string[] => {
    const lowerQuery = searchQuery.toLowerCase()
    if (lowerQuery.includes('develop') || lowerQuery.includes('engineer') || lowerQuery.includes('react') || lowerQuery.includes('frontend') || lowerQuery.includes('backend')) {
      return jobTitles.developer
    } else if (lowerQuery.includes('design') || lowerQuery.includes('ux') || lowerQuery.includes('ui')) {
      return jobTitles.designer
    } else if (lowerQuery.includes('manager') || lowerQuery.includes('product')) {
      return jobTitles.manager
    } else if (lowerQuery.includes('data') || lowerQuery.includes('ml') || lowerQuery.includes('machine learning')) {
      return jobTitles.data
    } else if (lowerQuery.includes('marketing') || lowerQuery.includes('growth')) {
      return jobTitles.marketing
    }
    return [...jobTitles.developer, ...jobTitles.designer, ...jobTitles.manager]
  }

  const relevantTitles = getRelevantTitles(query)
  const jobs: JobResult[] = []

  for (let i = 0; i < 8; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const title = relevantTitles[Math.floor(Math.random() * relevantTitles.length)]
    const jobLocation = location || locations[Math.floor(Math.random() * locations.length)]
    const salaryRanges = ['$80k - $120k', '$100k - $150k', '$120k - $180k', '$150k - $220k', '$180k - $280k']
    const types = ['Full-time', 'Part-time', 'Contract', 'Remote']
    
    const postedDays = Math.floor(Math.random() * 30) + 1
    const postedDate = `${postedDays} day${postedDays > 1 ? 's' : ''} ago`

    jobs.push({
      id: `${page}-${i}`,
      title,
      company,
      location: jobLocation,
      description: `Join ${company} as a ${title}. We're looking for someone with expertise in ${query} to help build amazing products. This role offers excellent growth opportunities and the chance to work with cutting-edge technology.`,
      salary: salaryRanges[Math.floor(Math.random() * salaryRanges.length)],
      type: jobType || types[Math.floor(Math.random() * types.length)],
      postedDate,
      url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
      source: 'Indeed'
    })
  }

  return jobs
}