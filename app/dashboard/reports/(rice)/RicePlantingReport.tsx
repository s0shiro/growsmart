'use client'

import { useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import useFetchMonthlyPlantingRice from '@/hooks/reports/useFetchMonthlyPlantingRice'

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
                body {
                  font-family: 'Times New Roman', Times, serif;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  font-size: 10px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 2px;
                  text-align: center;
                }
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
             <div class="header">
                <img src="/no-bg.png" alt="Logo" class="logo"/>
                <div class="org-info">
                  <h2>Marinduque Provincial Agriculture Office</h2>
                  <p>Capitol Compound, Boac, Philippines</p>
                </div>
              </div>
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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!processedData) return <div>No data available</div>

  const formatNumber = (num: number) => (num === 0 ? '' : num.toFixed(4))

  return (
    <div className='container mx-auto p-4'>
      <Button onClick={handlePrint} className='mb-4 no-print'>
        <Printer className='mr-2 h-4 w-4' /> Print Report (Landscape)
      </Button>

      <div ref={printableRef}>
        <div className='header no-print'>
          <h1 className='text-xl font-bold'>Department of Agriculture</h1>
          <h2 className='text-lg font-semibold'>
            REGIONAL FIELD OFFICE MIMAROPA
          </h2>
          <p className='text-md'>DRY SEASON 2024 Planting Report</p>
        </div>

        <table>
          <thead>
            <tr>
              <th rowSpan={3}>MUNICIPALITY</th>
              <th rowSpan={3}>NO. OF FARMERS PLANTED</th>
              <th className='irrigated' colSpan={6}>
                IRRIGATED
              </th>
              <th className='rainfed' colSpan={12}>
                RAINFED
              </th>
            </tr>
            <tr>
              <th className='irrigated' rowSpan={2}>
                HYBRID
              </th>
              <th className='irrigated' rowSpan={2}>
                REGISTERED
              </th>
              <th className='irrigated' rowSpan={2}>
                CERTIFIED
              </th>
              <th className='irrigated' rowSpan={2}>
                GOOD QUALITY
              </th>
              <th className='irrigated' rowSpan={2}>
                FARMER SAVED SEEDS
              </th>
              <th className='irrigated' rowSpan={2}>
                TOTAL
              </th>
              <th className='rainfed-lowland' colSpan={6}>
                LOWLAND
              </th>
              <th className='rainfed-upland' colSpan={6}>
                UPLAND
              </th>
            </tr>
            <tr>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1'>
                HYBRID
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1'>
                REGISTERED
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1'>
                CERTIFIED
              </th>
              <th className='rainfed-lowland border border-[hsl(var(--border))] p-1'>
                GOOD QUALITY
              </th>
              <th className='rainfed-lowland'>FARMER SAVED SEEDS</th>
              <th className='rainfed-lowland'>TOTAL</th>
              <th className='rainfed-upland'>HYBRID</th>
              <th className='rainfed-upland'>REGISTERED</th>
              <th className='rainfed-upland'>CERTIFIED</th>
              <th className='rainfed-upland'>GOOD QUALITY</th>
              <th className='rainfed-upland'>FARMER SAVED SEEDS</th>
              <th className='rainfed-upland'>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr className='total-row'>
              <td>MARINDUQUE</td>
              <td>{processedData.totals.farmers.size}</td>
              {['irrigated', 'rainfedLowland', 'rainfedUpland']
                .flatMap((category) => [
                  formatNumber(processedData.totals[category].hybrid),
                  formatNumber(processedData.totals[category].registered),
                  formatNumber(processedData.totals[category].certified),
                  formatNumber(processedData.totals[category].goodQuality),
                  formatNumber(processedData.totals[category].farmersSaved),
                  formatNumber(
                    Object.values(processedData.totals[category]).reduce(
                      (a, b) => a + b,
                      0,
                    ),
                  ),
                ])
                .map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
            </tr>
            {Object.entries(processedData.municipalities).map(
              ([municipality, data]) => (
                <tr key={municipality}>
                  <td>{municipality}</td>
                  <td>{data.farmers.size}</td>
                  {['irrigated', 'rainfedLowland', 'rainfedUpland']
                    .flatMap((category) => [
                      formatNumber(data[category].hybrid),
                      formatNumber(data[category].registered),
                      formatNumber(data[category].certified),
                      formatNumber(data[category].goodQuality),
                      formatNumber(data[category].farmersSaved),
                      formatNumber(
                        Object.values(data[category]).reduce(
                          (a, b) => a + b,
                          0,
                        ),
                      ),
                    ])
                    .map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
