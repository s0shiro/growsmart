'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import PlantingsTable from './PlantingsTable'
import HarvestedCropsTable from './HarvestedCropsTable'

const RecordsTabs = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('tab', value)
    window.history.pushState(
      {},
      '',
      `${pathname}?${newSearchParams.toString()}`,
    )
  }

  useEffect(() => {
    if (!tab) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('tab', 'recent-plantings')
      window.history.pushState(
        {},
        '',
        `${pathname}?${newSearchParams.toString()}`,
      )
    }
  }, [tab, pathname, searchParams])

  return (
    <Tabs
      defaultValue={tab || 'recent-plantings'}
      onValueChange={handleTabChange}
    >
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='recent-plantings'>Plantings</TabsTrigger>
          <TabsTrigger value='harvests'>Harvested</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='recent-plantings'>
        <PlantingsTable />
      </TabsContent>
      <TabsContent value='harvests'>
        <HarvestedCropsTable />
      </TabsContent>
    </Tabs>
  )
}

export default RecordsTabs
