'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

interface VideoPlayerProps {
  src: string
  title: string
  poster?: string
}

const qualityLimits = {
  'basic': '720p',
  'basicPlus': '1080p',
  'standard': '2160p',
  'premium': '4K'
}

export default function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentQuality, setCurrentQuality] = useState<string>('auto')

  useEffect(() => {
    if (!user?.subscription) return

    // Set quality based on subscription
    const maxQuality = qualityLimits[user.subscription.plan as keyof typeof qualityLimits]
    if (currentQuality === 'auto' || 
        getQualityValue(currentQuality) > getQualityValue(maxQuality)) {
      setCurrentQuality(maxQuality)
    }
  }, [user?.subscription, currentQuality])

  // Helper to convert quality string to numeric value for comparison
  function getQualityValue(quality: string): number {
    switch (quality) {
      case '4K': return 2160
      case '2160p': return 2160
      case '1080p': return 1080
      case '720p': return 720
      default: return 0
    }
  }

  return (
    <div className="relative bg-black aspect-video">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        controls
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {/* Quality indicator */}
      <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded text-sm">
        {currentQuality}
      </div>
    </div>
  )
}

