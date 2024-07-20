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
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
})

type FarmerFieldNames =
  | 'firstname'
  | 'lastname'
  | 'gender'
  | 'municipality'
  | 'barangay'
  | 'phoneNumber'

const fieldConfigs: {
  name: FarmerFieldNames
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'firstname',
    placeholder: 'firstname',
    label: 'Firstname',
    type: 'text',
  },
  {
    name: 'lastname',
    placeholder: 'lastname',
    label: 'Lastname',
    type: 'text',
  },
  { name: 'gender', placeholder: 'Male', label: 'Gender', type: 'text' },
  {
    name: 'municipality',
    placeholder: 'Gasan',
    label: 'Municipality',
    type: 'text',
  },
  {
    name: 'barangay',
    placeholder: 'Libtangin',
    label: 'Barangay',
    type: 'text',
  },
  {
    name: 'phoneNumber',
    placeholder: 'phonenumber',
    label: 'PhoneNumber',
    type: 'number',
  },
]

function CreateFarmerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createNewFarmer({
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        municipality: data.municipality,
        barangay: data.barangay,
        phoneNumber: data.phoneNumber,
      })
      console.log('Farmer created successfully', data)
      form.reset()
    } catch (error) {
      console.error('Failed to create farmer:', error)
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

export default CreateFarmerForm