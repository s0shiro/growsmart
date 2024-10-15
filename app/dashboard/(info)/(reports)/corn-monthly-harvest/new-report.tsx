'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useFetchMonthlyHarvestedCorn from '@/hooks/reports/useFetchMonthlyHarvestedcorn'

type CornData = {
  field_location: string
  crop_categoryId: { name: string }
  crop_type: { name: string }
  farmer_id: { lastname: string; firstname: string }
  harvest_records: { area_harvested: number; yield_quantity: number }[]
}

const calculateProduction = (yieldQuantity: number): number => {
  return yieldQuantity / 1000 // Convert kg to MT
}

const calculateAverageYield = (
  production: number,
  areaHarvested: number,
): number => {
  return areaHarvested > 0 ? production / areaHarvested : 0
}

const municipalities = [
  'Boac',
  'Buenavista',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
]

export default function MonthlyCornHarvesting() {
  const { data } = useFetchMonthlyHarvestedCorn()
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null)
  const printableRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Corn Production Table</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; border: 2px solid black; }
                th, td { border: 1px solid black; padding: 4px; font-size: 10px; }
                th { background-color: white; }
                .teal { background-color: #008080 !important; color: white !important; }
                .orange { background-color: #FFA500 !important; }
                .yellow { background-color: #FFFF00 !important; }
                .green { background-color: #90EE90 !important; }
                @media print {
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  @page { size: landscape; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const processData = (
    data: CornData[],
    selectedMunicipality: string | null,
  ) => {
    const barangays: {
      [key: string]: { [key: string]: { area: number; production: number } }
    } = {}

    data.forEach((item) => {
      const [barangay, municipality] = item.field_location.split(', ')

      if (selectedMunicipality && municipality !== selectedMunicipality) {
        return
      }

      const cornType = item.crop_type.name

      if (!barangays[barangay]) {
        barangays[barangay] = {
          Yellow: { area: 0, production: 0 },
          White: { area: 0, production: 0 },
        }
      }

      const areaHarvested = item.harvest_records[0].area_harvested
      const production = calculateProduction(
        item.harvest_records[0].yield_quantity,
      )

      barangays[barangay][cornType].area += areaHarvested
      barangays[barangay][cornType].production += production
    })

    return barangays
  }

  const processedData =
    data && selectedMunicipality ? processData(data, selectedMunicipality) : {}

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <Select onValueChange={(value) => setSelectedMunicipality(value)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Municipality' />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((municipality) => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div ref={printableRef}>
        {selectedMunicipality && (
          <table className='w-full border-collapse border-2 border-black text-xs'>
            <thead>
              <tr>
                <th rowSpan={3} className='border border-black p-1'>
                  BARANGAY
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  HYBRID
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  GREEN CORN/SWEET CORN
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  TRADITIONAL
                </th>
                <th colSpan={6} className='border border-black p-1'>
                  TOTAL
                </th>
              </tr>
              <tr>
                <th colSpan={3} className='border border-black p-1'>
                  YELLOW
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  WHITE
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  WHITE
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  YELLOW
                </th>
                <th colSpan={3} className='border border-black p-1'>
                  WHITE
                </th>
              </tr>
              <tr>
                {['YELLOW', 'WHITE', 'WHITE', 'YELLOW', 'WHITE'].map(
                  (category, index) => (
                    <React.Fragment key={index}>
                      <th className='border border-black p-1'>
                        Area Harvested (ha)
                      </th>
                      <th className='border border-black p-1'>
                        Ave Yield (MT/ha)
                      </th>
                      <th className='border border-black p-1'>
                        Production (MT)
                      </th>
                    </React.Fragment>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <tr className='teal'>
                <td colSpan={16} className='border border-black p-1'>
                  {selectedMunicipality.toUpperCase()}
                </td>
              </tr>
              {Object.entries(processedData).map(([barangay, data], index) => (
                <tr key={index}>
                  <td className='border border-black p-1'>{barangay}</td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.area !== 0 ? data.Yellow.area.toFixed(4) : ''}
                  </td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.area !== 0
                      ? calculateAverageYield(
                          data.Yellow.production,
                          data.Yellow.area,
                        ).toFixed(4)
                      : ''}
                  </td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.production !== 0
                      ? data.Yellow.production.toFixed(4)
                      : ''}
                  </td>
                  <td className='border border-black p-1'>
                    {data.White.area !== 0 ? data.White.area.toFixed(4) : ''}
                  </td>
                  <td className='border border-black p-1'>
                    {data.White.area !== 0
                      ? calculateAverageYield(
                          data.White.production,
                          data.White.area,
                        ).toFixed(4)
                      : ''}
                  </td>
                  <td className='orange border border-black p-1'>
                    {data.White.production !== 0
                      ? data.White.production.toFixed(4)
                      : ''}
                  </td>
                  <td className='border border-black p-1'></td>
                  <td className='border border-black p-1'></td>
                  <td className='border border-black p-1'></td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.area !== 0 ? data.Yellow.area.toFixed(4) : ''}
                  </td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.area !== 0
                      ? calculateAverageYield(
                          data.Yellow.production,
                          data.Yellow.area,
                        ).toFixed(4)
                      : ''}
                  </td>
                  <td className='yellow border border-black p-1'>
                    {data.Yellow.production !== 0
                      ? data.Yellow.production.toFixed(4)
                      : ''}
                  </td>
                  <td className='border border-black p-1'>
                    {data.White.area !== 0 ? data.White.area.toFixed(4) : ''}
                  </td>
                  <td className='border border-black p-1'>
                    {data.White.area !== 0
                      ? calculateAverageYield(
                          data.White.production,
                          data.White.area,
                        ).toFixed(4)
                      : ''}
                  </td>
                  <td className='orange border border-black p-1'>
                    {data.White.production !== 0
                      ? data.White.production.toFixed(4)
                      : ''}
                  </td>
                </tr>
              ))}
              <tr className='green'>
                <td className='border border-black p-1 font-bold'>TOTAL</td>
                {['Yellow', 'White', 'White', 'Yellow', 'White'].map(
                  (cornType, index) => {
                    const totalArea = Object.values(processedData).reduce(
                      (sum, data) => sum + data[cornType].area,
                      0,
                    )
                    const totalProduction = Object.values(processedData).reduce(
                      (sum, data) => sum + data[cornType].production,
                      0,
                    )
                    const averageYield = calculateAverageYield(
                      totalProduction,
                      totalArea,
                    )
                    return (
                      <React.Fragment key={index}>
                        <td className='border border-black p-1'>
                          {totalArea !== 0 ? totalArea.toFixed(4) : ''}
                        </td>
                        <td className='border border-black p-1'>
                          {averageYield !== 0 ? averageYield.toFixed(4) : ''}
                        </td>
                        <td className='border border-black p-1'>
                          {totalProduction !== 0
                            ? totalProduction.toFixed(4)
                            : ''}
                        </td>
                      </React.Fragment>
                    )
                  },
                )}
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <Button
        onClick={handlePrint}
        className='mt-4'
        disabled={!selectedMunicipality}
      >
        Print
      </Button>
    </div>
  )
}
