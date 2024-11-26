import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { useCropAnalytics } from '@/hooks/crop/useCropAnalytics'
import { useState } from 'react'

const MonthlyProductionChart = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { data } = useCropAnalytics(selectedYear)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const monthAbbreviations = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
  }

  const monthlyData = months.map((monthName) => {
    const monthIndex = months.indexOf(monthName)
    const monthData = data?.reduce(
      (total, record) => {
        if (record.status === 'harvested') {
          record.harvest_records?.forEach((harvest) => {
            const harvestMonth = new Date(harvest.harvest_date).getMonth()
            if (harvestMonth === monthIndex) {
              total.production += harvest.yield_quantity || 0
            }
          })
        }
        return total
      },
      { production: 0 },
    )

    return {
      name: monthAbbreviations[monthName], // Use abbreviated month name
      production: monthData?.production || 0,
    }
  })

  return (
    <motion.div
      className='background bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className='text-lg font-medium mb-4 foreground'>
        Monthly Production Overview {selectedYear}
      </h2>

      <div className='h-[400px]'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis
              dataKey='name'
              stroke='#9ca3af'
              angle={-45} // Rotate labels
              textAnchor='end' // Align rotated text
              height={60} // Increase height for rotated labels
              interval={0} // Force show all ticks
              tick={{
                fontSize: 12,
                dy: 8,
              }}
              label={{
                value: 'Month',
                position: 'bottom',
                dy: 50, // Adjust label position
              }}
            />
            <YAxis
              stroke='#9ca3af'
              label={{
                value: 'Production (kg)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563',
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Line
              type='monotone'
              dataKey='production'
              stroke='#22c55e'
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default MonthlyProductionChart
