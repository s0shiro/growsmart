import { create } from 'zustand'
import { Member } from '@/lib/types'
import {
  updateMemberBasicById,
  updateAccountById,
  updateMemberAdvanceAndMetadataById,
} from '@/app/dashboard/users/actions'

interface EditMemberStore {
  member: Member | null
  isLoading: boolean
  error: string | null
  setMember: (member: Member) => void
  updateBasic: (data: { full_name: string; jobTitle: string }) => Promise<{
    success: boolean
    error?: string
  }>
  updateAccount: (data: { password?: string; confirm?: string }) => Promise<{
    success: boolean
    error?: string
  }>
  updateAdvance: (data: {
    role: 'technician' | 'admin'
    status: 'active' | 'resigned'
  }) => Promise<{
    success: boolean
    error?: string
  }>
  reset: () => void
}

export const useEditMemberStore = create<EditMemberStore>((set, get) => ({
  member: null,
  isLoading: false,
  error: null,

  setMember: (member) => set({ member }),

  updateBasic: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = JSON.parse(
        await updateMemberBasicById(get().member?.user_id!, data),
      )
      if (error) throw error
      set((state) => ({
        member: state.member
          ? {
              ...state.member,
              users: { ...state.member.users, ...data },
            }
          : null,
      }))
      return { success: true }
    } catch (error) {
      set({ error: (error as Error).message })
      return { success: false, error: (error as Error).message }
    } finally {
      set({ isLoading: false })
    }
  },

  updateAccount: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = JSON.parse(
        await updateAccountById(get().member?.user_id!, data),
      )
      if (response.error) throw response.error
      return { success: true }
    } catch (error) {
      set({ error: (error as Error).message })
      return { success: false, error: (error as Error).message }
    } finally {
      set({ isLoading: false })
    }
  },

  updateAdvance: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = JSON.parse(
        await updateMemberAdvanceAndMetadataById(
          get().member?.id!,
          get().member?.user_id!,
          data,
        ),
      )
      if (response.error) throw response.error
      set((state) => ({
        member: state.member ? { ...state.member, ...data } : null,
      }))
      return { success: true }
    } catch (error) {
      set({ error: (error as Error).message })
      return { success: false, error: (error as Error).message }
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () => set({ member: null, error: null }),
}))