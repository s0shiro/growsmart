'use client'

import { useState } from 'react'
import {
  UserPlus,
  MoreHorizontal,
  Eye,
  MapPin,
  Phone,
  Filter,
  Edit,
  Trash,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DialogForm from '../../(components)/forms/DialogForm'
import CreateFarmerForm from './CreateFarmerForm'
import Link from 'next/link'
import useFetchFarmersByUserId from '@/hooks/farmer/useFetchFarmersByUserId'

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
  avatar: string
  association: Association
  rsbsa_number: number
}

type Association = {
  id: string
  name: string
}

const FarmersTable = () => {
  const { data: farmersData } = useFetchFarmersByUserId()
  const farmers: Farmer[] = (farmersData as Farmer[]) || []

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const [municipalityFilter, setMunicipalityFilter] = useState('All')
  const [associationFilter, setAssociationFilter] = useState('All')
  const [positionFilter, setPositionFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5


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

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage)
  const paginatedFarmers = filteredFarmers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
    setCurrentPage(1)
  }

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

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-foreground'>My Farmers</h2>
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

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Input
          type='search'
          placeholder='Search farmers...'
          value={searchTerm}
          onChange={handleSearch}
          className='w-full'
          icon={<Search className='h-4 w-4 text-muted-foreground' />}
        />
        <Select
          value={municipalityFilter}
          onValueChange={(value) => { setMunicipalityFilter(value); setCurrentPage(1); }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Filter by Municipality' />
          </SelectTrigger>
          <SelectContent>
            {uniqueMunicipalities.map((municipality) => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={associationFilter}
          onValueChange={(value) => { setAssociationFilter(value); setCurrentPage(1); }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Filter by Association' />
          </SelectTrigger>
          <SelectContent>
            {uniqueAssociations.map((id) => (
              <SelectItem key={id} value={id}>
                {id === 'all'
                  ? 'All'
                  : (Array.isArray(farmers) &&
                    farmers.find((farmer: any) => farmer.association_id === id)?.association
                      ?.name) ||
                  'All'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={positionFilter}
          onValueChange={(value) => { setPositionFilter(value); setCurrentPage(1); }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Filter by Position' />
          </SelectTrigger>
          <SelectContent>
            {uniquePositions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          variant='outline'
          onClick={() => {
            setMunicipalityFilter('All')
            setAssociationFilter('All')
            setPositionFilter('All')
            setCurrentPage(1)
          }}
        >
          <Filter className='mr-2 h-4 w-4' />
          Clear Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[250px]'>Name</TableHead>
              <TableHead>RSBSA Number</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Association</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFarmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className='font-medium'>
                  <div className='flex items-center'>
                    <Avatar className='h-8 w-8 mr-2'>
                      <AvatarImage
                        src={farmer.avatar}
                        alt={farmer.firstname}
                      />
                      <AvatarFallback>{farmer.firstname[0]}</AvatarFallback>
                    </Avatar>
                    {farmer.firstname} {farmer.lastname}
                  </div>
                </TableCell>
                <TableCell>{farmer.rsbsa_number}</TableCell>
                <TableCell>{farmer.municipality}</TableCell>
                <TableCell>{farmer.barangay}</TableCell>
                <TableCell>
                  <p>{farmer.association.name}</p>
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => setSelectedFarmer(farmer)}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </DropdownMenuItem>
                      <Link href={`/dashboard/${farmer.id}`}>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(filteredFarmers.length, currentPage * itemsPerPage)} of {filteredFarmers.length} farmers
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
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
                  {selectedFarmer.association.name}
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