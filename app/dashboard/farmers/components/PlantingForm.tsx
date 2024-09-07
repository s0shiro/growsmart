'use client'

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
import { addPlantingRecord } from '@/lib/planting'
import { isToday } from 'date-fns'

import useGetCropCategory from '@/hooks/useGetCropCategory'
import { useFetchCrops, useFetchVarieties } from '@/hooks/useCrops'
import SelectField from '../../(components)/CustomSelectField'

const FormSchema = z.object({
  cropCategory: z.string(),
  cropType: z.string(),
  variety: z.string(),
  plantingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for plantingDate',
  }),
  fieldLocation: z.string(),
  areaPlanted: z.string(),
  quantity: z.string(),
  weatherCondition: z.string(),
  expenses: z.string(),
  harvestDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for harvestDate',
  }),
})

// Define a type for the allowed field names
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
    placeholder: 'Planting Date',
    label: 'Planting Date',
    type: 'date',
  },
  {
    name: 'fieldLocation',
    placeholder: 'Field Location',
    label: 'Field Location',
    type: 'text',
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
    placeholder: 'Harvest Date',
    label: 'Harvest Date',
    type: 'date',
  },
]

function PlantingForm({ farmerID }: { farmerID: string | undefined }) {
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
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          {fieldConfigs.map(({ name, placeholder, label, type }) => {
            if (type === 'select' && name === 'cropCategory') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
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
                    setValue('cropType', '') // Reset crop type when category changes
                    setValue('variety', '') // Reset variety when category changes
                  }}
                />
              )
            } else if (type === 'select' && name === 'cropType') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='cropType'
                  label='Crop Name'
                  placeholder='Select Crop Name'
                  options={
                    crops?.map((crop) => ({
                      id: crop.id,
                      name: crop.name ?? '', // Provide a default value if name is null
                    })) || []
                  }
                  onChange={(value) => {
                    setValue('variety', '') // Reset variety when crop changes
                  }}
                  disabled={!selectedCategory} // Disable if no category is selected
                />
              )
            } else if (type === 'select' && name === 'variety') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='variety'
                  label='Variety'
                  placeholder='Select Variety'
                  options={
                    varieties?.map((variety) => ({
                      id: variety.id,
                      name: variety.name ?? '',
                    })) || []
                  }
                  disabled={!selectedCrop} // Disable if no crop is selected
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
                          className='mt-1 block w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            }
          })}
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          variant='outline'
          className='w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default PlantingForm
