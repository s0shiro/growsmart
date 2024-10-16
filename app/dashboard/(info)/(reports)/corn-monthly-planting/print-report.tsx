import React, { useState, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import useFetchMonthlyPlantingCorn from '@/hooks/reports/useFetchMonthlyPlantingCorn'

const municipalities = [
  'Boac',
  'Buenavista',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
]

export default function CornPlantingReport() {
  const { data } = useFetchMonthlyPlantingCorn()
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null)
  const printableRef = useRef<HTMLDivElement>(null)

  const processedData = useMemo(() => {
    if (!selectedMunicipality) return {}

    const barangays: {
      [key: string]: {
        Yellow: {
          [key: string]: {
            area: number
            entries: { farmer: string; area: number }[]
          }
        }
        White: {
          [key: string]: {
            area: number
            entries: { farmer: string; area: number }[]
          }
        }
        total: number
      }
    } = {}

    data.forEach((item) => {
      const [barangay, municipality] = item.field_location.split(', ')
      if (municipality !== selectedMunicipality) return

      if (!barangays[barangay]) {
        barangays[barangay] = {
          Yellow: {
            Hybrid: { area: 0, entries: [] },
            Traditional: { area: 0, entries: [] },
            'Green Corn/Sweet Corn': { area: 0, entries: [] },
          },
          White: {
            Hybrid: { area: 0, entries: [] },
            Traditional: { area: 0, entries: [] },
            'Green Corn/Sweet Corn': { area: 0, entries: [] },
          },
          total: 0,
        }
      }

      const farmerName = `${item.farmer_id.firstname} ${item.farmer_id.lastname}`
      barangays[barangay][item.crop_type.name][item.variety.name].area +=
        item.area_planted
      barangays[barangay][item.crop_type.name][item.variety.name].entries.push({
        farmer: farmerName,
        area: item.area_planted,
      })
      barangays[barangay].total += item.area_planted
    })

    return barangays
  }, [data, selectedMunicipality])

  const grandTotal = useMemo(() => {
    return Object.values(processedData).reduce(
      (sum, barangay) => sum + barangay.total,
      0,
    )
  }, [processedData])

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Corn Planting Report - August 31, 2024</title>
              <style>
                @page { size: portrait; }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  page-break-inside: auto;
                }
                tr { page-break-inside: avoid; page-break-after: auto; }
                th, td {
                  border: 1px solid black;
                  padding: 4px;
                  text-align: left;
                  font-size: 10px;
                }
                .municipality {
                  background-color: #0000FF !important;
                  color: white !important;
                  font-weight: bold;
                }
                .total { font-weight: bold; }
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
    <div className='container mx-auto p-4'>
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
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid black',
          }}
        >
          <thead>
            <tr>
              <th
                colSpan={5}
                style={{
                  border: '1px solid black',
                  textAlign: 'center',
                  padding: '4px',
                }}
              >
                As of August 31, 2024
              </th>
            </tr>
            <tr>
              <th
                style={{
                  border: '1px solid black',
                  padding: '4px',
                  width: '20%',
                }}
              >
                MUNICIPALITY
              </th>
              <th
                style={{
                  border: '1px solid black',
                  padding: '4px',
                  width: '20%',
                  textAlign: 'center',
                }}
              >
                VARIETY (GMO, HYBRID,
                <br />
                OPV, GREEN
                <br />
                CORN/SWEET CORN,
                <br />
                TRADITIONAL)
              </th>
              <th
                style={{
                  border: '1px solid black',
                  padding: '4px',
                  width: '20%',
                  textAlign: 'center',
                }}
              >
                YELLOW
                <br />
                Area Planted
                <br />
                (ha)
              </th>
              <th
                style={{
                  border: '1px solid black',
                  padding: '4px',
                  width: '20%',
                  textAlign: 'center',
                }}
              >
                WHITE
                <br />
                Area Planted
                <br />
                (ha)
              </th>
              <th
                style={{
                  border: '1px solid black',
                  padding: '4px',
                  width: '20%',
                  textAlign: 'center',
                }}
              >
                TOTAL
                <br />
                Area Planted
                <br />
                (ha)
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedMunicipality && (
              <>
                <tr>
                  <td
                    colSpan={5}
                    style={{ border: '1px solid black', padding: '4px' }}
                    className='municipality'
                  >
                    {selectedMunicipality.toUpperCase()}
                  </td>
                </tr>
                {Object.entries(processedData).map(([barangay, data]) => (
                  <React.Fragment key={barangay}>
                    <tr>
                      <td
                        colSpan={5}
                        style={{ border: '1px solid black', padding: '4px' }}
                      >
                        {barangay}
                      </td>
                    </tr>
                    {Object.entries(data.Yellow).map(([variety, info]) =>
                      info.entries.map(
                        (entry, index) =>
                          entry.area > 0 && (
                            <tr key={`${barangay}-Yellow-${variety}-${index}`}>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  paddingLeft: '20px',
                                }}
                              >
                                {entry.farmer}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  textAlign: 'center',
                                }}
                              >
                                {variety}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  textAlign: 'center',
                                }}
                              >
                                {entry.area.toFixed(4)}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                }}
                              ></td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                }}
                              ></td>
                            </tr>
                          ),
                      ),
                    )}
                    {Object.entries(data.White).map(([variety, info]) =>
                      info.entries.map(
                        (entry, index) =>
                          entry.area > 0 && (
                            <tr key={`${barangay}-White-${variety}-${index}`}>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  paddingLeft: '20px',
                                }}
                              >
                                {entry.farmer}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  textAlign: 'center',
                                }}
                              >
                                {variety}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                }}
                              ></td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                  textAlign: 'center',
                                }}
                              >
                                {entry.area.toFixed(4)}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  padding: '4px',
                                }}
                              ></td>
                            </tr>
                          ),
                      ),
                    )}
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          border: '1px solid black',
                          padding: '4px',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        TOTAL:
                      </td>
                      <td
                        style={{
                          border: '1px solid black',
                          padding: '4px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {data.total.toFixed(4)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      border: '1px solid black',
                      padding: '4px',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL:
                  </td>
                  <td
                    style={{
                      border: '1px solid black',
                      padding: '4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {grandTotal.toFixed(4)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
      <Button
        onClick={handlePrint}
        className='mt-4'
        disabled={!selectedMunicipality}
      >
        Print Report
      </Button>
    </div>
  )
}
