'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react'
import useFetchFarmersByUserId from '@/hooks/farmer/useFetchFarmersByUserId'
import Link from 'next/link'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import CreateFarmerForm from '@/app/dashboard/myfarmers/components/CreateFarmerForm'
import { Skeleton } from '@/components/ui/skeleton'

type FilterValue = string | null

export default function FarmerUI() {
  const { data: farmersData, isLoading } = useFetchFarmersByUserId()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAssociation, setFilterAssociation] = useState<FilterValue>(null)
  const [filterPosition, setFilterPosition] = useState<FilterValue>(null)

  const itemsPerPage = 5

  const filteredFarmers = useMemo(() => {
    return (
      farmersData?.filter(
        (farmer: any) =>
          (farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.lastname.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterAssociation === null ||
            filterAssociation === 'all' ||
            farmer.association.name === filterAssociation) &&
          (filterPosition === null ||
            filterPosition === 'all' ||
            farmer.position === filterPosition),
      ) || []
    )
  }, [farmersData, searchTerm, filterAssociation, filterPosition])

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const associations = useMemo(
    () => [
      'all',
      ...new Set(farmersData?.map((farmer: any) => farmer.association.name)),
    ],
    [farmersData],
  )

  const positions = useMemo(
    () => [
      'all',
      ...new Set(farmersData?.map((farmer: any) => farmer.position)),
    ],
    [farmersData],
  )

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Farmers</h1>
        <DialogForm
          id='create-trigger'
          title='Add Farmer'
          description='Add a new farmer to your list.'
          Trigger={
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Farmer
            </Button>
          }
          form={<CreateFarmerForm />}
        />
      </div>

      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <Input
          placeholder='Search by name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='md:w-1/3'
          disabled={isLoading}
        />
        <Select
          value={filterAssociation || undefined}
          onValueChange={(value: string) =>
            setFilterAssociation(value === 'all' ? null : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger className='md:w-1/3'>
            <SelectValue placeholder='Filter by Association' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Associations</SelectItem>
            {associations
              .filter((assoc) => assoc !== 'all')
              .map((assoc) => (
                <SelectItem key={assoc} value={assoc}>
                  {assoc}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select
          value={filterPosition || undefined}
          onValueChange={(value: string) =>
            setFilterPosition(value === 'all' ? null : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger className='md:w-1/3'>
            <SelectValue placeholder='Filter by Position' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Positions</SelectItem>
            {positions
              .filter((pos) => pos !== 'all')
              .map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos.replace('_', ' ')}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className='w-full whitespace-nowrap rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead>Barangay</TableHead>
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
                  <TableCell><Skeleton className='h-4 w-[200px]' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-[150px]' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-[100px]' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-[120px]' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-[100px]' /></TableCell>
                  <TableCell><Skeleton className='h-8 w-[100px]' /></TableCell>
                </TableRow>
              ))
              : paginatedFarmers.map((farmer: any) => (
                <TableRow key={farmer.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={farmer.avatar}
                        alt={`${farmer.firstname} ${farmer.lastname}`}
                      />
                      <AvatarFallback>
                        {farmer.firstname[0]}
                        {farmer.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    {farmer.firstname} {farmer.lastname}
                  </TableCell>
                  <TableCell>{farmer.association.name}</TableCell>
                  <TableCell>{farmer.position.replace('_', ' ')}</TableCell>
                  <TableCell>{farmer.municipality}</TableCell>
                  <TableCell>{farmer.barangay}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/${farmer.id}`} passHref>
                      <Button variant='ghost' size='sm'>
                        <Eye className='mr-2 h-4 w-4' />
                        View Profile
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {!isLoading && filteredFarmers.length === 0 && (
        <div className='text-center py-4'>
          No farmers found matching the current filters.
        </div>
      )}

      <div className='flex justify-between items-center mt-4'>
        <div>
          {isLoading ? (
            <Skeleton className='h-4 w-[100px]' />
          ) : (
            `Page ${currentPage} of ${totalPages}`
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={isLoading || currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={
              isLoading ||
              currentPage === totalPages ||
              filteredFarmers.length === 0
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