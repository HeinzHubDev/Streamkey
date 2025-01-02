'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Filter, Ban, CheckCircle, Trash2 } from 'lucide-react'
import { UserDetailsDialog } from './UserDetailsDialog'
import type { DetailedUser } from '@/app/types/user'

export default function UserManager() {
  const [users, setUsers] = useState<DetailedUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<DetailedUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<DetailedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    rank: 'all',
    device: 'all',
    paymentStatus: 'all'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      })
      setUsers([])
      setFilteredUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterUsers(value, filters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    filterUsers(searchTerm, newFilters)
  }

  const filterUsers = (search: string, currentFilters: typeof filters) => {
    let filtered = [...users]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        user =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
      )
    }

    if (currentFilters.status !== 'all') {
      filtered = filtered.filter(user => user.accountStatus === currentFilters.status)
    }
    if (currentFilters.rank !== 'all') {
      filtered = filtered.filter(user => user.rank === currentFilters.rank)
    }
    if (currentFilters.device !== 'all') {
      filtered = filtered.filter(user => user.deviceType === currentFilters.device)
    }
    if (currentFilters.paymentStatus !== 'all') {
      filtered = filtered.filter(user => user.payment.status === currentFilters.paymentStatus)
    }

    setFilteredUsers(filtered)
  }

  const handleUserAction = async (userId: string, action: 'activate' | 'disable' | 'delete' | 'suspend') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error(`Failed to ${action} user`)

      toast({
        title: 'Success',
        description: `User successfully ${action}ed`,
      })

      fetchUsers()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} user`,
        variant: 'destructive',
      })
    }
  }

  const handleLogoutDevices = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/logout-devices`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to logout devices')

      toast({
        title: 'Success',
        description: 'User logged out from all devices',
      })

      fetchUsers()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout devices',
        variant: 'destructive',
      })
    }
  }

  const handleEditUser = (user: DetailedUser) => {
    setSelectedUser(user)
    setIsEditing(true)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const userStats = useMemo(() => {
    return {
      total: filteredUsers.length,
      active: filteredUsers.filter(u => u.accountStatus === 'active').length,
      disabled: filteredUsers.filter(u => u.accountStatus === 'disabled').length,
      suspended: filteredUsers.filter(u => u.accountStatus === 'suspended').length,
      deleted: filteredUsers.filter(u => u.accountStatus === 'deleted').length,
      basicPlan: filteredUsers.filter(u => u.rank === 'basic').length,
      basicPlusPlan: filteredUsers.filter(u => u.rank === 'basicPlus').length,
      standardPlan: filteredUsers.filter(u => u.rank === 'standard').length,
      premiumPlan: filteredUsers.filter(u => u.rank === 'premium').length,
      activePayments: filteredUsers.filter(u => u.payment.status === 'active').length,
      overduePayments: filteredUsers.filter(u => u.payment.status === 'overdue').length,
    }
  }, [filteredUsers])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage and monitor user accounts, devices, and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{userStats.total}</div>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{userStats.active}</div>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{userStats.disabled}</div>
                <p className="text-xs text-muted-foreground">Disabled Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{userStats.suspended}</div>
                <p className="text-xs text-muted-foreground">Suspended Users</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.rank}
                onValueChange={(value) => handleFilterChange('rank', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="basicPlus">Basic+</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => handleFilterChange('paymentStatus', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.accountStatus === 'active' ? 'default' :
                          user.accountStatus === 'disabled' ? 'secondary' :
                          user.accountStatus === 'suspended' ? 'destructive' : 'outline'
                        }>
                          {user.accountStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.payment.status === 'active' ? 'default' :
                          user.payment.status === 'paused' ? 'secondary' :
                          user.payment.status === 'overdue' ? 'destructive' : 'outline'
                        }>
                          {user.payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserDetailsDialog 
                            user={user}
                            onEdit={() => handleEditUser(user)}
                            onLogoutDevices={handleLogoutDevices}
                          />
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {user.accountStatus === 'active' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowSuspendConfirm(true)
                                    }}
                                  >
                                    <Ban className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserAction(user.id, 'activate')}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.accountStatus === 'active' ? 'Suspend User' : 'Activate User'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowDeleteConfirm(true)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Delete User
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Confirmation Dialogs */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (selectedUser) {
                handleUserAction(selectedUser.id, 'delete')
                setShowDeleteConfirm(false)
              }
            }}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuspendConfirm} onOpenChange={setShowSuspendConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Suspension</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will not be able to access their account until reactivated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (selectedUser) {
                handleUserAction(selectedUser.id, 'suspend')
                setShowSuspendConfirm(false)
              }
            }}>
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

