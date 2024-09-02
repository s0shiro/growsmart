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

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const FormSchema = z.object({
  dateOfInspection: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for Date of Inspection',
  }),
  damagedQuantity: z
    .string()
    .regex(/^\d+$/, 'Damaged Quantity must be a number'),
  damagedReason: z
    .string()
    .max(256, 'Damaged Reason must be 256 characters or less'),
  findings: z.string(),
})

function InspectionForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
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
                <FormLabel>Damaged Quantity</FormLabel>
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
                    placeholder='Findings'
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
