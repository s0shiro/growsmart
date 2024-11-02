'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import useHighValueInspection from '@/hooks/reports/useFetchHighValueInspectionData'

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
                @page { size: landscape; }
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 4px; font-size: 10px; }
                .commodity { font-weight: bold; }
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
    <div className='p-4'>
      <div className='flex justify-end mb-4'>
        <Button onClick={handlePrint}>Print</Button>
      </div>
      <div ref={printableRef}>
        <table className='w-full border-collapse border text-sm'>
          <thead>
            <tr>
              <th
                rowSpan={2}
                className='border p-2 bg-gray-50 font-medium text-left'
              >
                COMMODITY
              </th>
              <th
                colSpan={3}
                className='border p-2 bg-gray-50 font-medium text-center'
              >
                AREA PLANTED (ha)
              </th>
              <th
                colSpan={2}
                className='border p-2 bg-gray-50 font-medium text-center'
              >
                PRODUCTION (MT)
              </th>
              <th
                rowSpan={2}
                className='border p-2 bg-gray-50 font-medium text-left'
              >
                REMARKS
              </th>
            </tr>
            <tr>
              <th className='border p-2 bg-gray-50 font-medium'>EXISTING</th>
              <th className='border p-2 bg-gray-50 font-medium'>THIS MONTH</th>
              <th className='border p-2 bg-gray-50 font-medium'>TO DATE</th>
              <th className='border p-2 bg-gray-50 font-medium'>THIS MONTH</th>
              <th className='border p-2 bg-gray-50 font-medium'>TO DATE</th>
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
                    <td className='border p-2 pl-4'>{crop}</td>
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
                  <td className='border p-2 pl-4 font-medium'>TOTAL</td>
                  <td className='border p-2 text-right font-medium'>
                    {totals[category].existing > 0
                      ? totals[category].existing.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium'>
                    {totals[category].thisMonth > 0
                      ? totals[category].thisMonth.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium'>
                    {totals[category].toDate > 0
                      ? totals[category].toDate.toFixed(4)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium'>
                    {totals[category].production > 0
                      ? totals[category].production.toFixed(2)
                      : ''}
                  </td>
                  <td className='border p-2 text-right font-medium'>
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
