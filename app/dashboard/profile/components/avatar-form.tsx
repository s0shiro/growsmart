'use client'

import React, { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'
import { Camera, Upload } from 'lucide-react'
import { SingleImageDropzone } from '../../(components)/forms/single-image-dropzone'
import { useQueryClient } from '@tanstack/react-query'
import { updateUserAvatar } from '@/lib/users'
import { Loader2 } from 'lucide-react'

export default function Component({
  profile,
  isOpen,
  onOpenChange,
}: {
  profile: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [file, setFile] = useState<File>()
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { edgestore } = useEdgeStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)

      const uploadConfig = {
        file,
        input: { type: 'avatar' },
        onProgressChange: (progress: any) => {
          setProgress(progress)
        },
        ...(profile.avatar_url && {
          options: {
            replaceTargetUrl: profile.avatar_url,
          },
        }),
      }

      const res = await edgestore.myPublicImages.upload(uploadConfig)

      await updateUserAvatar(profile.id, res.url)

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been successfully updated.',
      })
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setFile(undefined)
      setProgress(0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className='relative cursor-pointer group'>
          <Avatar className='w-32 h-32 border-4 border-white shadow-md'>
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className='bg-primary text-2xl'>
              {profile.full_name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
            <Camera className='text-white' />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            Update Profile Picture
          </DialogTitle>
          <DialogDescription className='text-center'>
            Choose a new avatar to represent you across the platform
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='flex justify-center'>
            <Avatar className='w-32 h-32 border-4 border-muted'>
              <AvatarImage
                src={file ? URL.createObjectURL(file) : profile.avatar_url}
                alt={profile.full_name}
              />
              <AvatarFallback className='bg-primary text-2xl'>
                {profile.full_name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex justify-center'>
            <SingleImageDropzone
              width={320}
              height={250}
              value={file}
              onChange={setFile}
              dropzoneOptions={{
                maxSize: 1024 * 1024 * 2, // 2MB
              }}
              className='border-dashed border-2 border-muted-foreground/25 rounded-3xl overflow-hidden'
            />
          </div>
          {isUploading && (
            <div className='space-y-2'>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className='w-full bg-muted rounded-full h-2.5 dark:bg-muted/30'>
                <div
                  className='bg-primary h-2.5 rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className='w-full'
          >
            {isUploading ? (
              <span className='flex items-center justify-center'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Uploading {Math.round(progress)}%
              </span>
            ) : (
              'Update Avatar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
