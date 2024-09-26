'use client'

import React from 'react'
import { Control, UseFormSetValue } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

interface CropDetailsProps {
  control: Control<any>
  categories: any[]
  crops: any[]
  varieties: any[]
  setValue: UseFormSetValue<any>
  selectedCategory: string
  selectedCrop: string
}

const CropDetails: React.FC<CropDetailsProps> = ({
                                                   control,
                                                   categories,
                                                   crops,
                                                   varieties,
                                                   setValue,
                                                   selectedCategory,
                                                   selectedCrop,
                                                 }) => {
  const fieldConfigs = [
    {
      name: 'cropCategory',
      placeholder: 'Select Category',
      label: 'Crop Category',
      type: 'select',
    },
    {
      name: 'cropType',
      placeholder: 'Select Crop Name',
      label: 'Crop Name',
      type: 'select',
    },
    {
      name: 'variety',
      placeholder: 'Select Variety',
      label: 'Variety',
      type: 'select',
    },
    {
      name: 'plantingDate',
      placeholder: 'Select date',
      label: 'Planting Date',
      type: 'date',
    },
    {
      name: 'areaPlanted',
      placeholder: 'Enter area',
      label: 'Area Planted',
      type: 'number',
    },
    {
      name: 'quantity',
      placeholder: 'Enter quantity',
      label: 'Quantity',
      type: 'number',
    },
    {
      name: 'weatherCondition',
      placeholder: 'Enter weather condition',
      label: 'Weather Condition',
      type: 'text',
    },
    {
      name: 'expenses',
      placeholder: 'Enter expenses',
      label: 'Expenses',
      type: 'number',
    },
    {
      name: 'harvestDate',
      placeholder: 'Select date',
      label: 'Expected Harvest',
      type: 'date',
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
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderDatePicker = (
    name: string,
    label: string,
    placeholder: string,
  ) => (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
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
                >
                  {field.value ? (
                    format(new Date(field.value), 'PPP')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                    field.onChange(utcDate.toISOString().split('T')[0]);
                  } else {
                    field.onChange('');
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldConfigs.map(({ name, placeholder, label, type }) => {
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
              }
            } else if (type === 'date') {
              return renderDatePicker(name, label, placeholder)
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
                        <Input
                          placeholder={placeholder}
                          type={type}
                          {...field}
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
      </CardContent>
    </Card>
  )
}

export default CropDetails