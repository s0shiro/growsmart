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
import useFetchCornStandingCrops from '@/hooks/crop/useFetchCornStandingCrops'
import { formatDate } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'

const municipalities = [
  'Boac',
  'Buenavista',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
]

export default function CornStandingCrop() {
  const printableRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = useFetchCornStandingCrops()
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null)
  const { data: user } = useCurrentUserProfile()

  const currentDate = new Date()
  const formattedDate = formatDate(currentDate)

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Corn Standing Crop Report - ${selectedMunicipality}</title>
              <style>
                *, *::before, *::after {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                }
                @page {
                  size: landscape;
                  margin: 10mm;
                }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 9px;
                  line-height: 1.5;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  border: 2px solid black;
                }
                th, td {
                  border: 1px solid black;
                  padding: 4px;
                  text-align: center;
                  font-size: 8px;
                }
                th {
                  background-color: #f2f2f2;
                  font-weight: bold;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                }
                .logo {
                  width: 80px;
                  height: 80px;
                }
                .org-info {
                  text-align: center;
                }
                .org-info h1 {
                  font-size: 16px;
                  margin-bottom: 5px;
                }
                .org-info p {
                  font-size: 12px;
                  margin-bottom: 3px;
                }
                .report-title {
                  text-align: center;
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .yellow { background-color: #FFFF00; }
                .white { background-color: #FFFFFF; }
                .grand-total { background-color: #FFFF00; }
                .marinduque { background-color: #00FFFF; }
                .municipality { background-color: #D3D3D3; }
                .province, .municipal {text-align: left;}
                .municipal {padding-left: 12px;}
                .grand-total-row { background-color: #90EE90; }
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
                .date-text {
                  text-align: center;
                  font-weight: bold;
                  margin-bottom: 8px;
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
              </style>
            </head>
            <body>
              <div class="date-text">
                <p>CORN PROGRAM</p>
                <p>STANDING CROP REPORT</p>
                <p>As of ${formattedDate}</p>
              </div>
              <div class="header-info">
                <div>
                  <p><strong>REGION:</strong> RFO IVB</p>
                  <p><strong>PROVINCE:</strong> MARINDUQUE</p>
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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Process the data
  const municipalityData = data?.filter((item: any) =>
    item.location_id.municipality.includes(selectedMunicipality),
  )
  const barangays = [
    ...new Set(municipalityData?.map((item) => item.location_id.barangay)),
  ]

  const getCropData = (barangay: string, cropType: string, stage: string) => {
    const value = municipalityData
      ?.filter(
        (item: any) =>
          item.location_id.barangay === barangay &&
          item.crop_type.name === cropType &&
          item.remarks === stage,
      )
      .reduce((sum, item) => sum + item.area_planted, 0)
      .toFixed(4)
    return value === '0.0000' ? '' : value
  }

  const getTotalForCrop = (barangay: string, cropType: string) => {
    const value = municipalityData
      ?.filter(
        (item) =>
          item.location_id.barangay === barangay &&
          item.crop_type.name === cropType,
      )
      .reduce((sum, item) => sum + item.area_planted, 0)
      .toFixed(4)
    return value === '0.0000' ? '' : value
  }

  const getGrandTotalForStage = (stage: string, cropType: string) => {
    const value = municipalityData
      ?.filter(
        (item) => item.remarks === stage && item.crop_type.name === cropType,
      )
      .reduce((sum, item) => sum + item.area_planted, 0)
      .toFixed(4)
    return value === '0.0000' ? '' : value
  }

  const getGrandTotal = () => {
    const value = municipalityData
      ?.reduce((sum, item) => sum + item.area_planted, 0)
      .toFixed(4)
    return value === '0.0000' ? '' : value
  }

  const sumValues = (...values: any) => {
    const sum = values
      .reduce((acc: any, val: any) => acc + (parseFloat(val) || 0), 0)
      .toFixed(4)
    return sum === '0.0000' ? '' : sum
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
                    rowSpan={2}
                    className='border border-[hsl(var(--border))] p-1'
                  >
                    Province/ Ecosystem
                  </th>
                  <th
                    colSpan={5}
                    className='border border-[hsl(var(--border))] p-1 yellow'
                  >
                    YELLOW
                  </th>
                  <th
                    colSpan={5}
                    className='border border-[hsl(var(--border))] p-1 white'
                  >
                    WHITE
                  </th>
                  <th
                    colSpan={5}
                    className='border border-[hsl(var(--border))] p-1 grand-total'
                  >
                    GRAND TOTAL
                  </th>
                </tr>
                <tr>
                  {['YELLOW', 'WHITE', 'GRAND TOTAL'].map((category) => (
                    <React.Fragment key={category}>
                      <th className='border border-[hsl(var(--border))] p-1'>
                        Newly Planted/ Seedling Stage (ha)
                      </th>
                      <th className='border border-[hsl(var(--border))] p-1'>
                        Vegetative Stage (ha)
                      </th>
                      <th className='border border-[hsl(var(--border))] p-1'>
                        Reproductive Stage (ha)
                      </th>
                      <th className='border border-[hsl(var(--border))] p-1'>
                        Maturing Stage (ha)
                      </th>
                      <th className='border border-[hsl(var(--border))] p-1'>
                        TOTAL
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className='marinduque'>
                  <td
                    colSpan={16}
                    className='border border-[hsl(var(--border))] p-1 text-left province'
                  >
                    MARINDUQUE
                  </td>
                </tr>
                <tr className='municipality'>
                  <td
                    colSpan={16}
                    className='border border-[hsl(var(--border))] p-1 text-left municipal'
                  >
                    {selectedMunicipality.toUpperCase()}
                  </td>
                </tr>
                {barangays.map((barangay) => (
                  <tr key={barangay}>
                    <td className='border border-[hsl(var(--border))] p-1 text-left'>
                      {barangay}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(
                        barangay,
                        'Yellow',
                        'newly planted/seedling',
                      )}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'Yellow', 'vegetative')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'Yellow', 'reproductive')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'Yellow', 'maturing')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getTotalForCrop(barangay, 'Yellow')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'White', 'newly planted/seedling')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'White', 'vegetative')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'White', 'reproductive')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getCropData(barangay, 'White', 'maturing')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {getTotalForCrop(barangay, 'White')}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {sumValues(
                        getCropData(
                          barangay,
                          'Yellow',
                          'newly planted/seedling',
                        ),
                        getCropData(
                          barangay,
                          'White',
                          'newly planted/seedling',
                        ),
                      )}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'vegetative'),
                        getCropData(barangay, 'White', 'vegetative'),
                      )}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'reproductive'),
                        getCropData(barangay, 'White', 'reproductive'),
                      )}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'maturing'),
                        getCropData(barangay, 'White', 'maturing'),
                      )}
                    </td>
                    <td className='border border-[hsl(var(--border))] p-1'>
                      {sumValues(
                        getTotalForCrop(barangay, 'Yellow'),
                        getTotalForCrop(barangay, 'White'),
                      )}
                    </td>
                  </tr>
                ))}
                <tr className='grand-total-row'>
                  <td className='border border-[hsl(var(--border))] p-1 font-bold text-left'>
                    GRAND TOTAL
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('newly planted/seedling', 'Yellow')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('vegetative', 'Yellow')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('reproductive', 'Yellow')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('maturing', 'Yellow')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getTotalForCrop('', 'Yellow')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('newly planted/seedling', 'White')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('vegetative', 'White')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('reproductive', 'White')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotalForStage('maturing', 'White')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getTotalForCrop('', 'White')}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {sumValues(
                      getGrandTotalForStage('newly planted/seedling', 'Yellow'),
                      getGrandTotalForStage('newly planted/seedling', 'White'),
                    )}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {sumValues(
                      getGrandTotalForStage('vegetative', 'Yellow'),
                      getGrandTotalForStage('vegetative', 'White'),
                    )}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {sumValues(
                      getGrandTotalForStage('reproductive', 'Yellow'),
                      getGrandTotalForStage('reproductive', 'White'),
                    )}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {sumValues(
                      getGrandTotalForStage('maturing', 'Yellow'),
                      getGrandTotalForStage('maturing', 'White'),
                    )}
                  </td>
                  <td className='border border-[hsl(var(--border))] p-1'>
                    {getGrandTotal()}
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
        Print
      </Button>
    </div>
  )
}
