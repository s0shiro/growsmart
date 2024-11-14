'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
]

export default function DamagePieChart({ data }: { data: any }) {
  // Filter out municipalities with 0 total and format data for the chart
  const chartData = data
    .filter((item: any) => item.total > 0)
    .map((item: any) => ({
      municipality: item.municipality,
      'Total Damage (ha)': item.total,
    }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className='bg-background text-foreground p-2 border border-border rounded shadow-md'>
          <p className='font-bold'>{data.municipality}</p>
          <p>Total Damage: {data['Total Damage (ha)']} ha</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Damages per Municipality</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center items-center'>
        <ChartContainer
          config={{
            municipality: {
              label: 'Municipality',
            },
            'Total Damage (ha)': {
              label: 'Total Damage (ha)',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className='h-[300px] w-full max-w-md'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                dataKey='Total Damage (ha)'
                nameKey='municipality'
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                label
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
