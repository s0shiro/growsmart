'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import EditForm from './edit/EditorForm'
import DeleteUser from './DeleteUser'

type User = {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

type Member = {
  id: string
  created_at: string
  user_id: string
  role: 'technician' | 'admin'
  status: 'active' | 'resigned' | null
  users: User
}

export default function ListOfMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

  useEffect(() => {
    async function fetchMembers() {
      const response = await fetch('/api/members')
      const data: Member[] = await response.json()
      setMembers(data)
      setFilteredMembers(data)
    }
    fetchMembers()
  }, [])

  const handleSearch = useCallback(
    (term: string) => {
      const filtered = members.filter(
        (member) =>
          member.users.full_name?.toLowerCase().includes(term) ||
          member.role.toLowerCase().includes(term) ||
          member.status?.toLowerCase().includes(term),
      )
      setFilteredMembers(filtered)
    },
    [members],
  )

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    handleSearch(term)
  }

  return (
    <motion.div
      className='bg-card bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='lg:text-xl font-semibold text-foreground'>Members</h2>
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
        {filteredMembers.length === 0 ? (
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
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                  Joined
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredMembers.map((member, index) => (
                <motion.tr
                  key={index}
                  className='bg-white dark:bg-inherit'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                          {member.users.full_name?.charAt(0)}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-foreground'>
                          {member.users.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full shadow capitalize text-sm border',
                        {
                          'border-green-500 text-foreground background':
                            member.role === 'admin',
                          'border-yellow-700 dark:text-foreground dark:border-yellow-700 px-4 background':
                            member.role === 'technician',
                        },
                      )}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm text-muted-foreground'>
                    {new Date(member.created_at).toDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full capitalize text-sm border',
                        {
                          'text-green-600 dark:border-green-400 bg-green-200':
                            member.status === 'active',
                          'text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400':
                            member.status === 'resigned',
                        },
                      )}
                    >
                      {member.status}
                    </span>
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
                          <DeleteUser userId={member.user_id} />
                        </DropdownMenuItem>
                        <DialogForm
                          id='edit-member'
                          title='Record Planting'
                          description={`Edit member`}
                          Trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Edit
                            </DropdownMenuItem>
                          }
                          form={<EditForm />}
                        />
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
