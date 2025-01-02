// Previous imports remain the same...

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  plan?: 'basic' | 'basicPlus' | 'standard' | 'premium';
  adSettings?: {
    enabled: boolean;
    frequency: number;
    maxDuration: number;
  };
  qualitySettings?: {
    maxResolution: string;
    audioQuality: string;
  };
}

export default function VideoPlayer({ 
  src, 
  title, 
  poster,
  plan = 'basic',
  adSettings,
  qualitySettings
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentQuality, setCurrentQuality] = useState(qualitySettings?.maxResolution || '720p')
  const [showAd, setShowAd] = useState(false)
  const [adTimeRemaining, setAdTimeRemaining] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const adIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle ad playback for basic plan
  useEffect(() => {
    if (plan === 'basic' && adSettings?.enabled) {
      const startAdInterval = () => {
        adIntervalRef.current = setInterval(() => {
          setShowAd(true)
          setAdTimeRemaining(adSettings.maxDuration)
        }, adSettings.frequency * 60 * 1000)
      }

      startAdInterval()
      return () => {
        if (adIntervalRef.current) {
          clearInterval(adIntervalRef.current)
        }
      }
    }
  }, [plan, adSettings])

  // Handle ad countdown
  useEffect(() => {
    if (showAd && adTimeRemaining > 0) {
      const countdown = setInterval(() => {
        setAdTimeRemaining(prev => {
          if (prev <= 1) {
            setShowAd(false)
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdown)
    }
  }, [showAd, adTimeRemaining])

  // Previous useEffect hooks remain...

  const qualities = {
    'basic': ['480p', '720p'],
    'basicPlus': ['720p', '1080p'],
    'standard': ['720p', '1080p', '2160p'],
    'premium': ['720p', '1080p', '2160p', '4K']
  }

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality)
    // In a real implementation, this would switch video sources
  }

  return (
    <div 
      ref={playerRef} 
      className="relative bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {showAd ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-2">Werbung</p>
            <p>Noch {adTimeRemaining} Sekunden</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-auto"
            onClick={togglePlay}
          />
          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <button onClick={() => seek(-10)} className="text-white">
                  <Rewind />
                </button>
                <button onClick={togglePlay} className="text-white">
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </button>
                <button onClick={() => seek(10)} className="text-white">
                  <FastForward />
                </button>
                <div className="flex-1">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleProgressChange}
                    className="w-full"
                  />
                </div>
                <div className="text-white text-sm">
                  {videoRef.current && formatTime(videoRef.current.currentTime)} / 
                  {videoRef.current && formatTime(videoRef.current.duration)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={toggleMute} className="text-white">
                      {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>
                  
                  <Select
                    value={currentQuality}
                    onValueChange={handleQualityChange}
                  >
                    <SelectTrigger className="w-24 bg-black/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities[plan].map(quality => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  {(plan === 'standard' || plan === 'premium') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white"
                      onClick={() => {/* Skip intro/outro logic */}}
                    >
                      <FastForward className="w-4 h-4 mr-2" />
                      Überspringen
                    </Button>
                  )}
                  <button onClick={toggleFullscreen} className="text-white">
                    {isFullscreen ? <Minimize /> : <Maximize />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

