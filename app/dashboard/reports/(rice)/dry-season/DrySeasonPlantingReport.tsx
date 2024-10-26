'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const municipalities = [
  'MARINDUQUE',
  'BOAC',
  'BUENAVISTA',
  'GASAN',
  'MOGPOG',
  'SANTA CRUZ',
  'TORRIJOS',
]

type SeedData = {
  hybrid: number
  registered: number
  certified: number
  goodQuality: number
  farmerHomeSaved: number
  remarks: string
}

export default function DrySeasonReport() {
  const printableRef = useRef<HTMLDivElement>(null)

  // Mock data - replace with actual data fetching logic
  const seedData: Record<string, SeedData> = {
    MARINDUQUE: {
      hybrid: 100,
      registered: 200,
      certified: 300,
      goodQuality: 400,
      farmerHomeSaved: 500,
      remarks: '',
    },
    BOAC: {
      hybrid: 50,
      registered: 100,
      certified: 150,
      goodQuality: 200,
      farmerHomeSaved: 250,
      remarks: '',
    },
    BUENAVISTA: {
      hybrid: 30,
      registered: 60,
      certified: 90,
      goodQuality: 120,
      farmerHomeSaved: 150,
      remarks: '',
    },
    GASAN: {
      hybrid: 20,
      registered: 40,
      certified: 60,
      goodQuality: 80,
      farmerHomeSaved: 100,
      remarks: '',
    },
    MOGPOG: {
      hybrid: 25,
      registered: 50,
      certified: 75,
      goodQuality: 100,
      farmerHomeSaved: 125,
      remarks: '',
    },
    'SANTA CRUZ': {
      hybrid: 35,
      registered: 70,
      certified: 105,
      goodQuality: 140,
      farmerHomeSaved: 175,
      remarks: '',
    },
    TORRIJOS: {
      hybrid: 15,
      registered: 30,
      certified: 45,
      goodQuality: 60,
      farmerHomeSaved: 75,
      remarks: '',
    },
  }

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>DRY SEASON 2024 Planting Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: center; }
                th { background-color: #FFD700; }
                .municipality { background-color: #FFA500; }
                .white-bg { background-color: white; }
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

  const calculateTotal = (data: SeedData) => {
    return (
      data.hybrid +
      data.registered +
      data.certified +
      data.goodQuality +
      data.farmerHomeSaved
    )
  }

  return (
    <div className='p-4'>
      <ScrollArea className='w-full rounded-md border'>
        <div ref={printableRef}>
          <table className='w-full border-collapse border-2 border-black'>
            <thead>
              <tr>
                <th rowSpan={2} className='border border-black p-2 bg-white'>
                  MUNICIPALITY /BARANGAY
                </th>
                <th
                  colSpan={6}
                  className='border border-black p-2 bg-yellow-300 text-center font-bold'
                >
                  DRY SEASON 2024 Planting Report
                </th>
                <th rowSpan={2} className='border border-black p-2 bg-white'>
                  REMARKS
                </th>
              </tr>
              <tr>
                <th className='border border-black p-2 bg-yellow-300'>
                  HYBRID SEEDS
                </th>
                <th className='border border-black p-2 bg-yellow-300'>
                  REGISTERED SEEDS
                </th>
                <th className='border border-black p-2 bg-yellow-300'>
                  CERTIFIED SEEDS
                </th>
                <th className='border border-black p-2 bg-yellow-300'>
                  GOOD QUALITY SEEDS
                </th>
                <th className='border border-black p-2 bg-yellow-300'>
                  FARMER HOME SAVED SEEDS
                </th>
                <th className='border border-black p-2 bg-yellow-300'>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {municipalities.map((municipality) => (
                <tr key={municipality}>
                  <td
                    className={`border border-black p-2 font-bold ${municipality === 'MARINDUQUE' ? 'bg-orange-300' : 'bg-white'}`}
                  >
                    {municipality}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].hybrid}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].registered}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].certified}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].goodQuality}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].farmerHomeSaved}
                  </td>
                  <td className='border border-black p-2 bg-white font-bold'>
                    {calculateTotal(seedData[municipality])}
                  </td>
                  <td className='border border-black p-2 bg-white'>
                    {seedData[municipality].remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <Button onClick={handlePrint} className='mt-4'>
        Print
      </Button>
    </div>
  )
}
