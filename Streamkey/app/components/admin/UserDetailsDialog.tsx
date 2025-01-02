'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Edit, UserCog, Shield, Smartphone, CreditCard, Clock, LogOut, RefreshCcw } from 'lucide-react'
import type { DetailedUser } from '@/app/types/user'

interface UserDetailsDialogProps {
  user: DetailedUser
  onEdit: () => void
  onLogoutDevices: (userId: string) => Promise<void>
}

export function UserDetailsDialog({ user, onEdit, onLogoutDevices }: UserDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('info')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">User Details</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Detailed information about {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-900">
            <TabsTrigger value="info" className="data-[state=active]:bg-zinc-800">
              <UserCog className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-zinc-800">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-zinc-800">
              <Smartphone className="w-4 h-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-zinc-800">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-800">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-zinc-800">
              <UserCog className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4 rounded-md border border-zinc-800 bg-zinc-900/50">
            <div className="p-4">
              <TabsContent value="info" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-100">Basic Information</h3>
                  <div className="grid gap-2 text-zinc-300">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Name:</span>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Account Status:</span>
                      <Badge variant={
                        user.accountStatus === 'active' ? 'default' :
                        user.accountStatus === 'disabled' ? 'secondary' :
                        'destructive'
                      }>
                        {user.accountStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Rank:</span>
                      <Badge variant="outline">{user.rank}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Created:</span>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-zinc-300">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">2FA Status:</span>
                        <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                          {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">VPN Detection:</span>
                        <Badge variant={user.vpnDetected ? 'destructive' : 'default'}>
                          {user.vpnDetected ? 'Detected' : 'Not Detected'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Last Login:</span>
                        <span>{formatDate(user.lastLogin)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onLogoutDevices(user.id)}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout All Devices
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Connected Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-zinc-400">Device</TableHead>
                          <TableHead className="text-zinc-400">OS</TableHead>
                          <TableHead className="text-zinc-400">Last Active</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.devices?.map((device) => (
                          <TableRow key={device.id}>
                            <TableCell className="text-zinc-300">{device.type}</TableCell>
                            <TableCell className="text-zinc-300">{device.os}</TableCell>
                            <TableCell className="text-zinc-300">{formatDate(device.lastActive)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {device.isVPN && (
                                  <Badge variant="secondary">VPN</Badge>
                                )}
                                {device.hasAdBlocker && (
                                  <Badge variant="destructive">Adblocker</Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-zinc-300">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Status:</span>
                        <Badge variant={
                          user.payment?.status === 'active' ? 'default' :
                          user.payment?.status === 'paused' ? 'secondary' :
                          'destructive'
                        }>
                          {user.payment?.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Plan:</span>
                        <span>{user.payment?.plan}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Last Payment:</span>
                        <span>{formatDate(user.payment?.lastPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Next Payment:</span>
                        <span>{formatDate(user.payment?.nextPayment)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-zinc-400">Date</TableHead>
                          <TableHead className="text-zinc-400">Activity</TableHead>
                          <TableHead className="text-zinc-400">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.activityLog?.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="text-zinc-300">
                              {formatDate(activity.timestamp)}
                            </TableCell>
                            <TableCell className="text-zinc-300">
                              {activity.type}
                            </TableCell>
                            <TableCell className="text-zinc-300">
                              {activity.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">User Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-zinc-300">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Language:</span>
                        <span>{user.contentPreferences?.language}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Subtitles:</span>
                        <Badge variant={user.contentPreferences?.subtitlesEnabled ? 'default' : 'secondary'}>
                          {user.contentPreferences?.subtitlesEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Marketing Emails:</span>
                        <Badge variant={user.marketingPreferences?.emailEnabled ? 'default' : 'secondary'}>
                          {user.marketingPreferences?.emailEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button onClick={onEdit} variant="outline" className="bg-zinc-800 hover:bg-zinc-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

