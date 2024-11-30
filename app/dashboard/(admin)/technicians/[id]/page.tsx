'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  HashIcon,
} from 'lucide-react'
import { useTechnicianProfile } from '@/hooks/users/useTechnicianProfile'
import Link from 'next/link'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const ITEMS_PER_PAGE = 5

export default function TechnicianProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { data, error } = useTechnicianProfile(params.id)
  const [currentFarmerPage, setCurrentFarmerPage] = useState(1)
  const [currentPlantingPage, setCurrentPlantingPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'harvested' | 'pending'>(
    'harvested',
  )

  if (error) return <div>Error loading technician profile: {error.message}</div>
  if (!data) return <TechnicianProfileSkeleton />

  const {
    technician,
    totalFarmers,
    activePlantings,
    harvestedPlantings,
    pendingInspections,
    farmersAssigned,
    plantingRecords,
  } = data

  const paginatedFarmers = farmersAssigned.slice(
    (currentFarmerPage - 1) * ITEMS_PER_PAGE,
    currentFarmerPage * ITEMS_PER_PAGE,
  )

  const paginatedPlantings = plantingRecords[activeTab].slice(
    (currentPlantingPage - 1) * ITEMS_PER_PAGE,
    currentPlantingPage * ITEMS_PER_PAGE,
  )

  const totalFarmerPages = Math.ceil(farmersAssigned.length / ITEMS_PER_PAGE)
  const totalPlantingPages = Math.ceil(
    plantingRecords[activeTab].length / ITEMS_PER_PAGE,
  )

  return (
    <div>
      <Card className='mb-8'>
        <CardHeader className='flex flex-col sm:flex-row items-center gap-4'>
          <Avatar className='h-24 w-24'>
            <AvatarImage src={technician.avatarUrl} alt={technician.fullName} />
            <AvatarFallback>
              {technician.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='text-center sm:text-left'>
            <CardTitle className='text-2xl sm:text-3xl'>
              {technician.fullName}
            </CardTitle>
            <p className='text-muted-foreground'>{technician.email}</p>
            <p className='text-sm mt-1'>{technician.jobTitle}</p>
          </div>
        </CardHeader>
      </Card>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        <StatCard
          title='Total Farmers'
          value={totalFarmers}
          icon={<UserIcon className='h-4 w-4' />}
        />
        <StatCard
          title='Active Plantings'
          value={activePlantings}
          icon={<CalendarIcon className='h-4 w-4' />}
        />
        <StatCard
          title='Harvested Plantings'
          value={harvestedPlantings}
          icon={<CalendarIcon className='h-4 w-4' />}
        />
        <StatCard
          title='Pending Inspections'
          value={pendingInspections}
          icon={<CalendarIcon className='h-4 w-4' />}
        />
      </div>

      <div className='grid gap-3 lg:grid-cols-2'>
        <Card className='flex flex-col'>
          <CardHeader>
            <CardTitle>Assigned Farmers</CardTitle>
          </CardHeader>
          <CardContent className='flex-grow flex flex-col justify-between'>
            <ScrollArea className='w-full'>
              <div className='space-y-4 mb-4'>
                {paginatedFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className='flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors'
                  >
                    <Avatar>
                      <AvatarImage src={farmer.avatar} alt={farmer.fullName} />
                      <AvatarFallback>
                        {farmer.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-grow'>
                      <p className='font-medium'>{farmer.fullName}</p>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <HashIcon className='h-3 w-3' />
                        <span>RSBSA: {farmer.rsbsaNumber}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <PhoneIcon className='h-3 w-3' />
                        <span>{farmer.phone}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/f/${farmer.id}`}>
                      <Button variant='outline' size='sm'>
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
            <Pagination className='mt-4'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentFarmerPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentFarmerPage === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
                {[...Array(totalFarmerPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentFarmerPage(i + 1)}
                      isActive={currentFarmerPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentFarmerPage((prev) =>
                        Math.min(prev + 1, totalFarmerPages),
                      )
                    }
                    className={
                      currentFarmerPage === totalFarmerPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        <Card className='flex flex-col'>
          <CardHeader>
            <CardTitle>Planting Records</CardTitle>
          </CardHeader>
          <CardContent className='flex-grow flex flex-col justify-between'>
            <Tabs
              defaultValue='harvested'
              onValueChange={(value) =>
                setActiveTab(value as 'harvested' | 'pending')
              }
            >
              <TabsList className='grid w-full grid-cols-2 mb-4'>
                <TabsTrigger value='harvested'>Harvested</TabsTrigger>
                <TabsTrigger value='pending'>Pending Inspection</TabsTrigger>
              </TabsList>
              <TabsContent value='harvested' className='flex-grow'>
                <ScrollArea className='w-full'>
                  <PlantingTable records={paginatedPlantings} />
                  <ScrollBar orientation='horizontal' />
                </ScrollArea>
              </TabsContent>
              <TabsContent value='pending' className='flex-grow'>
                <ScrollArea className='w-full'>
                  <PlantingTable records={paginatedPlantings} />
                  <ScrollBar orientation='horizontal' />
                </ScrollArea>
              </TabsContent>
            </Tabs>
            <Pagination className='mt-4'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPlantingPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPlantingPage === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
                {[...Array(totalPlantingPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPlantingPage(i + 1)}
                      isActive={currentPlantingPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPlantingPage((prev) =>
                        Math.min(prev + 1, totalPlantingPages),
                      )
                    }
                    className={
                      currentPlantingPage === totalPlantingPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  )
}

function PlantingTable({
  records,
}: {
  records: Array<{
    id: string
    cropName: string
    farmer: string
    location: string
    date: string
    status: string
  }>
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Crop</TableHead>
          <TableHead>Farmer</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.cropName}</TableCell>
            <TableCell>{record.farmer}</TableCell>
            <TableCell className='flex items-center gap-1'>
              <MapPinIcon className='h-4 w-4 text-muted-foreground' />
              {record.location}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  record.status === 'harvested' ? 'default' : 'destructive'
                }
              >
                {record.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TechnicianProfileSkeleton() {
  return (
    <div>
      <Card className='mb-8'>
        <CardHeader className='flex flex-col sm:flex-row items-center gap-4'>
          <Skeleton className='h-24 w-24 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-64' />
            <Skeleton className='h-4 w-40' />
          </div>
        </CardHeader>
      </Card>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-4 w-24' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(5)].map((_, j) => (
                  <div key={j} className='flex items-center gap-4'>
                    <Skeleton className='h-12 w-12 rounded-full' />
                    <div className='flex-grow'>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-24' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                    <Skeleton className='h-8 w-24' />
                  </div>
                ))}
              </div>
              <Skeleton className='h-10 w-full mt-4' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
