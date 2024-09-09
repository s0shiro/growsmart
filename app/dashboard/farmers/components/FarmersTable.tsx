'use client'

import { useState } from 'react'
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Filter,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import useFetchAllFarmers from '@/hooks/farmer/useFetchAllFarmers'
import useFetchAssociations from '@/hooks/association/useFetchAssociations'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import DialogForm from '../../(components)/DialogForm'

import Link from 'next/link'

import FarmerFilters from './FarmerFilters'
import { Label } from '@/components/ui/label'
import AssociationName from '../../myfarmers/components/AssociationName'
import PlantingForm from '../../myfarmers/components/PlantingForm'
import ReusableTable from '../../(components)/ui/ReusableTable'
import CreateFarmerForm from '../../myfarmers/components/CreateFarmerForm'

type Farmer = {
  id: string
  user_id: string
  firstname: string
  lastname: string
  gender: string
  municipality: string
  barangay: string
  phone: string
  created_at: string
  association_id: string
  position: string
}

type Association = {
  id: string
  name: string
}

const FarmersTable = () => {
  const { data: farmersData } = useFetchAllFarmers()
  const { data: associationsData } = useFetchAssociations()
  const farmers: Farmer[] = (farmersData as Farmer[]) || []
  const associations: Association[] = (associationsData as Association[]) || []

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const [municipalityFilter, setMunicipalityFilter] = useState('All')
  const [associationFilter, setAssociationFilter] = useState('All')
  const [positionFilter, setPositionFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const associationMap = associations.reduce(
    (acc, association) => {
      acc[association.id] = association.name
      return acc
    },
    {} as Record<string, string>,
  )

  const filteredFarmers = farmers.filter(
    (farmer) =>
      (farmer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (municipalityFilter === 'All' ||
        farmer.municipality === municipalityFilter) &&
      (associationFilter === 'All' ||
        farmer.association_id === associationFilter) &&
      (positionFilter === 'All' || farmer.position === positionFilter),
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFarmers = filteredFarmers.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage)

  const uniqueMunicipalities = [
    'All',
    ...new Set(farmers.map((farmer) => farmer.municipality)),
  ]
  const uniqueAssociations = [
    'All',
    ...new Set(farmers.map((farmer) => farmer.association_id)),
  ]
  const uniquePositions = [
    'All',
    ...new Set(farmers.map((farmer) => farmer.position)),
  ]

  const clearFilters = () => {
    setMunicipalityFilter('All')
    setAssociationFilter('All')
    setPositionFilter('All')
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (farmer: Farmer) => (
        <div className='flex items-center'>
          <Avatar className='h-8 w-8 mr-2'>
            <AvatarImage
              src={`/placeholder.svg?text=${farmer.firstname[0]}`}
              alt={farmer.firstname}
            />
            <AvatarFallback>{farmer.firstname[0]}</AvatarFallback>
          </Avatar>
          {farmer.firstname} {farmer.lastname}
        </div>
      ),
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Municipality', accessor: 'municipality' },
    { header: 'Barangay', accessor: 'barangay' },
    {
      header: 'Association',
      accessor: 'association_id',
      render: (farmer: Farmer) => (
        <AssociationName associationID={farmer.association_id} />
      ),
    },
    {
      header: 'Position',
      accessor: 'position',
      render: (farmer: Farmer) => (
        <Badge variant='outline'>{farmer.position}</Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (farmer: Farmer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setSelectedFarmer(farmer)}>
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <Link href={`/dashboard/myfarmers/${farmer.id}`}>
              <DropdownMenuItem>
                <Eye className='mr-2 h-4 w-4' />
                View Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>All Farmers</h2>
      </div>

      <FarmerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        municipalityFilter={municipalityFilter}
        setMunicipalityFilter={setMunicipalityFilter}
        associationFilter={associationFilter}
        setAssociationFilter={setAssociationFilter}
        positionFilter={positionFilter}
        setPositionFilter={setPositionFilter}
        uniqueMunicipalities={uniqueMunicipalities}
        uniqueAssociations={uniqueAssociations}
        uniquePositions={uniquePositions}
        clearFilters={clearFilters}
      />

      <ScrollArea className='h-[calc(100vh-350px)]'>
        <ReusableTable columns={columns} data={paginatedFarmers} />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <div className='flex justify-between items-center mt-4'>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {selectedFarmer && (
        <Dialog
          open={!!selectedFarmer}
          onOpenChange={() => setSelectedFarmer(null)}
        >
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>
                {selectedFarmer.firstname} {selectedFarmer.lastname}
              </DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='flex items-center gap-4'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span>{selectedFarmer.phone}</span>
              </div>
              <div className='flex items-center gap-4'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <span>
                  {selectedFarmer.municipality}, {selectedFarmer.barangay}
                </span>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Association:</Label>
                <span className='col-span-3'>
                  <AssociationName
                    associationID={selectedFarmer.association_id}
                  />
                </span>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Position:</Label>
                <Badge variant='outline' className='col-span-3'>
                  {selectedFarmer.position}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='secondary'
                onClick={() => setSelectedFarmer(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default FarmersTable
