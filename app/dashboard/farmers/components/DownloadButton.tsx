import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface DownloadButtonProps {
  url: string
  buttonName: string
  fileName: string
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  buttonName,
  fileName,
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const urlObject = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlObject
      a.download = `${fileName}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Error downloading the file:', error)
    }
  }

  return (
    <Button onClick={handleDownload} className='flex items-center space-x-2'>
      <Download className='w-4 h-4' />
      <span>{buttonName}</span>
    </Button>
  )
}

export default DownloadButton
