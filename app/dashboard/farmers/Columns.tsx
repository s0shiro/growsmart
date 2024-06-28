'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type Farmer = {
  id: string
  name: string
  gender: string
  address: string
  phone: number
}

export const columns: ColumnDef<Farmer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
  },
  {
    accessorKey: 'name',
    header: () => <div className='text-center font-medium'>Name</div>,
    cell: ({ row }) => (
      <div className='text-center font-medium'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'gender',
    header: () => <div className='text-center font-medium'>Gender</div>,
    cell: ({ row }) => (
      <div className='text-center font-medium'>{row.getValue('gender')}</div>
    ),
  },
  {
    accessorKey: 'address',
    header: () => <div className='text-center font-medium'>Address</div>,
    cell: ({ row }) => (
      <div className='text-center font-medium'>{row.getValue('address')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: () => <div className='text-center font-medium'>Phone</div>,
    cell: ({ row }) => (
      <div className='text-center font-medium'>{row.getValue('phone')}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Farmer</DropdownMenuItem>
            <DropdownMenuItem>View Production</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
