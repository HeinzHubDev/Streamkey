import { NextResponse } from 'next/server'

export async function GET() {
  // Mock data for the admin dashboard
  const dashboardData = {
    metrics: {
      activeUsers: {
        value: 1234,
        change: '+20.1%'
      },
      streamingContent: {
        value: 567,
        change: '+13%'
      },
      adRevenue: {
        value: 10000,
        change: '+12.5%'
      },
      avgWatchTime: {
        value: 120,
        change: '+5%'
      }
    },
    userGrowth: [
      { name: 'Jan', value: 1000 },
      { name: 'Feb', value: 1200 },
      { name: 'Mar', value: 1500 },
      { name: 'Apr', value: 1800 },
      { name: 'May', value: 2200 },
      { name: 'Jun', value: 2600 }
    ],
    contentCategories: [
      { name: 'Action', value: 30 },
      { name: 'Drama', value: 25 },
      { name: 'Comedy', value: 20 },
      { name: 'Sci-Fi', value: 15 },
      { name: 'Horror', value: 10 }
    ]
  }

  return NextResponse.json(dashboardData)
}

