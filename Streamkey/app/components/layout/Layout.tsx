'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, User, Film, LogOut, Settings, HelpCircle, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Main Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <Film className="h-8 w-auto text-red-600" />
                <span className="ml-2 text-xl font-bold text-white">Streamkey</span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/filme" 
                  className={`text-sm ${isActive('/filme') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Filme
                </Link>
                <Link 
                  href="/serien" 
                  className={`text-sm ${isActive('/serien') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Serien
                </Link>
                <Link 
                  href="/meine-liste" 
                  className={`text-sm ${isActive('/meine-liste') ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Meine Liste
                </Link>
              </nav>
            </div>

            {/* Search and User Menu */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <input
                  type="search"
                  placeholder="Titel, Personen, Genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-1 text-sm text-white bg-zinc-800 border border-zinc-700 rounded-full focus:outline-none focus:border-zinc-500"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  variant="ghost"
                  className="ml-2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <img
                        src={user.avatar || '/placeholder.svg?height=32&width=32'}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Einstellungen</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/help">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Hilfe</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Abmelden</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href="/login">Einloggen</Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800">
            <div className="px-4 py-2">
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="search"
                  placeholder="Titel, Personen, Genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500"
                />
              </form>
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/filme" 
                  className={`text-sm ${isActive('/filme') ? 'text-white font-medium' : 'text-gray-300'}`}
                >
                  Filme
                </Link>
                <Link 
                  href="/serien" 
                  className={`text-sm ${isActive('/serien') ? 'text-white font-medium' : 'text-gray-300'}`}
                >
                  Serien
                </Link>
                <Link 
                  href="/meine-liste" 
                  className={`text-sm ${isActive('/meine-liste') ? 'text-white font-medium' : 'text-gray-300'}`}
                >
                  Meine Liste
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

