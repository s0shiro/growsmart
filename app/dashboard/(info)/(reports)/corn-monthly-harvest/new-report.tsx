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
import useFetchMonthlyHarvestedCorn from '@/hooks/reports/useFetchMonthlyHarvestedCorn'
import { formatDate } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type CornData = {
  field_location: string
  crop_categoryId: { name: string }
  crop_type: { name: string }
  variety: { name: string }
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

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // getMonth() returns 0-11
  const isFirstHalf = currentMonth >= 1 && currentMonth <= 6

  const formattedDate = formatDate(currentDate)

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
         <html>
          <head>
            <title>Corn Harvesting Accomplishment ${selectedMunicipality}- ${formattedDate}</title>
            <style>
              *, *::before, *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { font-family: Arial, sans-serif; font-size: 9px; }
              table { width: 100%; border-collapse: collapse; border: 2px solid black; }
              th, td { border: 1px solid black; padding: 4px; font-size: 10px; }
              th { background-color: white; }
              .teal { background-color: #D3D3D3 !important; color: black !important; }
              .orange { background-color: #FFA500 !important; }
              .yellow { background-color: #FFFF00 !important; }
              .green { background-color: #90EE90 !important; }
              .date-text {
                text-align: center;
                font-weight: bold;
                margin-bottom: 8px;
              }
              .month {
                  color: #c7bbc90;
              }
              .header-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
              .region {
                margin-bottom: 8px;
              }
              .signature-section {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 30px;
                }
                .signature-block {
                  text-align: center;
                }
                .signature-line {
                  width: 200px;
                  border-top: 1px solid black;
                  margin-top: 30px;
                }
              .checkbox-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
              }

              .checkbox-label {
                display: flex;
                align-items: center;
                margin: 3px 0;
              }

              .checkbox-label input {
                margin-right: 5px;
              }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: landscape; }
              }
            </style>
          </head>
          <body>
            <div class="date-text">
              <p>CORN PROGRAM</p>
              <p>MONTHLY HARVESTING ACCOMPLISHMENT REPORT</p>
              <p class="month">For the Month of: ${formattedDate}</p>
            </div>
            <div class="header-info">
              <div>
                <p class="region"><strong>REGION:</strong> RFO IVB</p>
                <p><strong>PROVINCE:</strong> MARINDUQUE</p>
              </div>
              <div class="checkbox-container">
                <label class="checkbox-label">
                 <input type="checkbox" ${isFirstHalf ? 'checked' : ''}>
                  <span>JANUARY - JUNE</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" ${!isFirstHalf ? 'checked' : ''}>
                  <span>JULY - DECEMBER</span>
                </label>
              </div>
            </div>
            ${printContent}
           <div class="signature-section">
                <div class="signature-block">
                  <p>Prepared by:</p>
                  <div class="signature-line"></div>
                  <p><strong>JERALD B. MABUTI</strong></p>
                  <p>Corn AEW</p>
                </div>
                <div class="signature-block">
                  <p>Certified true and correct:</p>
                  <div class="signature-line"></div>
                  <p><strong>VANESSA TAYABA</strong></p>
                  <p>Municipal Agricultural Officer</p>
                </div>
              </div>
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

  const processData = (
    data: CornData[],
    selectedMunicipality: string | null,
  ) => {
    const barangays: {
      [key: string]: {
        Yellow: { Hybrid: { area: number; production: number } }
        White: {
          Traditional: { area: number; production: number }
          'Green Corn/Sweet Corn': { area: number; production: number }
        }
      }
    } = {}

    data.forEach((item) => {
      const [barangay, municipality] = item.field_location.split(', ')

      if (selectedMunicipality && municipality !== selectedMunicipality) {
        return
      }

      const cornType = item.crop_type.name
      const variety = item.variety.name

      if (!barangays[barangay]) {
        barangays[barangay] = {
          Yellow: { Hybrid: { area: 0, production: 0 } },
          White: {
            Traditional: { area: 0, production: 0 },
            'Green Corn/Sweet Corn': { area: 0, production: 0 },
          },
        }
      }

      const areaHarvested = item.harvest_records[0].area_harvested
      const production = calculateProduction(
        item.harvest_records[0].yield_quantity,
      )

      if (cornType === 'Yellow' && variety === 'Hybrid') {
        barangays[barangay].Yellow.Hybrid.area += areaHarvested
        barangays[barangay].Yellow.Hybrid.production += production
      } else if (cornType === 'White') {
        if (variety === 'Traditional') {
          barangays[barangay].White.Traditional.area += areaHarvested
          barangays[barangay].White.Traditional.production += production
        } else if (variety === 'Green Corn/Sweet Corn') {
          barangays[barangay].White['Green Corn/Sweet Corn'].area +=
            areaHarvested
          barangays[barangay].White['Green Corn/Sweet Corn'].production +=
            production
        }
      }
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
      <ScrollArea className='w-full rounded-md border'>
        <div ref={printableRef}>
          {selectedMunicipality && (
            <table className='w-full border-collapse border-2 border-[hsl(var(--border))] text-xs'>
              <thead>
                <tr>
                  <th
                    rowSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    MUNICIPALITY
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    HYBRID
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    GREEN CORN/SWEET CORN
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    TRADITIONAL
                  </th>
                  <th
                    colSpan={6}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    TOTAL
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    YELLOW
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    WHITE
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    WHITE
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    YELLOW
                  </th>
                  <th
                    colSpan={3}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    WHITE
                  </th>
                </tr>
                <tr>
                  {['YELLOW', 'WHITE', 'WHITE', 'YELLOW', 'WHITE'].map(
                    (category, index) => (
                      <React.Fragment key={index}>
                        <th className='border border-[hsl(var(--border))] p-1'>
                          Area Harvested (ha)
                        </th>
                        <th className='border border-[hsl(var(--border))] p-1'>
                          Ave Yield (MT/ha)
                        </th>
                        <th className='border border-[hsl(var(--border))] p-1 bg-orange-500'>
                          Production (MT)
                        </th>
                      </React.Fragment>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className='teal'>
                  <td
                    colSpan={16}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    {selectedMunicipality.toUpperCase()}
                  </td>
                </tr>
                {Object.entries(processedData).map(
                  ([barangay, data], index) => (
                    <tr key={index}>
                      <td className='border border-[hsl(var(--border))] p-1'>
                        {barangay}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1'>
                        {data.Yellow.Hybrid.area !== 0
                          ? data.Yellow.Hybrid.area.toFixed(4)
                          : ''}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1'>
                        {data.Yellow.Hybrid.area !== 0
                          ? calculateAverageYield(
                              data.Yellow.Hybrid.production,
                              data.Yellow.Hybrid.area,
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1 bg-orange-500'>
                        {data.Yellow.Hybrid.production !== 0
                          ? data.Yellow.Hybrid.production.toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1'>
                        {data.White['Green Corn/Sweet Corn'].area !== 0
                          ? data.White['Green Corn/Sweet Corn'].area.toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1'>
                        {data.White['Green Corn/Sweet Corn'].area !== 0
                          ? calculateAverageYield(
                              data.White['Green Corn/Sweet Corn'].production,
                              data.White['Green Corn/Sweet Corn'].area,
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='orange border border-[hsl(var(--border))] p-1 bg-orange-500'>
                        {data.White['Green Corn/Sweet Corn'].production !== 0
                          ? data.White[
                              'Green Corn/Sweet Corn'
                            ].production.toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1'>
                        {data.White.Traditional.area !== 0
                          ? data.White.Traditional.area.toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1 font bold'>
                        {data.White.Traditional.area !== 0
                          ? calculateAverageYield(
                              data.White.Traditional.production,
                              data.White.Traditional.area,
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='orange border border-[hsl(var(--border))] p-1 font bold bg-orange-500'>
                        {data.White.Traditional.production !== 0
                          ? data.White.Traditional.production.toFixed(4)
                          : ''}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1 font bold'>
                        {data.Yellow.Hybrid.area !== 0
                          ? data.Yellow.Hybrid.area.toFixed(4)
                          : ''}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1 font bold'>
                        {data.Yellow.Hybrid.area !== 0
                          ? calculateAverageYield(
                              data.Yellow.Hybrid.production,
                              data.Yellow.Hybrid.area,
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='yellow border border-[hsl(var(--border))] p-1 font bold bg-orange-500'>
                        {data.Yellow.Hybrid.production !== 0
                          ? data.Yellow.Hybrid.production.toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1 font bold'>
                        {data.White['Green Corn/Sweet Corn'].area +
                          data.White.Traditional.area !==
                        0
                          ? (
                              data.White['Green Corn/Sweet Corn'].area +
                              data.White.Traditional.area
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1 font bold'>
                        {data.White['Green Corn/Sweet Corn'].area +
                          data.White.Traditional.area !==
                        0
                          ? (
                              (data.White['Green Corn/Sweet Corn'].production +
                                data.White.Traditional.production) /
                              (data.White['Green Corn/Sweet Corn'].area +
                                data.White.Traditional.area)
                            ).toFixed(4)
                          : ''}
                      </td>
                      <td className='orange border border-[hsl(var(--border))] p-1 font bold bg-orange-500'>
                        {data.White['Green Corn/Sweet Corn'].production +
                          data.White.Traditional.production !==
                        0
                          ? (
                              data.White['Green Corn/Sweet Corn'].production +
                              data.White.Traditional.production
                            ).toFixed(4)
                          : ''}
                      </td>
                    </tr>
                  ),
                )}
                <tr className='green bg-green-500'>
                  <td className='border border-[hsl(var(--border))] p-1 font bold'>
                    TOTAL
                  </td>
                  {[
                    'Yellow.Hybrid',
                    'White.Green Corn/Sweet Corn',
                    'White.Traditional',
                    'Yellow',
                    'White',
                  ].map((category, index) => {
                    const [cornType, variety] = category.split('.')
                    const totalArea = Object.values(processedData).reduce(
                      (sum, data) => {
                        if (variety) {
                          return sum + (data[cornType][variety]?.area || 0)
                        } else {
                          return (
                            sum +
                            (cornType === 'Yellow'
                              ? data.Yellow.Hybrid.area
                              : data.White['Green Corn/Sweet Corn'].area +
                                data.White.Traditional.area)
                          )
                        }
                      },
                      0,
                    )
                    const totalProduction = Object.values(processedData).reduce(
                      (sum, data) => {
                        if (variety) {
                          return (
                            sum + (data[cornType][variety]?.production || 0)
                          )
                        } else {
                          return (
                            sum +
                            (cornType === 'Yellow'
                              ? data.Yellow.Hybrid.production
                              : data.White['Green Corn/Sweet Corn'].production +
                                data.White.Traditional.production)
                          )
                        }
                      },
                      0,
                    )
                    const averageYield = calculateAverageYield(
                      totalProduction,
                      totalArea,
                    )
                    return (
                      <React.Fragment key={index}>
                        <td className='border border-[hsl(var(--border))] p-1'>
                          {totalArea !== 0 ? totalArea.toFixed(4) : ''}
                        </td>
                        <td className='border border-[hsl(var(--border))] p-1'>
                          {averageYield !== 0 ? averageYield.toFixed(4) : ''}
                        </td>
                        <td className='border border-[hsl(var(--border))] p-1'>
                          {totalProduction !== 0
                            ? totalProduction.toFixed(4)
                            : ''}
                        </td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
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
