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
  Search,
} from 'lucide-react'
import useFetchAllFarmers from '@/hooks/farmer/useFetchAllFarmers'
import useFetchAssociations from '@/hooks/association/useFetchAssociations'
import { Button } from '@/components/ui/button'
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
import DownloadButton from '../../(components)/ui/DownloadButton'
import { Label } from '@/components/ui/label'
import AssociationName from '../../(components)/ui/AssociationName'
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

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage)
  const paginatedFarmers = filteredFarmers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">All Farmers</h2>
        <DownloadButton
          fileName='farmer_masterlist'
          url='/dashboard/farmers/pdf'
          buttonName='Download Masterlist'
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search farmers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value.toLowerCase())
            setCurrentPage(1)
          }}
          className="w-full"
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Select
          value={municipalityFilter}
          onValueChange={(value) => {
            setMunicipalityFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Municipality" />
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
          onValueChange={(value) => {
            setAssociationFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Association" />
          </SelectTrigger>
          <SelectContent>
            {uniqueAssociations.map((associationId) => (
              <SelectItem key={associationId} value={associationId}>
                {associationMap[associationId] || associationId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={positionFilter}
          onValueChange={(value) => {
            setPositionFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Position" />
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
          variant="outline"
          onClick={() => {
            setMunicipalityFilter('All')
            setAssociationFilter('All')
            setPositionFilter('All')
            setCurrentPage(1)
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>RSBSA Number</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Association</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFarmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
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
                  <AssociationName associationID={farmer.association_id} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedFarmer(farmer)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <Link href={`/dashboard/f/${farmer.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="mr-2 h-4 w-4" />
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedFarmer.firstname} {selectedFarmer.lastname}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>Phone Number</Label>
                <p>{selectedFarmer.phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Municipality</Label>
                <p>{selectedFarmer.municipality}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Barangay</Label>
                <p>{selectedFarmer.barangay}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Association</Label>
                <p>
                  {associationMap[selectedFarmer.association_id] ||
                    selectedFarmer.association_id}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Position</Label>
                <p>{selectedFarmer.position}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Date Added</Label>
                <p>
                  {new Date(selectedFarmer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedFarmer(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default FarmersTable