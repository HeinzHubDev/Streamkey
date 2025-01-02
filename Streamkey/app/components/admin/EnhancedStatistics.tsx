'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Play, DollarSign, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useToast } from "@/components/ui/use-toast"

interface DashboardMetric {
  value: number
  change: string
}

interface DashboardData {
  metrics: {
    activeUsers: DashboardMetric
    streamingContent: DashboardMetric
    adRevenue: DashboardMetric
    avgWatchTime: DashboardMetric
  }
  userGrowth: Array<{
    name: string
    value: number
  }>
}

export function EnhancedStatistics() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-gray-400 py-8">
        Failed to load dashboard data
      </div>
    )
  }

  const METRICS = [
    {
      title: 'Active Users',
      value: data.metrics.activeUsers.value.toString(),
      change: data.metrics.activeUsers.change,
      icon: Users
    },
    {
      title: 'Streaming Content',
      value: data.metrics.streamingContent.value.toString(),
      change: data.metrics.streamingContent.change,
      icon: Play
    },
    {
      title: 'Ad Revenue',
      value: `$${data.metrics.adRevenue.value.toLocaleString()}`,
      change: data.metrics.adRevenue.change,
      icon: DollarSign
    },
    {
      title: 'Avg. Watch Time',
      value: `${data.metrics.avgWatchTime.value} min`,
      change: data.metrics.avgWatchTime.change,
      icon: Clock
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {METRICS.map(({ title, value, change, icon: Icon }) => (
          <Card key={title} className="bg-[#1a1f2c] border-[#2a2f3c]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{value}</div>
              <p className="text-xs text-gray-400">
                {change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1a1f2c] border-[#2a2f3c]">
        <CardHeader>
          <CardTitle className="text-white">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3c" />
                <XAxis 
                  dataKey="name" 
                  stroke="#4a5568"
                  tick={{ fill: '#4a5568' }}
                />
                <YAxis 
                  stroke="#4a5568"
                  tick={{ fill: '#4a5568' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2c',
                    border: '1px solid #2a2f3c',
                    borderRadius: '0.375rem'
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4757"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

