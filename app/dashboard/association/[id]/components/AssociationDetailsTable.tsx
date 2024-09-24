'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontal,
  Search,
  Download,
  Users,
  UserPlus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import useAssociationDetails from '@/hooks/association/useAssociationDetails'
import Link from 'next/link'
import { toast } from 'sonner'
import DownloadButton from '@/app/dashboard/farmers/components/DownloadButton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type AssociationDetail = {
  id: string
  user_id: string
  firstname: string
  lastname: string
  gender: string
  phone: string
  barangay: string
  municipality: string
  created_at: string
  position: string | null
  association_id: string | null
}

type AssociationDetailsTableProps = {
  associationId: string
  associationName: string
}

export default function AssociationDetailsTable({
  associationId,
  associationName,
}: AssociationDetailsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDetails, setFilteredDetails] = useState<AssociationDetail[]>(
    [],
  )

  const {
    data: details,
    error,
    isLoading,
  } = useAssociationDetails(associationId)

  useEffect(() => {
    if (details) {
      setFilteredDetails(details)
    }
  }, [details])

  const handleSearch = useCallback(
    (term: string) => {
      if (details) {
        const filtered = details.filter((detail) =>
          `${detail.firstname ?? ''} ${detail.lastname ?? ''}`
            .toLowerCase()
            .includes(term),
        )
        setFilteredDetails(filtered)
      }
    },
    [details],
  )

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    handleSearch(term)
  }

  const handleAddMember = () => {
    // Implement add member logic here
    toast({
      title: 'Add Member',
      description: 'Member addition functionality to be implemented.',
    })
  }

  if (isLoading) {
    return <AssociationDetailsSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='text-2xl font-bold'>
              {associationName}
            </CardTitle>
            <CardDescription>Association Members</CardDescription>
          </div>
          <div className='flex space-x-2'>
            <DownloadButton
              url={`/dashboard/association/${associationId}/pdf`}
              fileName={`${associationName}_masterlist`}
              buttonName='Download Masterlist'
            />
            {/* <Button onClick={handleAddMember}>
              <UserPlus className='mr-2 h-4 w-4' />
              Add Member
            </Button> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center space-x-2'>
            <Users className='h-5 w-5 text-muted-foreground' />
            <span className='text-lg font-semibold'>
              {filteredDetails.length} Members
            </span>
          </div>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search members...'
              value={searchTerm}
              onChange={onSearchChange}
              className='pl-8'
            />
          </div>
        </div>
        {filteredDetails.length === 0 ? (
          <div className='text-center text-muted-foreground py-6'>
            No members found.
          </div>
        ) : (
          <div className='rounded-md border'>
            <ScrollArea className='max-h-full'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Barangay</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Municipality</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className='font-medium'>
                        <div className='flex items-center space-x-2'>
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${detail.firstname} ${detail.lastname}`}
                            />
                            <AvatarFallback>
                              {detail.firstname[0]}
                              {detail.lastname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {detail.firstname} {detail.lastname}
                            <p className='text-sm text-muted-foreground'>
                              {detail.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            detail.gender === 'Male' ? 'default' : 'secondary'
                          }
                        >
                          {detail.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>{detail.barangay}</TableCell>
                      <TableCell>{detail.position || 'N/A'}</TableCell>
                      <TableCell>{detail.municipality}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <span className='sr-only'>Open menu</span>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/myfarmers/${detail.id}`}>
                                View Farmer Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => console.log('edit')}
                            >
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => console.log('remove')}
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Remove from Association
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AssociationDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </CardContent>
    </Card>
  )
}
