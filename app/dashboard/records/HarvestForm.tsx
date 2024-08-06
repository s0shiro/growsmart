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
import { addHarvest } from '@/lib/harvests'
import { updateStatusWhenAddHarvest } from '@/lib/planting'

const FormSchema = z.object({
  harvestDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for plantingDate',
  }),
  yieldQuantity: z.string(),
  profit: z.string(),
  areaHarvested: z.string(),
  damagedQuantity: z.string(),
  damagedReason: z.string(),
})

type CropFormFieldName =
  | 'harvestDate'
  | 'yieldQuantity'
  | 'profit'
  | 'areaHarvested'
  | 'damagedQuantity'
  | 'damagedReason'

const fieldConfigs: {
  name: CropFormFieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'harvestDate',
    placeholder: 'Harvest Date',
    label: 'Harvest Date',
    type: 'date',
  },
  {
    name: 'yieldQuantity',
    placeholder: 'Yield',
    label: 'Yield',
    type: 'number',
  },
  {
    name: 'profit',
    placeholder: 'Profit',
    label: 'Profit',
    type: 'number',
  },
  {
    name: 'areaHarvested',
    placeholder: 'Area Harvested',
    label: 'Area',
    type: 'number',
  },
  {
    name: 'damagedQuantity',
    placeholder: 'Damage Quantity',
    label: 'Damaged',
    type: 'number',
  },
  {
    name: 'damagedReason',
    placeholder: 'Pest',
    label: 'Reason',
    type: 'text',
  },
]

function HarvestForm({
  plantingID,
  farmerID,
}: {
  plantingID: string
  farmerID: string | undefined
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await addHarvest({
        plantingId: plantingID,
        farmerId: farmerID,
        harvestDate: data.harvestDate,
        yieldQuantity: data.yieldQuantity,
        profit: data.profit,
        areaHarvested: data.areaHarvested,
        damagedQuantity: data.damagedQuantity,
        damagedReason: data.damagedReason,
      })

      await updateStatusWhenAddHarvest(plantingID)
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

export default HarvestForm
