'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Printer, CalendarIcon, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn, formatDate } from '@/lib/utils'
import useFetchAllDamagesDuringVisitation from '@/hooks/useFetchAllDamages'

export default function DamageReport() {
  const { data, isLoading, error } = useFetchAllDamagesDuringVisitation()
  const printableRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', '_blank')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Damage Report</title>
             <style>
  /* Reset and box-sizing rule */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @page {
    size: portrait;
    margin: 10mm;
  }

  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12px;
    margin: 0;
    padding: 5px;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    border: 1px solid #000;
    padding: 5px; /* Consolidated padding for both th and td */
    text-align: center;
    font-size: 10px;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .header {
    text-align: center;
    margin-bottom: 10px; /* Control space between header and the rest */
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #003366;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 5px 0; /* Small margin between title and subtitle */
  }

  p {
    font-size: 12px;
    margin: 5px 0; /* Control spacing between date and headers */
  }

  .subheader {
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
  }

  @media print {
    .no-print {
      display: none !important;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>

            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      } else {
        alert('Please allow popups for this website')
      }
    }
  }

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined })
  }

  const filteredData = data
    ? data.filter((item: any) => {
        const itemDate = new Date(item.date)
        const isInDateRange =
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        const isInCategory =
          activeCategory === 'All' ||
          item.planting_records.crop_categoryId.name.toLowerCase() ===
            activeCategory.toLowerCase()
        return isInDateRange && isInCategory
      })
    : []

  const renderTable = (data: any) => {
    if (data.length === 0) {
      return (
        <div className='text-center py-8 text-gray-500'>
          No data available for the selected filters.
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='bg-muted text-xs'>Farmer Name</TableHead>
            <TableHead className='bg-muted text-xs'>Crop</TableHead>
            <TableHead className='bg-muted text-xs'>Variety</TableHead>
            <TableHead className='bg-muted text-xs'>
              Damage Quantity (kg)
            </TableHead>
            <TableHead className='bg-muted text-xs'>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className='text-xs'>{`${item.technician_farmers.firstname} ${item.technician_farmers.lastname}`}</TableCell>
              <TableCell className='text-xs'>
                {item.planting_records.crop_type.name}
              </TableCell>
              <TableCell className='text-xs'>
                {item.planting_records.variety.name}
              </TableCell>
              <TableCell className='text-xs'>{`${item.damaged} kg`}</TableCell>
              <TableCell className='text-xs'>{formatDate(item.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const renderSkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='bg-muted'>
            <Skeleton className='h-4 w-full' />
          </TableHead>
          <TableHead className='bg-muted'>
            <Skeleton className='h-4 w-full' />
          </TableHead>
          <TableHead className='bg-muted'>
            <Skeleton className='h-4 w-full' />
          </TableHead>
          <TableHead className='bg-muted'>
            <Skeleton className='h-4 w-full' />
          </TableHead>
          <TableHead className='bg-muted'>
            <Skeleton className='h-4 w-full' />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className='h-4 w-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-full' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 no-print'>
        <div className='w-full sm:w-auto'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn(
                  'w-full sm:w-[300px] justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newDateRange) =>
                  setDateRange({
                    from: newDateRange?.from,
                    to: newDateRange?.to,
                  })
                }
                numberOfMonths={2}
              />
              <div className='p-3 border-t border-border'>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={clearDateRange}
                >
                  <X className='mr-2 h-4 w-4' />
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handlePrint} className='w-full sm:w-auto'>
          <Printer className='mr-2 h-4 w-4' /> Print Report
        </Button>
      </div>

      <div ref={printableRef}>
        <div className='header text-center mb-2'>
          <p className='title text-xl font-bold'>DAMAGE REPORT</p>
          <p className='text-lg font-semibold'>
            {activeCategory.toUpperCase()} CROP PROGRAM
          </p>
          <p className='no-print text-sm'>
            {dateRange.from && dateRange.to
              ? `From ${format(dateRange.from, 'MMMM d, yyyy')} to ${format(dateRange.to, 'MMMM d, yyyy')}`
              : 'All Dates'}
          </p>
        </div>

        <div className='subheader flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-sm'>
          <div>
            <p>REGION: RFO IVB</p>
            <p>PROVINCE: MARINDUQUE</p>
          </div>
        </div>

        <div className='no-print'>
          <Tabs
            defaultValue='All'
            onValueChange={setActiveCategory}
            className='mb-6'
          >
            <TabsList className='w-full sm:w-auto'>
              <TabsTrigger value='All'>All</TabsTrigger>
              <TabsTrigger value='Rice'>Rice</TabsTrigger>
              <TabsTrigger value='Corn'>Corn</TabsTrigger>
              <TabsTrigger value='High-Value'>High Value</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className='w-full whitespace-nowrap rounded-md border mt-4'>
          <div className='p-2'>
            {isLoading ? renderSkeletonTable() : renderTable(filteredData)}
          </div>
          <ScrollBar orientation='horizontal' className='no-print' />
        </ScrollArea>
      </div>
    </div>
  )
}
