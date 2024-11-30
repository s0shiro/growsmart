'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Activity, Info, MoreHorizontal, TrendingUp } from 'lucide-react'
import { useSession } from '@/stores/useSession'
import { useGetTechniciansByCoordinator } from '@/hooks/users/useGetTechniciansByCoordinator'
import Link from 'next/link'

// Types
interface Technician {
  user_id: string
  status: string
  users: {
    email: string
    full_name: string
    job_title: string
    avatar_url: string
  }
}

// Utility function for searching technicians
function searchTechnicians(
  technicians: Technician[],
  searchTerm: string,
): Technician[] {
  const lowercasedTerm = searchTerm.toLowerCase()
  return technicians.filter(
    (technician) =>
      technician.users.full_name.toLowerCase().includes(lowercasedTerm) ||
      technician.users.email.toLowerCase().includes(lowercasedTerm) ||
      technician.users.job_title.toLowerCase().includes(lowercasedTerm),
  )
}

// TechnicianTable component
function TechnicianTable({
  technicians,
  isLoading,
  error,
}: {
  technicians: Technician[]
  isLoading: boolean
  error: Error | null
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (isLoading) return <div className='text-center py-4'>Loading...</div>
  if (error)
    return (
      <div className='text-center py-4 text-red-500'>
        Error: {error.message}
      </div>
    )

  const filteredTechnicians = searchTechnicians(technicians, searchTerm)
  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTechnicians = filteredTechnicians.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  return (
    <div className='space-y-4'>
      <Input
        placeholder='Search technicians...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='max-w-sm'
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTechnicians.map((technician) => (
            <TableRow key={technician.user_id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={technician.users.avatar_url}
                    alt={technician.users.full_name}
                  />
                  <AvatarFallback>
                    {technician.users.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className='font-medium'>
                {technician.users.full_name}
              </TableCell>
              <TableCell>{technician.users.email}</TableCell>
              <TableCell>{technician.users.job_title}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    technician.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {technician.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/technicians/${technician.user_id}`}>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='flex items-center'
                  >
                    <Activity className='mr-2 h-4 w-4' />
                    View Activity
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-between items-center'>
        <div>
          Showing {startIndex + 1} to{' '}
          {Math.min(startIndex + itemsPerPage, filteredTechnicians.length)} of{' '}
          {filteredTechnicians.length} technicians
        </div>
        <div className='space-x-2'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main TechniciansPage component
export default function TechniciansPage() {
  const user = useSession((state) => state.user)
  const { data, error, isFetching } = useGetTechniciansByCoordinator(user?.id)

  // Ensure data is an array
  const technicians: Technician[] = Array.isArray(data) ? data : []

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>My Technicians</h1>
      <TechnicianTable
        technicians={technicians}
        isLoading={isFetching}
        error={error}
      />
    </div>
  )
}
