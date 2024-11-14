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
import { Loader2, User, Phone, MapPin, CirclePlus } from 'lucide-react'
import {
  useFetchBarangays,
  useFetchMunicipalities,
} from '@/hooks/municipalities/useFetchMunicipalities'
import useReadAssociation from '@/hooks/association/useReadAssociations'
import { SingleImageDropzone } from '@/app/dashboard/(components)/forms/single-image-dropzone'
import { useEdgeStore } from '@/lib/edgestore'
import { Separator } from '@/components/ui/separator'
import { AssociationPositionPair } from './AssociationPair'
import { useToast } from '@/components/hooks/use-toast'

const AssociationPositionSchema = z.object({
  associationId: z.string(),
  position: z.string(),
})

const FormSchema = z.object({
  rsbsaNumber: z.coerce.number(),
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  gender: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  avatar: z.string().optional(),
  associationPositions: z.array(AssociationPositionSchema).min(1),
})

type FarmerFieldNames =
  | 'rsbsaNumber'
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
  icon: React.ElementType
}[] = [
  {
    name: 'rsbsaNumber',
    placeholder: 'RSBSA Number',
    label: 'RSBSA Number',
    type: 'number',
    icon: User,
  },
  {
    name: 'firstname',
    placeholder: 'First name',
    label: 'First Name',
    type: 'text',
    icon: User,
  },
  {
    name: 'lastname',
    placeholder: 'Last name',
    label: 'Last Name',
    type: 'text',
    icon: User,
  },
  {
    name: 'gender',
    placeholder: 'Select Gender',
    label: 'Gender',
    type: 'select',
    icon: User,
  },
  {
    name: 'municipality',
    placeholder: 'Select a municipality',
    label: 'Municipality',
    type: 'select',
    icon: MapPin,
  },
  {
    name: 'barangay',
    placeholder: 'Select a barangay',
    label: 'Barangay',
    type: 'select',
    icon: MapPin,
  },
  {
    name: 'phoneNumber',
    placeholder: 'Phone number',
    label: 'Phone Number',
    type: 'number',
    icon: Phone,
  },
]

function CreateFarmerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const addFarmerMutation = useAddFarmer()
  const { data: associations, error, isLoading } = useReadAssociation()
  const { toast } = useToast()
  const { data: municipalities } = useFetchMunicipalities()
  const [file, setFile] = useState<File>()
  const [associationPositions, setAssociationPositions] = useState([
    { associationId: '', position: '' },
  ])

  const { edgestore } = useEdgeStore()

  const selectedMunicipality = useWatch({
    control: form.control,
    name: 'municipality',
  })

  const { data: barangays } = useFetchBarangays(selectedMunicipality || '')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedMunicipality = municipalities?.find(
      (mun: any) => mun.code === data.municipality,
    )?.name

    const selectedBarangay = barangays?.find(
      (brgy: any) => brgy.code === data.barangay,
    )?.name

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
        return
      }
    }

    try {
      await addFarmerMutation.mutateAsync({
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        municipality: selectedMunicipality,
        barangay: selectedBarangay,
        phoneNumber: data.phoneNumber,
        avatar: avatarUrl,
        rsbsaNumber: data.rsbsaNumber,
        associationPositions: associationPositions,
      })
      toast({
        description: `Farmer added to you list.`,
      })
      document.getElementById('create-trigger')?.click()
    } catch (error) {
      console.error('Error creating farmer:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to add farmer!😢',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center mb-6 mt-2'>
          <SingleImageDropzone
            width={200}
            height={200}
            value={file}
            dropzoneOptions={{
              maxSize: 1024 * 1024,
            }}
            onChange={(file) => {
              setFile(file)
            }}
          />
          <p className='text-sm text-muted-foreground mt-2'>
            Upload farmer's avatar (optional)
          </p>
        </div>
        <Separator />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {fieldConfigs.map(
            ({ name, placeholder, label, type, icon: Icon }) => {
              if (type === 'select') {
                let options: { id: string; name: string }[] = []
                let disabled = false

                switch (name) {
                  case 'municipality':
                    options =
                      municipalities?.map((mun: any) => ({
                        id: mun.code,
                        name: mun.name,
                      })) || []
                    break
                  case 'barangay':
                    options =
                      barangays?.map((brgy: any) => ({
                        id: brgy.code,
                        name: brgy.name,
                      })) || []
                    disabled = !selectedMunicipality
                    break
                  case 'gender':
                    options = [
                      { id: 'male', name: 'Male' },
                      { id: 'female', name: 'Female' },
                    ]
                    break
                }

                return (
                  <SelectField
                    control={form.control}
                    key={name}
                    name={name as any}
                    label={label}
                    placeholder={placeholder}
                    options={options}
                    disabled={disabled}
                    icon={<Icon className='h-4 w-4 text-muted-foreground' />}
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
                          <div className='relative'>
                            <Icon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              placeholder={placeholder}
                              type={type}
                              {...field}
                              className='pl-10 mt-1 block w-full'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }
            },
          )}
        </div>

        <Separator />

        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Association Memberships</h3>

          {associationPositions.map((ap, index) => (
            <AssociationPositionPair
              key={index}
              index={index}
              associations={
                associations?.map((assoc) => ({
                  id: assoc.id,
                  name: assoc.name,
                })) ?? []
              }
              value={ap}
              control={form.control}
              onChange={(newValue) => {
                const newPositions = [...associationPositions]
                newPositions[index] = newValue
                setAssociationPositions(newPositions)
              }}
              onRemove={() => {
                if (associationPositions.length > 1) {
                  setAssociationPositions(
                    associationPositions.filter((_, i) => i !== index),
                  )
                }
              }}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={() => {
              setAssociationPositions([
                ...associationPositions,
                { associationId: '', position: '' },
              ])
            }}
          >
            <CirclePlus className='h-4 w-4 mr-2' /> Add Association
          </Button>
        </div>

        <Button
          type='submit'
          className='w-full flex gap-2 items-center justify-center'
          variant='default'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className='animate-spin mr-2' />
              Submitting...
            </>
          ) : (
            'Create Farmer'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateFarmerForm
