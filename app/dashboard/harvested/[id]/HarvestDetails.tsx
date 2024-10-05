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

interface Inspection {
  id: string
  date: string
  damaged: number
  findings: string | null
  damaged_reason: string
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
  field_location: string
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
            {`${entry.name}: ${entry.value} kg`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export default function HarvestDetails({ harvest }: { harvest: HarvestData }) {
  const [activeTab, setActiveTab] = useState('overview')

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
    reason: inspection.damaged_reason,
  }))

  if (latestHarvest) {
    damageData.push({
      date: formatDate(latestHarvest.harvest_date),
      damaged: latestHarvest.damaged_quantity || 0,
      reason: latestHarvest.damaged_reason || 'Unknown',
    })
  }

  const harvestData = [
    { name: 'Yield', value: latestHarvest?.yield_quantity || 0 },
    { name: 'Damaged', value: latestHarvest?.damaged_quantity || 0 },
  ]

  const formatCurrency = (amount: number | undefined) => {
    return amount !== undefined ? `₱${amount.toLocaleString()}` : 'N/A'
  }

  return (
    <Card className='max-w-6xl mx-auto bg-card text-card-foreground shadow-lg rounded-[var(--radius)] overflow-hidden'>
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
            <Button
              size='sm'
              variant='secondary'
              className='bg-secondary text-secondary-foreground hover:bg-secondary/90'
            >
              <Edit3 className='mr-2 h-4 w-4' />
              Edit
            </Button>
            <Button
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
            </Button>
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
                          {harvest.field_location}
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
                        <Badge variant='outline'>
                          {formatCurrency(harvest.expenses)}
                        </Badge>
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
                          name='Damaged (kg)'
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
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Crop Type:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.crops.name}
                              </Badge>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-muted-foreground'>
                                Variety:
                              </span>
                              <Badge variant='secondary'>
                                {harvest.crop_varieties.name}
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
                  <div className='mt-6'>
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
                  </div>
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
                        {totalDamaged} kg
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
                        <CardContent className='p-4'>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='font-medium text-lg flex items-center'>
                              {visit.damaged > 0 ? (
                                <XCircle className='mr-2 h-5 w-5 text-destructive' />
                              ) : (
                                <CheckCircle className='mr-2 h-5 w-5 text-primary' />
                              )}
                              {formatDate(visit.date)}
                            </span>
                            <Badge
                              variant={
                                visit.damaged > 0 ? 'destructive' : 'default'
                              }
                            >
                              {visit.damaged > 0
                                ? `${visit.damaged} kg damaged`
                                : 'No damage'}
                            </Badge>
                          </div>
                          <p className='text-muted-foreground mb-2'>
                            {visit.findings || 'No findings recorded'}
                          </p>
                          <div className='flex justify-between items-center text-sm'>
                            <span className='text-muted-foreground'>
                              Reason: {visit.damaged_reason || 'N/A'}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-primary hover:text-primary/80'
                            >
                              View Details
                              <ChevronRight className='ml-2 h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    <Eye className='mr-2 h-4 w-4' />
                    View All Visits
                  </Button>
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
                            <p className='text-white text-sm'>View Full Size</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full' variant='outline'>
                    <UploadCloud className='mr-2 h-4 w-4' />
                    Upload New Photos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
