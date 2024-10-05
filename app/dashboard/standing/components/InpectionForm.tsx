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

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { recordInspection } from '@/lib/inspection'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { updateStatusWhenAddHarvest } from '@/lib/planting'

const FormSchema = z.object({
  dateOfInspection: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for Date of Inspection',
  }),
  damagedQuantity: z.coerce.number().nonnegative(),
  damagedReason: z
    .string()
    .max(256, 'Damaged Reason must be 256 characters or less'),
  findings: z.string().optional(),
})

function InspectionForm({ plantingID }: { plantingID: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await recordInspection({
        plantingID: plantingID,
        dateOfInspection: data.dateOfInspection,
        damagedQuantity: data.damagedQuantity,
        damagedReason: data.damagedReason,
        findings: data.findings,
      })

      document.getElementById('create-visit')?.click()
      toast.success('Successfully record visit!')
      console.log('visit record successfully!')
      await queryClient.invalidateQueries({
        queryKey: ['crop-planting-record', plantingID],
      })
      form.reset()
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='dateOfInspection'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Of Inspection</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Date of Inspection'
                    type='date'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='damagedQuantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Damaged Quantity (kg)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Damaged Quantity'
                    type='number'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='damagedReason'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Damaged Reason</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Reason for Damage'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                    maxLength={256}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='findings'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Findings</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Findings (optional)'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full h-32 resize-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default InspectionForm
