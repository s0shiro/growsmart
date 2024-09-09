import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Filter, Search } from 'lucide-react'
import AssociationName from '../../myfarmers/components/AssociationName'

type FarmerFiltersProps = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  municipalityFilter: string
  setMunicipalityFilter: (value: string) => void
  associationFilter: string
  setAssociationFilter: (value: string) => void
  positionFilter: string
  setPositionFilter: (value: string) => void
  uniqueMunicipalities: string[]
  uniqueAssociations: string[]
  uniquePositions: string[]
  clearFilters: () => void
}

const FarmerFilters: React.FC<FarmerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  municipalityFilter,
  setMunicipalityFilter,
  associationFilter,
  setAssociationFilter,
  positionFilter,
  setPositionFilter,
  uniqueMunicipalities,
  uniqueAssociations,
  uniquePositions,
  clearFilters,
}) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
        <Input
          type='search'
          placeholder='Search farmers...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className='w-full sm:w-[300px]'
          icon={<Search className='h-4 w-4 text-muted-foreground' />}
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
        <Select value={associationFilter} onValueChange={setAssociationFilter}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Filter by Association' />
          </SelectTrigger>
          <SelectContent>
            {uniqueAssociations.map((associationId) => (
              <SelectItem key={associationId} value={associationId}>
                <AssociationName associationID={associationId} />
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
      <Button variant='outline' onClick={clearFilters}>
        <Filter className='mr-2 h-4 w-4' />
        Clear Filters
      </Button>
    </div>
  )
}

export default FarmerFilters
