import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) {
    return ''
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatCurrency = (amount: number | undefined) => {
  return amount !== undefined ? `₱${amount.toLocaleString()}` : 'N/A'
}

export function getStatusColor(status: string): string {
  console.log(`Status received: ${status}`)
  switch (status.toLowerCase()) {
    case 'inspection':
      return 'bg-green-500 text-white'
    case 'harvest':
      return 'bg-green-500 text-white'
    case 'harvested':
      return 'bg-green-500 text-black'
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground'
    default:
      return 'bg-gray-500 text-white'
  }
}

export const getBgColor = (selectedWaterSupply: string) => {
  switch (selectedWaterSupply) {
    case 'irrigated':
      return 'bg-yellow-300'
    case 'rainfed':
      return 'bg-green-500'
    case 'upland':
      return 'bg-orange-300'
    case 'total':
      return 'bg-blue-500'
    default:
      return ''
  }
}

export const formatDateRange = (from: any, to: any) => {
  if (!from || !to) return ''
  const formattedFrom = format(new Date(from), 'MMM d')
  const formattedTo = format(new Date(to), 'd, yyyy')
  return `${formattedFrom} - ${formattedTo}`
}

export const getSeasonAndYear = (date: any) => {
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const day = date.getDate()
  const year = date.getFullYear()

  let season = ''
  if (
    (month === 9 && day >= 16) ||
    (month >= 10 && month <= 12) ||
    month === 1 ||
    month === 2 ||
    (month === 3 && day <= 15)
  ) {
    season = 'Dry Season'
  } else {
    season = 'Wet Season'
  }

  return `${season} ${year}`
}

export const getInitials = (name?: string) => {
  if (!name) return 'UN'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export const capitalizeFirst = (text?: string) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'
  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

export const formatAmountWithUnit = (amount: number, type: string) => {
  switch (type) {
    case 'Financial Aid':
      return `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    case 'Equipment':
      return `${amount} pcs`
    case 'Seeds':
      return `${amount} kg`
    default:
      return amount.toString()
  }
}
