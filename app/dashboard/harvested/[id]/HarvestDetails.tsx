import React from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/utils'
import { Edit3, Trash2, ArrowLeftCircle, UploadCloud, Calendar, MapPin, CloudSun, DollarSign, Droplet, Scale, AlertTriangle } from 'lucide-react'

interface HarvestRecord {
  id: string
  profit: number
  user_id: string
  farmer_id: string
  created_at: string
  planting_id: string
  harvest_date: string
  area_harvested: number
  damaged_reason: string
  harvest_images: string[]
  yield_quantity: number
  damaged_quantity: number
}

interface HarvestData {
  crop_type: string
  variety: string
  planting_date: string
  weather_condition: string | null
  expenses: number
  field_location: string
  harvest_records: HarvestRecord[]
}

const HarvestDetails = ({ harvest }: { harvest: HarvestData }) => {
  const {
    crop_type,
    variety,
    planting_date,
    weather_condition,
    expenses,
    field_location,
    harvest_records,
  } = harvest

  const latestHarvest = harvest_records[0]

  // Simple function to format currency
  const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`

  return (
    <div>
      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">Harvest Details</CardTitle>
              <CardDescription className="text-xl text-gray-100">
                {crop_type} - {variety}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Edit3 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
              <Button size="sm" variant="outline">
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-100 dark:bg-gray-600 p-4">
                <CardTitle className="text-xl font-semibold">Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="mr-2 h-4 w-4" />
                      Planting Date
                    </span>
                    <Badge variant="outline">{formatDate(planting_date)}</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="mr-2 h-4 w-4" />
                      Field Location
                    </span>
                    <Badge variant="outline">{field_location}</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      <CloudSun className="mr-2 h-4 w-4" />
                      Weather
                    </span>
                    <Badge variant="outline">{weather_condition || 'N/A'}</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Expenses
                    </span>
                    <Badge variant="outline">{formatCurrency(expenses)}</Badge>
                  </li>
                  {latestHarvest && (
                    <li className="flex items-center justify-between">
                      <span className="flex items-center text-gray-600 dark:text-gray-300">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Profit
                      </span>
                      <Badge variant="outline">{formatCurrency(latestHarvest.profit)}</Badge>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            {harvest_records.length > 0 && (
              <Card className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                <CardHeader className="bg-gray-100 dark:bg-gray-600 p-4">
                  <CardTitle className="text-xl font-semibold">Harvest Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-[300px] pr-4">
                    {harvest_records.map((record, index) => (
                      <div key={record.id} className={index !== 0 ? "mt-4 pt-4 border-t" : ""}>
                        <h4 className="text-lg font-semibold mb-2">{formatDate(record.harvest_date)}</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span className="flex items-center text-gray-600 dark:text-gray-300">
                              <Droplet className="mr-2 h-4 w-4" />
                              Yield
                            </span>
                            <Badge>{record.yield_quantity} kg</Badge>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="flex items-center text-gray-600 dark:text-gray-300">
                              <Scale className="mr-2 h-4 w-4" />
                              Area Harvested
                            </span>
                            <Badge>{record.area_harvested} sqm</Badge>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="flex items-center text-gray-600 dark:text-gray-300">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Damaged
                            </span>
                            <Badge>{record.damaged_quantity} kg</Badge>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="flex items-center text-gray-600 dark:text-gray-300">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Damage Reason
                            </span>
                            <Badge variant="outline">{record.damaged_reason}</Badge>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
          <Separator className="my-8" />
          <Card className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-100 dark:bg-gray-600 p-4">
              <CardTitle className="text-xl font-semibold">Harvest Photos</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {latestHarvest && latestHarvest.harvest_images.map((url, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`Harvest Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full sm:w-auto" variant="outline">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          <Card className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-100 dark:bg-gray-600 p-4">
              <CardTitle className="text-xl font-semibold">Related Records</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Previous Harvests</span>
                <Button variant="link" asChild>
                  <a href={`/harvests?crop=${crop_type}&field=${field_location}`}>
                    View
                  </a>
                </Button>
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default HarvestDetails