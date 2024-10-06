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
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import useGetAllCropData from '@/hooks/crop/useGetAllCropData'

export default function ImprovedPlantingForm() {
  const { data: allCropData = [] } = useGetAllCropData()
  const categories = Array.isArray(allCropData) ? allCropData : []

  const FormSchema = z
    .object({
      farmerId: z.string().min(1, { message: 'Farmer selection is required' }),
      cropCategory: z.string().min(1, { message: 'Crop category is required' }),
      landType: z.string().optional(),
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
        const { cropCategory, landType } = data
        const isRice =
          categories.find((c) => c.id === cropCategory)?.name?.toLowerCase() ===
          'rice'
        return !isRice || (isRice && landType)
      },
      {
        message: 'Land type is required for rice crops',
        path: ['landType'],
      },
    )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      landType: '',
    },
  })

  const queryClient = useQueryClient()
  const { data: farmers } = useFetchFarmersByUserId()
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

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [step, setStep] = useState(1)

  const onLocationSelect = (locationName: string, coords: [number, number]) => {
    setSelectedLocation(locationName)
    setValue('fieldLocation', locationName)
    setCoordinates(coords) // Store the coordinates
    console.log('Selected Location:', locationName)
    console.log('Coordinates:', coords) // Log the coordinates
  }

  function calculateHarvestDate(plantingDate: string, cropCategory: string) {
    const daysToHarvest: { [key: string]: number } = {
      rice: 120,
      corn: 90,
      'high-value': 60,
    }

    if (!plantingDate || !cropCategory) return ''

    const days = daysToHarvest[cropCategory.toLowerCase()] || 0
    const planting = new Date(plantingDate)
    planting.setDate(planting.getDate() + days)

    return planting.toISOString().split('T')[0]
  }

  useEffect(() => {
    if (plantingDate && selectedCategory) {
      const harvestDate = calculateHarvestDate(
        plantingDate,
        categoryNames[selectedCategory],
      )
      setValue('harvestDate', harvestDate)
    }
  }, [plantingDate, selectedCategory, setValue, categoryNames])

  useEffect(() => {
    if (selectedCategory) {
      const categoryName = categoryNames[selectedCategory] || 'Unknown Category'
      console.log(categoryName)
      if (categoryName.toLowerCase() !== 'rice') {
        setValue('landType', '')
      }
    }
  }, [selectedCategory, categoryNames, setValue])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const harvestDate = new Date(data.harvestDate)
        const status = isToday(harvestDate) ? 'harvest' : 'inspection'

        await addPlantingRecord({
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
          landType: data.landType,
          status: status,
          latitude: coordinates ? coordinates[0] : 0, // Save latitude
          longitude: coordinates ? coordinates[1] : 0, // Save longitude
        })
        console.log('Form submitted successfully')
        form.reset()
        setSelectedLocation('')
        setCoordinates(null) // Reset coordinates on form reset
        setStep(1)
        toast.success('Crop added successfully!')
        await queryClient.invalidateQueries({ queryKey: ['inspections'] })
      } catch (error) {
        console.error('Failed to submit form:', error)
        toast.error('Failed to submit form. Please try again later.')
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
                    setValue={setValue}
                    selectedCategory={selectedCategory}
                    selectedCrop={selectedCrop}
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
                coordinates={coordinates} // Pass coordinates here
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
                      !form.watch('landType'))
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
