'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`page-container animate-fade-in ${className}`}>
      {children}
    </div>
  )
}

