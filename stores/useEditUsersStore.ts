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
  isDialogOpen: boolean
  setMember: (member: Member) => void
  setDialogOpen: (open: boolean) => void
  updateBasic: (data: { full_name: string; jobTitle: string }) => Promise<{
    success: boolean
    error?: string
  }>
  updateAccount: (data: { password?: string; confirm?: string }) => Promise<{
    success: boolean
    error?: string
  }>
  updateAdvance: (data: {
    role: 'technician' | 'admin' | 'program coordinator'
    status: 'active' | 'resigned'
    coordinatorId?: string
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
  isDialogOpen: false,
  setDialogOpen: (open) => set({ isDialogOpen: open }),

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
      if (response.error) {
        throw new Error(response.error)
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      }
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

      // Update local state including coordinator_id
      set((state) => ({
        member: state.member
          ? {
              ...state.member,
              role: data.role,
              status: data.status,
              coordinator_id:
                data.role === 'technician' ? data.coordinatorId : null,
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

  reset: () =>
    set({
      member: null,
      error: null,
      isDialogOpen: false,
    }),
}))
