'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wheat,
  TreePine,
  Sprout,
  Clock4,
  Calendar,
  CalendarCheck,
  ArrowLeft,
} from 'lucide-react'

const reportCategories = [
  {
    category: 'Rice',
    Icon: Wheat,
    reports: [
      {
        label: 'Standing Rice Crops',
        Icon: Clock4,
        href: '/dashboard/reports/rice-standing',
      },
      {
        label: 'Monthly Rice Plantings',
        Icon: Calendar,
        href: '/dashboard/reports/planting',
      },
      {
        label: 'Monthly Rice Harvest',
        Icon: CalendarCheck,
        href: '/dashboard/reports/harvesting',
      },
    ],
  },
  {
    category: 'Corn',
    Icon: TreePine,
    reports: [
      {
        label: 'Standing Corn Crops',
        Icon: Clock4,
        href: '/dashboard/reports/standing',
      },
      {
        label: 'Monthly Corn Plantings',
        Icon: Calendar,
        href: '/dashboard/reports/monthly-planting',
      },
      {
        label: 'Monthly Corn Harvests',
        Icon: CalendarCheck,
        href: '/dashboard/reports/monthly-harvest',
      },
    ],
  },
  {
    category: 'High Value',
    Icon: Sprout,
    reports: [
      {
        label: 'High Value Crops Report',
        Icon: Clock4,
        href: '/dashboard/reports/hv-production',
      },
    ],
  },
]

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null)
  const router = useRouter()

  const handleReportClick = (href: string) => {
    setActiveReport(href)
    router.push(href)
  }

  return (
    <div className='container mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Generate Reports</h1>
        <Button variant='outline' onClick={() => router.push('/dashboard')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue={reportCategories[0].category.toLowerCase()}>
        <TabsList className='mb-6'>
          {reportCategories.map((category) => (
            <TabsTrigger
              key={category.category}
              value={category.category.toLowerCase()}
            >
              <category.Icon className='mr-2 h-5 w-5' />
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {reportCategories.map((category) => (
          <TabsContent
            key={category.category}
            value={category.category.toLowerCase()}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-2xl'>
                  <category.Icon className='mr-2 h-6 w-6' />
                  {category.category} Reports
                </CardTitle>
                <CardDescription>Select a report to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {category.reports.map((report) => (
                    <Button
                      key={report.label}
                      variant={
                        activeReport === report.href ? 'default' : 'outline'
                      }
                      className='h-auto py-4 justify-start'
                      onClick={() => handleReportClick(report.href)}
                    >
                      <report.Icon className='mr-2 h-5 w-5' />
                      <span className='text-left'>{report.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
