'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { addPlantingRecord } from '@/lib/planting'
import { isToday } from 'date-fns'
import { MapPin } from 'lucide-react'

import useGetCropCategory from '@/hooks/crop/useGetCropCategory'
import { useFetchCrops, useFetchVarieties } from '@/hooks/crop/useCrops'
import SelectField from '../(components)/forms/CustomSelectField'
import MapComponent from '../myfarmers/components/MapComponent'

const FormSchema = z.object({
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

type FieldName = keyof z.infer<typeof FormSchema>

const fieldConfigs: {
  name: FieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'cropCategory',
    placeholder: 'Select Category',
    label: 'Crop Category',
    type: 'select',
  },
  {
    name: 'cropType',
    placeholder: 'Select Crop Name',
    label: 'Crop Name',
    type: 'select',
  },
  {
    name: 'variety',
    placeholder: 'Select Variety',
    label: 'Variety',
    type: 'select',
  },
  {
    name: 'plantingDate',
    placeholder: 'mm/dd/yyyy',
    label: 'Planting Date',
    type: 'date',
  },
  {
    name: 'areaPlanted',
    placeholder: 'Area Planted',
    label: 'Area Planted',
    type: 'number',
  },
  {
    name: 'quantity',
    placeholder: 'Quantity',
    label: 'Quantity',
    type: 'number',
  },
  {
    name: 'weatherCondition',
    placeholder: 'Weather Condition',
    label: 'Weather Condition',
    type: 'text',
  },
  {
    name: 'expenses',
    placeholder: 'Expenses',
    label: 'Expenses',
    type: 'number',
  },
  {
    name: 'harvestDate',
    placeholder: 'mm/dd/yyyy',
    label: 'Harvest Date',
    type: 'date',
  },
]


export default function ImprovedPlantingForm({
  farmerID,
}: {
  farmerID: string | undefined
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const { data: categories } = useGetCropCategory()
  const { watch, setValue } = form

  const selectedCategory = watch('cropCategory')
  const selectedCrop = watch('cropType')

  const { data: crops } = useFetchCrops(selectedCategory)
  const { data: varieties } = useFetchVarieties(selectedCrop)

  const [selectedLocation, setSelectedLocation] = useState<string>('')

  const onLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName)
    setValue('fieldLocation', locationName)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const harvestDate = new Date(data.harvestDate)
      const status = isToday(harvestDate) ? 'harvest' : 'inspection'

      await addPlantingRecord({
        farmerId: farmerID,
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
      console.log('Form submitted successfully', data)
      form.reset()
      setSelectedLocation('')
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Crop Details</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {fieldConfigs.map(({ name, placeholder, label, type }) => {
                if (type === 'select' && name === 'cropCategory') {
                  return (
                    <SelectField
                      key={name}
                      control={form.control}
                      name='cropCategory'
                      label='Crop Category'
                      placeholder='Select Category'
                      options={
                        Array.isArray(categories)
                          ? categories.map((category: any) => ({
                              id: category.id,
                              name: category.name,
                            }))
                          : []
                      }
                      onChange={(value) => {
                        setValue('cropType', '')
                        setValue('variety', '')
                      }}
                    />
                  )
                } else if (type === 'select' && name === 'cropType') {
                  return (
                    <SelectField
                      key={name}
                      control={form.control}
                      name='cropType'
                      label='Crop Name'
                      placeholder='Select Crop Name'
                      options={
                        crops?.map((crop) => ({
                          id: crop.id,
                          name: crop.name ?? '',
                        })) || []
                      }
                      onChange={(value) => {
                        setValue('variety', '')
                      }}
                      disabled={!selectedCategory}
                    />
                  )
                } else if (type === 'select' && name === 'variety') {
                  return (
                    <SelectField
                      key={name}
                      control={form.control}
                      name='variety'
                      label='Variety'
                      placeholder='Select Variety'
                      options={
                        varieties?.map((variety) => ({
                          id: variety.id,
                          name: variety.name ?? '',
                        })) || []
                      }
                      disabled={!selectedCrop}
                    />
                  )
                } else {
                  return (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={placeholder}
                              type={type}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                }
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Field Location</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Please point the location on the map to insert the field
                location.
              </p>
              <div className='h-[300px] rounded-md overflow-hidden'>
                <MapComponent onLocationSelect={onLocationSelect} />
              </div>
              {selectedLocation && (
                <div className='flex items-center text-sm text-green-600'>
                  <MapPin className='w-4 h-4 mr-2' />
                  Selected Location: {selectedLocation}
                </div>
              )}
              {form.formState.errors.fieldLocation && (
                <p className='text-sm text-destructive'>
                  {form.formState.errors.fieldLocation?.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? 'Submitting...'
            : 'Submit Planting Record'}
        </Button>
      </form>
    </Form>
  )
}
