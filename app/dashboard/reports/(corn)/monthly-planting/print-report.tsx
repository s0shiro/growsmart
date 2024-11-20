'use client'

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import { Printer } from 'lucide-react'

const municipalities = [
  'Boac',
  'Buenavista',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
]

export default function CornMonthlyPlantingAccomplishment() {
  const { data } = useFetchMonthlyPlantingCorn()
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >('Gasan')
  const printableRef = useRef<HTMLDivElement>(null)
  const { data: user } = useCurrentUserProfile()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const isFirstHalf = currentMonth >= 1 && currentMonth <= 6

  const formattedDate = formatDate(currentDate)

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

    data?.forEach((item) => {
      const { barangay, municipality } = item.location_id
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
              <title>Corn Planting Report - ${formattedDate}</title>
              <style>
               *, *::before, *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
               }
                @page { size: portrait; }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 9px;
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
                th {
                  text-align: center;
                  font-weight: bold;
                }
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
                .municipality, .barangay {
                    padding: 4px;
                    font-weight: bold;
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
                .municipality {
                  background-color: #0000FF !important;
                  color: white !important;
                }
                .barangay {
                  background-color: #f0f0f0 !important;
                }
                .print-center { text-align: center; }
                .brgy-total { background-color: #FFA500 !important; }
                .grand-total {
                  background-color: #00FF00 !important;
                }
                .total { font-weight: bold; }
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
              </style>
            </head>
            <body>
            <div class="date-text">
              <p>CORN PROGRAM</p>
              <p>MONTHLY PLANTING ACCOMPLISHMENT REPORT</p>
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
                   <p><strong>${user?.full_name?.toUpperCase()}</strong></p>
                  <p>${user?.job_title}</p>
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
                    colSpan={5}
                    className='border border-[hsl(var(--border))] p-1 text-center'
                  >
                    As of {formattedDate}
                  </th>
                </tr>
                <tr>
                  <th className='border border-[hsl(var(--border))] p-1'>
                    MUNICIPALITY
                  </th>
                  <th className='border border-[hsl(var(--border))] p-1 text-center'>
                    VARIETY (GMO, HYBRID,
                    <br />
                    OPV, GREEN
                    <br />
                    CORN/SWEET CORN,
                    <br />
                    TRADITIONAL)
                  </th>
                  <th className='border border-[hsl(var(--border))] p-1 text-center'>
                    YELLOW
                    <br />
                    Area Planted
                    <br />
                    (ha)
                  </th>
                  <th className='border border-[hsl(var(--border))] p-1 text-center'>
                    WHITE
                    <br />
                    Area Planted
                    <br />
                    (ha)
                  </th>
                  <th className='border border-[hsl(var(--border))] p-1 text-center'>
                    TOTAL
                    <br />
                    Area Planted
                    <br />
                    (ha)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='municipality'>
                  <td
                    colSpan={5}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    {selectedMunicipality.toUpperCase()}
                  </td>
                </tr>
                {Object.entries(processedData).map(([barangay, data]) => (
                  <React.Fragment key={barangay}>
                    <tr className='barangay'>
                      <td
                        colSpan={5}
                        className='border border-[hsl(var(--border))] p-1'
                      >
                        {barangay}
                      </td>
                    </tr>
                    {Object.entries(data.Yellow).map(([variety, info]) =>
                      info.entries.map(
                        (entry, index) =>
                          entry.area > 0 && (
                            <tr
                              key={`${barangay}-Yellow-${variety}-${index}`}
                              className='bg-yellow-100 dark:bg-yellow-700'
                            >
                              <td className='border border-[hsl(var(--border))] p-1 pl-6'>
                                {entry.farmer}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1 text-center print-center'>
                                {variety}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1 text-center print-center'>
                                {entry.area.toFixed(4)}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1'></td>
                              <td className='border border-[hsl(var(--border))] p-1'></td>
                            </tr>
                          ),
                      ),
                    )}
                    {Object.entries(data.White).map(([variety, info]) =>
                      info.entries.map(
                        (entry, index) =>
                          entry.area > 0 && (
                            <tr key={`${barangay}-White-${variety}-${index}`}>
                              <td className='border border-[hsl(var(--border))] p-1 pl-6'>
                                {entry.farmer}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1 text-center print-center'>
                                {variety}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1'></td>
                              <td className='border border-[hsl(var(--border))] p-1 text-center print-center'>
                                {entry.area.toFixed(4)}
                              </td>
                              <td className='border border-[hsl(var(--border))] p-1'></td>
                            </tr>
                          ),
                      ),
                    )}
                    <tr className='font-bold brgy-total '>
                      <td
                        colSpan={4}
                        className='border border-[hsl(var(--border))] p-1 text-right'
                      >
                        Total:
                      </td>
                      <td className='border border-[hsl(var(--border))] p-1 text-center'>
                        {data.total.toFixed(4)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr className='font-bold bg-green-500 grand-total'>
                  <td
                    colSpan={4}
                    className='border border-[hsl(var(--border))] p-1 text-right'
                  >
                    GRAND TOTAL:
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1 text-center'>
                    {grandTotal.toFixed(4)}
                  </td>
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
        <Printer className='mr-2 h-4 w-4' /> Print Corn Planting Report
      </Button>
    </div>
  )
}
