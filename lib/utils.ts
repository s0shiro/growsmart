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
