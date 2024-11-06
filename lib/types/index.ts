type User = {
  id: string
  email: string
  full_name: string
  created_at: string
  job_title?: string
}

export type Member = {
  id: string
  created_at: string
  user_id: string
  role: 'technician' | 'admin' | 'program coordinator'
  status: 'active' | 'resigned'
  users: User
  user_metadata?: {
    jobTitle?: string
    full_name: string
    avatarUrl?: string
  }
}
