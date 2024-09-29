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

export function getStatusColor(status: string): string {
  console.log(`Status received: ${status}`);
  switch (status.toLowerCase()) {
    case 'inspection':
      return 'bg-green-500 text-white';
    case 'harvest':
      return 'bg-green-500 text-white';
    case 'harvested':
      return 'bg-green-500 text-black';
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-gray-500 text-white';
  }
}