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

import { useTransition } from 'react'
import { useAddFarmer } from '@/hooks/useAddFarmer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useReadAssociation from '@/hooks/useReadAssociations'

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  association: z.string(), // Assuming it's a string, update if different
  position: z.string(), // Assuming it's a string, update if different
})

type FarmerFieldNames =
  | 'firstname'
  | 'lastname'
  | 'gender'
  | 'municipality'
  | 'barangay'
  | 'phoneNumber'
  | 'association'
  | 'position'

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
  {
    name: 'association',
    placeholder: 'Select an association',
    label: 'Association',
    type: 'select', // We'll handle the select type specifically
  },
  {
    name: 'position',
    placeholder: 'Position',
    label: 'Position',
    type: 'text',
  },
]

function CreateFarmerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const addFarmerMutation = useAddFarmer()
  const [isPending, startTransition] = useTransition()
  const { data: associations, error, isLoading } = useReadAssociation()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(() => {
      addFarmerMutation.mutate(
        {
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          municipality: data.municipality,
          barangay: data.barangay,
          phoneNumber: data.phoneNumber,
          association: data.association,
          position: data.position,
        },
        {
          onSuccess: () => {
            console.log('Farmer created successfully', data)
            form.reset()
          },
          onError: (error: any) => {
            console.error('Failed to create farmer:', error)
          },
        },
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          {fieldConfigs.map(({ name, placeholder, label, type }) => {
            if (type === 'select' && name === 'association') {
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {associations?.map((association: any) => (
                            <SelectItem
                              value={association.id}
                              key={association.id}
                            >
                              {association.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
                          onChange={field.onChange}
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
          disabled={form.formState.isSubmitting || isPending}
          type='submit'
          variant='outline'
          className='w-full'
        >
          {form.formState.isSubmitting || isPending
            ? 'Submitting...'
            : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default CreateFarmerForm
