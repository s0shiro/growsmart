'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import useFetchCornStandingCrops from '@/hooks/crop/useFetchCornStandingCrops'

export default function StandingCropReport() {
  const printableRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, error } = useFetchCornStandingCrops()
  const [selectedMunicipality, setSelectedMunicipality] = useState('Gasan')
  const [preparedBy, setPreparedBy] = useState('JOHN DOE')
  const [certifiedBy, setCertifiedBy] = useState('JANE DOE')
  const [showPreview, setShowPreview] = useState(false)

  const municipalities = [
    'Boac',
    'Buenavista',
    'Gasan',
    'Mogpog',
    'Santa Cruz',
    'Torrijos',
  ]

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Corn Planting Report - ${selectedMunicipality}</title>
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
                  font-family: 'Arial', 'Helvetica', sans-serif;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  font-size: 9px;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  font-size: 8px;
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
                  width: 80px;
                  height: 80px;
                }
                .org-info {
                  flex-grow: 1;
                  margin-left: 8px;
                }
                .org-info h2 {
                  font-size: 14px;
                  font-weight: bold;
                  color: #003366;
                }
                .org-info p {
                  font-size: 10px;
                  margin-bottom: 2px;
                }
                .yellow { background-color: #FFFF00; }
                .white { background-color: #FFFFFF; }
                .grand-total { background-color: #FFFF00; }
                .marinduque { background-color: #00FFFF; }
                .municipality { background-color: #D3D3D3; }
                .grand-total-row { background-color: #90EE90; }
                .signature-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 2rem;
                }
                .signature-block {
                  text-align: center;

                  margin: 0 1rem;
                }
                .signature-name {
                  margin-top: 1.5rem;
                  font-weight: bold;
                }
                .date-text {
                  text-align: center;
                  font-weight: bold;
                  margin-bottom: 8px;
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
              <div class="header">
                <img src="/no-bg.png" alt="Logo" class="logo"/>
                <div class="org-info">
                  <h2>Marinduque Provincial Agriculture Office</h2>
                  <p>Capitol Compound, Boac, Philippines</p>
                </div>
              </div>
              <div class="date-text">
                <p>CORN</p>
                <p>STANDING CROP</p>
                <p>As of ${currentDate}</p>
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

  // Process the data
  const municipalityData = data?.filter((item: any) =>
    item.field_location.includes(selectedMunicipality),
  )
  const barangays = [
    ...new Set(
      municipalityData?.map((item) => item.field_location.split(', ')[0]),
    ),
  ]

  const getCropData = (barangay: string, cropType: string, stage: string) => {
    const value = municipalityData
      ?.filter(
        (item: any) =>
          item.field_location.startsWith(barangay) &&
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
          item.field_location.startsWith(barangay) &&
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
    <div className='container mx-auto p-4'>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Generate Corn Standing Crop Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end'>
            <div className='space-y-2'>
              <Label htmlFor='municipality'>Municipality</Label>
              <Select
                onValueChange={setSelectedMunicipality}
                defaultValue={selectedMunicipality}
              >
                <SelectTrigger id='municipality' className='w-full'>
                  <SelectValue placeholder='Select municipality' />
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
            <div className='space-y-2'>
              <Label htmlFor='preparedBy'>Prepared by</Label>
              <Input
                id='preparedBy'
                type='text'
                placeholder='Prepared by'
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='certifiedBy'>Certified by</Label>
              <Input
                id='certifiedBy'
                type='text'
                placeholder='Certified by'
                value={certifiedBy}
                onChange={(e) => setCertifiedBy(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => setShowPreview(true)} className='w-full mt-4'>
            Generate Report
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-[90vw] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Corn Standing Crop Report Preview</DialogTitle>
            <DialogDescription>
              Review the report before printing. Click the Print Report button
              to print.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-between items-center mb-4'>
            <Button onClick={handlePrint}>
              <Printer className='mr-2 h-4 w-4' /> Print Report
            </Button>
            <DialogClose asChild>
              <Button variant='outline'>
                <X className='mr-2 h-4 w-4' /> Close Preview
              </Button>
            </DialogClose>
          </div>
          <div ref={printableRef} className='text-[9px] font-sans'>
            {/* <div className='header'>
              <h1 className='text-xl font-bold'>Department of Agriculture</h1>
              <h2 className='text-lg font-semibold'>
                REGIONAL FIELD OFFICE MIMAROPA
              </h2>
              <p className='text-md'>
                DRY SEASON 2024 Corn Planting Report - {selectedMunicipality}
              </p>
            </div> */}

            <table className='w-full text-[8px]'>
              <thead>
                <tr>
                  <th rowSpan={2}>Province/ Ecosystem</th>
                  <th colSpan={5} className='yellow'>
                    YELLOW
                  </th>
                  <th colSpan={5} className='white'>
                    WHITE
                  </th>
                  <th colSpan={5} className='grand-total'>
                    GRAND TOTAL
                  </th>
                </tr>
                <tr>
                  <th>Newly Planted/ Seedling Stage (ha)</th>
                  <th>Vegetative Stage (ha)</th>
                  <th>Reproductive Stage (ha)</th>
                  <th>Maturing Stage (ha)</th>
                  <th>TOTAL</th>
                  <th>Newly Planted/ Seedling Stage (ha)</th>
                  <th>Vegetative Stage (ha)</th>
                  <th>Reproductive Stage (ha)</th>
                  <th>Maturing Stage (ha)</th>
                  <th>TOTAL</th>
                  <th>Newly Planted/ Seedling Stage (ha)</th>
                  <th>Vegetative Stage (ha)</th>
                  <th>Reproductive Stage (ha)</th>
                  <th>Maturing Stage (ha)</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr className='marinduque'>
                  <td>MARINDUQUE</td>
                  {[...Array(15)].map((_, index) => (
                    <td key={index}></td>
                  ))}
                </tr>
                <tr className='municipality'>
                  <td>{selectedMunicipality.toUpperCase()}</td>
                  {[...Array(15)].map((_, index) => (
                    <td key={index}></td>
                  ))}
                </tr>
                {barangays.map((barangay) => (
                  <tr key={barangay}>
                    <td>{barangay}</td>
                    <td>
                      {getCropData(
                        barangay,
                        'Yellow',
                        'newly planted/seedling',
                      )}
                    </td>
                    <td>{getCropData(barangay, 'Yellow', 'vegetative')}</td>
                    <td>{getCropData(barangay, 'Yellow', 'reproductive')}</td>
                    <td>{getCropData(barangay, 'Yellow', 'maturing')}</td>
                    <td>{getTotalForCrop(barangay, 'Yellow')}</td>
                    <td>
                      {getCropData(barangay, 'White', 'newly planted/seedling')}
                    </td>
                    <td>{getCropData(barangay, 'White', 'vegetative')}</td>
                    <td>{getCropData(barangay, 'White', 'reproductive')}</td>
                    <td>{getCropData(barangay, 'White', 'maturing')}</td>
                    <td>{getTotalForCrop(barangay, 'White')}</td>
                    <td>
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
                    <td>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'vegetative'),
                        getCropData(barangay, 'White', 'vegetative'),
                      )}
                    </td>
                    <td>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'reproductive'),
                        getCropData(barangay, 'White', 'reproductive'),
                      )}
                    </td>
                    <td>
                      {sumValues(
                        getCropData(barangay, 'Yellow', 'maturing'),
                        getCropData(barangay, 'White', 'maturing'),
                      )}
                    </td>
                    <td>
                      {sumValues(
                        getTotalForCrop(barangay, 'Yellow'),
                        getTotalForCrop(barangay, 'White'),
                      )}
                    </td>
                  </tr>
                ))}
                <tr className='grand-total-row'>
                  <td>GRAND TOTAL</td>
                  <td>
                    {getGrandTotalForStage('newly planted/seedling', 'Yellow')}
                  </td>
                  <td>{getGrandTotalForStage('vegetative', 'Yellow')}</td>
                  <td>{getGrandTotalForStage('reproductive', 'Yellow')}</td>
                  <td>{getGrandTotalForStage('maturing', 'Yellow')}</td>
                  <td>{getTotalForCrop('', 'Yellow')}</td>
                  <td>
                    {getGrandTotalForStage('newly planted/seedling', 'White')}
                  </td>
                  <td>{getGrandTotalForStage('vegetative', 'White')}</td>
                  <td>{getGrandTotalForStage('reproductive', 'White')}</td>
                  <td>{getGrandTotalForStage('maturing', 'White')}</td>
                  <td>{getTotalForCrop('', 'White')}</td>
                  <td>
                    {sumValues(
                      getGrandTotalForStage('newly planted/seedling', 'Yellow'),
                      getGrandTotalForStage('newly planted/seedling', 'White'),
                    )}
                  </td>
                  <td>
                    {sumValues(
                      getGrandTotalForStage('vegetative', 'Yellow'),
                      getGrandTotalForStage('vegetative', 'White'),
                    )}
                  </td>
                  <td>
                    {sumValues(
                      getGrandTotalForStage('reproductive', 'Yellow'),
                      getGrandTotalForStage('reproductive', 'White'),
                    )}
                  </td>
                  <td>
                    {sumValues(
                      getGrandTotalForStage('maturing', 'Yellow'),
                      getGrandTotalForStage('maturing', 'White'),
                    )}
                  </td>
                  <td>{getGrandTotal()}</td>
                </tr>
              </tbody>
            </table>
            <div className='signature-section'>
              <div className='signature-block'>
                <p>Prepared by:</p>
                <p className='signature-name font-bold'>{preparedBy}</p>
                <p>Corn AEW</p>
              </div>
              <div className='signature-block'>
                <p>Certified true and correct:</p>
                <p className='signature-name font-bold'>{certifiedBy}</p>
                <p>Municipal Agricultural Officer</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
