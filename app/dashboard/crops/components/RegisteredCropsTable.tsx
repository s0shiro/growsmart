'use client'

import React, { useState, useMemo } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, Leaf, Search, ChevronRight, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFetchAllRegisteredCrops } from '@/hooks/crop/useFetchAllRegisteredCrops'
import CropForm from '@/app/dashboard/crops/add-crops/CropForm'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'

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
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handleRegisterCrop = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Implement crop registration logic here
    console.log("Registering crop...")
    setIsDialogOpen(false)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.map((category: any) => ({
      ...category,
      crops: category.crops.filter((crop: Crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.crop_varieties.some((variety: CropVariety) =>
          variety.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    })).filter((category: CropCategory) => category.crops.length > 0)
  }, [data, searchTerm])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load registered crops. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">Registered Crops</CardTitle>
          <DialogForm
            id='create-trigger'
            title='Add Crop'
            description='Add a new crop to your list.'
            Trigger={
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Register Crop
              </Button>
            }
            form={<CropForm />}
          />
        </div>
        <CardDescription>
          Browse through all registered crops and their varieties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crops or varieties"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-5 w-5 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[420px] w-full rounded-md border p-4">
          {filteredData.map((category: CropCategory) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
              className="mb-4"
            >
              <CollapsibleTrigger className="flex items-center w-full p-2 rounded-md hover:bg-accent transition-colors duration-200">
                <Leaf className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-lg font-medium flex-grow text-left">{category.name}</span>
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedCategories.includes(category.id) ? 'transform rotate-90' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {category.crops.map((crop: Crop) => (
                  <Card key={crop.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium mb-2">{crop.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {crop.crop_varieties.map((variety: CropVariety) => (
                        <TooltipProvider key={variety.id}>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200">
                                {variety.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Variety: {variety.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </Card>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}