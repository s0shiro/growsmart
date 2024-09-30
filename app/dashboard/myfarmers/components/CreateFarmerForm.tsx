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
import { useState } from 'react'
import { useAddFarmer } from '@/hooks/farmer/useAddFarmer'
import SelectField from '../../(components)/forms/CustomSelectField'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useFetchBarangays,
  useFetchMunicipalities,
} from '@/hooks/municipalities/useFetchMunicipalities'
import useReadAssociation from '@/hooks/association/useReadAssociations'
import SelectFieldName from './SelecFieldName'
import { SingleImageDropzone } from '@/app/dashboard/(components)/forms/single-image-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEdgeStore } from '@/lib/edgestore'

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
  avatar: z.string().optional(),
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
  const { data: associations, error, isLoading } = useReadAssociation()
  const { data: municipalities } = useFetchMunicipalities()
  const [file, setFile] = useState<File>()

  const { edgestore } = useEdgeStore()

  // Watch municipality selection
  const selectedMunicipality = useWatch({
    control: form.control,
    name: 'municipality',
  })

  // Fetch barangays based on selected municipality
  const { data: barangays } = useFetchBarangays(selectedMunicipality || '')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Get the selected municipality name based on its code
    const selectedMunicipality = municipalities?.find(
      (mun: any) => mun.code === data.municipality,
    )?.name

    // Get the selected barangay name based on its code
    const selectedBarangay = barangays?.find(
      (brgy: any) => brgy.code === data.barangay,
    )?.name

    // Upload the avatar if a file is selected
    let avatarUrl = data.avatar
    if (file) {
      try {
        const res = await edgestore.myPublicImages.upload({
          file,
          input: { type: 'avatar' },
          onProgressChange: (progress) => {
            console.log(progress)
          },
        })
        avatarUrl = res.url
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload avatar.')
        return
      }
    }

    try {
      await addFarmerMutation.mutateAsync({
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        municipality: selectedMunicipality, // Send name instead of code
        barangay: selectedBarangay, // Send name instead of code
        phoneNumber: data.phoneNumber,
        association_id: data.association,
        position: data.position,
        avatar: avatarUrl,
      })
      toast.success('Farmer created successfully!')
      document.getElementById('create-trigger')?.click()
    } catch (error) {
      console.error('Error creating farmer:', error)
      toast.error('Failed to create farmer.')
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create New Farmer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className="flex justify-center mb-6">
              <SingleImageDropzone
                width={200}
                height={200}
                value={file}
                dropzoneOptions={{
                  maxSize: 1024 * 1024, // 1MB
                }}
                onChange={(file) => {
                  setFile(file);
                }}
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateFarmerForm