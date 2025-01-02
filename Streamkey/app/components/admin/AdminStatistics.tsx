'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type StatData = {
  name: string
  value: number
}

export default function AdminStatistics() {
  const [activeUsers, setActiveUsers] = useState(1234)
  const [streamingContent, setStreamingContent] = useState(567)
  const [avgWatchtime, setAvgWatchtime] = useState(120)
  const [topContent, setTopContent] = useState<StatData[]>([
    { name: 'Film 1', value: 1000 },
    { name: 'Serie 1', value: 800 },
    { name: 'Anime 1', value: 600 },
    { name: 'Film 2', value: 400 },
    { name: 'Serie 2', value: 200 },
  ])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Aktive Nutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Gestreamte Inhalte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{streamingContent}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Durchschnittliche Watchtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{avgWatchtime} min</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Top 5 Inhalte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topContent}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a"
                  tick={{ fill: '#71717a' }}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis 
                  stroke="#71717a"
                  tick={{ fill: '#71717a' }}
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '0.375rem',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#a78bfa"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

