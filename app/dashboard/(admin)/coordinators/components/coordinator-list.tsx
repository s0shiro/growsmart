'use client'

import { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Eye, MoreHorizontal, Search } from 'lucide-react'
import { useGetCoordinators } from '@/hooks/users/useGetCoordinators'
import Link from 'next/link'

type Coordinator = {
  user_id: string
  users: {
    email: string
    full_name: string
    program_type: { name: string }
    avatar_url: string
  }
}

const ITEMS_PER_PAGE = 9 // 3x3 grid

export function CoordinatorList() {
  const { data, isLoading } = useGetCoordinators()
  const [selectedProgramType, setSelectedProgramType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  // Safely cast data to Coordinator array with fallback
  const coordinators: Coordinator[] = data || []

  const programTypes = useMemo(() => {
    const types = new Set(coordinators.map((c) => c.users.program_type.name))
    return ['all', ...Array.from(types)]
  }, [coordinators])

  const filteredCoordinators = useMemo(() => {
    return coordinators.filter((coordinator) => {
      const matchesProgram =
        selectedProgramType === 'all' ||
        coordinator.users.program_type.name === selectedProgramType
      const matchesSearch =
        searchQuery === '' ||
        coordinator.users.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        coordinator.users.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      return matchesProgram && matchesSearch
    })
  }, [coordinators, selectedProgramType, searchQuery])

  const paginatedCoordinators = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCoordinators.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredCoordinators, currentPage])

  const totalPages = Math.ceil(filteredCoordinators.length / ITEMS_PER_PAGE)

  if (isLoading) {
    return <div>Loading coordinators...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Program Coordinators</h2>
        <div className='flex space-x-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search by name or email'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-8'
            />
          </div>
          <Select
            value={selectedProgramType}
            onValueChange={setSelectedProgramType}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by program' />
            </SelectTrigger>
            <SelectContent>
              {programTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {paginatedCoordinators.map((coordinator) => (
          <Card key={coordinator.user_id}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {coordinator.users.full_name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/coordinators/${coordinator.user_id}`}
                      className='flex items-center'
                    >
                      <Eye className='mr-2 h-4 w-4' />
                      View Technicians
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={coordinator.users.avatar_url}
                    alt={coordinator.users.full_name}
                  />
                  <AvatarFallback>
                    {coordinator.users.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {coordinator.users.email}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Program Type: {coordinator.users.program_type.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
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
    </div>
  )
}
