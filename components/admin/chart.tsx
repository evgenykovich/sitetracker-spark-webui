'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface ChartData {
  name: string
  users: number
  forms: number
  revenue: number
}

export interface ChartProps {
  data: ChartData[]
}

const Chart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="users"
          stackId="1"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.6}
          name="Users"
        />
        <Area
          type="monotone"
          dataKey="forms"
          stackId="2"
          stroke="#16a34a"
          fill="#22c55e"
          fillOpacity={0.6}
          name="Forms"
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stackId="3"
          stroke="#ca8a04"
          fill="#eab308"
          fillOpacity={0.6}
          name="Revenue ($)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Chart
