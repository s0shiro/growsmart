'use client'

import React, { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
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
import { useUsersStore } from '@/stores/usersStore'
import UserDetails from './UserDetails'
import TableSkeleton from './TableSkeleton'
import { useReadUsers } from '@/hooks/users/useReadUsers'
import Link from 'next/link'

export default function UsersTable() {
  const {
    members,
    filteredMembers,
    searchTerm,
    roleFilter,
    statusFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    setMembers,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setCurrentPage,
  } = useUsersStore()

  const { data, error, isLoading } = useReadUsers()

  useEffect(() => {
    if (data) {
      setMembers(data)
    }
  }, [data, setMembers])

  const roles = React.useMemo(
    () => ['all', ...new Set(members.map((member) => member.role))],
    [members],
  )

  const statuses = React.useMemo(
    () => ['all', ...new Set(members.map((member) => member.status))],
    [members],
  )

  const paginatedMembers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

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
          onChange={(e) => setSearchTerm(e.target.value)}
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
              {isLoading ? (
                <TableSkeleton itemsPerPage={itemsPerPage} />
              ) : (
                paginatedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={member.users.avatar_url}
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
                        className={getRoleColor(member.role)}
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
                        {/* <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='sm:max-w-[425px]'>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            <UserDetails user={member} />
                          </DialogContent>
                        </Dialog> */}
                        {/* <Link href={`/dashboard/users/${member.id}`}>
                          <Button variant='ghost' size='icon' asChild>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link> */}
                        <EditMember permission={member} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      {!isLoading && paginatedMembers.length === 0 && (
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
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={isLoading || currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={
              isLoading ||
              currentPage === totalPages ||
              filteredMembers.length === 0
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

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500'
    case 'resigned':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case 'admin':
      return 'border-green-500 text-green-500'
    case 'technician':
      return 'border-yellow-500 text-yellow-500'
    default:
      return 'border-gray-500 text-gray-500'
  }
}
