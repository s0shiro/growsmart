'use client'

import React, { useRef } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

type SeedData = {
  area: number
  averageYield: number
  production: number
}

type BarangayData = {
  noOfFarmerHarvested: number
  hybridSeeds: SeedData
  registeredSeeds: SeedData
  certifiedSeeds: SeedData
  goodQualitySeeds: SeedData
  farmerSavedSeeds: SeedData
}

const barangays: Record<string, Record<string, BarangayData>> = {
  BOAC: {
    Agot: {
      noOfFarmerHarvested: 50,
      hybridSeeds: { area: 10, averageYield: 5.5, production: 55 },
      registeredSeeds: { area: 15, averageYield: 5.0, production: 75 },
      certifiedSeeds: { area: 20, averageYield: 4.8, production: 96 },
      goodQualitySeeds: { area: 25, averageYield: 4.5, production: 112.5 },
      farmerSavedSeeds: { area: 30, averageYield: 4.0, production: 120 },
    },
    Buliashin: {
      noOfFarmerHarvested: 40,
      hybridSeeds: { area: 8, averageYield: 5.2, production: 41.6 },
      registeredSeeds: { area: 12, averageYield: 4.8, production: 57.6 },
      certifiedSeeds: { area: 16, averageYield: 4.6, production: 73.6 },
      goodQualitySeeds: { area: 20, averageYield: 4.3, production: 86 },
      farmerSavedSeeds: { area: 24, averageYield: 3.8, production: 91.2 },
    },
  },
}

export default function HarvestingReportTable() {
  const printableRef = useRef<HTMLDivElement>(null)

  const calculateTotal = (data: BarangayData) => {
    const seedTypes = [
      'hybridSeeds',
      'registeredSeeds',
      'certifiedSeeds',
      'goodQualitySeeds',
      'farmerSavedSeeds',
    ] as const
    return seedTypes.reduce(
      (acc, seedType) => ({
        area: acc.area + data[seedType].area,
        averageYield: acc.averageYield + data[seedType].averageYield,
        production: acc.production + data[seedType].production,
      }),
      { area: 0, averageYield: 0, production: 0 },
    )
  }

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>IRRIGATED Harvesting Report</title>
              <style>
                @page { size: landscape; }
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 4px; text-align: center; font-size: 12px; }
                .irrigated-header { background-color: #FFFF00; }
                .municipality { background-color: #FFA500; text-align: left; }
                .seed-type { background-color: #FFFFFF; }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      } else {
        alert('Please allow popups for this website')
      }
    }
  }

  return (
    <div className='p-4'>
      <ScrollArea className='w-full rounded-md border'>
        <div ref={printableRef}>
          <table className='w-full border-collapse border-2 border-black text-sm'>
            <thead>
              <tr>
                <th
                  rowSpan={3}
                  className='border border-black p-2 bg-white text-black'
                >
                  BARANGAY
                </th>
                <th
                  rowSpan={3}
                  className='border border-black p-2 bg-white text-black'
                >
                  No. of Farmer Harvested
                </th>
                <th
                  colSpan={18}
                  className='border border-black p-2 bg-yellow-300 text-black text-center font-bold irrigated-header'
                >
                  IRRIGATED
                </th>
              </tr>
              <tr>
                {[
                  'HYBRID SEEDS',
                  'REGISTERED SEEDS',
                  'CERTIFIED SEEDS',
                  'GOOD QUALITY SEEDS',
                  'FARMER SAVED SEEDS',
                  'TOTAL',
                ].map((seedType) => (
                  <React.Fragment key={seedType}>
                    <th
                      colSpan={3}
                      className='border border-black p-2 bg-white text-black seed-type'
                    >
                      {seedType}
                    </th>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                {[
                  'HYBRID SEEDS',
                  'REGISTERED SEEDS',
                  'CERTIFIED SEEDS',
                  'GOOD QUALITY SEEDS',
                  'FARMER SAVED SEEDS',
                  'TOTAL',
                ].map(() => (
                  <React.Fragment key={Math.random()}>
                    <th className='border border-black p-2 bg-white text-black'>
                      Area
                      <br />
                      (ha)
                    </th>
                    <th className='border border-black p-2 bg-white text-black'>
                      Average Yield
                      <br />
                      (mt/ha)
                    </th>
                    <th className='border border-black p-2 bg-white text-black'>
                      Production
                      <br />
                      (mt)
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(barangays).map(([municipality, barangayData]) => (
                <React.Fragment key={municipality}>
                  <tr>
                    <td
                      colSpan={20}
                      className='border border-black p-2 bg-orange-300 text-black font-bold municipality'
                    >
                      {municipality}
                    </td>
                  </tr>
                  {Object.entries(barangayData).map(([barangay, data]) => {
                    const total = calculateTotal(data)
                    return (
                      <tr key={barangay}>
                        <td className='border border-black p-2 bg-white text-black'>
                          {barangay}
                        </td>
                        <td className='border border-black p-2 bg-white text-black text-center'>
                          {data.noOfFarmerHarvested}
                        </td>
                        {[
                          'hybridSeeds',
                          'registeredSeeds',
                          'certifiedSeeds',
                          'goodQualitySeeds',
                          'farmerSavedSeeds',
                        ].map((seedType) => (
                          <React.Fragment key={seedType}>
                            <td className='border border-black p-2 bg-white text-black text-center'>
                              {data[seedType].area.toFixed(2)}
                            </td>
                            <td className='border border-black p-2 bg-white text-black text-center'>
                              {data[seedType].averageYield.toFixed(2)}
                            </td>
                            <td className='border border-black p-2 bg-white text-black text-center'>
                              {data[seedType].production.toFixed(2)}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className='border border-black p-2 bg-white text-black text-center'>
                          {total.area.toFixed(2)}
                        </td>
                        <td className='border border-black p-2 bg-white text-black text-center'>
                          {(total.averageYield / 5).toFixed(2)}
                        </td>
                        <td className='border border-black p-2 bg-white text-black text-center'>
                          {total.production.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <Button onClick={handlePrint} className='mt-4'>
        Print
      </Button>
    </div>
  )
}
