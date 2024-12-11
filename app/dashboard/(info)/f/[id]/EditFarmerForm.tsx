// components/forms/EditFarmerForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useQueryClient } from '@tanstack/react-query'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/hooks/use-toast'
import { updateFarmer } from '@/lib/farmer'

const FormSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['Male', 'Female']),
  municipality: z.string().min(1, 'Municipality is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  phone: z.string().min(11, 'Phone number must be 11 digits'),
  landsize: z.number().min(0, 'Land size must be positive'),
  rsbsa_number: z
    .number()
    .nullable()
    .optional()
    .transform((val) => val || null),
})

interface EditFarmerFormProps {
  farmer: {
    id: string
    firstname: string
    lastname: string
    gender: string
    municipality: string
    barangay: string
    phone: string
    landsize: number
    rsbsa_number?: number
  }
}

export default function EditFarmerForm({ farmer }: EditFarmerFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  console.log(farmer)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: farmer.firstname,
      lastname: farmer.lastname,
      gender: farmer.gender as 'Male' | 'Female',
      municipality: farmer.municipality,
      barangay: farmer.barangay,
      phone: farmer.phone,
      landsize: farmer.land_size,
      rsbsa_number: farmer.rsbsa_number,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await updateFarmer(farmer.id, data)
      toast({
        title: 'Success!',
        description: 'Farmer information updated successfully.',
      })
      queryClient.invalidateQueries(['farmer', farmer.id])
      document.getElementById('edit-farmer')?.click()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update farmer information.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='rsbsa_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>RSBSA Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Male'>Male</SelectItem>
                    <SelectItem value='Female'>Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='municipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipality</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='barangay'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='landsize'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land Size (ha)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Updating...' : 'Update Farmer'}
        </Button>
      </form>
    </Form>
  )
}
