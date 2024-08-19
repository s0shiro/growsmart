type User = {
  id: string
  email: string
  full_name: string
  created_at: string
}

export type Member = {
  id: string
  created_at: string
  user_id: string
  role: 'technician' | 'admin'
  status: 'active' | 'resigned'
  users: User
}
