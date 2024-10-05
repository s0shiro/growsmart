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
  Plus,
  ExternalLinkIcon,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import InspectionForm from '@/app/dashboard/standing/components/InpectionForm'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import Link from 'next/link'
import React from 'react'

export default function CropsDetailsPage({
  params,
}: {
  params: { cropId: string }
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['crop-planting-record', params.cropId],
    queryFn: async () => getPlantingRecordById(params.cropId),
  })

  console.log(data)

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorDisplay error={error} />
  if (!data) return <div>No data found</div>

  return (
    <div className='space-y-6'>
      <Card className='bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground'>
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Planting Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Planting Date:</span>{' '}
                  {formatDate(data.planting_date)}
                </div>
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Field Location:</span>{' '}
                  {data.field_location}
                </div>
                <div className='flex items-center gap-2'>
                  <CropIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Land Type:</span>{' '}
                  {data.land_type || 'Not specified'}
                </div>
                <div className='flex items-center gap-2'>
                  <ScaleIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Area Planted:</span>{' '}
                  {data.area_planted} ha
                </div>
                <div className='flex items-center gap-2'>
                  <LeafIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Quantity:</span> {data.quantity}{' '}
                  kg
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Harvest Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>
                    Expected Harvest Date:
                  </span>{' '}
                  {formatDate(data.harvest_date)}
                </div>
                <div className='flex items-center gap-2'>
                  <BanknoteIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Expenses:</span>{' '}
                  {formatCurrency(data.expenses)}
                </div>
                <div className='flex items-center gap-2'>
                  <TagIcon className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Category:</span>{' '}
                  {data.crop_categories?.name}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='mt-6'>
            <CardHeader>
              <CardTitle className='text-xl font-semibold'>
                Farmer Information
              </CardTitle>
            </CardHeader>
            <CardContent className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={`${data.technician_farmers?.avatar}`} />
                  <AvatarFallback>
                    {data.technician_farmers?.firstname}
                    {data.technician_farmers?.lastname}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-lg font-medium'>
                    {data.technician_farmers?.firstname}{' '}
                    {data.technician_farmers?.lastname}
                  </p>
                  <p className='text-sm text-muted-foreground'>Farmer</p>
                </div>
              </div>
              <Link href={`/dashboard/f/${data.farmer_id}`} passHref>
                <Button variant='outline'>
                  View Profile
                  <ExternalLinkIcon className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </CardContent>
          </Card>
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
                form={<InspectionForm plantingID={params.cropId} />}
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
    <div className='container mx-auto p-4 space-y-6'>
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(2)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2 mb-2' />
                </CardHeader>
                <CardContent>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-4 w-full mb-2' />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className='mt-6'>
            <CardHeader>
              <Skeleton className='h-6 w-1/2 mb-2' />
            </CardHeader>
            <CardContent className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-full' />
                <div>
                  <Skeleton className='h-6 w-40 mb-2' />
                  <Skeleton className='h-4 w-24' />
                </div>
              </div>
              <Skeleton className='h-10 w-32' />
            </CardContent>
          </Card>
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
