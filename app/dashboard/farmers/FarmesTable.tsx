'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Search } from 'lucide-react'
import useFetchFarmers from '@/hooks/fetchFarmers'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DialogForm from '../(components)/DialogForm'
import PlantingForm from './PlantingForm'
import AssociationName from './AssociationName'

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
  association_id: string // New field
  position: string // New field
}

const FarmersTable = () => {
  const { data, isFetching } = useFetchFarmers()
  const farmers: Farmer[] = data as Farmer[]

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<Farmer[]>([])

  useEffect(() => {
    if (farmers) {
      setFilteredUsers(farmers)
    }
  }, [farmers])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = farmers.filter(
      (farmer) =>
        farmer.firstname.toLowerCase().includes(term) ||
        farmer.lastname.toLowerCase().includes(term) ||
        farmer.phone.toLowerCase().includes(term),
    )
    setFilteredUsers(filtered)
  }

  return (
    <motion.div
      className='bg-background bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-border
                 sm:p-4 md:p-6 lg:p-8 xl:p-10'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>Farmers</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search users...'
            className='bg-background text-foreground placeholder-muted-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary border border-border'
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className='absolute left-3 top-2.5 text-muted-foreground'
            size={18}
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto divide-y divide-border'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                Phone
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                Municipality
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                Barangay
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                Association
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                Position
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-border'>
            {filteredUsers.map((farmer) => (
              <motion.tr
                key={farmer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                        <Link href={`/dashboard/farmers/${farmer.id}`}>
                          {' '}
                          {farmer.firstname.charAt(0)}
                        </Link>
                      </div>
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-foreground'>
                        <Link href={`/dashboard/farmers/${farmer.id}`}>
                          {farmer.firstname} {farmer.lastname}
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                  <div className='text-sm text-muted-foreground'>
                    {farmer.phone}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                  <div className='text-sm text-muted-foreground'>
                    {farmer.municipality}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                  <div className='text-sm text-muted-foreground'>
                    {farmer.barangay}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                  <div className='text-sm text-muted-foreground'>
                    <AssociationName associationID={farmer.association_id} />
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                  <div className='text-sm text-muted-foreground'>
                    {farmer.position}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/farmers/${farmer.id}`}>
                        <DropdownMenuItem>View Farmer</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DialogForm
                        id='create-record'
                        title='Record Planting'
                        description={`Record planting data to ${farmer.firstname}`}
                        Trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Record Planting
                          </DropdownMenuItem>
                        }
                        form={<PlantingForm farmerID={farmer.id} />}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default FarmersTable
