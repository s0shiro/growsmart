'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function CornHarvestReport() {
  const printableRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', '_blank')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Corn Program Monthly Harvesting Accomplishment Report</title>
              <style>
                @page {
                  size: landscape;
                  margin: 10mm;
                }
                body {
                  font-family: Arial, sans-serif;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
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
                  text-align: center;
                  margin-bottom: 5px;
                }
                .subheader {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
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
        <div className='header text-center mb-2'>
          <h1 className='text-xl font-bold'>CORN PROGRAM</h1>
          <h2 className='text-lg font-semibold'>
            MONTHLY HARVESTING ACCOMPLISHMENT REPORT
          </h2>
          <p className='text-sm'>For the Month of: September 30, 2023</p>
        </div>

        <div className='subheader flex justify-between items-center mb-2 text-sm'>
          <div>
            <p>REGION: RFO IVB</p>
            <p>PROVINCE: MARINDUQUE</p>
          </div>
          <div>
            <label className='mr-4'>
              <input type='checkbox' disabled /> JANUARY - JUNE
            </label>
            <label>
              <input type='checkbox' checked disabled /> JULY - DECEMBER
            </label>
          </div>
        </div>

        <ScrollArea className='w-full whitespace-nowrap rounded-md border'>
          <div className='p-2'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className='bg-muted'>
                    MUNICIPALITY
                  </TableHead>
                  <TableHead colSpan={3} className='bg-muted'>
                    HYBRID YELLOW
                  </TableHead>
                  <TableHead colSpan={3} className='bg-muted'>
                    GREEN CORN/SWEET CORN WHITE
                  </TableHead>
                  <TableHead colSpan={3} className='bg-muted'>
                    TRADITIONAL WHITE
                  </TableHead>
                  <TableHead colSpan={3} className='bg-muted'>
                    TOTAL YELLOW
                  </TableHead>
                  <TableHead colSpan={3} className='bg-muted'>
                    TOTAL WHITE
                  </TableHead>
                </TableRow>
                <TableRow>
                  {[
                    'Area Harvested (ha)',
                    'Ave. Yield (MT/ha)',
                    'Production (MT)',
                  ].map((header) => (
                    <>
                      <TableHead className='bg-muted text-xs'>
                        {header}
                      </TableHead>
                      <TableHead className='bg-muted text-xs'>
                        {header}
                      </TableHead>
                      <TableHead className='bg-muted text-xs'>
                        {header}
                      </TableHead>
                      <TableHead className='bg-muted text-xs'>
                        {header}
                      </TableHead>
                      <TableHead className='bg-muted text-xs'>
                        {header}
                      </TableHead>
                    </>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {['GASAN', 'Banuyo', 'Antipolo'].map((municipality, index) => (
                  <TableRow key={municipality}>
                    <TableCell className='text-xs'>{municipality}</TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '3.5000'
                        : index === 1
                          ? '3.5000'
                          : '0.1875'}
                    </TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '8.7500'
                        : index === 1
                          ? '8.7500'
                          : '0.4688'}
                    </TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '30.6250'
                        : index === 1
                          ? '30.6250'
                          : '0.0879'}
                    </TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '3.5000'
                        : index === 1
                          ? '3.5000'
                          : '0.1875'}
                    </TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '8.7500'
                        : index === 1
                          ? '8.7500'
                          : '0.4688'}
                    </TableCell>
                    <TableCell className='text-xs'>
                      {index === 0
                        ? '30.6250'
                        : index === 1
                          ? '30.6250'
                          : '0.0879'}
                    </TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                    <TableCell className='text-xs'></TableCell>
                  </TableRow>
                ))}
                <TableRow className='font-bold'>
                  <TableCell className='text-xs'>TOTAL</TableCell>
                  <TableCell className='text-xs'>3.6875</TableCell>
                  <TableCell className='text-xs'>9.2188</TableCell>
                  <TableCell className='text-xs'>30.7129</TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'>3.6875</TableCell>
                  <TableCell className='text-xs'>9.2188</TableCell>
                  <TableCell className='text-xs'>30.7129</TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                  <TableCell className='text-xs'></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  )
}
