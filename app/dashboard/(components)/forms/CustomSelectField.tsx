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
import { ReactElement } from 'react'

interface SelectFieldProps {
  name: string
  label: string
  placeholder: string
  options: { id: string; name: string }[] | undefined
  onChange?: (value: any) => void // Add onChange prop
  disabled?: boolean // Add disabled prop
  value?: string // Add if missing
  control?: Control<any>
  icon: ReactElement
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  control,
  onChange, // Destructure onChange prop
  disabled, // Destructure disabled prop
  value,
  icon,
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
                defaultValue={field.value}
                disabled={disabled} // Pass disabled prop to Select
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem value={option.id} key={option.id}>
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

export default SelectField
