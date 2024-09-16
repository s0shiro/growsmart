'use client'

import { useForm, useWatch } from 'react-hook-form'
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
import SelectField from '../../(components)/CustomSelectField'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useFetchBarangays,
  useFetchMunicipalities,
} from '@/hooks/municipalities/useFetchMunicipalities'
import useReadAssociation from '@/hooks/useReadAssociations'
import SelectFieldName from './SelecFieldName'

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  association: z.string(),
  position: z.string(),
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
  {
    name: 'gender',
    placeholder: 'Select Gender',
    label: 'Gender',
    type: 'select',
  },
  {
    name: 'municipality',
    placeholder: 'Select a municipality',
    label: 'Municipality',
    type: 'select',
  },
  {
    name: 'barangay',
    placeholder: 'Select a barangay',
    label: 'Barangay',
    type: 'select',
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
    type: 'select',
  },
  {
    name: 'position',
    placeholder: 'Select Position',
    label: 'Position',
    type: 'select',
  },
]

const positions = [
  { id: 'member', name: 'Member' },
  { id: 'president', name: 'President' },
  { id: 'vice_president', name: 'Vice President' },
  { id: 'secretary', name: 'Secretary' },
  { id: 'treasurer', name: 'Treasurer' },
  { id: 'board_member', name: 'Board Member' },
]

function CreateFarmerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const addFarmerMutation = useAddFarmer()
  const [isPending, startTransition] = useTransition()
  const { data: associations, error, isLoading } = useReadAssociation()
  const { data: municipalities } = useFetchMunicipalities()

  // Watch municipality selection
  const selectedMunicipality = useWatch({
    control: form.control,
    name: 'municipality',
  })

  // Fetch barangays based on selected municipality
  const { data: barangays } = useFetchBarangays(selectedMunicipality || '')

  console.log(municipalities)
  console.log('Selected Municipality:', selectedMunicipality)
  console.log('Barangays:', barangays)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Get the selected municipality name based on its code
    const selectedMunicipality = municipalities?.find(
      (mun: any) => mun.code === data.municipality,
    )?.name

    // Get the selected barangay name based on its code
    const selectedBarangay = barangays?.find(
      (brgy: any) => brgy.code === data.barangay,
    )?.name

    // Proceed with form submission, sending the names instead of codes
    startTransition(() => {
      addFarmerMutation.mutate(
        {
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          municipality: selectedMunicipality, // Send name instead of code
          barangay: selectedBarangay, // Send name instead of code
          phoneNumber: data.phoneNumber,
          association_id: data.association,
          position: data.position,
        },
        {
          onSuccess: () => {
            toast.success('Farmer created successfully!')
            document.getElementById('create-trigger')?.click()
          },
          onError: (error: any) => {
            toast.error('Failed to create farmer.')
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
                <SelectField
                  control={form.control}
                  key={name}
                  name='association'
                  label='Association'
                  placeholder='Select Association'
                  options={
                    associations?.map((assoc) => ({
                      id: assoc.id,
                      name: assoc.name,
                    })) || []
                  }
                />
              )
            } else if (type === 'select' && name === 'municipality') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='municipality'
                  label='Municipality'
                  placeholder='Select Municipality'
                  options={
                    municipalities?.map((mun: any) => ({
                      id: mun.code,
                      name: mun.name,
                    })) || []
                  }
                />
              )
            } else if (type === 'select' && name === 'barangay') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='barangay'
                  label='Barangay'
                  placeholder='Select Barangay'
                  options={
                    barangays?.map((brgy: any) => ({
                      id: brgy.code,
                      name: brgy.name,
                    })) || []
                  }
                  disabled={!selectedMunicipality} // Disable until a municipality is selected
                />
              )
            } else if (type === 'select' && name === 'gender') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='gender'
                  label='Gender'
                  placeholder='Select Gender'
                  options={[
                    { id: 'male', name: 'Male' },
                    { id: 'female', name: 'Female' },
                  ]}
                />
              )
            } else if (type === 'select' && name === 'position') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='position'
                  label='Position'
                  placeholder='Select Position'
                  options={positions}
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
          type='submit'
          className='w-full flex gap-2 items-center dark:bg-green-500'
          variant='outline'
          disabled={isPending}
        >
          Add
          <Loader2 className={cn('animate-spin', { hidden: !isPending })} />
        </Button>
      </form>
    </Form>
  )
}

export default CreateFarmerForm
