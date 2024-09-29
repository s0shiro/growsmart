'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import SelectField from '../../(components)/forms/CustomSelectField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addCrop } from '@/lib/crop'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import useGetAllCropData from '@/hooks/crop/useGetAllCropData'

const FormSchema = z.object({
  cropCategory: z.string(),
  cropName: z.string(),
  cropVariety: z.string(),
  isNewCrop: z.boolean().optional(),
  newCropName: z.string().optional(),
  isNewVariety: z.boolean().optional(), // Boolean to track whether the user is adding a new variety
  newVarietyName: z.string().optional(), // Field for the new variety name, only needed if isNewVariety is true
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
    placeholder: 'Select Variety',
    label: 'Variety',
    type: 'select',
  },
]

const CropForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { isNewCrop: false, isNewVariety: false },
  })

  const { data: categories } = useGetAllCropData()
  const selectedCategory = form.watch('cropCategory')
  const isNewCrop = form.watch('isNewCrop')
  const isNewVariety = form.watch('isNewVariety')
  const selectedCategoryData = Array.isArray(categories)
  ? categories.find((category: any) => category.id === selectedCategory)
  : undefined
  const crops = selectedCategoryData?.crops || []
  const selectedCrop = form.watch('cropName')
  const selectedCropData = crops.find((crop: any) => crop.id === selectedCrop)
  const varieties = selectedCropData?.crop_varieties || []

  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isNewCrop && !data.newCropName) {
      toast.error('Please enter a new crop name.')
      return
    }

    if (isNewVariety && !data.newVarietyName) {
      toast.error('Please enter a new variety name.')
      return
    }

    startTransition(async () => {
      try {
        const res = await addCrop({
          cropCategory: data.cropCategory,
          cropName: isNewCrop
            ? (data.newCropName ?? '')
            : (data.cropName ?? ''),
          cropVariety: isNewVariety
            ? (data.newVarietyName ?? '')
            : (data.cropVariety ?? ''),
        })

        if (res.error) {
          const errorMessage =
            typeof res.error === 'string' ? res.error : res.error.message
          toast.error(`Failed to save crop: ${errorMessage}`)
        } else {
          document.getElementById('create-trigger')?.click()
          toast.success('Crop added successfully!')
          form.reset()
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
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='cropName'
                  label='Crop Name'
                  placeholder='Select Crop Name'
                  options={[
                    ...(crops?.map((crop: any) => ({
                      id: crop.id,
                      name: crop.name ?? '',
                    })) || []),
                    { id: 'add_new_crop', name: 'Add New Crop' },
                  ]}
                  disabled={!selectedCategory}
                  onChange={(value) => {
                    if (value === 'add_new_crop') {
                      form.setValue('isNewCrop', true)
                    } else {
                      form.setValue('isNewCrop', false)
                      form.setValue('cropName', value)
                    }
                  }}
                />
              )
            } else if (name === 'cropName' && isNewCrop) {
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
            } else if (
              type === 'select' &&
              name === 'cropVariety' &&
              !isNewVariety
            ) {
              return (
                <SelectField
                  control={form.control}
                  key={name}
                  name='cropVariety'
                  label='Variety'
                  placeholder='Select Variety'
                  options={[
                    ...(varieties?.map((variety: any) => ({
                      id: variety.id,
                      name: variety.name ?? '',
                    })) || []),
                    { id: 'add_new_variety', name: 'Add New Variety' },
                  ]}
                  disabled={!selectedCrop}
                  onChange={(value) => {
                    if (value === 'add_new_variety') {
                      form.setValue('isNewVariety', true)
                    } else {
                      form.setValue('isNewVariety', false)
                      form.setValue('cropVariety', value)
                    }
                  }}
                />
              )
            } else if (name === 'cropVariety' && isNewVariety) {
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name='newVarietyName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add New Variety</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter new variety name'
                          {...field}
                          className='mt-1 block w-full'
                        />
                      </FormControl>
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
                          value={
                            typeof field.value === 'boolean' ? '' : field.value
                          }
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
