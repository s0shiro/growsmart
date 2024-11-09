import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  id: string
  email: string | undefined
  fullName: string | null // Allow null
  avatarUrl: string | null // Allow null
  jobTitle: string | null // Allow null
  role: string | null // Allow null
  status: string | null // Allow null
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
