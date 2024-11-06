'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/hooks/use-toast'
import { useEdgeStore } from '@/lib/edgestore'
import { SingleImageDropzone } from '@/app/dashboard/(components)/forms/single-image-dropzone'

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  jobTitle: z.string().min(2, {
    message: 'Job title must be at least 2 characters.',
  }),
  role: z.enum(['technician', 'admin', 'program coordinator']),
  status: z.enum(['active', 'resigned']),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  avatarUrl: z.string().optional(),
})

async function createMember(data: z.infer<typeof FormSchema>) {
  const response = await fetch('/api/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create member')
  }

  return response.json()
}

export default function MemberForm() {
  const [isPending, startTransition] = useTransition()
  const roles = ['admin', 'technician', 'program coordinator']
  const status = ['active', 'resigned']
  const { toast } = useToast()
  const [file, setFile] = useState<File>()
  const [uploadProgress, setUploadProgress] = useState(0)
  const { edgestore } = useEdgeStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      jobTitle: '',
      role: 'technician',
      status: 'active',
      email: '',
      password: '',
      avatarUrl: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        let avatarUrl = ''

        if (file) {
          const result = await edgestore.myPublicImages.upload({
            file,
            input: { type: 'avatar' },
            onProgressChange: (progress) => {
              setUploadProgress(progress)
            },
          })
          avatarUrl = result.url
        }

        const submitData = {
          ...data,
          avatarUrl,
        }

        const result = await createMember(submitData)
        document.getElementById('create-member')?.click()

        toast({
          title: 'User created successfully!🎉',
          description: `Please check email for ${data.email} to login.`,
        })
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Failed to create user!😢',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='avatarUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className='flex flex-col items-center gap-2'>
                  <SingleImageDropzone
                    width={200}
                    height={200}
                    value={file}
                    dropzoneOptions={{
                      maxSize: 1024 * 1024 * 2, // 2MB
                    }}
                    onChange={setFile}
                  />
                  {uploadProgress > 0 && (
                    <div className='w-full h-2 bg-gray-200 rounded-full'>
                      <div
                        className='h-full bg-green-500 rounded-full transition-all'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload a profile picture (max 2MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='jobTitle'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Senior Technician' {...field} />
              </FormControl>
              <FormDescription>
                The official job title of the user.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='email@example.com'
                  type='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='Set a default password'
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be the user's initial password. They should change it
                after first login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Display name' {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select user status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map((s) => (
                    <SelectItem value={s} key={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                'Resigned' status means the user no longer works here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
