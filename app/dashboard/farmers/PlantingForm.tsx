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
import { createNewFarmer } from '@/lib/farmer'

const FormSchema = z.object({
  croptype: z.string(),
  variety: z.string(),
  plantingDate: z.string(),
  fieldLocation: z.string(),
  areaPlanted: z.number(),
  quantity: z.number(),
  weatherCondition: z.string(),
  expenses: z.number(),
  harvestDate: z.string(),
})

type CropFormFieldName =
  | 'croptype'
  | 'variety'
  | 'plantingDate'
  | 'fieldLocation'
  | 'areaPlanted'
  | 'quantity'
  | 'weatherCondition'
  | 'expenses'
  | 'harvestDate'

const fieldConfigs: {
  name: CropFormFieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'croptype',
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
]

function PlantingForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Modify the code here to handle the form submission
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
