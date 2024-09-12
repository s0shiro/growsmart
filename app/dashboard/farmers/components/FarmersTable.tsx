'use client'

import { useState } from 'react'
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
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
import Link from 'next/link'
import DownloadButton from './DownloadButton'
import { Label } from '@/components/ui/label'
import AssociationName from '../../myfarmers/components/AssociationName'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>All Farmers</h2>
        <DownloadButton
          fileName='farmer_masterlist'
          url='/dashboard/farmers/pdf'
          buttonName='Download Masterlist'
        />
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
          <Input
            type='search'
            placeholder='Search farmers...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className='w-full sm:w-[300px]'
          />
          <Select
            value={municipalityFilter}
            onValueChange={setMunicipalityFilter}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
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
            onValueChange={setAssociationFilter}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter by Association' />
            </SelectTrigger>
            <SelectContent>
              {uniqueAssociations.map((associationId) => (
                <SelectItem key={associationId} value={associationId}>
                  {associationMap[associationId] || associationId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className='w-full sm:w-[180px]'>
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
        <Button
          variant='outline'
          onClick={() => {
            setMunicipalityFilter('All')
            setAssociationFilter('All')
            setPositionFilter('All')
          }}
        >
          <Filter className='mr-2 h-4 w-4' />
          Clear Filters
        </Button>
      </div>

      <ScrollArea className='h-[calc(100vh-350px)]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[250px]'>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFarmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className='font-medium'>
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
                </TableCell>
                <TableCell>{farmer.phone}</TableCell>
                <TableCell>{farmer.municipality}</TableCell>
                <TableCell>{farmer.barangay}</TableCell>
                <TableCell>
                  <AssociationName associationID={farmer.association_id} />
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>{farmer.position}</Badge>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

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
              <div className='flex flex-col gap-2'>
                <Label>Phone Number</Label>
                <p>{selectedFarmer.phone}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Municipality</Label>
                <p>{selectedFarmer.municipality}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Barangay</Label>
                <p>{selectedFarmer.barangay}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Association</Label>
                <p>
                  {associationMap[selectedFarmer.association_id] ||
                    selectedFarmer.association_id}
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Position</Label>
                <p>{selectedFarmer.position}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Date Added</Label>
                <p>
                  {new Date(selectedFarmer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default FarmersTable
