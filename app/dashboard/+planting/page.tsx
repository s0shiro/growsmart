'use client'

import { useTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { addPlantingRecord } from '@/lib/planting'
import { isToday } from 'date-fns'
import useFetchFarmersByUserId from '@/hooks/farmer/useFetchFarmersByUserId'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FarmerSelection from '@/app/dashboard/+planting/components/FarmerSelection'
import CropDetails from '@/app/dashboard/+planting/components/CropDetailsComponent'
import FieldLocation from '@/app/dashboard/+planting/components/FieldLocationComponent'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useGetAllCropData from '@/hooks/crop/useGetAllCropData'
import { useToast } from '@/components/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { getOneFarmer } from '@/lib/farmer'

export default function ImprovedPlantingForm() {
  const { data: allCropData = [] } = useGetAllCropData()
  const categories = Array.isArray(allCropData) ? allCropData : []

  const FormSchema = z
    .object({
      farmerId: z.string().min(1, { message: 'Farmer selection is required' }),
      cropCategory: z.string().min(1, { message: 'Crop category is required' }),
      categorySpecific: z.object({
        landType: z.string().optional(),
        waterSupply: z.string().optional(),
        classification: z.string().optional(),
      }),
      remarks: z.string(),
      cropType: z.string().min(1, { message: 'Crop name is required' }),
      variety: z.string().min(1, { message: 'Variety is required' }),
      plantingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for planting date',
      }),
      fieldLocation: z
        .string()
        .min(1, { message: 'Field location is required' }),
      areaPlanted: z.string().min(1, { message: 'Area planted is required' }),
      quantity: z.string().min(1, { message: 'Quantity is required' }),
      expenses: z.string().min(1, { message: 'Expenses are required' }),
      harvestDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for harvest date',
      }),
    })
    .refine(
      (data) => {
        const { cropCategory, categorySpecific } = data
        const isRice =
          categories.find((c) => c.id === cropCategory)?.name?.toLowerCase() ===
          'rice'
        return !isRice || (isRice && categorySpecific.landType)
      },
      {
        message: 'Land type is required for rice crops',
        path: ['categorySpecific', 'landType'],
      },
    )
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farmerId: '',
      cropCategory: '',
      categorySpecific: {
        landType: '',
        waterSupply: '',
        classification: '',
      },
      remarks: '',
      cropType: '',
      variety: '',
      plantingDate: '',
      fieldLocation: '',
      areaPlanted: '',
      quantity: '',
      expenses: '',
      harvestDate: '',
    },
  })

  const queryClient = useQueryClient()
  const { data: farmers, isFetching } = useFetchFarmersByUserId()
  const { watch, setValue } = form

  const categoryNames = categories.reduce(
    (acc: Record<string, string>, category: any) => {
      acc[category.id] = category.name
      return acc
    },
    {},
  )
  const [isPending, startTransition] = useTransition()

  const selectedFarmer = watch('farmerId')
  const selectedCategory = watch('cropCategory')
  const plantingDate = watch('plantingDate')
  const selectedCrop = watch('cropType')
  const selectedVariety = watch('variety')

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const router = useRouter()

  const { data: selectedFarmerDetails } = useQuery({
    queryKey: ['farmer', selectedFarmer],
    queryFn: () => (selectedFarmer ? getOneFarmer(selectedFarmer) : null),
    enabled: !!selectedFarmer,
  })

  const onLocationSelect = (locationName: string, coords: [number, number]) => {
    setSelectedLocation(locationName)
    setValue('fieldLocation', locationName)
    setCoordinates(coords)
    console.log('Selected Location:', locationName)
    console.log('Coordinates:', coords)
  }

  function calculateHarvestDate(
    plantingDate: string,
    cropCategory: string,
    selectedVariety: any,
  ) {
    const defaultDaysToHarvest: { [key: string]: number } = {
      rice: 120,
      corn: 90,
      'high-value': 60,
    }

    if (!plantingDate || !cropCategory) return ''

    console.log('Selected Variety:', selectedVariety)
    console.log('Variety Maturity Days:', selectedVariety?.maturity_days)
    console.log(
      'Default Days:',
      defaultDaysToHarvest[cropCategory.toLowerCase()],
    )

    // Use variety's maturity_days if available, otherwise use default
    const days =
      selectedVariety?.maturity_days ||
      defaultDaysToHarvest[cropCategory.toLowerCase()] ||
      90

    const planting = new Date(plantingDate)
    planting.setDate(planting.getDate() + days)
    return planting.toISOString().split('T')[0]
  }

  const varieties = selectedCrop
    ? categories
        .find((c: any) => c.id === selectedCategory)
        ?.crops.find((crop: any) => crop.id === selectedCrop)?.crop_varieties ||
      []
    : []

  useEffect(() => {
    if (plantingDate && selectedCategory) {
      const variety = varieties.find((v: any) => v.id === selectedVariety)
      console.log('Current Variety:', variety)
      const harvestDate = calculateHarvestDate(
        plantingDate,
        categoryNames[selectedCategory],
        variety,
      )
      setValue('harvestDate', harvestDate)
    }
  }, [
    plantingDate,
    selectedCategory,
    selectedVariety,
    setValue,
    categoryNames,
    varieties,
  ])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const harvestDate = new Date(data.harvestDate)
        const status = isToday(harvestDate) ? 'harvest' : 'inspection'

        const res = await addPlantingRecord({
          farmerId: data.farmerId,
          cropCategory: data.cropCategory,
          cropType: data.cropType,
          variety: data.variety,
          plantingDate: data.plantingDate,
          fieldLocation: data.fieldLocation,
          areaPlanted: data.areaPlanted,
          quantity: data.quantity,
          expenses: data.expenses,
          harvestDate: data.harvestDate,
          categorySpecific: {
            landType: data.categorySpecific.landType,
            waterSupply: data.categorySpecific.waterSupply,
            classification: data.categorySpecific.classification,
          },
          status: status,
          remarks: data.remarks,
          latitude: coordinates ? coordinates[0] : 0,
          longitude: coordinates ? coordinates[1] : 0,
        })
        console.log('Form submitted successfully')
        form.reset()
        setSelectedLocation('')
        setCoordinates(null)
        setStep(1)
        toast({
          title: 'Planting Added!🎉',
          description: `Expected harvest ${formatDate(data.harvestDate)}📅.`,
        })
        await queryClient.invalidateQueries({ queryKey: ['inspections'] })
        router.push(`/dashboard/standing`)
      } catch (error) {
        console.error('Failed to submit form:', error)
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong."',
          description: 'Please try again later.',
        })
      }
    })
  }

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key='farmer-selection'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Farmer Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <FarmerSelection
                    control={form.control}
                    farmers={farmers || []}
                    isLoading={isFetching}
                  />
                </CardContent>
              </Card>
              <div className='flex justify-end mt-4'>
                <Button
                  type='button'
                  onClick={nextStep}
                  disabled={!selectedFarmer}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key='crop-details'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='w-full mx-auto'>
                <CardHeader>
                  <CardTitle className='text-2xl'>Crop Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <CropDetails
                    control={form.control}
                    setValue={form.setValue}
                    farmerLandSize={selectedFarmerDetails?.land_size}
                    errors={form.formState.errors}
                  />
                </CardContent>
              </Card>
              <div className='flex justify-between mt-4'>
                <Button type='button' onClick={prevStep}>
                  Previous
                </Button>
                <Button type='button' onClick={nextStep}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key='field-location'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <FieldLocation
                selectedLocation={selectedLocation}
                coordinates={coordinates}
                onLocationSelect={onLocationSelect}
                errorMessage={form.formState.errors.fieldLocation?.message}
              />
              <div className='flex justify-between mt-4'>
                <Button type='button' onClick={prevStep}>
                  Previous
                </Button>
                <Button
                  type='submit'
                  disabled={
                    isPending ||
                    (categoryNames[selectedCategory]?.toLowerCase() ===
                      'rice' &&
                      !form.watch('categorySpecific.landType'))
                  }
                >
                  {isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  )
}
