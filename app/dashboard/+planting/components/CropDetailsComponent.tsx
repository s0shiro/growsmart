'use client'

import React from 'react'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CalendarIcon,
  CheckCircle2,
  Sprout,
  Apple,
  Leaf,
  Calendar,
  MapPin,
  Droplet,
  CloudSun,
  Banknote,
  Clock,
  FileText,
  Shapes,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useGetAllCropData from '@/hooks/crop/useGetAllCropData'

interface CropDetailsProps {
  control: Control<any>
  setValue: UseFormSetValue<any>
  farmerLandSize: number | undefined
  errors: any
}

const CropDetails: React.FC<CropDetailsProps> = ({
  control,
  setValue,
  farmerLandSize,
  errors,
}) => {
  const { data: allCropData = [] } = useGetAllCropData()

  const categories = Array.isArray(allCropData) ? allCropData : []

  const formValues = useWatch({ control })
  const selectedCategory = formValues.cropCategory
  const selectedCrop = formValues.cropType
  const selectedWaterSupply = formValues.categorySpecific?.waterSupply

  const crops = selectedCategory
    ? categories.find((category: any) => category.id === selectedCategory)
        ?.crops || []
    : []
  const varieties = selectedCrop
    ? crops.find((crop: any) => crop.id === selectedCrop)?.crop_varieties || []
    : []

  const getCategoryNameById = (id: string) => {
    const category = categories.find((category: any) => category.id === id)
    return category ? category.name?.toLowerCase() : ''
  }

  const fieldConfigs = [
    {
      name: 'cropCategory',
      placeholder: 'Select category',
      label: 'Crop category',
      type: 'select',
      icon: Sprout,
    },
    {
      name: 'cropType',
      placeholder: 'Select crop name',
      label: 'Crop name',
      type: 'select',
      icon: Apple,
    },
    {
      name: 'variety',
      placeholder: 'Select Variety',
      label: 'Variety',
      type: 'select',
      icon: Leaf,
    },
    {
      name: 'categorySpecific.waterSupply',
      placeholder: 'Select water supply',
      label: 'Water supply',
      type: 'select',
      icon: Droplet,
      options: ['irrigated', 'rainfed'],
      showIf: (category: string) => getCategoryNameById(category) === 'rice',
    },
    {
      name: 'categorySpecific.landType',
      placeholder: 'Select land type',
      label: 'Land type',
      type: 'select',
      icon: CloudSun,
      options: ['lowland', 'upland', 'none'],
      showIf: (category: string) => getCategoryNameById(category) === 'rice',
    },
    {
      name: 'categorySpecific.classification',
      placeholder: 'Select classification',
      label: 'Classification',
      type: 'select',
      icon: Shapes,
      options: (category: string) => {
        const categoryName = getCategoryNameById(category)
        if (categoryName === 'rice') {
          return [
            'Hybrid',
            'Registered',
            'Certified',
            'Good Quality',
            'Farmer Saved Seeds',
          ]
        } else if (categoryName === 'high-value') {
          return [
            'lowland vegetable',
            'upland vegetable',
            'legumes',
            'spice',
            'rootcrop',
            'fruit',
          ]
        }
        return []
      },
      showIf: (category: string) => {
        const categoryName = getCategoryNameById(category)
        return categoryName === 'rice' || categoryName === 'high-value'
      },
    },
    {
      name: 'remarks',
      placeholder: 'Select remarks',
      label: 'Remarks',
      type: 'select',
      icon: FileText,
      options: [
        'newly planted/seedling',
        'vegetative',
        'reproductive',
        'maturing',
      ],
    },
    {
      name: 'plantingDate',
      placeholder: 'Select date',
      label: 'Planting date',
      type: 'date',
      icon: Calendar,
    },
    {
      name: 'harvestDate',
      placeholder: 'Select date',
      label: 'Expected Harvest Date',
      type: 'date',
      icon: Clock,
    },
    {
      name: 'areaPlanted',
      placeholder: 'Enter area',
      label: 'Area planted (ha)',
      type: 'number',
      icon: MapPin,
    },
    {
      name: 'quantity',
      placeholder: 'Enter quantity',
      label: 'Quantity (kg)',
      type: 'number',
      icon: Droplet,
    },
    {
      name: 'expenses',
      placeholder: 'Enter cost',
      label: 'Production cost',
      type: 'number',
      icon: Banknote,
    },
  ]

  const renderSelect = (
    name: string,
    label: string,
    placeholder: string,
    options: any[],
    disabled: boolean = false,
    onChange?: (value: string) => void,
  ) => (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value)
              onChange?.(value)

              if (
                name === 'categorySpecific.waterSupply' &&
                value === 'irrigated'
              ) {
                setValue('categorySpecific.landType', 'none')
              }
            }}
            value={field.value}
            disabled={
              disabled ||
              (name === 'categorySpecific.landType' &&
                selectedWaterSupply === 'irrigated')
            }
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.id || option}
                  value={option.id || option}
                >
                  {option.name || option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  //   const renderNumberInput = (
  //     name: string,
  //     label: string,
  //     placeholder: string,
  //   ) => (
  //     <FormField
  //       key={name}
  //       control={control}
  //       name={name}
  //       render={({ field }) => (
  //         <FormItem>
  //           <FormLabel>{label}</FormLabel>
  //           <FormControl>
  //             <Input
  //               placeholder={placeholder}
  //               type='number'
  //               min='0'
  //               onInput={(e) => {
  //                 const input = e.target as HTMLInputElement
  //                 if (input.value < '0') {
  //                   input.value = ''
  //                 }
  //               }}
  //               {...field}
  //             />
  //           </FormControl>
  //           <FormMessage />
  //         </FormItem>
  //       )}
  //     />
  //   )

  const renderDatePicker = (
    name: string,
    label: string,
    placeholder: string,
    readOnly: boolean = false,
  ) => (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                  disabled={readOnly}
                >
                  {field.value ? (
                    format(new Date(field.value), 'PPP')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            {!readOnly && (
              <PopoverContent className='w-auto p-0' align='start'>
                <CalendarComponent
                  mode='single'
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const utcDate = new Date(
                        Date.UTC(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                        ),
                      )
                      field.onChange(utcDate.toISOString().split('T')[0])
                    } else {
                      field.onChange('')
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            )}
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderAreaPlantedInput = (
    name: string,
    label: string,
    placeholder: string,
    farmerLandSize: number | undefined,
  ) => (
    <FormField
      key={name}
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          const areaPlanted = Number(value)
          if (isNaN(areaPlanted) || areaPlanted <= 0) {
            return 'Area must be a positive number'
          }
          if (farmerLandSize && areaPlanted > farmerLandSize) {
            return `Area planted cannot exceed farmer's total land size of ${farmerLandSize} ha`
          }
          return true
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='relative'>
              <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={placeholder}
                type='number'
                step='0.01'
                min='0'
                max={farmerLandSize}
                className={cn(
                  'pl-10',
                  errors.areaPlanted &&
                    'border-destructive focus-visible:ring-destructive',
                )}
                {...field}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (value < 0) {
                    e.target.value = '0'
                  } else if (farmerLandSize && value > farmerLandSize) {
                    e.target.value = farmerLandSize.toString()
                  }
                  field.onChange(e)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
          {errors.areaPlanted && (
            <p className='text-xs text-destructive mt-1'>
              {errors.areaPlanted.message}
            </p>
          )}
          {farmerLandSize && (
            <FormDescription className='text-xs mt-1'>
              Maximum area: {farmerLandSize} ha
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  )

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Crop Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {fieldConfigs.map(
              ({
                name,
                placeholder,
                label,
                type,
                options,
                showIf,
                icon: Icon,
              }) => {
                if (showIf && !showIf(formValues.cropCategory)) {
                  return null
                }

                if (type === 'select') {
                  if (name === 'cropCategory') {
                    return renderSelect(
                      name,
                      label,
                      placeholder,
                      categories,
                      false,
                      (value) => {
                        setValue('cropType', '')
                        setValue('variety', '')
                        setValue('categorySpecific.landType', '')
                        setValue('categorySpecific.waterSupply', '')
                        setValue('categorySpecific.classification', '')
                      },
                    )
                  } else if (name === 'cropType') {
                    return renderSelect(
                      name,
                      label,
                      placeholder,
                      crops,
                      !selectedCategory,
                      (value) => {
                        setValue('variety', '')
                      },
                    )
                  } else if (name === 'variety') {
                    return renderSelect(
                      name,
                      label,
                      placeholder,
                      varieties,
                      !selectedCrop,
                    )
                  } else if (
                    name === 'categorySpecific.landType' ||
                    name === 'categorySpecific.waterSupply' ||
                    name === 'categorySpecific.classification' ||
                    name === 'remarks'
                  ) {
                    const optionsArray =
                      typeof options === 'function'
                        ? options(formValues.cropCategory)
                        : options || []
                    return renderSelect(
                      name,
                      label,
                      placeholder,
                      optionsArray,
                      false,
                    )
                  }
                } else if (type === 'date') {
                  return renderDatePicker(
                    name,
                    label,
                    placeholder,
                    name === 'harvestDate',
                  )
                } else if (name === 'areaPlanted') {
                  return renderAreaPlantedInput(
                    name,
                    label,
                    placeholder,
                    farmerLandSize,
                  )
                } else {
                  return (
                    <FormField
                      key={name}
                      control={control}
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
                                className='pl-10'
                                {...field}
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
        </CardContent>
      </Card>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Crop Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {fieldConfigs.map(({ name, label, icon: Icon, showIf }) => {
              if (showIf && !showIf(formValues.cropCategory)) {
                return null
              }

              const value =
                name === 'cropCategory'
                  ? categories.find(
                      (category: any) => category.id === formValues[name],
                    )?.name
                  : name === 'cropType'
                    ? crops.find((crop: any) => crop.id === formValues[name])
                        ?.name
                    : name === 'variety'
                      ? varieties.find(
                          (variety: any) => variety.id === formValues[name],
                        )?.name
                      : name.startsWith('categorySpecific.')
                        ? formValues.categorySpecific?.[name.split('.')[1]]
                        : formValues[name]

              const isSet = value && value !== 'Not set'

              return (
                <div
                  key={name}
                  className={cn(
                    'p-4 rounded-lg transition-all duration-200 ease-in-out',
                    isSet ? 'bg-primary/10' : 'bg-muted',
                  )}
                >
                  <div className='flex items-center space-x-2'>
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        isSet ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span className='font-medium text-sm text-muted-foreground'>
                      {label}
                    </span>
                    {isSet && (
                      <CheckCircle2 className='h-4 w-4 text-primary ml-auto' />
                    )}
                  </div>
                  <p
                    className={cn(
                      'mt-1 font-semibold',
                      isSet ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {value || 'Not set'}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CropDetails
