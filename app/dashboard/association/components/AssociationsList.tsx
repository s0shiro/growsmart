'use client'

import { useState, useMemo } from 'react'
import {
  PlusCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import useReadAssociation from '@/hooks/association/useReadAssociations'
import Link from 'next/link'
import AssociationForm from './create/AssociationForm'
import DialogForm from '../../(components)/forms/DialogForm'

interface Association {
  id: string
  created_at: string
  name: string
  memberCount: number
}

export default function AssociationsList() {
  const { data, error, isLoading } = useReadAssociation()
  const [newAssociationName, setNewAssociationName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null)

  const itemsPerPage = 5

  const filteredAssociations = useMemo(() => {
    return (
      data?.filter((association: any) =>
        association.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    )
  }, [data, searchTerm])

  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAssociations.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAssociations, currentPage])

  const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage)

  const handleCreateAssociation = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement association creation logic
    console.log('Creating new association:', newAssociationName)
    setNewAssociationName('')
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold tracking-tight'>Associations</h2>
        <DialogForm
          id='create-trigger'
          description='Add a new farmer association to the system'
          title='Add Association'
          Trigger={
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Association
            </Button>
          }
          form={<AssociationForm />}
        />
      </div>

      <div className='flex items-center space-x-2'>
        <Search className='h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search associations...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
      </div>

      <div className='rounded-md border'>
        <ScrollArea className='h-[400px]'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className='h-5 w-[200px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-5 w-[50px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-5 w-[150px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-[80px]' />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedAssociations.map((association: Association) => (
                    <TableRow key={association.id}>
                      <TableCell className='font-medium'>
                        {association.name}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          <Users className='mr-2 h-4 w-4 text-muted-foreground' />
                          {association.memberCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(association.created_at), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/association/${association.id}`}>
                          <Button variant='ghost' className='p-2'>
                            <Eye className='mr-2 h-4 w-4' />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Showing {paginatedAssociations.length} of{' '}
          {filteredAssociations.length} associations
        </p>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className='text-center p-4 border border-destructive rounded-md'>
      <h3 className='text-lg font-semibold text-destructive mb-2'>Error</h3>
      <p className='text-muted-foreground'>
        Failed to load associations: {error.message}
      </p>
    </div>
  )
}
