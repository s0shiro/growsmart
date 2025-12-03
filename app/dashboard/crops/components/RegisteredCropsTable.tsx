'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertCircle,
  Plus,
  Leaf,
  Search,
  ChevronRight,
  X,
  Layers,
  Tag,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFetchAllRegisteredCrops } from '@/hooks/crop/useFetchAllRegisteredCrops'
import CropForm from '@/app/dashboard/crops/add-crops/CropForm'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import { cn } from '@/lib/utils'

interface CropVariety {
  id: string
  name: string
}

interface Crop {
  id: string
  name: string
  crop_varieties: CropVariety[]
}

interface CropCategory {
  id: string
  name: string
  crops: Crop[]
}

export default function RegisteredCrops() {
  const { data, isLoading, error } = useFetchAllRegisteredCrops()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handleRegisterCrop = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Implement crop registration logic here
    console.log('Registering crop...')
    setIsDialogOpen(false)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const filteredData = useMemo(() => {
    if (!data) return []
    return data
      .map((category: any) => ({
        ...category,
        crops: category.crops.filter(
          (crop: Crop) =>
            crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.crop_varieties.some((variety: CropVariety) =>
              variety.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        ),
      }))
      .filter((category: CropCategory) => category.crops.length > 0)
  }, [data, searchTerm])

  // Calculate stats
  const totalCategories = data?.length || 0
  const totalCrops =
    data?.reduce(
      (acc: number, cat: CropCategory) => acc + cat.crops.length,
      0,
    ) || 0
  const totalVarieties =
    data?.reduce(
      (acc: number, cat: CropCategory) =>
        acc +
        cat.crops.reduce(
          (cropAcc: number, crop: Crop) => cropAcc + crop.crop_varieties.length,
          0,
        ),
      0,
    ) || 0

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-3'>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className='h-24 rounded-xl' />
          ))}
        </div>
        <Skeleton className='h-12 rounded-xl' />
        <div className='space-y-3'>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className='h-16 rounded-xl' />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-xl border border-destructive/50 bg-destructive/10 p-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-destructive/20'>
            <AlertCircle className='h-5 w-5 text-destructive' />
          </div>
          <div>
            <h3 className='font-semibold text-destructive'>
              Error Loading Crops
            </h3>
            <p className='text-sm text-muted-foreground'>
              Failed to load registered crops. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full space-y-6'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        {[
          {
            label: 'Categories',
            value: totalCategories,
            icon: Layers,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Total Crops',
            value: totalCrops,
            icon: Leaf,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Varieties',
            value: totalVarieties,
            icon: Tag,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative group p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border transition-all duration-300'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>{stat.label}</p>
                <p className='text-2xl font-semibold text-foreground mt-1'>
                  {stat.value}
                </p>
              </div>
              <div className={cn('p-3 rounded-lg', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Actions Bar */}
      <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search crops or varieties...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-10 h-11 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background transition-colors'
          />
          {searchTerm && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted'
              onClick={() => setSearchTerm('')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
        <DialogForm
          id='create-trigger'
          title='Add Crop'
          description='Add a new crop to your list.'
          Trigger={
            <Button className='h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white'>
              <Plus className='mr-2 h-4 w-4' />
              Register Crop
            </Button>
          }
          form={<CropForm />}
        />
      </div>

      {/* Categories List */}
      <div className='rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden'>
        {/* Section Header */}
        <div className='px-6 py-4 border-b border-border/50 bg-muted/30'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-emerald-500/10'>
                <Leaf className='h-4 w-4 text-emerald-500' />
              </div>
              <div>
                <h2 className='font-semibold text-foreground'>
                  Crop Categories
                </h2>
                <p className='text-xs text-muted-foreground'>
                  {filteredData.length} categories found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className='h-[450px]'>
          <div className='divide-y divide-border/50'>
            <AnimatePresence>
              {filteredData.map((category: CropCategory, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Collapsible
                    open={expandedCategories.includes(category.id)}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className='flex items-center w-full px-6 py-4 hover:bg-muted/50 transition-colors duration-200 group'>
                      <div className='p-2 rounded-lg bg-emerald-500/10 mr-4 group-hover:bg-emerald-500/20 transition-colors'>
                        <Leaf className='h-4 w-4 text-emerald-500' />
                      </div>
                      <div className='flex-grow text-left'>
                        <span className='text-base font-medium text-foreground'>
                          {category.name}
                        </span>
                        <p className='text-xs text-muted-foreground'>
                          {category.crops.length} crop
                          {category.crops.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform duration-200',
                          expandedCategories.includes(category.id) &&
                            'rotate-90',
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='px-6 pb-4 space-y-3'
                      >
                        {category.crops.map((crop: Crop) => (
                          <div
                            key={crop.id}
                            className='ml-10 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-all duration-200'
                          >
                            <h3 className='text-sm font-medium text-foreground mb-3 flex items-center gap-2'>
                              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                              {crop.name}
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                              {crop.crop_varieties.map(
                                (variety: CropVariety) => (
                                  <TooltipProvider key={variety.id}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className='inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 cursor-default'>
                                          {variety.name}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Variety: {variety.name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ),
                              )}
                              {crop.crop_varieties.length === 0 && (
                                <span className='text-xs text-muted-foreground italic'>
                                  No varieties registered
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-12 px-6'
            >
              <div className='inline-flex p-3 rounded-full bg-muted/50 mb-4'>
                <Search className='h-6 w-6 text-muted-foreground' />
              </div>
              <h3 className='font-medium text-foreground mb-1'>
                No crops found
              </h3>
              <p className='text-sm text-muted-foreground max-w-sm mx-auto'>
                {searchTerm
                  ? `No crops or varieties match "${searchTerm}"`
                  : 'No crops have been registered yet.'}
              </p>
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
