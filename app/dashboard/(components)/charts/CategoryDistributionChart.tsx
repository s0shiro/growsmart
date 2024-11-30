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
  Cell,
} from 'recharts'

const CategoryDistributionChart = () => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { data } = useCategoryAnalytics(selectedYear)

  // Add custom colors array
  const colors = ['#22c55e', '#3b82f6', '#ec4899', '#f59e0b', '#6366f1']

  return (
    <motion.div
      className='background bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 w-full'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-medium mb-6 foreground'>
        Crop Category Distribution {selectedYear}
      </h2>
      <div className='h-[400px]'>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis
              dataKey='name'
              stroke='#9ca3af'
              label={{ value: 'Category', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke='#9ca3af'
              label={{
                value: 'Area Planted (ha)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563',
                padding: '10px',
                fontSize: '14px',
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Bar dataKey='area' label={{ position: 'top', fontSize: 12 }}>
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default CategoryDistributionChart
