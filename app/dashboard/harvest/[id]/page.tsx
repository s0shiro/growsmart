import { getCalculatedDamagesOfPlantingRecord } from '@/lib/damages'
import HarvestForm from '../../(components)/forms/HarvestForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrendingUpIcon,
  EyeIcon,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { farmerId?: string }
}) {
  const data = await getCalculatedDamagesOfPlantingRecord(params.id)

  const damagedPercentage =
    data?.area_planted && data?.total_damaged
      ? (data.total_damaged / data.area_planted) * 100
      : 0

  const remainingPercentage =
    data?.area_planted && data?.remaining_area
      ? (data.remaining_area / data.area_planted) * 100
      : 0

  return (
    <div>
      <div className='mb-4'>
        <Button variant='outline' size='sm' asChild>
          <Link href={`/dashboard/c/${params.id}`}>
            <EyeIcon className='mr-2 h-4 w-4' />
            View Full Crop Details
          </Link>
        </Button>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 shadow-lg'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-primary flex items-center'>
              <TrendingUpIcon className='mr-2 h-5 w-5 text-purple-500' />
              Harvest Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow'>
                <p className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                  {(
                    ((data?.total_damaged ?? 0) / (data?.area_planted ?? 1)) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Damaged Area
                </p>
              </div>
              <div className='text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow'>
                <p className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                  {(
                    ((data?.remaining_area ?? 0) / (data?.area_planted ?? 1)) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Remaining Area
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-gray-800/20 shadow-lg'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-primary'>
              Planting Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground flex items-center'>
                  <AlertTriangleIcon className='mr-2 h-4 w-4 text-red-500' />
                  Total Damaged Area
                </span>
                <span className='text-base font-bold text-red-600 dark:text-red-400'>
                  {data?.total_damaged?.toFixed(4) ?? 'No data'}
                  <span className='text-xs ml-1 font-normal text-muted-foreground'>
                    ha
                  </span>
                </span>
                <Progress
                  value={damagedPercentage}
                  className='mt-2 [&>div]:bg-red-500'
                />
                <span className='text-xs text-muted-foreground mt-1'>
                  {damagedPercentage.toFixed(2)}% of planted area
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground flex items-center'>
                  <CheckCircleIcon className='mr-2 h-4 w-4 text-green-500' />
                  Area Planted
                </span>
                <span className='text-base font-bold text-green-600 dark:text-green-400'>
                  {data?.area_planted?.toFixed(4) ?? 'No data'}
                  <span className='text-xs ml-1 font-normal text-muted-foreground'>
                    ha
                  </span>
                </span>
                <Progress value={100} className='mt-2 [&>div]:bg-green-500' />
                <span className='text-xs text-muted-foreground mt-1'>
                  Total planted area
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground flex items-center'>
                  <XCircleIcon className='mr-2 h-4 w-4 text-blue-500' />
                  Remaining Area
                </span>
                {data?.remaining_area ? (
                  <>
                    <span className='text-base font-bold text-blue-600 dark:text-blue-400'>
                      {data.remaining_area.toFixed(4)}
                      <span className='text-xs ml-1 font-normal text-muted-foreground'>
                        ha
                      </span>
                    </span>
                    <Progress
                      value={remainingPercentage}
                      className='mt-2 [&>div]:bg-blue-500'
                    />
                    <span className='text-xs text-muted-foreground mt-1'>
                      {remainingPercentage.toFixed(2)}% of planted area
                    </span>
                  </>
                ) : (
                  <span className='text-yellow-600 dark:text-yellow-400 text-sm'>
                    No data available
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-gray-800/20 shadow-lg'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-primary'>
              Harvest Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HarvestForm
              plantingID={params.id}
              farmerID={searchParams.farmerId}
              remainingArea={data?.remaining_area ?? null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
