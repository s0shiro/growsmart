'use client'

import { useRef, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import useFetchMonthlyPlantingRice from '@/hooks/reports/useFetchMonthlyPlantingRice'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import { formatDate, getSeasonAndYear } from '@/lib/utils'
import { format } from 'date-fns'
import { NotedBySection } from '@/app/dashboard/(components)/NotedBySection'

type PlantingData = {
  location_id: {
    barangay: string
    municipality: string
    province: string
  }
  area_planted: number
  planting_date: string
  category_specific: {
    landType: string
    waterSupply: string
    classification: string
  }
  crop_categoryId: { name: string }
  crop_type: { name: string }
  variety: { name: string }
  farmer_id: { id: string; lastname: string; firstname: string }
}

export default function RicePlantingReport() {
  const printableRef = useRef<HTMLDivElement>(null)
  const { data, error, isLoading } = useFetchMonthlyPlantingRice()
  const { data: user } = useCurrentUserProfile()

  const [notedByName, setNotedByName] = useState('VANESSA TAYABA')
  const [notedByTitle, setNotedByTitle] = useState(
    'Municipal Agricultural Officer',
  )

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return null

    const municipalities = [
      'BOAC',
      'BUENAVISTA',
      'GASAN',
      'MOGPOG',
      'SANTA CRUZ',
      'TORRIJOS',
    ]
    const initialData = municipalities.reduce(
      (acc, municipality) => {
        acc[municipality] = {
          farmers: new Set(),
          irrigated: {
            hybrid: 0,
            registered: 0,
            certified: 0,
            goodQuality: 0,
            farmersSaved: 0,
          },
          rainfedLowland: {
            hybrid: 0,
            registered: 0,
            certified: 0,
            goodQuality: 0,
            farmersSaved: 0,
          },
          rainfedUpland: {
            hybrid: 0,
            registered: 0,
            certified: 0,
            goodQuality: 0,
            farmersSaved: 0,
          },
        }
        return acc
      },
      {} as Record<string, any>,
    )

    data.forEach((item: PlantingData) => {
      const { municipality } = item.location_id
      if (!municipalities.includes(municipality.toUpperCase())) return

      const { waterSupply, landType, classification } = item.category_specific
      let category
      if (waterSupply === 'irrigated') {
        category = 'irrigated'
      } else if (landType === 'lowland') {
        category = 'rainfedLowland'
      } else if (landType === 'upland') {
        category = 'rainfedUpland'
      } else {
        return // Skip if category can't be determined
      }

      initialData[municipality.toUpperCase()].farmers.add(item.farmer_id.id)

      let classificationKey
      switch (classification) {
        case 'Hybrid':
          classificationKey = 'hybrid'
          break
        case 'Registered':
          classificationKey = 'registered'
          break
        case 'Certified':
          classificationKey = 'certified'
          break
        case 'Good Quality':
          classificationKey = 'goodQuality'
          break
        case 'Farmer Saved Seeds':
          classificationKey = 'farmersSaved'
          break
        default:
          return // Skip if classification doesn't match
      }

      initialData[municipality.toUpperCase()][category][classificationKey] +=
        item.area_planted
    })

    // Calculate totals
    const totals = {
      farmers: new Set(),
      irrigated: {
        hybrid: 0,
        registered: 0,
        certified: 0,
        goodQuality: 0,
        farmersSaved: 0,
      },
      rainfedLowland: {
        hybrid: 0,
        registered: 0,
        certified: 0,
        goodQuality: 0,
        farmersSaved: 0,
      },
      rainfedUpland: {
        hybrid: 0,
        registered: 0,
        certified: 0,
        goodQuality: 0,
        farmersSaved: 0,
      },
    }

    Object.entries(initialData).forEach(([municipality, data]) => {
      data.farmers.forEach((farmer: any) => totals.farmers.add(farmer))
      ;['irrigated', 'rainfedLowland', 'rainfedUpland'].forEach((category) => {
        Object.entries(data[category]).forEach(([classification, value]) => {
          totals[category][classification] += value
        })
      })
    })

    return { municipalities: initialData, totals }
  }, [data])

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Rice Planting Report</title>
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
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }

                .logo {
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                }
                .org-info {
                  flex-grow: 1;
                  margin-left: 8px;
                }

                .org-info h2 {
                  font-size: 16px;
                  font-weight: bold;
                  color: #003366;
                }

                .org-info p {
                  font-size: 12px;
                  margin-bottom: 2px;
                }
                .irrigated { background-color: #90EE90; }
                .rainfed { background-color: #FFFFE0; }
                .rainfed-lowland { background-color: #FFD700; }
                .rainfed-upland { background-color: #F0E68C; }
                .total-row { background-color: #FFD700; }
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
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
                <div class="date-text">
                    <p>Department Of Agriculture</p>
                    <p><strong>REGIONAL FIELD OFFICE MIMAROPA</strong></p>
                    <p><strong>Rice Program</strong></p>
                </div>
                <div class="header-info">
                    <div>
                    <p class="region"><strong>${getSeasonAndYear(new Date()).toUpperCase()} Planting Reportt</strong></p>
                    <p><strong>as of ${format(new Date(), 'MMMM dd, yyyy')}</strong></p>
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
                  <p><strong>${notedByName}</strong></p>
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

  const formatNumber = (num: number) => (num === 0 ? '' : num.toFixed(4))

  return (
    <div>
      <Button onClick={handlePrint} className='mb-4 no-print'>
        <Printer className='mr-2 h-4 w-4' /> Print Rice Planting Report
      </Button>

      <div ref={printableRef} className='overflow-x-auto'>
        <table className='w-full border-collapse border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]'>
          <thead>
            <tr>
              <th
                rowSpan={3}
                className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'
              >
                MUNICIPALITY
              </th>
              <th
                rowSpan={3}
                className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'
              >
                NO. OF FARMERS PLANTED
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                colSpan={6}
              >
                IRRIGATED
              </th>
              <th
                className='rainfed border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.1)]'
                colSpan={11}
              >
                RAINFED
              </th>
            </tr>
            <tr>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                HYBRID
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                REGISTERED
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                CERTIFIED
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                GOOD QUALITY
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                FARMER SAVED SEEDS
              </th>
              <th
                className='irrigated border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--primary)/.1)]'
                rowSpan={2}
              >
                TOTAL
              </th>
              <th
                className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'
                colSpan={5}
              >
                LOWLAND
              </th>
              <th
                className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'
                colSpan={6}
              >
                UPLAND
              </th>
            </tr>
            <tr>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'>
                HYBRID
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'>
                REGISTERED
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'>
                CERTIFIED
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'>
                GOOD QUALITY
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.2)]'>
                FARMER SAVED SEEDS
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                HYBRID
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                REGISTERED
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                CERTIFIED
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                GOOD QUALITY
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                FARMER SAVED SEEDS
              </th>
              <th className='rainfed-upland border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--secondary)/.3)]'>
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='total-row'>
              <td className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'>
                MARINDUQUE
              </td>
              <td className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'>
                {processedData.totals.farmers.size}
              </td>
              {['irrigated', 'rainfedLowland', 'rainfedUpland']
                .flatMap((category, index) => {
                  const values = [
                    formatNumber(processedData.totals[category].hybrid),
                    formatNumber(processedData.totals[category].registered),
                    formatNumber(processedData.totals[category].certified),
                    formatNumber(processedData.totals[category].goodQuality),
                    formatNumber(processedData.totals[category].farmersSaved),
                  ]
                  if (index === 0) {
                    values.push(
                      formatNumber(
                        Object.values(processedData.totals[category]).reduce(
                          (a, b) => a + b,
                          0,
                        ),
                      ),
                    )
                  } else if (index === 2) {
                    const rainfedTotal =
                      Object.values(processedData.totals.rainfedLowland).reduce(
                        (a, b) => a + b,
                        0,
                      ) +
                      Object.values(processedData.totals.rainfedUpland).reduce(
                        (a, b) => a + b,
                        0,
                      )
                    values.push(formatNumber(rainfedTotal))
                  }
                  return values
                })
                .map((value, index) => (
                  <td
                    key={index}
                    className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'
                  >
                    {value}
                  </td>
                ))}
            </tr>
            {Object.entries(processedData.municipalities).map(
              ([municipality, data]) => (
                <tr key={municipality}>
                  <td className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'>
                    {municipality}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'>
                    {data.farmers.size}
                  </td>
                  {['irrigated', 'rainfedLowland', 'rainfedUpland']
                    .flatMap((category, index) => {
                      const values = [
                        formatNumber(data[category].hybrid),
                        formatNumber(data[category].registered),
                        formatNumber(data[category].certified),
                        formatNumber(data[category].goodQuality),
                        formatNumber(data[category].farmersSaved),
                      ]
                      if (index === 0) {
                        values.push(
                          formatNumber(
                            Object.values(data[category]).reduce(
                              (a, b) => a + b,
                              0,
                            ),
                          ),
                        )
                      } else if (index === 2) {
                        const rainfedTotal =
                          Object.values(data.rainfedLowland).reduce(
                            (a, b) => a + b,
                            0,
                          ) +
                          Object.values(data.rainfedUpland).reduce(
                            (a, b) => a + b,
                            0,
                          )
                        values.push(formatNumber(rainfedTotal))
                      }
                      return values
                    })
                    .map((value, index) => (
                      <td
                        key={index}
                        className='border border-[hsl(var(--border))] p-1 dark:border-[hsl(var(--border))]'
                      >
                        {value}
                      </td>
                    ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className='flex justify-end w-full print:hidden'>
        <NotedBySection
          notedByName={notedByName}
          notedByTitle={notedByTitle}
          setNotedByName={setNotedByName}
          setNotedByTitle={setNotedByTitle}
          className='mt-4 sm:w-auto'
        />
      </div>
    </div>
  )
}
