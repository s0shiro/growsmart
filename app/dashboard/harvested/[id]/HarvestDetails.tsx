'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/utils'
import {
  Edit3,
  Trash2,
  ArrowLeftCircle,
  UploadCloud,
  Calendar,
  MapPin,
  DollarSign,
  Droplet,
  Scale,
  AlertTriangle,
  Eye,
  ChevronRight,
  CheckCircle,
  XCircle,
  BarChart2,
  Camera,
  Leaf,
  Sprout,
  Tractor,
  Wheat,
  User2,
  EyeIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import Link from 'next/link'
import { toast } from '@/components/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface Inspection {
  id: string
  date: string
  damaged: number
  findings: string | null
  damaged_reason: string
}

type Location = {
  barangay: string
  municipality: string
  province: string
}

interface HarvestRecord {
  id: string
  profit: number
  user_id: string
  farmer_id: string
  created_at: string
  planting_id: string
  harvest_date: string
  area_harvested: number
  damaged_reason: string | null
  harvest_images: string[]
  yield_quantity: number
  damaged_quantity: number | null
}

interface HarvestData {
  id: string
  created_at: string
  farmer_id: string
  crop_type: string
  variety: string
  planting_date: string
  location_id: Location
  area_planted: number
  quantity: number
  expenses: number
  harvest_date: string
  user_id: string
  status: string
  crop_categoryId: string
  land_type: string
  crop_categories: { name: string }
  crops: { name: string }
  crop_varieties: { name: string }
  inspections: Inspection[]
  harvest_records: HarvestRecord[]
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-background border border-border p-2 rounded-md shadow-md'>
        <p className='text-foreground font-semibold'>{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className={
              entry.dataKey === 'damaged' ? 'text-destructive' : 'text-primary'
            }
          >
            {`${entry.name}: ${entry.value} ha`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export default function HarvestDetails({ harvest }: { harvest: HarvestData }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditingExpenses, setIsEditingExpenses] = useState(false)
  const [expenses, setExpenses] = useState(harvest.expenses)
  const [isUpdating, setIsUpdating] = useState(false)

  const { barangay, municipality, province } = harvest.location_id

  const latestHarvest = harvest.harvest_records[0]

  const finalProfit = latestHarvest
    ? latestHarvest.profit - harvest.expenses
    : undefined

  const totalDamaged =
    harvest.inspections.reduce(
      (sum, inspection) => sum + inspection.damaged,
      0,
    ) + (latestHarvest?.damaged_quantity || 0)

  const damageData = harvest.inspections.map((inspection) => ({
    date: formatDate(inspection.date),
    damaged: inspection.damaged,
    // reason: inspection.damaged_reason,
  }))

  if (latestHarvest) {
    damageData.push({
      date: formatDate(latestHarvest.harvest_date),
      damaged: latestHarvest.damaged_quantity || 0,
      //   reason: latestHarvest.damaged_reason || 'Unknown',
    })
  }

  const harvestData = [
    { name: 'Yield', value: latestHarvest?.yield_quantity || 0 },
    { name: 'Damaged', value: latestHarvest?.damaged_quantity || 0 },
  ]

  const formatCurrency = (amount: number | undefined) => {
    return amount !== undefined ? `₱${amount.toLocaleString()}` : 'N/A'
  }

  const handleUpdateExpenses = async () => {
    try {
      setIsUpdating(true)

      const supabase = await createClient()

      const { error } = await supabase
        .from('planting_records') // adjust table name if different
        .update({ expenses })
        .eq('id', harvest.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Expenses updated successfully',
      })

      setIsEditingExpenses(false)
    } catch (error) {
      console.error('Failed to update expenses:', error)
      toast({
        title: 'Error',
        description: 'Failed to update expenses',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className='mx-auto bg-card text-card-foreground shadow-lg rounded-[var(--radius)] overflow-hidden'>
      <CardHeader className='bg-primary text-primary-foreground p-2 py-4'>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='text-3xl font-bold mb-2'>
              {harvest.crops.name} Harvest
            </CardTitle>
            <CardDescription className='text-xl text-primary-foreground/80'>
              {harvest.crop_varieties.name}
            </CardDescription>
          </div>
          <div className='flex space-x-2'>
            <Link href={`/dashboard/f/${harvest.farmer_id}`} passHref>
              <Button variant='secondary' className='w-full'>
                Farmer Profile
                <ExternalLinkIcon className='ml-2 h-4 w-4' />
              </Button>
            </Link>
            {/* <Button
              size='sm'
              variant='destructive'
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
            >
              <ArrowLeftCircle className='mr-2 h-4 w-4' />
              Back
            </Button> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-2 py-4'>
        <Tabs
          defaultValue='overview'
          className='w-full'
          onValueChange={setActiveTab}
        >
          <TabsList className='grid w-full grid-cols-4 rounded-[var(--radius)] bg-muted p-1'>
            <TabsTrigger value='overview' className='rounded-[var(--radius)]'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='details' className='rounded-[var(--radius)]'>
              Details
            </TabsTrigger>
            <TabsTrigger value='visits' className='rounded-[var(--radius)]'>
              Visits
            </TabsTrigger>
            <TabsTrigger value='photos' className='rounded-[var(--radius)]'>
              Photos
            </TabsTrigger>
          </TabsList>
          <div className='mt-6'>
            <TabsContent value='overview'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold flex items-center'>
                      <Leaf className='mr-2 h-5 w-5 text-primary' />
                      Crop Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-3'>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-muted-foreground'>
                          <Calendar className='mr-2 h-4 w-4' />
                          Planting Date
                        </span>
                        <Badge variant='outline'>
                          {formatDate(harvest.planting_date)}
                        </Badge>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-muted-foreground'>
                          <MapPin className='mr-2 h-4 w-4' />
                          Field Location
                        </span>
                        <Badge variant='outline'>
                          {`${barangay}, ${municipality}, ${province}`}
                        </Badge>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-muted-foreground'>
                          <Sprout className='mr-2 h-4 w-4' />
                          Land Type
                        </span>
                        <Badge variant='outline'>
                          {harvest.land_type || 'N/A'}
                        </Badge>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-muted-foreground'>
                          <Scale className='mr-2 h-4 w-4' />
                          Area Planted
                        </span>
                        <Badge variant='outline'>
                          {harvest.area_planted} ha
                        </Badge>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-muted-foreground'>
                          <DollarSign className='mr-2 h-4 w-4' />
                          Expenses
                        </span>
                        {isEditingExpenses ? (
                          <div className='flex items-center gap-2'>
                            <Input
                              type='number'
                              value={expenses}
                              onChange={(e) =>
                                setExpenses(Number(e.target.value))
                              }
                              className='w-32'
                            />
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleUpdateExpenses}
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setIsEditingExpenses(false)
                                setExpenses(harvest.expenses)
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <Badge variant='outline'>
                              {formatCurrency(expenses)}
                            </Badge>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setIsEditingExpenses(true)}
                            >
                              <Edit3 className='h-4 w-4' />
                            </Button>
                          </div>
                        )}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className='md:col-span-2'>
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold flex items-center'>
                      <AlertTriangle className='mr-2 h-5 w-5 text-primary' />
                      Damage Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <LineChart data={damageData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='damaged'
                          stroke='hsl(var(--destructive))'
                          name='Damaged (ha)'
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='details'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold flex items-center'>
                    <Droplet className='mr-2 h-5 w-5 text-primary' />
                    Harvest Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <h4 className='text-lg font-semibold mb-3 text-primary flex items-center'>
                        <Tractor className='mr-2 h-5 w-5' />
                        Planting Information
                      </h4>
                      <Card>
                        <CardContent className='p-4'>
                          <ul className='space-y-2'>
                            {/* <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Crop Type:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.crops.name}
                              </Badge>
                            </li> */}
                            {/* <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Variety:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.crop_varieties.name}
                              </Badge>
                            </li> */}
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Expected Harvest Date:
                              </span>
                              <Badge variant='secondary'>
                                {formatDate(harvest.harvest_date)}
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Area Planted:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.area_planted} ha
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Quantity Planted:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.quantity} kg
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Planting Date:
                              </span>
                              <Badge variant='secondary'>
                                {formatDate(harvest.planting_date)}
                              </Badge>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h4 className='text-lg font-semibold mb-3 text-primary flex items-center'>
                        <Wheat className='mr-2 h-5 w-5' />
                        Harvest Information
                      </h4>
                      <Card>
                        <CardContent className='p-4'>
                          <ul className='space-y-2'>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Harvested Date:
                              </span>
                              <Badge variant='secondary'>
                                {formatDate(latestHarvest?.harvest_date)}
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Area Harvested:
                              </span>
                              <Badge variant='secondary'>
                                {latestHarvest?.area_harvested} ha
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Yield Quantity:
                              </span>
                              <Badge variant='secondary'>
                                {latestHarvest?.yield_quantity} kg
                              </Badge>
                            </li>
                            {latestHarvest?.damaged_quantity !== null && (
                              <li className='flex justify-between items-center'>
                                <span className='text-muted-foreground'>
                                  Damaged Quantity:
                                </span>
                                <Badge variant='destructive'>
                                  {latestHarvest.damaged_quantity} kg
                                </Badge>
                              </li>
                            )}
                            {latestHarvest?.damaged_reason && (
                              <li className='flex justify-between items-center'>
                                <span className='text-muted-foreground'>
                                  Damage Reason:
                                </span>
                                <Badge variant='outline'>
                                  {latestHarvest.damaged_reason}
                                </Badge>
                              </li>
                            )}
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Revenue:
                              </span>
                              <Badge variant='secondary'>
                                {formatCurrency(latestHarvest?.profit)}
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Expenses:
                              </span>
                              <Badge variant='secondary'>
                                {formatCurrency(harvest.expenses)}
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Final Profit:
                              </span>
                              <Badge
                                variant={
                                  finalProfit && finalProfit > 0
                                    ? 'default'
                                    : 'destructive'
                                }
                              >
                                {formatCurrency(finalProfit)}
                              </Badge>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  {/* <div className='mt-6'>
                    <h4 className='text-lg font-semibold mb-3 text-primary flex items-center'>
                      <BarChart2 className='mr-2 h-5 w-5' />
                      Yield vs Damage
                    </h4>
                    <Card>
                      <CardContent className='p-4'>
                        <ResponsiveContainer width='100%' height={300}>
                          <BarChart data={harvestData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey='value'
                              fill='hsl(var(--primary))'
                              name='Quantity (kg)'
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='visits'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold flex items-center'>
                    <Eye className='mr-2 h-5 w-5 text-primary' />
                    Visit Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-muted p-4 rounded-[var(--radius)]'>
                      <p className='text-sm text-muted-foreground mb-1'>
                        Total Visits
                      </p>
                      <p className='text-2xl font-bold text-primary'>
                        {harvest.inspections.length}
                      </p>
                    </div>
                    <div className='bg-muted p-4 rounded-[var(--radius)]'>
                      <p className='text-sm text-muted-foreground mb-1'>
                        Total Damage
                      </p>
                      <p className='text-2xl font-bold text-destructive'>
                        {totalDamaged} ha
                      </p>
                    </div>
                    <div className='bg-muted p-4 rounded-[var(--radius)]'>
                      <p className='text-sm text-muted-foreground mb-1'>
                        Healthy Visits
                      </p>
                      <p className='text-2xl font-bold text-primary'>
                        {
                          harvest.inspections.filter(
                            (visit) => visit.damaged === 0,
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                  <ScrollArea className='h-[300px] pr-4'>
                    {harvest.inspections.map((visit, index) => (
                      <Card key={visit.id} className='mb-4'>
                        <CardContent className='p-6'>
                          {/* Header Section */}
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                              {visit.is_priority ? (
                                <AlertTriangleIcon className='h-8 w-8 text-destructive' />
                              ) : (
                                <CheckCircleIcon className='h-8 w-8 text-primary' />
                              )}
                              <div>
                                <p className='font-semibold text-lg'>
                                  {formatDate(visit.date)}
                                </p>
                                <Badge
                                  variant={
                                    visit.is_priority
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {visit.is_priority ? 'Priority' : 'Normal'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div className='space-y-2'>
                              <p className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Damaged Area:
                                </span>{' '}
                                <span className='font-medium'>
                                  {visit.damaged} ha
                                </span>
                              </p>
                              <p className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Damage Type:
                                </span>{' '}
                                <span className='font-medium'>
                                  {visit.damage_type || 'N/A'}
                                </span>
                              </p>
                            </div>
                            <div className='space-y-2'>
                              <p className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Growth Stage:
                                </span>{' '}
                                <span className='font-medium'>
                                  {visit.growth_stage || 'N/A'}
                                </span>
                              </p>
                              <p className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Severity:
                                </span>{' '}
                                <span className='font-medium'>
                                  {visit.damage_severity || 'N/A'}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Findings Section */}
                          {visit.findings && (
                            <div className='mt-4'>
                              <p className='text-sm text-muted-foreground mb-1'>
                                Findings:
                              </p>
                              <p className='text-sm bg-muted p-3 rounded-md'>
                                {visit.findings}
                              </p>
                            </div>
                          )}

                          {/* Images Carousel */}
                          {visit.visitation_images &&
                            visit.visitation_images.length > 0 && (
                              <div className='mt-4'>
                                <Carousel className='w-full max-w-xs mx-auto'>
                                  <CarouselContent>
                                    {visit.visitation_images.map(
                                      (image, index) => (
                                        <CarouselItem key={index}>
                                          <div className='p-1'>
                                            <Image
                                              src={image}
                                              alt={`Inspection image ${index + 1}`}
                                              width={300}
                                              height={200}
                                              className='rounded-md object-cover w-full h-[200px]'
                                              priority={index === 0}
                                              quality={75}
                                            />
                                          </div>
                                        </CarouselItem>
                                      ),
                                    )}
                                  </CarouselContent>
                                  <CarouselPrevious />
                                  <CarouselNext />
                                </Carousel>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  {/* <Button variant='outline' className='w-full'>
                    <Eye className='mr-2 h-4 w-4' />
                    View All Visits
                  </Button> */}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='photos'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold flex items-center'>
                    <Camera className='mr-2 h-5 w-5 text-primary' />
                    Harvest Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                    {latestHarvest &&
                      latestHarvest.harvest_images.map((url, index) => (
                        <div
                          key={index}
                          className='aspect-square relative rounded-[var(--radius)] overflow-hidden cursor-pointer group'
                        >
                          <Image
                            src={url}
                            alt={`Harvest Photo ${index + 1}`}
                            fill
                            className='object-cover transition-transform group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                            {/* <p className='text-white text-sm'>View Full Size</p> */}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  {/* <Button className='w-full' variant='outline'>
                    <UploadCloud className='mr-2 h-4 w-4' />
                    Upload New Photos
                  </Button> */}
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
