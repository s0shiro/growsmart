import React from 'react'
import { Control, Controller } from 'react-hook-form'

// Adjust the import path as needed
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectFieldProps {
  name: string
  label: string
  placeholder: string
  options: { id: string; name: string }[] | undefined
  control: Control<any>
  onChange?: (value: any) => void
  disabled?: boolean
}

const SelectFieldName: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  control,
  onChange,
  disabled,
}) => {
  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (onChange) {
                    onChange(value)
                  }
                }}
                defaultValue={field.value || ''} // Ensure a valid default value is passed
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem value={option.name} key={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SelectFieldName
