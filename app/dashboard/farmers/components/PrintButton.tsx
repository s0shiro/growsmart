'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function PrintButton({ farmers }: any) {
  const printableRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Farmers Masterlist</title>
              <style>
                *, *::before, *::after {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                @page {
                  size: portrait;
                  margin: 10mm;
                }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 9px;
                  padding: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  border: 2px solid black;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 6px;
                  font-size: 10px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                  font-weight: bold;
                }
                .header {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 2px;
                  margin-bottom: 5px;
                }
                .logo {
                  border-radius: 50%;
                  width: 80px;
                  height: 80px;
                  object-fit: contain;
                }
                .org-info {
                  flex-grow: 1;
                }
                .org-info h2 {
                  font-size: 16px;
                  font-weight: bold;
                  color: #003366;
                  margin-bottom: 4px;
                }
                .org-info p {
                  font-size: 10px;
                  color: #666;
                }
                .title {
                  font-size: 14px;
                  font-weight: bold;
                  text-align: center;
                  margin: 5px 0;
                  color: #003366;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 8px;
                  color: #666;
                  text-align: right;
                }
                .associations {
                  white-space: pre-line;
                }
                @media print {
                  .no-print {
                    display: none !important;
                  }
                  body { -webkit-print-color-adjust: exact; }
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
              <div class="title">FARMERS MASTERLIST</div>
              ${printContent}
              <div class="footer">
                Generated on ${new Date().toLocaleDateString()}
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
      }
    }
  }

  return (
    <>
      <Button onClick={handlePrint}>
        <Printer className='mr-2 h-4 w-4' /> Print Masterlist
      </Button>
      <div ref={printableRef} className='hidden'>
        <h2 className='no-print'>Farmers Masterlist</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Municipality</th>
              <th>Barangay</th>
              <th>Phone</th>
              <th>RSBSA Number</th>
              <th>Associations</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{`${farmer.firstname} ${farmer.lastname}`}</td>
                <td>
                  {farmer.gender.charAt(0).toUpperCase() +
                    farmer.gender.slice(1).toLowerCase()}
                </td>
                <td>{farmer.municipality}</td>
                <td>{farmer.barangay}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.rsbsa_number}</td>
                <td className='associations'>
                  {farmer.farmer_associations
                    .map(
                      (assoc) =>
                        `${assoc.association.name} (${assoc.position.replace('_', ' ')})`,
                    )
                    .join('\n')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
