import { create } from 'zustand'
import { Member } from '@/lib/types'

interface UsersState {
  members: Member[]
  filteredMembers: Member[]
  paginatedMembers: Member[]
  searchTerm: string
  roleFilter: string
  statusFilter: string
  currentPage: number
  itemsPerPage: number
  totalPages: number
  setMembers: (members: Member[]) => void
  setSearchTerm: (term: string) => void
  setRoleFilter: (role: string) => void
  setStatusFilter: (status: string) => void
  setCurrentPage: (page: number) => void
  filterMembers: () => void
}

export const useUsersStore = create<UsersState>((set, get) => ({
  members: [],
  filteredMembers: [],
  paginatedMembers: [],
  searchTerm: '',
  roleFilter: 'all',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 5,
  totalPages: 1,

  setMembers: (members) => {
    set({ members })
    get().filterMembers()
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term })
    get().filterMembers()
  },

  setRoleFilter: (role) => {
    set({ roleFilter: role, currentPage: 1 })
    get().filterMembers()
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 })
    get().filterMembers()
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  filterMembers: () => {
    const {
      members,
      searchTerm,
      roleFilter,
      statusFilter,
      itemsPerPage,
      currentPage,
    } = get()
    let filtered = members.filter(
      (member) =>
        member.users.full_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.status?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => member.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((member) => member.status === statusFilter)
    }

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedMembers = filtered.slice(
      startIndex,
      startIndex + itemsPerPage,
    )

    set({ filteredMembers: filtered, totalPages, paginatedMembers })
  },
}))
