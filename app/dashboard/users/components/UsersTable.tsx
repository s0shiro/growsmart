'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, getInitials } from '@/lib/utils'
import EditMember from './edit/EditMember'
import CreateMember from './create/CreateMember'
import { Member } from '@/lib/types'

export default function UsersTable() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [selectedUser, setSelectedUser] = useState<Member | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const itemsPerPage = 5

  const fetchMembers = async () => {
    const response = await fetch('/api/members')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  const { data, error, isLoading } = useQuery<Member[], Error>({
    queryKey: ['members'],
    queryFn: fetchMembers,
  })

  useEffect(() => {
    if (data) {
      setMembers(data)
      setFilteredMembers(data)
    }
  }, [data])

  const handleSearch = useCallback(
    (term: string) => {
      const filtered = members.filter(
        (member) =>
          member.users.full_name?.toLowerCase().includes(term.toLowerCase()) ||
          member.role.toLowerCase().includes(term.toLowerCase()) ||
          member.status?.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredMembers(filtered)
      setCurrentPage(1)
    },
    [members],
  )

  const filteredAndSortedMembers = useMemo(() => {
    return filteredMembers.filter(
      (member) =>
        (roleFilter === 'all' || member.role === roleFilter) &&
        (statusFilter === 'all' || member.status === statusFilter),
    )
  }, [filteredMembers, roleFilter, statusFilter])

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedMembers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedMembers, currentPage])

  const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage)

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    handleSearch(term)
  }

  const roles = useMemo(
    () => ['all', ...new Set(members.map((member) => member.role))],
    [members],
  )

  const statuses = useMemo(
    () => ['all', ...new Set(members.map((member) => member.status))],
    [members],
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'resigned':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'border-green-500 text-green-500'
      case 'technician':
        return 'border-yellow-500 text-yellow-500'
      default:
        return 'border-gray-500 text-gray-500'
    }
  }

  if (error) return <ErrorDisplay error={error} />

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Users List</h2>
          <p className='text-muted-foreground'>
            A comprehensive list of all registered users
          </p>
        </div>
        <CreateMember />
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <Input
          placeholder='Search by name'
          value={searchTerm}
          onChange={onSearchChange}
          className='sm:w-1/3'
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className='sm:w-1/3'>
            <SelectValue placeholder='Filter by Role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Roles</SelectItem>
            {roles
              .filter((role) => role !== 'all')
              .map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='sm:w-1/3'>
            <SelectValue placeholder='Filter by Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Statuses</SelectItem>
            {statuses
              .filter((status) => status !== 'all')
              .map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <ScrollArea className='w-full whitespace-nowrap'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className='h-10 w-10 rounded-full' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[200px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[120px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-[100px]' />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={
                              member.users.avatar_url ??
                              '/images/default-avatar.png'
                            }
                            alt={member.users.full_name || 'User'}
                            className='object-cover'
                          />
                          <AvatarFallback className='bg-muted'>
                            {getInitials(member.users.full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{member.users.full_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={`${getRoleColor(member.role)}`}
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(member.status)} text-white`}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(member.created_at)}</TableCell>
                      <TableCell>
                        <div className='flex space-x-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => setSelectedUser(member)}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[425px]'>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className='grid gap-4 py-4'>
                                  <div className='flex items-center space-x-4'>
                                    <Avatar className='w-20 h-20'>
                                      <AvatarImage
                                        src={
                                          member.users.avatar_url ??
                                          '/images/default-avatar.png'
                                        }
                                        alt={member.users.full_name || 'User'}
                                        className='object-cover'
                                      />
                                      <AvatarFallback>
                                        {selectedUser.users.full_name?.charAt(
                                          0,
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className='font-semibold text-lg'>
                                        {selectedUser.users.full_name}
                                      </h3>
                                      <p className='text-sm text-muted-foreground'>
                                        {selectedUser.users.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                      <p className='text-sm font-medium'>
                                        Role
                                      </p>
                                      <p className='text-sm text-muted-foreground'>
                                        {selectedUser.role}
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-sm font-medium'>
                                        Status
                                      </p>
                                      <p className='text-sm text-muted-foreground'>
                                        {selectedUser.status}
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-sm font-medium'>
                                        Joined
                                      </p>
                                      <p className='text-sm text-muted-foreground'>
                                        {new Date(
                                          selectedUser.created_at,
                                        ).toDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <EditMember permission={member} />

                          {/* <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDeleteUser(member)}
                          >
                            <Trash className='h-4 w-4' />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      {!isLoading && filteredAndSortedMembers.length === 0 && (
        <div className='text-center py-4 text-muted-foreground'>
          No users found matching the current filters.
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div>
          {isLoading ? (
            <Skeleton className='h-4 w-[100px]' />
          ) : (
            <p className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={isLoading || currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={
              isLoading ||
              currentPage === totalPages ||
              filteredAndSortedMembers.length === 0
            }
          >
            Next
            <ChevronRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className='rounded-md border border-destructive p-4'>
      <h2 className='text-lg font-semibold text-destructive mb-2'>Error</h2>
      <p>An error occurred while fetching user data: {error.message}</p>
    </div>
  )
}
