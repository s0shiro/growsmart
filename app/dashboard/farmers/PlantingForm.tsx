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

const FormSchema = z.object({
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
  status: z.string(),
})

type CropFormFieldName =
  | 'cropType'
  | 'variety'
  | 'plantingDate'
  | 'fieldLocation'
  | 'areaPlanted'
  | 'quantity'
  | 'weatherCondition'
  | 'expenses'
  | 'harvestDate'
  | 'status'

const fieldConfigs: {
  name: CropFormFieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'cropType',
    placeholder: 'Crop Type',
    label: 'Crop Type',
    type: 'text',
  },
  {
    name: 'variety',
    placeholder: 'Variety',
    label: 'Variety',
    type: 'text',
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
  {
    name: 'status',
    placeholder: 'planted',
    label: 'Status',
    type: 'text',
  },
]

function PlantingForm({ farmerID }: { farmerID: string | undefined }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Modify the code here to handle the form submission
      await addPlantingRecord({
        farmerId: farmerID,
        cropType: data.cropType,
        variety: data.variety,
        plantingDate: data.plantingDate,
        fieldLocation: data.fieldLocation,
        areaPlanted: data.areaPlanted,
        quantity: data.quantity,
        weatherCondition: data.weatherCondition,
        expenses: data.expenses,
        harvestDate: data.harvestDate,
        status: data.status,
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
          {fieldConfigs.map(({ name, placeholder, label, type }) => (
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
                      onChange={field.onChange}
                      className='mt-1 block w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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
