'use client'

import React, { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Building2,
} from 'lucide-react'
import useReadAssociation from '@/hooks/association/useReadAssociations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import MembersCount from './MembersCount'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AssociationForm from './create/AssociationForm'
import DialogForm from '../../(components)/forms/DialogForm'

type Association = {
  id: string
  name: string | null
}

interface Filters {
  associationName: string
}

export default function AssociationTable() {
  const { data, error, isLoading } = useReadAssociation()
  const allAssociations: Association[] = data ? (data as Association[]) : []

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({
    associationName: 'all',
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const associationNames = useMemo(() => {
    return [
      'all',
      ...new Set(
        allAssociations.map(
          (association) => association.name ?? 'Unnamed Association',
        ),
      ),
    ]
  }, [allAssociations])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (type: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      associationName: 'all',
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const filteredAssociations = useMemo(() => {
    return allAssociations.filter((association) => {
      return (
        (association.name ?? 'Unnamed Association')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (filters.associationName === 'all' ||
          association.name === filters.associationName)
      )
    })
  }, [allAssociations, searchTerm, filters])

  const pageCount = Math.ceil(filteredAssociations.length / itemsPerPage)
  const paginatedAssociations = filteredAssociations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-destructive">Error: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='bg-background'>
      <Card className='w-full max-w-6xl mx-auto shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
          <div>
            <CardTitle className='text-3xl font-bold'>
              Associations Dashboard
            </CardTitle>
            <CardDescription className='text-muted-foreground mt-1'>
              Manage and monitor farmer associations
            </CardDescription>
          </div>
          <DialogForm
            id='create-trigger'
            description='Add a new farmer association to the system'
            title='Add Association'
            Trigger={
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                <Plus className='mr-2 h-4 w-4' /> Add Association
              </Button>
            }
            form={<AssociationForm />}
          />
        </CardHeader>
        <CardContent>
          <div className='mb-8'>
            <Card className='w-full sm:w-64'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Associations
                </CardTitle>
                <Building2 className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>{allAssociations.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
              <div className='relative flex-grow'>
                <Input
                  placeholder='Search associations...'
                  value={searchTerm}
                  onChange={handleSearch}
                  className='pl-10'
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
              </div>
              <div className='flex flex-wrap gap-2'>
                <Select
                  value={filters.associationName}
                  onValueChange={(value) =>
                    handleFilterChange('associationName', value)
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='All Associations' />
                  </SelectTrigger>
                  <SelectContent>
                    {associationNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(Object.values(filters).some((filter) => filter !== 'all') || searchTerm) && (
                  <Button
                    variant='outline'
                    onClick={clearFilters}
                    className='flex items-center'
                  >
                    <X className='mr-2 h-4 w-4' /> Clear Filters
                  </Button>
                )}
              </div>
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[50%]'>Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssociations.map((association, index) => (
                    <TableRow
                      key={association.id}
                      className={index % 2 === 0 ? 'bg-muted/50' : ''}
                    >
                      <TableCell className='font-medium'>
                        {association.name ?? 'Unnamed Association'}
                      </TableCell>
                      <TableCell>
                        <MembersCount associationID={association.id} />
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <span className='sr-only'>Open menu</span>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/association/${association.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Association</DropdownMenuItem>
                            <DropdownMenuItem>Manage Members</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                Showing{' '}
                {Math.min(
                  filteredAssociations.length,
                  (currentPage - 1) * itemsPerPage + 1,
                )}{' '}
                to{' '}
                {Math.min(
                  filteredAssociations.length,
                  currentPage * itemsPerPage,
                )}{' '}
                of {filteredAssociations.length} entries
              </p>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='h-4 w-4 mr-2' />
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(pageCount, prev + 1))
                  }
                  disabled={currentPage === pageCount}
                >
                  Next
                  <ChevronRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}