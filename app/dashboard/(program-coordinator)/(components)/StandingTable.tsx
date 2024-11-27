'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlantingRecordDialog } from '../coordinator-standing/PlantingRecordsDialog'
import Link from 'next/link'

export interface PlantingRecord {
  id: string
  status: string // Changed from union type to string since DB may return other values
  farmer_id: {
    id: string
    lastname: string
    firstname: string
  }
  crop_type: {
    id: string
    name: string
  }
  variety: {
    id: string
    name: string
  }
  crop_categoryId: {
    id: string
    name: string
  }
  planting_date?: string
  area_planted?: number
  quantity?: number
  expenses?: number
  harvest_date?: string
  remarks?: string
}

export const getStatusColor = (status: PlantingRecord['status']): string => {
  switch (status) {
    case 'inspection':
      return 'bg-yellow-500'
    case 'harvest':
      return 'bg-blue-500'
    case 'harvested':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

const columns: ColumnDef<PlantingRecord>[] = [
  {
    accessorKey: 'farmer_id',
    header: 'Farmer',
    cell: ({ row }) => {
      const farmer = row.getValue('farmer_id') as PlantingRecord['farmer_id']
      return `${farmer.firstname} ${farmer.lastname}`
    },
  },
  {
    id: 'crop_type', // Add explicit id
    accessorKey: 'crop_type.name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Crop Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => row.original.crop_type.name,
  },
  {
    accessorKey: 'variety',
    header: 'Variety',
    cell: ({ row }) => {
      const variety = row.getValue('variety') as PlantingRecord['variety']
      return variety.name
    },
  },
  {
    accessorKey: 'crop_categoryId',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue(
        'crop_categoryId',
      ) as PlantingRecord['crop_categoryId']
      return category.name
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as PlantingRecord['status']
      return (
        <Badge className={`${getStatusColor(status)} text-white`}>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const record = row.original
      const [open, setOpen] = React.useState(false)

      return (
        <>
          {record.status === 'harvested' ? (
            <Link href={`/dashboard/harvested/${record.id}`}>
              <Button variant='outline' className='flex items-center'>
                <Info className='mr-2 h-4 w-4' />
                More Info
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/c/${record.id}`}>
              <Button variant='outline' className='flex items-center'>
                <Info className='mr-2 h-4 w-4' />
                More Info
              </Button>
            </Link>
          )}
        </>
      )
    },
  },
]

export function StandingTable({ data }: { data: PlantingRecord[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter by crop type...'
          value={
            (table.getColumn('crop_type')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('crop_type')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
