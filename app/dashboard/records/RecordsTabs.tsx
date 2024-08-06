'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AllPlantingsByFarmers from './AllPlantingsByFarmers'
import HarvestedStatus from './Harvested'

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
          <TabsTrigger value='recent-plantings'>
            Recent Planting Records
          </TabsTrigger>
          <TabsTrigger value='harvests'>Recent Harvest</TabsTrigger>
          <TabsTrigger value='damages'>Damages</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='recent-plantings'>
        <AllPlantingsByFarmers />
      </TabsContent>
      <TabsContent value='harvests'>
        <HarvestedStatus />
      </TabsContent>
      <TabsContent value='damages'>
        <p>I'm tired w/ this shit.</p>
      </TabsContent>
    </Tabs>
  )
}

export default RecordsTabs
