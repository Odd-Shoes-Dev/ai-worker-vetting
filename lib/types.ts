export interface JobRole {
  id: string
  title: string
  icon: string
  tasks: string[]
}

export interface Message {
  role: 'assistant' | 'user'
  content: string
}

export interface Evaluation {
  score: number
  strengths: string[]
  concerns: string[]
  summary: string
  recommendation: 'Strong Fit' | 'Possible Fit' | 'Not Recommended'
}

export interface InterviewSession {
  jobRole: JobRole
  cvText: string
}
