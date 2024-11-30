// app/dashboard/analytics/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import {
  useCategoryAnalytics,
  useCropAnalytics,
} from '@/hooks/crop/useCropAnalytics'

function getCurrentYear() {
  return new Date().getFullYear()
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function AnalyticsPage() {
  const currentYear = getCurrentYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { data, isLoading } = useCropAnalytics(selectedYear)
  const { data: categoryData } = useCategoryAnalytics(selectedYear)

  const monthlyData = months.map((monthName) => {
    const monthIndex = months.indexOf(monthName)
    const monthData = data?.reduce(
      (total, record) => {
        // Only include harvested records
        if (record.status === 'harvested') {
          // Sum up all harvest records for this month
          record.harvest_records?.forEach((harvest) => {
            const harvestMonth = new Date(harvest.harvest_date).getMonth()
            if (harvestMonth === monthIndex) {
              total.production += harvest.yield_quantity || 0
              total.area += record.area_planted || 0
            }
          })
        }
        return total
      },
      { production: 0, area: 0 },
    )

    return {
      month: monthName,
      production: monthData?.production || 0,
      area: monthData?.area || 0,
    }
  })

  // Update crop distribution to show planted vs harvested
  const cropDistribution = data?.reduce((acc, record) => {
    const crop = record.crops.name
    if (!acc[crop]) {
      acc[crop] = {
        name: crop,
        planted: 0,
        harvested: 0,
      }
    }
    acc[crop].planted += record.area_planted
    if (record.status === 'harvested') {
      acc[crop].harvested += record.area_planted
    }
    return acc
  }, {})

  return (
    <div className='container p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Crop Analytics</h1>
        <Select
          value={selectedYear.toString()}
          onValueChange={(v) => setSelectedYear(Number(v))}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select year' />
          </SelectTrigger>
          <SelectContent>
            {[...Array(5)].map((_, i) => (
              <SelectItem
                key={currentYear - i}
                value={(currentYear - i).toString()}
              >
                {currentYear - i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Production {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='month'
                  label={{ value: 'Month', position: 'bottom' }}
                />
                <YAxis
                  label={{
                    value: 'Production (kg)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='production'
                  stroke='#22c55e'
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crop Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  label={{ value: 'Category', position: 'bottom' }}
                />
                <YAxis
                  label={{
                    value: 'Area Planted (ha)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey='area'
                  fill='#22c55e'
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Total Production</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {Object.values(monthlyData || {}).reduce(
                (sum, m) => sum + m.production,
                0,
              )}{' '}
              kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Area Planted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {Object.values(monthlyData || {}).reduce(
                (sum, m) => sum + m.area,
                0,
              )}{' '}
              ha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {Object.keys(cropDistribution || {}).length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
