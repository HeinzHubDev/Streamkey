'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UserManager from './UserManager'
import MediaManager from './MediaManager'
import { EnhancedStatistics } from './EnhancedStatistics'
import { Search, Settings, Menu, TrendingUp, Users, Play, Activity } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', icon: TrendingUp, label: 'Overview' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'media', icon: Play, label: 'Media' },
  { id: 'stats', icon: Activity, label: 'Statistics' },
  { id: 'settings', icon: Settings, label: 'Settings' }
]

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
      case 'stats':
        return <EnhancedStatistics />;
      case 'users':
        return <UserManager />;
      case 'media':
        return <MediaManager />;
      case 'settings':
        return (
          <Card className="bg-[#1a1f2c] border-[#2a2f3c]">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Admin settings and preferences</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-[#0f1219]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1f2c] border-r border-[#2a2f3c]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#2a2f3c]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="ghost"
                className={`w-full justify-start ${
                  activeSection === id 
                    ? 'bg-[#2a2f3c] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2f3c]'
                }`}
                onClick={() => setActiveSection(id)}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold text-white">
                {NAV_ITEMS.find(item => item.id === activeSection)?.label}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#1a1f2c] border-[#2a2f3c] text-white placeholder:text-gray-400 w-[300px]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px] bg-[#1a1f2c] border-[#2a2f3c] text-white">
                    <SelectValue placeholder="Last 7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="3m">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}

