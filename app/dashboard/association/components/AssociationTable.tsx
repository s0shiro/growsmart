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
import DialogForm from '../../(components)/DialogForm'
// import EditAssociationForm from './edit/EditAssociationForm'
// import DeleteAssociation from './DeleteAssociation'
import useReadAssociation from '@/hooks/useReadAssociations'

type Association = {
  id: string
  name: string | null
}

export default function ListOfAssociations() {
  const { data, error, isLoading } = useReadAssociation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAssociations, setFilteredAssociations] = useState<
    Association[]
  >([])

  console.log(data)

  useEffect(() => {
    if (data) {
      setFilteredAssociations(data)
    }
  }, [data])

  const handleSearch = useCallback(
    (term: string) => {
      if (data) {
        const filtered = data.filter((association) =>
          (association.name ?? 'Unnamed Association')
            .toLowerCase()
            .includes(term),
        )
        setFilteredAssociations(filtered)
      }
    },
    [data],
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
        <h2 className='lg:text-xl font-semibold text-foreground'>
          Associations
        </h2>
        <div className='relative flex items-center'>
          <input
            type='text'
            placeholder='Search associations...'
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
        {filteredAssociations.length === 0 ? (
          <div className='text-center text-muted-foreground py-6'>
            No associations found.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-border'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredAssociations.map((association, index) => (
                <motion.tr
                  key={index}
                  className='bg-white dark:bg-inherit'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-foreground'>
                      {association.name}
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
                        <DropdownMenuItem>
                          {/* <DeleteAssociation
                            id={association.id}
                            onDelete={deleteAssociation}
                          /> */}
                        </DropdownMenuItem>
                        {/* <DialogForm
                          id='edit-association'
                          title='Edit Association'
                          description={`Edit association`}
                          Trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Edit
                            </DropdownMenuItem>
                          }
                          form={
                            <EditAssociationForm
                              association={association}
                              updateAssociation={updateAssociation}
                            />
                          }
                        /> */}
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
