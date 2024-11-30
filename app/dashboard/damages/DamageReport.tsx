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

import DamagePieChart from './DamagesGraph'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DamageSeverityEnum,
  DamageTypesEnum,
  GrowthStagesEnum,
} from '@/lib/constant'
import useFetchAllDamagesDuringVisitation from '@/hooks/useFetchAllDamages'
import useFetchDamagesByMunicipality from '@/hooks/reports/useFetchCurrentMonthDamages'

export default function DamageReport() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const { data, isLoading, error } =
    useFetchAllDamagesDuringVisitation(dateRange)
  const { data: municipalityDamages, isLoading: damagesLoading } =
    useFetchDamagesByMunicipality(dateRange)
  const printableRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [damageSeverityFilter, setDamageSeverityFilter] = useState('all')
  const [damageTypeFilter, setDamageTypeFilter] = useState('all')
  const [growthStageFilter, setGrowthStageFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML

      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      const isValidDate = (date: any) =>
        date instanceof Date && !isNaN(date.getTime())

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${activeCategory} Damage(s) Report</title>
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

                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }

                .logo {
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                }

                .org-info {
                  flex-grow: 1;
                  margin-left: 8px;
                }

                .org-info h2 {
                  font-size: 16px;
                  font-weight: bold;
                  color: #003366;
                }

                .org-info p {
                  font-size: 12px;
                  margin-bottom: 2px;
                }

                .title {
                  font-size: 11px;
                  font-weight: bold;
                  text-align: center;
                  color: #003366;
                  margin-bottom: 5px;
                }

                .date-range {
                  font-size: 8px;
                  color: #6c757d;
                }

                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }

                th, td {
                  border: 1px solid #000;
                  padding: 5px;
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

                .subheader {
                  margin-bottom: 2px;
                  display: flex;
                  justify-content: space-between;
                }

                p {
                  font-size: 12px;
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
              <div class="header">
                <img src="/no-bg.png" alt="Logo" class="logo"/>
                <div class="org-info">
                  <h2>Marinduque Provincial Agriculture Office</h2>
                  <p>Capitol Compound, Boac, Philippines</p>
                </div>
              </div>
              <div class="title">DAMAGE(S) REPORT</div>
              <div class="title">${activeCategory.toUpperCase()} PROGRAM</div>
              <div class="title date-range"> ${isValidDate(dateRange.from) && isValidDate(dateRange.to) ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}` : ''}</div>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      } else {
        alert('Please enable popups to allow printing.')
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
        const matchesSeverity =
          damageSeverityFilter === 'all' ||
          item.damage_severity === damageSeverityFilter
        const matchesType =
          damageTypeFilter === 'all' || item.damage_type === damageTypeFilter
        const matchesGrowthStage =
          growthStageFilter === 'all' || item.growth_stage === growthStageFilter
        const matchesPriority =
          priorityFilter === 'all' ||
          (priorityFilter === 'priority' ? item.is_priority : !item.is_priority)

        return (
          isInDateRange &&
          isInCategory &&
          matchesSeverity &&
          matchesType &&
          matchesGrowthStage &&
          matchesPriority
        )
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
            <TableHead className='bg-muted text-xs'>Damage Area (ha)</TableHead>
            <TableHead className='bg-muted text-xs'>
              Damage Severity
            </TableHead>{' '}
            {/* New */}
            <TableHead className='bg-muted text-xs'>Damage Type</TableHead>{' '}
            {/* New */}
            <TableHead className='bg-muted text-xs'>
              Growth Stage
            </TableHead>{' '}
            {/* New */}
            <TableHead className='bg-muted text-xs'>Priority</TableHead>{' '}
            {/* New */}
            <TableHead className='bg-muted text-xs'>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className='text-xs'>
                {`${item.technician_farmers.firstname} ${item.technician_farmers.lastname}`}
              </TableCell>
              <TableCell className='text-xs'>
                {item.planting_records.crop_type.name}
              </TableCell>
              <TableCell className='text-xs'>
                {item.planting_records.variety.name}
              </TableCell>
              <TableCell className='text-xs'>{`${item.damaged} ha`}</TableCell>
              <TableCell className='text-xs'>{item.damage_severity}</TableCell>
              <TableCell className='text-xs'>{item.damage_type}</TableCell>
              <TableCell className='text-xs'>{item.growth_stage}</TableCell>
              <TableCell className='text-xs'>
                {item.is_priority ? (
                  <Badge variant='destructive'>Priority</Badge>
                ) : (
                  <Badge variant='secondary'>Normal</Badge>
                )}
              </TableCell>
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
    <div>
      <div className='flex flex-col gap-4 mb-6 no-print'>
        <div className='flex items-center justify-between'>
          <Tabs defaultValue='All' onValueChange={setActiveCategory}>
            <TabsList>
              <TabsTrigger value='All'>All</TabsTrigger>
              <TabsTrigger value='Rice'>Rice</TabsTrigger>
              <TabsTrigger value='Corn'>Corn</TabsTrigger>
              <TabsTrigger value='High-Value'>High Value</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className='flex items-center gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-[240px]'>
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
            <Button onClick={handlePrint}>
              <Printer className='mr-2 h-4 w-4' /> Print
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Select
            value={damageSeverityFilter}
            onValueChange={setDamageSeverityFilter}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='All Severities' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Severities</SelectItem>
              {Object.values(DamageSeverityEnum).map((severity) => (
                <SelectItem key={severity} value={severity}>
                  {severity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={damageTypeFilter} onValueChange={setDamageTypeFilter}>
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='All Types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              {Object.values(DamageTypesEnum).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={growthStageFilter}
            onValueChange={setGrowthStageFilter}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='All Stages' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Stages</SelectItem>
              {Object.values(GrowthStagesEnum).map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='priority'>Priority</SelectItem>
              <SelectItem value='normal'>Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div ref={printableRef}>
        <div className='no-print header text-center mb-6'>
          <h1 className='text-2xl font-bold mb-2'>
            {activeCategory.toUpperCase()} PROGRAM
          </h1>
          <p className='text-sm text-muted-foreground'>
            {dateRange.from && dateRange.to
              ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
              : 'All Time'}
          </p>
        </div>

        <ScrollArea
          className='w-full rounded-md border'
          style={{ height: '400px' }}
        >
          <div className='p-4'>
            {isLoading ? renderSkeletonTable() : renderTable(filteredData)}
          </div>
          <ScrollBar orientation='horizontal' className='no-print' />
          <ScrollBar orientation='vertical' className='no-print' />
        </ScrollArea>

        {municipalityDamages && !damagesLoading && (
          <div className='mt-8 no-print'>
            <DamagePieChart data={municipalityDamages} />
          </div>
        )}
      </div>
    </div>
  )
}
