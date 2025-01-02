'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import Layout from './Layout'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <Layout>{children}</Layout>
}

