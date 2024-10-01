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

const FormSchema = z.object({
  farmerId: z.string().nonempty({ message: 'Farmer selection is required' }),
  cropCategory: z.string().nonempty({ message: 'Crop category is required' }),
  cropType: z.string().nonempty({ message: 'Crop name is required' }),
  variety: z.string().nonempty({ message: 'Variety is required' }),
  plantingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for planting date',
  }),
  fieldLocation: z.string().nonempty({ message: 'Field location is required' }),
  areaPlanted: z.string().nonempty({ message: 'Area planted is required' }),
  quantity: z.string().nonempty({ message: 'Quantity is required' }),
  weatherCondition: z
    .string()
    .nonempty({ message: 'Weather condition is required' }),
  expenses: z.string().nonempty({ message: 'Expenses are required' }),
  harvestDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for harvest date',
  }),
})

// Helper function to calculate harvest date based on category
function calculateHarvestDate(plantingDate: string, cropCategory: string) {
  const daysToHarvest: { [key: string]: number } = {
    palay: 120,
    corn: 90,
    'high-value': 60,
  }

  if (!plantingDate || !cropCategory) return ''

  const days = daysToHarvest[cropCategory] || 0
  const planting = new Date(plantingDate)
  planting.setDate(planting.getDate() + days)

  return planting.toISOString().split('T')[0] // Return in yyyy-mm-dd format
}

export default function ImprovedPlantingForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const queryClient = useQueryClient()
  const { data: farmers } = useFetchFarmersByUserId()
  const { data: allCropData } = useGetAllCropData()
  const { watch, setValue } = form

  const categoryNames = (allCropData || []).reduce(
    (acc: any, category: any) => {
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

  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [step, setStep] = useState(1)

  const onLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName)
    setValue('fieldLocation', locationName)
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
    }
  }, [selectedCategory, categoryNames])

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
          weatherCondition: data.weatherCondition,
          expenses: data.expenses,
          harvestDate: data.harvestDate,
          status: status,
        })
        console.log('Form submitted successfully')
        form.reset()
        setSelectedLocation('')
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
                onLocationSelect={onLocationSelect}
                errorMessage={form.formState.errors.fieldLocation?.message}
              />
              <div className='flex justify-between mt-4'>
                <Button type='button' onClick={prevStep}>
                  Previous
                </Button>
                <Button type='submit' disabled={isPending}>
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
