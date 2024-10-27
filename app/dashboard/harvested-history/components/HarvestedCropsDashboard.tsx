'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  Leaf,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import useFetchAllHarvestedCrops from '@/hooks/reports/useFecthAllHarvestedCrops'
import { DatePickerWithRange } from './DatePickerWithRange'
import Link from 'next/link'
import { useHarvestedCropsStore } from '@/stores/harvestedHistoryStore'

const ITEMS_PER_PAGE = 10

export default function HarvestedCropsDashboard() {
  const {
    dateRange,
    currentPage,
    activeTab,
    setDateRange,
    setCurrentPage,
    setActiveTab,
    clearDateRange,
  } = useHarvestedCropsStore()
  const { data, error, isFetching } = useFetchAllHarvestedCrops()

  const filteredData = data?.filter((crop: any) => {
    const inDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(crop.harvest_records[0]?.harvest_date || crop.harvest_date) >=
        dateRange.from &&
        new Date(crop.harvest_records[0]?.harvest_date || crop.harvest_date) <=
          dateRange.to)
    const matchesCategory =
      activeTab === 'All' ||
      crop.crop_categoryId.name.toLowerCase() === activeTab.toLowerCase()
    return inDateRange && matchesCategory
  })

  const totalPages = Math.ceil((filteredData?.length || 0) / ITEMS_PER_PAGE)
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  if (error) {
    return (
      <div className='text-center text-red-500'>
        Error loading data: {error.message}
      </div>
    )
  }

  const renderTable = (data: typeof paginatedData) => (
    <Table className='border-2 border-border'>
      <TableHeader>
        <TableRow>
          <TableHead className='border-r'>Farmer</TableHead>
          <TableHead className='border-r'>Crop Type</TableHead>
          <TableHead className='border-r'>Variety</TableHead>
          <TableHead className='border-r'>Area Planted (ha)</TableHead>
          <TableHead className='border-r'>Quantity (kg)</TableHead>
          <TableHead className='border-r'>Planting Date</TableHead>
          <TableHead className='border-r'>Actual Harvest Date</TableHead>
          <TableHead className='border-r'>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((crop: any) => (
          <TableRow key={crop.id}>
            <TableCell className='border-r'>
              {crop.farmer_id.firstname} {crop.farmer_id.lastname}
            </TableCell>
            <TableCell className='border-r'>{crop.crop_type.name}</TableCell>
            <TableCell className='border-r'>{crop.variety.name}</TableCell>
            <TableCell className='border-r'>{crop.area_planted}</TableCell>
            <TableCell className='border-r'>{crop.quantity}</TableCell>
            <TableCell className='border-r'>
              {new Date(crop.planting_date).toLocaleDateString()}
            </TableCell>
            <TableCell className='border-r'>
              {crop.harvest_records[0]
                ? new Date(
                    crop.harvest_records[0].harvest_date,
                  ).toLocaleDateString()
                : 'Not yet harvested'}
            </TableCell>
            <TableCell className='border-r'>
              <Badge
                variant={
                  crop.status === 'harvested' ? 'default' : 'destructive'
                }
              >
                {crop.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant='ghost' size='sm' asChild>
                <Link href={`/dashboard/harvested/${crop.id}`}>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  View Details
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Harvested Crops Dashboard</h1>
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <DatePickerWithRange
            onChange={setDateRange}
            onClear={clearDateRange}
          />
        </CardContent>
      </Card>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className='mb-4'>
          <TabsTrigger value='All'>All</TabsTrigger>
          <TabsTrigger value='Rice'>Rice</TabsTrigger>
          <TabsTrigger value='Corn'>Corn</TabsTrigger>
          <TabsTrigger value='High Value'>High Value</TabsTrigger>
        </TabsList>
        <TabsContent value='All'>
          {isFetching ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            renderTable(paginatedData)
          )}
        </TabsContent>
        {/* Other TabsContent components remain the same */}
        <TabsContent value='Rice'>
          {isFetching ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            renderTable(paginatedData)
          )}
        </TabsContent>
        <TabsContent value='Corn'>
          {isFetching ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            renderTable(paginatedData)
          )}
        </TabsContent>
        <TabsContent value='High Value'>
          {isFetching ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            renderTable(paginatedData)
          )}
        </TabsContent>
      </Tabs>

      {filteredData && filteredData.length > 0 ? (
        <div className='flex justify-between items-center mt-4'>
          <p className='text-sm text-muted-foreground'>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{' '}
            {filteredData.length} entries
          </p>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4 mr-2' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </div>
      ) : (
        <div className='text-center text-muted-foreground mt-12'>
          <Leaf className='mx-auto h-12 w-12 mb-4' />
          <p>
            No harvested crops found for the selected category and date range.
          </p>
        </div>
      )}
    </div>
  )
}
