'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate, formatCurrency } from '@/lib/utils'
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Tractor,
  Sprout,
  Calendar,
  DollarSign,
  Leaf,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { getOneFarmer } from '@/lib/farmer'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import AddAssistanceForm from './AssistanceForm'
import useFetchAssitanceOfFarmerById from '@/hooks/farmer/useFetchAssitanceOfFarmerById'

interface FarmerProfileProps {
  id: string
}

export default function FarmerProfile({ id }: FarmerProfileProps) {
  const {
    data: farmer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farmer', id],
    queryFn: () => getOneFarmer(id),
  })

  const { data: assistances, isLoading: isLoadingAssistance } =
    useFetchAssitanceOfFarmerById(id)

  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  if (isLoading) {
    return <FarmerProfileSkeleton />
  }

  if (error) {
    return (
      <div className='text-center text-destructive'>
        Error loading farmer profile
      </div>
    )
  }

  if (!farmer) {
    return <div className='text-center'>No farmer data found</div>
  }

  const getQuantityUnit = (assistanceType: string): string => {
    return assistanceType.toLowerCase() === 'farm inputs' ? 'kg' : 'pcs'
  }

  const totalAreaPlanted = farmer.planting_records.reduce(
    (sum, record) => sum + record.area_planted,
    0,
  )
  const totalExpenses = farmer.planting_records.reduce(
    (sum, record) => sum + record.expenses,
    0,
  )
  const totalQuantity = farmer.planting_records.reduce(
    (sum, record) => sum + record.quantity,
    0,
  )

  const cropDistribution = farmer.planting_records.reduce(
    (acc, record) => {
      acc[record.crops.name] =
        (acc[record.crops.name] || 0) + record.area_planted
      return acc
    },
    {} as Record<string, number>,
  )

  const cropDistributionData = Object.entries(cropDistribution).map(
    ([name, value]) => ({ name, value }),
  )

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const expensesOverTime = farmer.planting_records
    .map((record) => ({
      date: formatDate(record.planting_date),
      expenses: record.expenses,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className='space-y-6'>
      <Card className='bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground'>
        <CardHeader className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
          <Avatar className='w-24 h-24 border-4 border-primary-foreground'>
            <AvatarImage
              src={farmer.avatar}
              alt={`${farmer.firstname} ${farmer.lastname}`}
            />
            <AvatarFallback>
              {farmer.firstname[0]}
              {farmer.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div className='text-center sm:text-left'>
            <CardTitle className='text-3xl font-bold'>
              {farmer.firstname} {farmer.lastname}
            </CardTitle>
            <CardDescription className='text-primary-foreground/80'>
              RSBSA: {farmer.rsbsa_number}
            </CardDescription>
            <div className='flex flex-wrap justify-center sm:justify-start gap-2 mt-2'>
              <Badge variant='secondary' className='capitalize'>
                {farmer.gender}
              </Badge>
              {farmer.farmer_associations.map((assoc, index) => (
                <Badge key={index} variant='secondary'>
                  {assoc.position.replace('_', ' ')} - {assoc.association.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='planting-records'>Planting Records</TabsTrigger>
          <TabsTrigger value='assistance'>Assistance</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* <div className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Associations:</span>
                  <ul>
                    {farmer.farmer_associations.map((assoc, index) => (
                      <li key={index}>
                        {assoc.association.name} -{' '}
                        {assoc.position.replace('_', ' ')}
                      </li>
                    ))}
                  </ul>
                </div> */}
                <div className='flex items-center gap-2'>
                  <Phone className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Phone:</span> {farmer.phone}
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Location:</span>{' '}
                  {farmer.barangay}, {farmer.municipality}
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5 text-primary' />
                  <span className='font-medium'>Joined:</span>{' '}
                  {formatDate(farmer.created_at)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Farming Overview
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium'>Total Area Planted</span>
                    <span>{totalAreaPlanted.toFixed(2)} ha</span>
                  </div>
                  <Progress
                    value={(totalAreaPlanted / 10) * 100}
                    className='h-2'
                  />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium'>Total Expenses</span>
                    <span>{formatCurrency(totalExpenses)}</span>
                  </div>
                  <Progress
                    value={(totalExpenses / 100000) * 100}
                    className='h-2'
                  />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium'>Total Revenue</span>
                    <span>{formatCurrency(farmer.totalProfits)}</span>
                  </div>
                  <Progress
                    value={(farmer.totalProfits / 200000) * 100}
                    className='h-2'
                  />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium'>Total Quantity Planted</span>
                    <span>{totalQuantity} kg</span>
                  </div>
                  <Progress
                    value={(totalQuantity / 1000) * 100}
                    className='h-2'
                  />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium'>Active Plantings</span>
                    <span>
                      {
                        farmer.planting_records.filter(
                          (r) => r.status !== 'harvested',
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (farmer.planting_records.filter(
                        (r) => r.status !== 'harvested',
                      ).length /
                        farmer.planting_records.length) *
                      100
                    }
                    className='h-2'
                  />
                </div>
              </CardContent>
            </Card>
            <Card className='md:col-span-2'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Crop Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={cropDistributionData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {cropDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className='md:col-span-2'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Expenses Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={expensesOverTime}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='date' />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type='monotone'
                        dataKey='expenses'
                        stroke='#8884d8'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='planting-records'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                <Tractor className='h-6 w-6 text-primary' />
                Planting Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {farmer.planting_records.map((record: any) => (
                  <Card key={record.id} className='overflow-hidden'>
                    <CardHeader
                      className='bg-muted cursor-pointer'
                      onClick={() =>
                        setExpandedRecord(
                          expandedRecord === record.id ? null : record.id,
                        )
                      }
                    >
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-lg'>
                          {record.crops.name}
                        </CardTitle>
                        {expandedRecord === record.id ? (
                          <ChevronUp className='h-5 w-5' />
                        ) : (
                          <ChevronDown className='h-5 w-5' />
                        )}
                      </div>
                      <CardDescription>
                        {record.crop_varieties.name}
                      </CardDescription>
                    </CardHeader>
                    <AnimatePresence>
                      {expandedRecord === record.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className='pt-4'>
                            <div className='space-y-2'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Planting Date:
                                </span>
                                <span>{formatDate(record.planting_date)}</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Area:
                                </span>
                                <span>{record.area_planted.toFixed(2)} ha</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Quantity:
                                </span>
                                <span>{record.quantity} kg</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Expenses:
                                </span>
                                <span>{formatCurrency(record.expenses)}</span>
                              </div>
                              <div className='flex justify-between items-center'>
                                <span className='text-muted-foreground'>
                                  Status:
                                </span>
                                <Badge
                                  variant={
                                    record.status === 'harvested'
                                      ? 'default'
                                      : 'default'
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='assistance'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-base font-medium'>
                Assistance
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogForm
                      id='add-assistance'
                      title='Add Assistance'
                      description='Record a new assistance for this farmer'
                      Trigger={
                        <Button variant='outline' size='sm'>
                          <Plus className='h-4 w-4 mr-2' />
                          Add Assistance
                        </Button>
                      }
                      form={<AddAssistanceForm farmerID={id} />}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new assistance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              {isLoadingAssistance ? (
                <div className='text-center py-2 text-sm'>
                  Loading assistance data...
                </div>
              ) : assistances && assistances.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {assistances.map((assistance: any) => (
                    <Card key={assistance.id} className='bg-muted'>
                      <CardHeader className='p-4 pb-2'>
                        <div className='flex justify-between items-start'>
                          <Badge variant='default' className='mb-2'>
                            {assistance.assistance_type}
                          </Badge>
                          <span className='text-xs text-muted-foreground'>
                            {formatDate(assistance.date_received)}
                          </span>
                        </div>
                        <CardTitle className='text-sm font-medium'>
                          {assistance.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-4 pt-0'>
                        <div className='text-sm'>
                          <span className='font-medium'>Quantity:</span>{' '}
                          {assistance.quantity}{' '}
                          {getQuantityUnit(assistance.assistance_type)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='text-center py-6'>
                  <Sprout className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-sm font-medium text-muted-foreground mb-1'>
                    No assistance data available
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Assistance will be displayed here once recorded.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FarmerProfileSkeleton() {
  return (
    <div className='container mx-auto p-4 space-y-6'>
      <Card>
        <CardHeader className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
          <Skeleton className='w-24 h-24 rounded-full' />
          <div className='space-y-2 w-full'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
            <div className='flex gap-2'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-20' />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='planting-records'>Planting Records</TabsTrigger>
          <TabsTrigger value='interventions'>Interventions</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(2)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className='h-4 w-full' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {[...Array(2)].map((_, index) => (
              <Card key={index} className='md:col-span-2'>
                <CardHeader>
                  <Skeleton className='h-6 w-1/2' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-64 w-full' />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='planting-records'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-1/4' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(3)].map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className='h-6 w-3/4' />
                      <Skeleton className='h-4 w-1/2' />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='interventions'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-1/4' />
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center py-12'>
                <Skeleton className='h-12 w-12 rounded-full mb-4' />
                <Skeleton className='h-6 w-1/2 mb-2' />
                <Skeleton className='h-4 w-3/4 mb-6' />
                <Skeleton className='h-10 w-40' />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
