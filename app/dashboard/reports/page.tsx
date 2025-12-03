'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wheat,
  TreePine,
  Sprout,
  Clock4,
  Calendar,
  CalendarCheck,
  ChevronRight,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const reportCategories = [
  {
    category: 'Rice',
    description: 'Rice production and harvest analytics',
    Icon: Wheat,
    gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/40',
    reports: [
      {
        label: 'Standing Rice Crops',
        description: 'View current standing rice crop status',
        Icon: Clock4,
        href: '/dashboard/reports/rice-standing',
      },
      {
        label: 'Monthly Rice Plantings',
        description: 'Track monthly rice planting activities',
        Icon: Calendar,
        href: '/dashboard/reports/planting',
      },
      {
        label: 'Monthly Rice Harvest',
        description: 'Analyze rice harvest data by month',
        Icon: CalendarCheck,
        href: '/dashboard/reports/harvesting',
      },
    ],
  },
  {
    category: 'Corn',
    description: 'Corn cultivation and yield reports',
    Icon: TreePine,
    gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    reports: [
      {
        label: 'Standing Corn Crops',
        description: 'Monitor current corn crop conditions',
        Icon: Clock4,
        href: '/dashboard/reports/standing',
      },
      {
        label: 'Monthly Corn Plantings',
        description: 'Track corn planting progress monthly',
        Icon: Calendar,
        href: '/dashboard/reports/monthly-planting',
      },
      {
        label: 'Monthly Corn Harvests',
        description: 'Review corn harvest performance',
        Icon: CalendarCheck,
        href: '/dashboard/reports/monthly-harvest',
      },
    ],
  },
  {
    category: 'High Value',
    description: 'Specialty and high-value crop insights',
    Icon: Sprout,
    gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/40',
    reports: [
      {
        label: 'High Value Crops Report',
        description: 'Comprehensive high-value crop analysis',
        Icon: Clock4,
        href: '/dashboard/reports/hv-production',
      },
    ],
  },
]

export default function ReportsDashboard() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredReport, setHoveredReport] = useState<string | null>(null)
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
    router.push(href)
  }

  const activeCategoryData = reportCategories.find(
    (c) => c.category.toLowerCase() === activeCategory,
  )

  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <FileText className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
              Reports
            </h1>
            <p className='text-sm text-muted-foreground'>{currentDate}</p>
          </div>
        </div>
        <p className='text-muted-foreground mt-3 max-w-2xl'>
          Generate comprehensive agricultural reports for rice, corn, and
          high-value crops. Select a category below to view available reports.
        </p>
      </div>

      {/* Category Cards */}
      <div className='grid gap-4 md:grid-cols-3 mb-8'>
        {reportCategories.map((category) => {
          const isActive = activeCategory === category.category.toLowerCase()
          return (
            <motion.button
              key={category.category}
              onClick={() =>
                setActiveCategory(
                  isActive ? null : category.category.toLowerCase(),
                )
              }
              className={cn(
                'relative group text-left p-5 rounded-xl border transition-all duration-300',
                'bg-card/50 backdrop-blur-sm',
                category.borderColor,
                category.hoverBorder,
                isActive && 'ring-1 ring-offset-2 ring-offset-background',
                isActive && category.borderColor.replace('border-', 'ring-'),
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Background */}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  category.gradient,
                  isActive && 'opacity-100',
                )}
              />

              <div className='relative z-10'>
                <div className='flex items-start justify-between mb-3'>
                  <div
                    className={cn(
                      'p-2.5 rounded-lg transition-colors',
                      category.iconBg,
                    )}
                  >
                    <category.Icon className={cn('h-5 w-5', category.iconColor)} />
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-300',
                      isActive && 'rotate-90',
                    )}
                  />
                </div>
                <h3 className='font-semibold text-foreground mb-1'>
                  {category.category}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {category.description}
                </p>
                <div className='mt-3 flex items-center gap-1.5'>
                  <span className='text-xs font-medium text-muted-foreground'>
                    {category.reports.length} report
                    {category.reports.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Reports Section */}
      <AnimatePresence mode='wait'>
        {activeCategoryData && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden'>
              {/* Section Header */}
              <div className='px-6 py-4 border-b border-border/50 bg-muted/30'>
                <div className='flex items-center gap-3'>
                  <div className={cn('p-2 rounded-lg', activeCategoryData.iconBg)}>
                    <activeCategoryData.Icon
                      className={cn('h-4 w-4', activeCategoryData.iconColor)}
                    />
                  </div>
                  <div>
                    <h2 className='font-semibold text-foreground'>
                      {activeCategoryData.category} Reports
                    </h2>
                    <p className='text-xs text-muted-foreground'>
                      Select a report to generate
                    </p>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className='divide-y divide-border/50'>
                {activeCategoryData.reports.map((report, index) => (
                  <motion.button
                    key={report.label}
                    onClick={() => handleReportClick(report.href)}
                    onMouseEnter={() => setHoveredReport(report.href)}
                    onMouseLeave={() => setHoveredReport(null)}
                    className='w-full text-left px-6 py-4 hover:bg-muted/50 transition-colors group'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            'bg-muted/50 group-hover:bg-muted',
                            hoveredReport === report.href &&
                              activeCategoryData.iconBg,
                          )}
                        >
                          <report.Icon
                            className={cn(
                              'h-4 w-4 transition-colors',
                              'text-muted-foreground',
                              hoveredReport === report.href &&
                                activeCategoryData.iconColor,
                            )}
                          />
                        </div>
                        <div>
                          <h3 className='font-medium text-foreground group-hover:text-foreground/90'>
                            {report.label}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity'>
                          Generate
                        </span>
                        <ArrowRight
                          className={cn(
                            'h-4 w-4 text-muted-foreground transition-all',
                            'group-hover:translate-x-1',
                            hoveredReport === report.href &&
                              activeCategoryData.iconColor,
                          )}
                        />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!activeCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12 px-6 rounded-xl border border-dashed border-border/50 bg-muted/20'
        >
          <div className='inline-flex p-3 rounded-full bg-muted/50 mb-4'>
            <FileText className='h-6 w-6 text-muted-foreground' />
          </div>
          <h3 className='font-medium text-foreground mb-1'>
            Select a category
          </h3>
          <p className='text-sm text-muted-foreground max-w-sm mx-auto'>
            Choose a crop category above to view and generate available reports
          </p>
        </motion.div>
      )}
    </div>
  )
}
