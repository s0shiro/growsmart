// CategoryDistributionChart.tsx
import { useCategoryAnalytics } from '@/hooks/crop/useCropAnalytics'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CategoryDistributionChart = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { data } = useCategoryAnalytics(selectedYear)

  return (
    <motion.div
      className='background bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-lg font-medium mb-4 foreground'>
        Crop Category Distribution {selectedYear}
      </h2>
      <div className='h-80'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis
              dataKey='name'
              stroke='#9ca3af'
              label={{ value: 'Category', position: 'bottom' }}
            />
            <YAxis
              stroke='#9ca3af'
              label={{
                value: 'Area Planted (ha)',
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
            <Bar dataKey='area' fill='#22c55e' label={{ position: 'top' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default CategoryDistributionChart
