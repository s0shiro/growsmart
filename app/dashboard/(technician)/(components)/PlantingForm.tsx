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

const FormSchema = z.object({
  fullname: z.string(),
  cropType: z.string(),
  variety: z.string(),
  plantingDate: z.string(),
  fieldLocation: z.string(),
  areaPlanted: z.string(),
  seedQuantity: z.string(),
  seedSource: z.string(),
  fertilizerUsed: z.string(),
  weatherCondition: z.string(),
  totalSpendAmount: z.string(),
})

function CreatePlantingForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
          {/* fullname */}
          <FormField
            control={form.control}
            name='fullname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input
                    placeholder='fullname'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* cropType */}
          <FormField
            control={form.control}
            name='cropType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder='cropType'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* variety */}
          <FormField
            control={form.control}
            name='variety'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variety</FormLabel>
                <FormControl>
                  <Input
                    placeholder='variety'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* plantingDate */}
          <FormField
            control={form.control}
            name='plantingDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planting Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder='plantingDate'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* fieldLocation */}
          <FormField
            control={form.control}
            name='fieldLocation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder='fieldLocation'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* areaPlanted */}
          <FormField
            control={form.control}
            name='areaPlanted'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Planted</FormLabel>
                <FormControl>
                  <Input
                    placeholder='areaPlanted'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* seedQuantity */}
          <FormField
            control={form.control}
            name='seedQuantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder='seedQuantity'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* seedSource */}
          <FormField
            control={form.control}
            name='seedSource'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder='seedSource'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* fertilizerUsed */}
          <FormField
            control={form.control}
            name='fertilizerUsed'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fertilizer Used</FormLabel>
                <FormControl>
                  <Input
                    placeholder='fertilizerUsed'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* weatherCondition */}
          <FormField
            control={form.control}
            name='weatherCondition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather Condition</FormLabel>
                <FormControl>
                  <Input
                    placeholder='weatherCondition'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* totalSpendAmount */}
          <FormField
            control={form.control}
            name='totalSpendAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Spend Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder='totalSpendAmount'
                    type='text'
                    {...field}
                    onChange={field.onChange}
                    className='mt-1 block w-full'
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

export default CreatePlantingForm
