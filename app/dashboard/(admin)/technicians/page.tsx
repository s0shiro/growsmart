'use client'

import { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, MoreHorizontal, Search } from 'lucide-react'
import { useGetTechnicians } from '@/hooks/users/useGetTechnicians'
import Link from 'next/link'

type Technician = {
  user_id: string
  status: string
  users: {
    email: string
    full_name: string
    job_title: string | null
    avatar_url: string | null
  }
}

const ITEMS_PER_PAGE = 6

export default function TechniciansPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading, error } = useGetTechnicians()

  const technicians: Technician[] = data || []

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const fullName = technician.users.full_name.toLowerCase()
      const email = technician.users.email.toLowerCase()
      const query = searchQuery.toLowerCase()
      return fullName.includes(query) || email.includes(query)
    })
  }, [technicians, searchQuery])

  const totalPages = Math.ceil(filteredTechnicians.length / ITEMS_PER_PAGE)

  const paginatedTechnicians = filteredTechnicians.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  if (isLoading) return <TechniciansListSkeleton />
  if (error) return <div>Error loading technicians: {error.message}</div>

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Technicians List</h1>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search by name or email'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>
      {filteredTechnicians.length === 0 ? (
        <Card>
          <CardContent className='py-10'>
            <p className='text-center text-muted-foreground'>
              No technicians found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6'>
            {paginatedTechnicians.map((technician) => (
              <Card key={technician.user_id}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarImage
                        src={technician.users.avatar_url || undefined}
                        alt={technician.users.full_name}
                      />
                      <AvatarFallback>
                        {technician.users.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-sm font-medium'>
                        {technician.users.full_name}
                      </CardTitle>
                      <p className='text-sm text-muted-foreground'>
                        {technician.users.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/technicians/${technician.user_id}`}
                          className='flex items-center'
                        >
                          <Activity className='mr-2 h-4 w-4' />
                          View Activity
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col gap-2'>
                    <p className='text-sm font-medium'>
                      Job Title: {technician.users.job_title || 'Not specified'}
                    </p>
                    <Badge
                      variant={
                        technician.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {technician.status.charAt(0).toUpperCase() +
                        technician.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href='#'
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  )
}

function TechniciansListSkeleton() {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Skeleton className='w-[250px] h-[36px]' />
        <Skeleton className='w-64 h-[36px]' />
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center space-x-4'>
                <Skeleton className='w-10 h-10 rounded-full' />
                <div>
                  <Skeleton className='w-[150px] h-[20px] mb-2' />
                  <Skeleton className='w-[200px] h-[16px]' />
                </div>
              </div>
              <Skeleton className='w-8 h-8 rounded-full' />
            </CardHeader>
            <CardContent>
              <Skeleton className='w-[120px] h-[16px] mb-2' />
              <Skeleton className='w-[80px] h-[24px]' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
