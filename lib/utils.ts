import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'inspection':
      return 'bg-yellow-200 text-yellow-800'
    case 'harvest':
      return 'bg-blue-200 text-blue-800'
    case 'harvested':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}