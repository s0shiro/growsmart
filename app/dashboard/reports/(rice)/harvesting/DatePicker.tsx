'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [internalDateRange, setInternalDateRange] = React.useState<
    DateRange | undefined
  >(dateRange)

  React.useEffect(() => {
    setInternalDateRange(dateRange)
  }, [dateRange])

  const handleRangeSelect = (range: DateRange | undefined) => {
    setInternalDateRange(range)
    if (range?.from) {
      onDateRangeChange({ from: range.from, to: range.to || range.from })
    }
  }

  return (
    <div className='grid gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {internalDateRange?.from ? (
              internalDateRange.to ? (
                <>
                  {format(internalDateRange.from, 'LLL dd, y')} -{' '}
                  {format(internalDateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(internalDateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={internalDateRange?.from}
            selected={internalDateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
