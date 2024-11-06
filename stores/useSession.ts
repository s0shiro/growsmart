import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  id: string
  email: string | undefined
  fullName: string
  role: string
  status: string
  lastSignInAt: string | undefined
  jobTitle?: string
  avatarUrl?: string
}

interface SessionStore {
  user: UserData | null
  setUser: (user: UserData) => void
  clearUser: () => void
}

export const useSession = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-session',
    },
  ),
)
