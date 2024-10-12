'use client'

import { useQuery } from '@tanstack/react-query'
import { getPlantingRecordById } from '@/lib/planting'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarIcon,
  MapPinIcon,
  CropIcon,
  ScaleIcon,
  BanknoteIcon,
  LeafIcon,
  UserIcon,
  TagIcon,
  PlusCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  Droplet,
  FileText,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import InspectionForm from '@/app/dashboard/standing/components/InpectionForm'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LocationMap from '@/app/dashboard/(components)/LocationMap'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'

export default function CropsDetailsPage({
  params,
}: {
  params: { cropId: string }
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['crop-planting-record', params.cropId],
    queryFn: async () => getPlantingRecordById(params.cropId),
  })

  const router = useRouter()

  useEffect(() => {
    if (data && data.status === 'harvested') {
      router.push(`/dashboard/harvested/${params.cropId}`)
    }
  }, [data, router, params.cropId])

  if (isLoading) return <LoadingSkeleton />
  if (data && data.status === 'harvested')
    return <p>Harvested already! Redirecting...</p>
  if (error) return <ErrorDisplay error={error} />
  if (!data) return <div>No data found</div>

  const calculateDaysDifference = (date: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    const differenceInTime = targetDate.getTime() - today.getTime()
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
    return differenceInDays
  }

  const daysSincePlanting = calculateDaysDifference(data.planting_date)
  const daysUntilHarvest = calculateDaysDifference(data.harvest_date)

  return (
    <div className='space-y-6'>
      <Card
        className={`${
          data.crop_categories?.name === 'rice'
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
            : data.crop_categories?.name === 'corn'
              ? 'bg-gradient-to-r from-orange-400 to-orange-600'
              : 'bg-gradient-to-r from-primary to-primary-foreground'
        } text-primary-foreground`}
      >
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className='text-3xl font-bold mb-2'>
                {data.crops?.name}
              </CardTitle>
              <CardDescription className='text-primary-foreground/80'>
                Variety: {data.crop_varieties?.name}
              </CardDescription>
            </div>
            <Badge variant='secondary' className='text-lg py-1 px-3'>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='details'>Crop Details</TabsTrigger>
          <TabsTrigger value='visitations'>Visitations</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>
                    Crop Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Planting Details</h3>
                    <div className='flex items-center gap-2'>
                      <CalendarIcon className='h-4 w-4 text-primary' />
                      <span>Planted: {formatDate(data.planting_date)}</span>
                    </div>
                    {data.crop_categories?.name === 'rice' && (
                      <>
                        <div className='flex items-center gap-2'>
                          <CropIcon className='h-4 w-4 text-primary' />
                          <span>
                            Land Type: {data.land_type || 'Not applicable'}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Droplet className='h-4 w-4 text-primary' />
                          <span>
                            Water Supply: {data.water_supply || 'Not specified'}
                          </span>
                        </div>
                      </>
                    )}
                    <div className='flex items-center gap-2'>
                      <ScaleIcon className='h-4 w-4 text-primary' />
                      <span>Area: {data.area_planted} ha</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <LeafIcon className='h-4 w-4 text-primary' />
                      <span>Quantity: {data.quantity} kg</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-primary' />
                      <span>Remarks: {data.remarks}</span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Harvest Information</h3>
                    <div className='flex items-center gap-2'>
                      <CalendarIcon className='h-4 w-4 text-primary' />
                      <span>Expected: {formatDate(data.harvest_date)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <BanknoteIcon className='h-4 w-4 text-primary' />
                      <span>Expenses: {formatCurrency(data.expenses)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TagIcon className='h-4 w-4 text-primary' />
                      <span>Category: {data.crop_categories?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>
                    Field Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-[400px] w-full rounded-lg overflow-hidden'>
                    <LocationMap
                      latitude={data.latitude}
                      longitude={data.longitude}
                    />
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                    <MapPinIcon className='h-4 w-4' />
                    <span>{data.field_location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>
                    Farmer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center text-center'>
                  <Avatar className='h-24 w-24 mb-4'>
                    <AvatarImage src={`${data.technician_farmers?.avatar}`} />
                    <AvatarFallback>
                      {data.technician_farmers?.firstname?.[0]}
                      {data.technician_farmers?.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className='text-lg font-medium mb-1'>
                    {data.technician_farmers?.firstname}{' '}
                    {data.technician_farmers?.lastname}
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4'>Farmer</p>
                  <Link href={`/dashboard/f/${data.farmer_id}`} passHref>
                    <Button variant='outline' className='w-full'>
                      View Profile
                      <ExternalLinkIcon className='ml-2 h-4 w-4' />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Days Since Planting:</span>
                    <Badge variant='secondary'>
                      {Math.abs(daysSincePlanting)}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Days Until Harvest:</span>
                    <Badge variant='secondary'>
                      {daysUntilHarvest < 0 ? 'Overdue' : daysUntilHarvest}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Total Visitations:</span>
                    <Badge variant='secondary'>{data.inspections.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='visitations'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-xl font-semibold'>
                Visitation Records
              </CardTitle>

              <DialogForm
                id='create-visit'
                title='Record Visit'
                description={`Record visit data for planting ${data.crops?.name}`}
                Trigger={
                  <Button>
                    <PlusCircleIcon className='mr-2 h-4 w-4' />
                    Add Visitation
                  </Button>
                }
                form={
                  <InspectionForm
                    plantingID={params.cropId}
                    farmerID={data.farmer_id}
                  />
                }
              />
            </CardHeader>
            <CardContent>
              {data.inspections.length === 0 ? (
                <p className='text-center text-muted-foreground'>
                  No visitations recorded yet.
                </p>
              ) : (
                <div className='space-y-4'>
                  {data.inspections.map((inspection) => (
                    <Card key={inspection.id}>
                      <CardContent className='flex items-center justify-between p-4'>
                        <div className='flex items-center gap-4'>
                          {(inspection.damaged ?? 0) > 0 ? (
                            <AlertTriangleIcon className='h-8 w-8 text-destructive' />
                          ) : (
                            <CheckCircleIcon className='h-8 w-8 text-primary' />
                          )}
                          <div>
                            <p className='font-semibold'>
                              {formatDate(inspection?.date ?? '')}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              Damage: {inspection.damaged} | Reason:{' '}
                              {inspection.damaged_reason}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            (inspection?.damaged ?? 0) > 0
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {(inspection?.damaged ?? 0) > 0
                            ? 'Damaged'
                            : 'Healthy'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-3/4 mb-2' />
          <Skeleton className='h-4 w-1/2' />
        </CardHeader>
      </Card>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='details'>Crop Details</TabsTrigger>
          <TabsTrigger value='visitations'>Visitations</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-1/3 mb-2' />
                </CardHeader>
                <CardContent className='grid sm:grid-cols-2 gap-4'>
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className='space-y-2'>
                      <Skeleton className='h-4 w-1/2 mb-2' />
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className='h-4 w-full' />
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-1/3 mb-2' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-[400px] w-full mb-4' />
                  <Skeleton className='h-4 w-2/3' />
                </CardContent>
              </Card>
            </div>

            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2 mb-2' />
                </CardHeader>
                <CardContent className='flex flex-col items-center'>
                  <Skeleton className='h-24 w-24 rounded-full mb-4' />
                  <Skeleton className='h-6 w-1/2 mb-2' />
                  <Skeleton className='h-4 w-1/3 mb-4' />
                  <Skeleton className='h-10 w-full' />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2 mb-2' />
                </CardHeader>
                <CardContent className='space-y-2'>
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <Skeleton className='h-4 w-1/3' />
                      <Skeleton className='h-6 w-16' />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='visitations'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-10 w-32' />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, index) => (
                <Card key={index} className='mb-4'>
                  <CardContent className='flex items-center justify-between p-4'>
                    <div className='flex items-center gap-4'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                      <div>
                        <Skeleton className='h-4 w-24 mb-2' />
                        <Skeleton className='h-3 w-32' />
                      </div>
                    </div>
                    <Skeleton className='h-6 w-16' />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className='container mx-auto p-4'>
      <Card className='bg-destructive text-destructive-foreground'>
        <CardHeader>
          <CardTitle>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
