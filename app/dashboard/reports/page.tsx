'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wheat,
  TreePine,
  Sprout,
  Clock4,
  Calendar,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react'

const reportCategories = [
  {
    category: 'Rice',
    Icon: Wheat,
    color: 'text-amber-500',
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
    color: 'text-green-500',
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
    color: 'text-purple-500',
    reports: [
      {
        label: 'High Value Crops Report',
        Icon: Clock4,
        href: '/dashboard/reports/hv-production',
      },
    ],
  },
]

export default function CleanReportsDashboard() {
  const [activeCategory, setActiveCategory] = useState(
    reportCategories[0].category.toLowerCase(),
  )
  const [activeReport, setActiveReport] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const now = new Date()
    setCurrentDate(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    )
  }, [])

  const handleReportClick = (href: string) => {
    setActiveReport(href)
    router.push(href)
  }

  return (
    <div>
      <header className='mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Agricultural Reports
        </h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {currentDate}
        </p>
      </header>

      <Card className='overflow-hidden'>
        <CardContent className='p-6'>
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 mb-6'>
              {reportCategories.map((category) => (
                <TabsTrigger
                  key={category.category}
                  value={category.category.toLowerCase()}
                  className='flex items-center justify-center'
                >
                  <category.Icon className={`mr-2 h-5 w-5 ${category.color}`} />
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {reportCategories.map((category) => (
              <TabsContent
                key={category.category}
                value={category.category.toLowerCase()}
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='grid gap-4 md:grid-cols-2'>
                      {category.reports.map((report) => (
                        <Button
                          key={report.label}
                          variant={
                            activeReport === report.href ? 'default' : 'outline'
                          }
                          className='h-auto py-4 justify-between text-left'
                          onClick={() => handleReportClick(report.href)}
                        >
                          <div className='flex items-center'>
                            <report.Icon
                              className={`mr-3 h-5 w-5 ${category.color}`}
                            />
                            <div>
                              <div className='font-medium'>{report.label}</div>
                              <div className='text-xs text-gray-500 dark:text-gray-400'>
                                Generate report
                              </div>
                            </div>
                          </div>
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
