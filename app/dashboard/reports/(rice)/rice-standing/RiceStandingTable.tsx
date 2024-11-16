'use client'

import { useRef, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import useRiceStandingData from '@/hooks/reports/useFetchStandingRiceData'
import { formatDate } from '@/lib/utils'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import { Input } from '@/components/ui/input'

type RiceData = {
  area_planted: number
  planting_date: string
  category_specific: {
    landType: string
    waterSupply: string
    classification: string
  }
  remarks: string
  location: {
    barangay: string
    province: string
    municipality: string
  }
}

export default function RiceStandingTable() {
  const printableRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = useRiceStandingData()
  const { data: user } = useCurrentUserProfile()
  const [notedByName, setNotedByName] = useState('VANESSA TAYABA')
  const [notedByTitle, setNotedByTitle] = useState(
    'Municipal Agricultural Officer',
  )

  const processedData = useMemo(() => {
    if (!data) return null

    const municipalities = [
      'Boac',
      'Buenavista',
      'Gasan',
      'Mogpog',
      'Santa Cruz',
      'Torrijos',
    ]
    const categories = ['irrigated', 'rainfed', 'upland']
    const stages = [
      'Newly Planted/Seeding Stage',
      'Vegetative Stage',
      'Reproductive Stage',
      'Maturing Stage',
    ]

    const stageMapping: Record<string, string> = {
      'newly planted/seedling': 'Newly Planted/Seeding Stage',
      vegetative: 'Vegetative Stage',
      reproductive: 'Reproductive Stage',
      maturing: 'Maturing Stage',
    }

    const initialData = {
      Marinduque: categories.reduce(
        (acc, category) => {
          acc[category] = stages.reduce(
            (stageAcc, stage) => {
              stageAcc[stage] = 0
              return stageAcc
            },
            {} as Record<string, number>,
          )
          acc[category].total = 0
          return acc
        },
        {} as Record<string, Record<string, number>>,
      ),
    }

    municipalities.forEach((municipality) => {
      initialData[municipality] = JSON.parse(
        JSON.stringify(initialData.Marinduque),
      )
    })

    data.forEach((item: RiceData) => {
      const { municipality } = item.location
      let category: string
      if (item.category_specific.waterSupply === 'irrigated') {
        category = 'irrigated'
      } else if (item.category_specific.landType === 'upland') {
        category = 'upland'
      } else {
        category = 'rainfed'
      }

      const stage = stageMapping[item.remarks.toLowerCase()] || 'Unknown Stage'
      if (stages.includes(stage)) {
        initialData[municipality][category][stage] += item.area_planted
        initialData[municipality][category].total += item.area_planted
        initialData.Marinduque[category][stage] += item.area_planted
        initialData.Marinduque[category].total += item.area_planted

        // Also add upland data to rainfed category
        if (category === 'upland') {
          initialData[municipality]['rainfed'][stage] += item.area_planted
          initialData[municipality]['rainfed'].total += item.area_planted
          initialData.Marinduque['rainfed'][stage] += item.area_planted
          initialData.Marinduque['rainfed'].total += item.area_planted
        }
      }
    })

    return initialData
  }, [data])

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Rice Standing Report</title>
              <style>
                *, *::before, *::after {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                @page {
                  size: landscape;
                  margin: 10mm;
                }
                body { font-family: Arial, sans-serif; font-size: 9px; }
                table { width: 100%; border-collapse: collapse; border: 2px solid black; }
                th, td { border: 1px solid black; padding: 4px; font-size: 10px; }
                th {
                  background-color: #f2f2f2;
                }
                td.locations {
                 text-align: left;
                 padding-left: 10px;
                }
                .province { background-color: #FFEF96; }
                .irrigated { background-color: #FFF5E6; }
                .rainfed { background-color: #E6F3FF; }
                .upland { background-color: #E6FFE6; }
                .date-text {
                text-align: center;
                font-weight: bold;
                margin-bottom: 8px;
                }
                .header-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
                }
                .region {
                margin-bottom: 2px;
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
                @media print {
                  body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
            <div class="date-text">
              <p>RICE</p>
              <p>STANDING CROP</p>
              <p>As of ${formatDate(new Date().toLocaleDateString())}</p>
            </div>
             <div class="header-info">
              <div>
                <p class="region"><strong>REGION: IV - MIMAROPA</strong></p>
                <p><strong>PROVINCE: MARINDUQUE</strong></p>
              </div>
            </div>
              ${printContent}
               <div class="signature-section">
                <div class="signature-block">
                  <p>Prepared by:</p>
                  <div class="signature-line"></div>
                  <p><strong>${user?.full_name?.toUpperCase()}</strong></p>
                  <p>${user?.job_title}</p>
                </div>
                <div class="signature-block">
                  <p>Noted by:</p>
                  <div class="signature-line"></div>
                  <p><strong>${notedByName.toUpperCase()}</strong></p>
                  <p>${notedByTitle}</p>
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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!processedData) return <div>No data available</div>

  const municipalities = [
    'Marinduque',
    'Boac',
    'Buenavista',
    'Gasan',
    'Mogpog',
    'Santa Cruz',
    'Torrijos',
  ]
  const categories = ['irrigated', 'rainfed', 'upland']
  const stages = [
    'Newly Planted/Seeding Stage',
    'Vegetative Stage',
    'Reproductive Stage',
    'Maturing Stage',
    'TOTAL',
  ]

  const formatNumber = (num: number) => {
    if (num === 0 || num.toFixed(4) === '0.0000') return ''
    return num.toFixed(4)
  }

  return (
    <div>
      <Button onClick={handlePrint} className='mb-4 print:hidden'>
        <Printer className='mr-2 h-4 w-4' /> Print Rice Standing Report
      </Button>

      <div ref={printableRef} className='overflow-x-auto'>
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr>
              <th
                rowSpan={2}
                className='border border-gray-300 p-2 text-left bg-gray-50 dark:bg-gray-800/30'
              >
                MUNICIPALITY/
                <br />
                BARANGAY
              </th>
              {categories.map((category) => (
                <th
                  key={category}
                  colSpan={5}
                  className={`border border-gray-300 p-2 text-center ${category}`}
                >
                  {category.toUpperCase()} (ha)
                </th>
              ))}
            </tr>
            <tr>
              {categories.map((category) =>
                stages.map((stage) => (
                  <th
                    key={`${category}-${stage}`}
                    className={`border border-gray-300 p-2 text-center ${category}`}
                  >
                    {stage}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {municipalities.map((place) => (
              <tr
                key={place}
                className={
                  place === 'Marinduque'
                    ? 'bg-yellow-50 font-bold province dark:bg-yellow-800/30'
                    : ''
                }
              >
                <td className='border border-gray-300 p-2 locations'>
                  {place}
                </td>
                {categories.flatMap((category) =>
                  stages.map((stage) => (
                    <td
                      key={`${place}-${category}-${stage}`}
                      className='border border-gray-300 p-2 text-center'
                    >
                      {formatNumber(
                        processedData[place][category][
                          stage === 'TOTAL' ? 'total' : stage
                        ] || 0,
                      )}
                    </td>
                  )),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='print:hidden w-full p-4 space-y-2 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t sm:border sm:rounded-lg sm:shadow-md sm:fixed sm:bottom-4 sm:right-4 sm:w-auto sm:p-4'>
        <div className='sm:flex sm:space-x-4 sm:space-y-0 space-y-2'>
          <div className='flex flex-col'>
            <label
              htmlFor='notedByName'
              className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'
            >
              Noted by Name
            </label>
            <input
              id='notedByName'
              type='text'
              placeholder='Enter name'
              value={notedByName}
              onChange={(e) => setNotedByName(e.target.value)}
              className='w-full sm:w-64 px-2 py-1 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none transition-colors'
            />
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='notedByTitle'
              className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'
            >
              Noted by Title
            </label>
            <input
              id='notedByTitle'
              type='text'
              placeholder='Enter title'
              value={notedByTitle}
              onChange={(e) => setNotedByTitle(e.target.value)}
              className='w-full sm:w-64 px-2 py-1 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none transition-colors'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
