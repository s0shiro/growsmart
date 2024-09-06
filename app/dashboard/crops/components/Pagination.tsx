import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  return (
    <div className='flex justify-between items-center mt-4 flex-wrap'>
      <p className='text-sm text-muted-foreground'>
        Showing {(currentPage - 1) * 5 + 1} to{' '}
        {Math.min(currentPage * 5, pageCount * 5)} of {pageCount * 5} entries
      </p>
      <div className='flex space-x-2 mt-2 sm:mt-0'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
          disabled={currentPage === pageCount}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
