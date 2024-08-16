import { Button } from '@/components/ui/button'
import React from 'react'
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons'
import ListOfMembers from './ListOfMembers'
import { Table } from '@/components/ui/table'

export default function MemberTable() {
  const tableHeader = ['Name', 'Role', 'Joined', 'Status']

  return (
    <div>
      <ListOfMembers />
    </div>
  )
}
