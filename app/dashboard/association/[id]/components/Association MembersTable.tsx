'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, ChevronLeft, ChevronRight, User } from 'lucide-react'
import useAssociationDetails from '@/hooks/association/useAssociationDetails'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Link from 'next/link'
import DownloadButton from '@/app/dashboard/(components)/ui/DownloadButton'

export default function AssociationMembers({
  associationId,
}: {
  associationId: string
}) {
  const { data, error, isLoading } = useAssociationDetails(associationId)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const associationName =
    data && data.length > 0 ? data[0].association?.name : 'Unknown Association'

  if (error) {
    return <div className='text-red-500'>Error loading association details</div>
  }

  const filteredData =
    data?.filter(
      (member) =>
        member.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastname.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold mb-4'>{associationName}</h1>

      <div className='flex justify-between items-center'>
        <Input
          className='max-w-sm'
          placeholder='Search members...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DownloadButton
          url={`/dashboard/association/${associationId}/pdf`}
          fileName={`${associationName}_masterlist`}
          buttonName='Members Masterlist'
        />
      </div>

      <div className='border rounded-lg'>
        <ScrollArea className='h-[400px]'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] sticky top-0 bg-background'>
                  Avatar
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  Name
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  Position
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  Municipality
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  Barangay
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  Phone
                </TableHead>
                <TableHead className='sticky top-0 bg-background'>
                  RSBSA Number
                </TableHead>
                <TableHead className='text-right sticky top-0 bg-background'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className='h-10 w-10 rounded-full' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[200px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[100px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[150px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[100px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[120px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-[150px]' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-8 w-[100px] ml-auto' />
                        </TableCell>
                      </TableRow>
                    ))
                : paginatedData.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={member.avatar}
                            alt={`${member.firstname} ${member.lastname}`}
                          />
                          <AvatarFallback>
                            {member.firstname[0]}
                            {member.lastname[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {member.firstname} {member.lastname}
                      </TableCell>
                      <TableCell className='capitalize'>
                        {member.position.replace('_', ' ')}
                      </TableCell>
                      <TableCell>{member.municipality}</TableCell>
                      <TableCell>{member.barangay}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.rsbsa_number}</TableCell>
                      <TableCell className='text-right'>
                        <Button asChild variant='outline' size='sm'>
                          <Link href={`/dashboard/f/${member.id}`} passHref>
                            <User className='h-4 w-4 mr-2' />
                            View Profile
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      <div className='flex justify-between items-center'>
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
          {filteredData.length} entries
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
