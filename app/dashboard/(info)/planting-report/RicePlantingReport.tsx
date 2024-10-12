'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function RicePlantingReport() {
  const printableRef = useRef<HTMLDivElement>(null)

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
                HYBRID SEEDS
              </th>
              <th className='irrigated' rowSpan={2}>
                REGISTERED SEEDS
              </th>
              <th className='irrigated' rowSpan={2}>
                CERTIFIED SEEDS
              </th>
              <th className='irrigated' rowSpan={2}>
                GOOD QUALITY SEEDS
              </th>
              <th className='irrigated' rowSpan={2}>
                FARMERS HOME SEEDS
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
              <th className='rainfed-lowland'>HYBRID SEEDS</th>
              <th className='rainfed-lowland'>REGISTERED SEEDS</th>
              <th className='rainfed-lowland'>CERTIFIED SEEDS</th>
              <th className='rainfed-lowland'>GOOD QUALITY SEEDS</th>
              <th className='rainfed-lowland'>FARMERS HOME SEEDS</th>
              <th className='rainfed-lowland'>TOTAL</th>
              <th className='rainfed-upland'>HYBRID SEEDS</th>
              <th className='rainfed-upland'>REGISTERED SEEDS</th>
              <th className='rainfed-upland'>CERTIFIED SEEDS</th>
              <th className='rainfed-upland'>GOOD QUALITY SEEDS</th>
              <th className='rainfed-upland'>FARMERS HOME SEEDS</th>
              <th className='rainfed-upland'>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {[
              'BOAC',
              'BUENAVISTA',
              'GASAN',
              'MOGPOG',
              'STA. CRUZ',
              'TORRIJOS',
            ].map((municipality) => (
              <tr key={municipality}>
                <td>{municipality}</td>
                <td>0</td>
                {[...Array(18)].map((_, index) => (
                  <td key={index}>0</td>
                ))}
              </tr>
            ))}
            <tr className='total-row'>
              <td>MARINDUQUE</td>
              <td>0</td>
              {[...Array(18)].map((_, index) => (
                <td key={index}>0</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
