'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Edit,
  Trash,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import DialogForm from '../../(components)/forms/DialogForm'
import EditForm from './edit/EditorForm'
import DeleteUser from './DeleteUser'
import { Member } from '@/lib/types'
import CreateForm from './create/CreateForm'
import { Card } from '@/components/ui/card'

export default function UsersTable() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [selectedUser, setSelectedUser] = useState<Member | null>(null)

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

  const updateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.user_id === updatedMember.user_id ? updatedMember : member,
      ),
    )
    setFilteredMembers((prevFilteredMembers) =>
      prevFilteredMembers.map((member) =>
        member.user_id === updatedMember.user_id ? updatedMember : member,
      ),
    )
  }

  const deleteMember = (userId: string) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.user_id !== userId),
    )
    setFilteredMembers((prevFilteredMembers) =>
      prevFilteredMembers.filter((member) => member.user_id !== userId),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'resigned':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'border-green-500 text-green-500'
      case 'technician':
        return 'border-yellow-500 text-yellow-500'
      default:
        return 'border-gray-500 text-gray-500'
    }
  }

  return (
    <div className='bg-background text-foreground'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Users</h1>
        <DialogForm
          id='create-trigger'
          description='This is description'
          title='Create Member'
          Trigger={
            <Button>
              <UserPlus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          }
          form={<CreateForm />}
        />
      </div>

      <div className='mb-4'>
        <Input
          type='search'
          placeholder='Search members...'
          value={searchTerm}
          onChange={onSearchChange}
          className='max-w-sm'
          icon={<Search className='h-4 w-4 text-muted-foreground' />}
        />
      </div>
      <Card>
        <ScrollArea className='h-[calc(100vh-350px)]'>
          <Table className='min-w-[800px] table-auto divide-y divide-border'>
            <TableHeader>
              <TableRow className='bg-background hover:bg-background'>
                <TableHead className='w-[250px]'>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center'>
                      <Avatar className='h-8 w-8 mr-2'>
                        <AvatarImage
                          src={`/placeholder.svg?text=${member.users.full_name?.charAt(0)}`}
                          alt={member.users.full_name}
                        />
                        <AvatarFallback>
                          {member.users.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {member.users.full_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`${getRoleColor(member.role)}`}
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(member.status)} text-white`}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => setSelectedUser(member)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View
                        </DropdownMenuItem>
                        <DialogForm
                          id='edit-member'
                          title='Record Planting'
                          description={`Edit member`}
                          Trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                          }
                          form={
                            <EditForm
                              permission={member}
                              updateMember={updateMember}
                            />
                          }
                        />
                        <DropdownMenuItem>
                          <DeleteUser
                            userId={member.user_id}
                            onDelete={deleteMember}
                          />
                          <Trash className='mr-2 h-4 w-4' />
                          Delete
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
      </Card>

      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.users.full_name}</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <label className='text-right'>Role:</label>
                <span className='col-span-3'>{selectedUser.role}</span>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <label className='text-right'>Joined:</label>
                <span className='col-span-3'>
                  {new Date(selectedUser.created_at).toDateString()}
                </span>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <label className='text-right'>Status:</label>
                <span className='col-span-3'>{selectedUser.status}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
