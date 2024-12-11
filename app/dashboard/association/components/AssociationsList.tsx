'use client'

import { useState, useMemo } from 'react'
import {
  PlusCircle,
  Users,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
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
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import useReadAssociation from '@/hooks/association/useReadAssociations'
import Link from 'next/link'
import AssociationForm from './create/AssociationForm'
import DialogForm from '../../(components)/forms/DialogForm'
import AssistanceForm from './AssistanceForm'
import { Badge } from '@/components/ui/badge'

interface Association {
  id: string
  created_at: string
  name: string
  memberCount: { count: number }[]
}

export default function AssociationsList() {
  const { data, error, isLoading } = useReadAssociation()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredAssociations = useMemo(() => {
    if (!data) return []
    return data.filter((association: any) =>
      association.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [data, searchTerm])

  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAssociations.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAssociations, currentPage])

  const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage)

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
                <TableHead>Assistance</TableHead>
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
                : paginatedAssociations.map((association: any) => (
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
                        <Badge
                          variant={
                            association.assistanceCount > 0
                              ? 'default'
                              : 'secondary'
                          }
                          className={`${
                            association.assistanceCount > 0
                              ? 'dark:bg-green-900 dark:text-green-100 bg-green-100 text-green-800'
                              : 'dark:bg-slate-800 dark:text-slate-400 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {association.assistanceCount > 0
                            ? `${association.assistanceCount} Assistance Given`
                            : 'No Assistance'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(association.created_at), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <div className='flex space-x-2'>
                          <Link
                            href={`/dashboard/association/${association.id}`}
                          >
                            <Button variant='ghost' className='p-2'>
                              <Eye className='mr-2 h-4 w-4' />
                              View
                            </Button>
                          </Link>
                          <DialogForm
                            id={`assistance-${association.id}`}
                            title={`Record Assistance - ${association.name}`}
                            description='Record a new assistance entry for this association'
                            Trigger={
                              <Button variant='ghost' className='p-2'>
                                <PlusCircle className='mr-2 h-4 w-4' />
                                Record Assistance
                              </Button>
                            }
                            form={
                              <AssistanceForm associationId={association.id} />
                            }
                          />
                        </div>
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
