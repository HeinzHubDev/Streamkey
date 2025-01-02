'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

type ViewData = {
  date: string
  views: number
}

type GenreData = {
  name: string
  value: number
}

export function Statistics() {
  const [viewsData, setViewsData] = useState<ViewData[]>([])
  const [genreData, setGenreData] = useState<GenreData[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [uniqueViewers, setUniqueViewers] = useState(0)
  const [averageWatchTime, setAverageWatchTime] = useState(0)

  useEffect(() => {
    // Simulierte Daten - würde normalerweise von einer API kommen
    const mockViewsData: ViewData[] = [
      { date: 'Mo', views: 400 },
      { date: 'Di', views: 300 },
      { date: 'Mi', views: 550 },
      { date: 'Do', views: 450 },
      { date: 'Fr', views: 600 },
      { date: 'Sa', views: 750 },
      { date: 'So', views: 800 },
    ]

    const mockGenreData: GenreData[] = [
      { name: 'Action', value: 1200 },
      { name: 'Drama', value: 900 },
      { name: 'Comedy', value: 800 },
      { name: 'Sci-Fi', value: 600 },
      { name: 'Horror', value: 400 },
    ]

    setViewsData(mockViewsData)
    setGenreData(mockGenreData)
    setTotalViews(15234)
    setUniqueViewers(4567)
    setAverageWatchTime(127)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Gesamtaufrufe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{totalViews}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Unique Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{uniqueViewers}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-normal">Ø Watchtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{averageWatchTime} min</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="views" className="space-y-4">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="views">Aufrufe</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
        </TabsList>

        <TabsContent value="views">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Aufrufe diese Woche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="date" 
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
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#a78bfa" 
                      strokeWidth={2}
                      dot={{ fill: '#a78bfa', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Beliebteste Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Statistics;

