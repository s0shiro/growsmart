import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function TableSkeleton({
  itemsPerPage,
}: {
  itemsPerPage: number
}) {
  return Array.from({ length: itemsPerPage }).map((_, index) => (
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
        <Skeleton className='h-4 w-[100px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[120px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-8 w-[100px]' />
      </TableCell>
    </TableRow>
  ))
}
