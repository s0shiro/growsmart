'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useGetCropCategory from '@/hooks/crop/useGetCropCategory'
import { useFetchCrops } from '@/hooks/crop/useCrops'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import SelectField from '../../(components)/CustomSelectField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addCrop } from '@/lib/crop'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  cropCategory: z.string(),
  cropName: z.string(), // cropName is optional if the user wants to add a new crop
  cropVariety: z.string(),
  isNewCrop: z.boolean().optional(), // Boolean to track whether the user is adding a new crop
  newCropName: z.string().optional(), // Field for the new crop name, only needed if isNewCrop is true
})

type FieldName = keyof z.infer<typeof FormSchema>

const fieldConfigs: {
  name: FieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'cropCategory',
    placeholder: 'Select Category',
    label: 'Crop Category',
    type: 'select',
  },
  {
    name: 'cropName',
    placeholder: 'Select Crop Name',
    label: 'Crop Name',
    type: 'select',
  },
  {
    name: 'cropVariety',
    placeholder: 'Variety',
    label: 'Variety',
    type: 'text',
  },
]

const CropForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { isNewCrop: false },
  })

  const { data: categories } = useGetCropCategory()
  const selectedCategory = form.watch('cropCategory')
  const isNewCrop = form.watch('isNewCrop') // Track if the user wants to add a new crop
  const { data: crops } = useFetchCrops(selectedCategory)

  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isNewCrop && !data.newCropName) {
      toast.error('Please enter a new crop name.')
      return
    }

    startTransition(async () => {
      try {
        const res = await addCrop({
          cropCategory: data.cropCategory,
          cropName: isNewCrop
            ? (data.newCropName ?? '')
            : (data.cropName ?? ''), // If adding a new crop, use the newCropName
          cropVariety: data.cropVariety,
        })

        if (res.error) {
          const errorMessage =
            typeof res.error === 'string' ? res.error : res.error.message
          toast.error(`Failed to save crop: ${errorMessage}`)
        } else {
          document.getElementById('create-trigger')?.click()
          toast.success('Crop added successfully!')
          form.reset()
          // Refetch crops after adding a new one
          queryClient.invalidateQueries({ queryKey: ['registered-crops'] })
        }
      } catch (error) {
        toast.error('Unexpected error occurred.')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          {fieldConfigs.map(({ name, placeholder, label, type }) => {
            if (type === 'select' && name === 'cropCategory') {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='cropCategory'
                  label='Crop Category'
                  placeholder='Select Category'
                  options={
                    Array.isArray(categories)
                      ? categories.map((category: any) => ({
                          id: category.id,
                          name: category.name,
                        }))
                      : []
                  }
                />
              )
            } else if (type === 'select' && name === 'cropName' && !isNewCrop) {
              // Show this select field only when isNewCrop is false
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='cropName'
                  label='Crop Name'
                  placeholder='Select Crop Name'
                  options={[
                    ...(crops?.map((crop) => ({
                      id: crop.id,
                      name: crop.name ?? '',
                    })) || []),
                    { id: 'add_new_crop', name: 'Add New Crop' }, // Add an option to add a new crop
                  ]}
                  disabled={!selectedCategory}
                  onChange={(value) => {
                    if (value === 'add_new_crop') {
                      form.setValue('isNewCrop', true) // Trigger the "Add New Crop" flow
                    } else {
                      form.setValue('isNewCrop', false)
                      form.setValue('cropName', value) // Set the selected crop name
                    }
                  }}
                />
              )
            } else if (name === 'cropName' && isNewCrop) {
              // If isNewCrop is true, show a text input for the new crop name
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name='newCropName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add New Crop</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter new crop name'
                          {...field}
                          className='mt-1 block w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            } else if (name === 'cropVariety') {
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
        >
          Submit
          <Loader2 className={cn('animate-spin', { hidden: !isPending })} />
        </Button>
      </form>
    </Form>
  )
}

export default CropForm
