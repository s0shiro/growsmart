'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import useAssociationDetails from '@/hooks/useAssociationDetails'
import Link from 'next/link'

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
  position: string | null // Allow null
  association_id: string | null // Allow null
}

type AssociationDetailsTableProps = {
  associationId: string
  associationName: string // Add the associationName prop
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <motion.div
      className='bg-card bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        {/* Dynamic title with association name */}
        <h2 className='lg:text-xl font-semibold text-foreground'>
          {/* {associationName} */}
        </h2>
        <div className='relative flex items-center'>
          <input
            type='text'
            placeholder='Search members...'
            className='bg-input text-foreground placeholder-muted-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            value={searchTerm}
            onChange={onSearchChange}
          />
          <Search
            className='absolute left-3 top-2.5 text-muted-foreground'
            size={18}
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
        {filteredDetails.length === 0 ? (
          <div className='text-center text-muted-foreground py-6'>
            No members found.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-border'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Gender
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Barangay
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Position
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Municipality
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Association
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredDetails.map((detail) => (
                <motion.tr
                  key={detail.id}
                  className='bg-white dark:bg-inherit'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-foreground'>
                      {detail.firstname} {detail.lastname}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-foreground'>
                      {detail.gender}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-foreground'>
                      {detail.barangay}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-foreground'>
                      {detail.position}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-foreground'>
                      {detail.municipality}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-foreground'>
                      {associationName}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/farmers/${detail.id}`}>
                          <DropdownMenuItem>Farmer</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => alert('Edit action')}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert('Delete action')}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  )
}
