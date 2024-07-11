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
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits')
    .transform((number) => parseInt(number, 10)),
})

function CreateFarmerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    console.log(typeof data.phoneNumber)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          {/* firstname */}
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input
                    placeholder='firstname'
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
          {/* lastname */}
          <FormField
            control={form.control}
            name='lastname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input
                    placeholder='lastname'
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

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
          {/* gender */}
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Male'
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

          {/* municipality */}
          <FormField
            control={form.control}
            name='municipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipality</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Gasan'
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

          {/* barangay */}
          <FormField
            control={form.control}
            name='barangay'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Libtangin'
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

        {/* phoneNumber */}
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>PhoneNumber</FormLabel>
              <FormControl>
                <Input
                  placeholder='phonenumber'
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

export default CreateFarmerForm
