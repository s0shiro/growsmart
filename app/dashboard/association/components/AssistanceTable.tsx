// components/association/AssistanceTable.tsx
'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import useAssistanceRecords from '@/hooks/association/useAssistanceRecords'
import { formatAmountWithUnit } from '@/lib/utils'

export default function AssistanceTable({
  associationId,
}: {
  associationId: string
}) {
  const { data, isLoading } = useAssistanceRecords(associationId)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredData =
    data?.filter(
      (record) =>
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assistance_type.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <Search className='h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search assistance records...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Given</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[80px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-[200px]' />
                      </TableCell>
                    </TableRow>
                  ))
              : paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className='font-medium'>
                      {record.assistance_type}
                    </TableCell>
                    <TableCell>
                      {formatAmountWithUnit(
                        record.amount,
                        record.assistance_type,
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.date_given), 'PPP')}
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Showing {paginatedData.length} of {filteredData.length} records
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
