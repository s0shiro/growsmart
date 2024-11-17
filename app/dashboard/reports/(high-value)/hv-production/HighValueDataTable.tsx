'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import useHighValueInspection from '@/hooks/reports/useFetchHighValueInspectionData'
import { format } from 'date-fns'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import { Printer } from 'lucide-react'

type CropData = {
  area_planted: number
  classification: string
  crop_type: {
    id: string
    name: string
  }
}

type CategoryData = {
  existing: number
  thisMonth: number
  toDate: number
  production: number
}

type TableData = {
  [key: string]: {
    [key: string]: CategoryData
  }
}

const classificationMap: { [key: string]: string } = {
  'lowland vegetable': 'Lowland Vegetables',
  'upland vegetable': 'Upland Vegetables',
  legumes: 'Legumes',
  spice: 'Spice(s)',
  rootcrop: 'Rootcrops',
  fruit: 'Fruits',
}

const calculateTotals = (data: TableData) => {
  const totals: { [key: string]: CategoryData } = {}
  Object.keys(data).forEach((category) => {
    totals[category] = Object.values(data[category]).reduce(
      (acc, curr) => ({
        existing: acc.existing + curr.existing,
        thisMonth: acc.thisMonth + curr.thisMonth,
        toDate: acc.toDate + curr.toDate,
        production: acc.production + curr.production,
      }),
      { existing: 0, thisMonth: 0, toDate: 0, production: 0 },
    )
  })
  return totals
}

export default function Component() {
  const printableRef = useRef<HTMLDivElement>(null)
  const { data, error, isFetching } = useHighValueInspection()
  const { data: user } = useCurrentUserProfile()

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Agricultural Report</title>
              <style>
                *, *::before, *::after {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                @page { size: landscape; }
                body { font-family: Arial, sans-serif; font-size: 9px; }
                table { width: 100%; border-collapse: collapse; border: 2px solid black; }
                th, td { border: 1px solid black; padding: 4px; font-size: 10px; }
                .commodity { font-weight: bold; }
                 .header-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
                }
                .region {
                margin-bottom: 2px;
                }
                .total { font-weight: bold; }
                .crop { padding-left: 15px; }
                .signature-section {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 10px;
                  flex-wrap: wrap;
                }

                .signature-block {
                  text-align: center;
                  flex: 0 0 auto;
                }

                .signature-block:last-child {
                  flex-basis: 100%;
                  margin-top: 1rem;
                  display: flex;
                  flex-direction: column;
                  align-items: center; /* Centers the content horizontally */
                }

                .signature-line {
                  width: 200px;
                  border-top: 1px solid black;
                  margin-top: 30px;
                }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <div class="header-info">
              <div>
                <p class="region"><strong>REGION: IV - MIMAROPA</strong></p>
                <p><strong>PROVINCE: MARINDUQUE</strong></p>\
               <p><strong>For the Month of: ${format(new Date(), 'MMMM yyyy').toUpperCase()}</strong></p>
              </div>
            </div>
              ${printContent}
              <div class="signature-section">
                <div class="signature-block">
                  <p>Prepared by:</p>
                  <div class="signature-line"></div>
                  <p><strong>${user?.full_name}</strong></p>
                  <p>${user?.job_title}</p>
                </div>
                <div class="signature-block">
                  <p>Submitted by:</p>
                  <div class="signature-line"></div>
                  <p><strong>VANESSA TAYABA</strong></p>
                  <p>Municipal Agricultural Officer</p>
                </div>
                <div class="signature-block">
                  <p>Noted by:</p>
                  <div class="signature-line"></div>
                  <p><strong>EDILBERTO M. DE LUNA</strong></p>
                  <p>Provincial Agricuturist</p>
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

  if (isFetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const tableData: TableData = {
    'Lowland Vegetables': {},
    'Upland Vegetables': {},
    Legumes: {},
    'Spice(s)': {},
    Rootcrops: {},
    Fruits: {},
  }

  // Process existing data
  data?.existing?.forEach((crop: CropData) => {
    const category = classificationMap[crop.classification] || 'Other'
    if (category === 'Other') return // Skip if classification is not recognized

    if (!tableData[category][crop.crop_type.name]) {
      tableData[category][crop.crop_type.name] = {
        existing: 0,
        thisMonth: 0,
        toDate: 0,
        production: 0,
      }
    }
    tableData[category][crop.crop_type.name].existing += crop.area_planted
    tableData[category][crop.crop_type.name].toDate += crop.area_planted
  })

  // Process current month data
  data?.currentMonth?.forEach((crop: CropData) => {
    const category = classificationMap[crop.classification] || 'Other'
    if (category === 'Other') return // Skip if classification is not recognized

    if (!tableData[category][crop.crop_type.name]) {
      tableData[category][crop.crop_type.name] = {
        existing: 0,
        thisMonth: 0,
        toDate: 0,
        production: 0,
      }
    }
    tableData[category][crop.crop_type.name].thisMonth += crop.area_planted
    tableData[category][crop.crop_type.name].toDate += crop.area_planted
  })

  // Process production data
  if (data?.production) {
    const { name, yield_quantity } = data.production
    Object.values(tableData).forEach((category) => {
      if (category[name]) {
        category[name].production = yield_quantity
      }
    })
  }

  // Remove categories and crops with all zero values
  Object.keys(tableData).forEach((category) => {
    Object.keys(tableData[category]).forEach((crop) => {
      const data = tableData[category][crop]
      if (
        data.existing === 0 &&
        data.thisMonth === 0 &&
        data.toDate === 0 &&
        data.production === 0
      ) {
        delete tableData[category][crop]
      }
    })
    if (Object.keys(tableData[category]).length === 0) {
      delete tableData[category]
    }
  })

  const totals = calculateTotals(tableData)

  return (
    <div>
      <div className='flex justify-end mb-4'>
        <Button onClick={handlePrint}>
          {' '}
          <Printer className='mr-2 h-4 w-4' /> Print High Value Report
        </Button>
      </div>
      <div ref={printableRef}>
        <table className='w-full border-collapse border text-sm'>
          <thead>
            <tr>
              <th rowSpan={2} className='border p-2 font-medium text-left'>
                COMMODITY
              </th>
              <th colSpan={3} className='border p-2 font-medium text-center'>
                AREA PLANTED (ha)
              </th>
              <th colSpan={2} className='border p-2 font-medium text-center'>
                PRODUCTION (MT)
              </th>
              <th rowSpan={2} className='border p-2 font-medium text-left'>
                REMARKS
              </th>
            </tr>
            <tr>
              <th className='border p-2  font-medium'>EXISTING</th>
              <th className='border p-2  font-medium'>THIS MONTH</th>
              <th className='border p-2  font-medium'>TO DATE</th>
              <th className='border p-2  font-medium'>THIS MONTH</th>
              <th className='border p-2  font-medium'>TO DATE</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tableData).map(([category, crops]) => (
              <React.Fragment key={category}>
                <tr>
                  <td className='border p-2 font-medium commodity'>
                    {category}
                  </td>
                  <td className='border p-2'></td>
                  <td className='border p-2'></td>
                  <td className='border p-2'></td>
                  <td className='border p-2'></td>
                  <td className='border p-2'></td>
                  <td className='border p-2'></td>
                </tr>
                {Object.entries(crops).map(([crop, data]) => (
                  <tr key={crop}>
                    <td className='border p-2 pl-4 crop'>{crop}</td>
                    <td className='border p-2 text-right'>
                      {data.existing > 0 ? data.existing.toFixed(4) : ''}
                    </td>
                    <td className='border p-2 text-right'>
                      {data.thisMonth > 0 ? data.thisMonth.toFixed(4) : ''}
                    </td>
                    <td className='border p-2 text-right'>
                      {data.toDate > 0 ? data.toDate.toFixed(4) : ''}
                    </td>
                    <td className='border p-2 text-right'>
                      {data.production > 0 ? data.production.toFixed(2) : ''}
                    </td>
                    <td className='border p-2 text-right'>
                      {data.production > 0 ? data.production.toFixed(2) : ''}
                    </td>
                    <td className='border p-2'></td>
                  </tr>
                ))}
                <tr>
                  <td className='border p-2 pl-4 font-medium total'>TOTAL</td>
                  <td className='border p-2 text-right font-medium total'>
                    {totals[category].existing > 0
                      ? totals[category].existing.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium total'>
                    {totals[category].thisMonth > 0
                      ? totals[category].thisMonth.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium total'>
                    {totals[category].toDate > 0
                      ? totals[category].toDate.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium total'>
                    {totals[category].production > 0
                      ? totals[category].production.toFixed(2)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium total'>
                    {totals[category].production > 0
                      ? totals[category].production.toFixed(2)
                      : ''}
                  </td>
                  <td className='border p-2'></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
