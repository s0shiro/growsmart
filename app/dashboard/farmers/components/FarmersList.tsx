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
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useFetchAllFarmers from '@/hooks/farmer/useFetchAllFarmers'
import DownloadButton from '../../(components)/ui/DownloadButton'
import PrintButton from './PrintButton'

interface Farmer {
  id: string
  created_at: string
  user_id: string
  firstname: string
  lastname: string
  gender: string
  municipality: string
  barangay: string
  phone: string
  association_id: string | null
  position: string | null
  avatar: string | null
  rsbsa_number: number
  farmer_associations: {
    id: string
    position: string
    association: {
      id: string
      name: string
    }
  }[]
}

export default function FarmerList() {
  const { data: farmers, error, isLoading } = useFetchAllFarmers()
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [associationFilter, setAssociationFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')

  const itemsPerPage = 5

  const filteredFarmers = useMemo(() => {
    return (
      farmers?.filter(
        (farmer) =>
          (
            farmer.firstname.toLowerCase() +
            ' ' +
            farmer.lastname.toLowerCase()
          ).includes(searchTerm.toLowerCase()) &&
          (associationFilter === 'all' ||
            farmer.farmer_associations.some(
              (assoc) => assoc.association.name === associationFilter,
            )) &&
          (positionFilter === 'all' ||
            farmer.farmer_associations.some(
              (assoc) => assoc.position === positionFilter,
            )),
      ) || []
    )
  }, [farmers, searchTerm, associationFilter, positionFilter])

  const paginatedFarmers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredFarmers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredFarmers, currentPage])

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage)

  const associations = useMemo(
    () => [
      'all',
      ...new Set(
        farmers?.flatMap((farmer) =>
          farmer.farmer_associations.map((assoc) => assoc.association.name),
        ) || [],
      ),
    ],
    [farmers],
  )

  const positions = useMemo(
    () => [
      'all',
      ...new Set(
        farmers?.flatMap((farmer) =>
          farmer.farmer_associations.map((assoc) => assoc.position),
        ) || [],
      ),
    ],
    [farmers],
  )

  if (error) return <ErrorDisplay error={error} />

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Farmers List</h2>
          <p className='text-muted-foreground'>
            A comprehensive list of all registered farmers
          </p>
        </div>

        <PrintButton farmers={farmers || []} />
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <Input
          placeholder='Search by name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='sm:w-1/3'
        />
        <Select value={associationFilter} onValueChange={setAssociationFilter}>
          <SelectTrigger className='sm:w-1/3'>
            <SelectValue placeholder='Filter by Association' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Associations</SelectItem>
            {associations
              .filter((assoc) => assoc !== 'all')
              .map((assoc) => (
                <SelectItem key={assoc} value={assoc || ''}>
                  {assoc}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className='sm:w-1/3'>
            <SelectValue placeholder='Filter by Position' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Positions</SelectItem>
            {positions
              .filter((pos) => pos !== 'all')
              .map((pos) => (
                <SelectItem key={pos} value={pos || ''}>
                  {pos?.replace('_', ' ') || ''}
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
                      <TableCell>
                        <Skeleton className='h-4 w-[200px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[120px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-[100px]' />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={farmer?.avatar || undefined}
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
                      <TableCell>{farmer.municipality}</TableCell>
                      <TableCell>{farmer.barangay}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setSelectedFarmer(farmer)}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='sm:max-w-[425px]'>
                            <DialogHeader>
                              <DialogTitle>Farmer Details</DialogTitle>
                              <DialogDescription>
                                Comprehensive information about the farmer
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFarmer && (
                              <div className='grid gap-4 py-4'>
                                <div className='flex items-center space-x-4'>
                                  <Avatar className='w-20 h-20'>
                                    <AvatarImage
                                      src={selectedFarmer.avatar || undefined}
                                      alt={`${selectedFarmer.firstname} ${selectedFarmer.lastname}`}
                                    />
                                    <AvatarFallback>
                                      {selectedFarmer.firstname[0]}
                                      {selectedFarmer.lastname[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className='font-semibold text-lg'>
                                      {selectedFarmer.firstname}{' '}
                                      {selectedFarmer.lastname}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                      {selectedFarmer.gender}
                                    </p>
                                  </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div>
                                    <p className='text-sm font-medium'>
                                      Associations
                                    </p>
                                    <ul className='text-sm text-muted-foreground'>
                                      {selectedFarmer.farmer_associations.map(
                                        (assoc, index) => (
                                          <li key={index}>
                                            {assoc.association.name} (
                                            {assoc.position.replace('_', ' ')})
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className='text-sm font-medium'>Phone</p>
                                    <p className='text-sm text-muted-foreground'>
                                      {selectedFarmer.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <p className='text-sm font-medium'>
                                      Location
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                      {selectedFarmer.barangay},{' '}
                                      {selectedFarmer.municipality}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className='text-sm font-medium'>
                                    RSBSA Number
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {selectedFarmer.rsbsa_number}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      {!isLoading && filteredFarmers.length === 0 && (
        <div className='text-center py-4 text-muted-foreground'>
          No farmers found matching the current filters.
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

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className='rounded-md border border-destructive p-4'>
      <h2 className='text-lg font-semibold text-destructive mb-2'>Error</h2>
      <p>An error occurred while fetching farmer data: {error.message}</p>
    </div>
  )
}
