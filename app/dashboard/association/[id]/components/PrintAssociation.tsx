'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function PrintAssociation({ members }: any) {
  const printableRef = useRef<HTMLDivElement>(null)

  const associationName =
    members && members.length > 0
      ? members[0].association_id.name
      : 'Association'

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${associationName} Members List</title>
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
                  margin-bottom: 2px;
                }
                .logo {
                  border-radius: 50%;
                  width: 70px;
                  height: 70px;
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
                  margin: 15px 0;
                  color: #003366;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 8px;
                  color: #666;
                  text-align: right;
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
              <div class="title">${associationName.toUpperCase()} MEMBERS LIST</div>
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
      <Button onClick={handlePrint} disabled={!members || members.length === 0}>
        <Printer className='mr-2 h-4 w-4' /> Print Members List
      </Button>
      <div ref={printableRef} className='hidden'>
        {members && members.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Barangay</th>
                <th>Municipality</th>
                <th>Position</th>
                <th>Phone</th>
                <th>RSBSA Number</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{`${member.technician_farmers.firstname} ${member.technician_farmers.lastname}`}</td>
                  <td>
                    {member.technician_farmers.gender.charAt(0).toUpperCase() +
                      member.technician_farmers.gender.slice(1).toLowerCase()}
                  </td>
                  <td>{member.technician_farmers.barangay}</td>
                  <td>{member.technician_farmers.municipality}</td>
                  <td>
                    {member.position
                      .replace('_', ' ')
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </td>
                  <td>{member.technician_farmers.phone}</td>
                  <td>{member.technician_farmers.rsbsa_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No members found for this association.</p>
        )}
      </div>
    </>
  )
}
