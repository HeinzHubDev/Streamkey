'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Crown, Tv, Users, Volume2, Gauge, PlayCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { PaymentDialog } from './payment-dialog'

const GlowingIcon = ({ icon: Icon, color }: { icon: any, color: string }) => (
  <div className="relative">
    <div 
      className="absolute inset-0 blur-sm animate-pulse"
      style={{ 
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.5 
      }}
    />
    <Icon className={`relative z-10 w-12 h-12 ${color}`} />
  </div>
)

const FeatureRow = ({ icon: Icon, text, color }: { icon: any, text: string, color: string }) => (
  <div className="flex items-center gap-3">
    <div className="relative flex-shrink-0">
      <div 
        className="absolute inset-0 blur-sm"
        style={{ 
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0.3 
        }}
      />
      <Icon className={`relative z-10 h-5 w-5 ${color}`} />
    </div>
    <span className="text-zinc-400">{text}</span>
  </div>
)

// Multicolored laser beam component
const LaserBeam = ({ delay = 0, color1 = "#4F46E5", color2 = "#E11D48" }) => (
  <motion.div
    className="absolute inset-0"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0, 0.3, 0],
      scale: [0.8, 1.2, 0.8],
      rotate: [0, 45, 0]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      background: `linear-gradient(45deg, ${color1}, ${color2})`,
      filter: 'blur(8px)'
    }}
  />
)

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '0,00',
    yearlyPrice: null,
    description: 'Kostenloser Zugang mit Werbung',
    icon: Star,
    iconColor: 'text-green-400',
    features: [
      { text: 'Videoqualität: Full HD (1080p)', icon: Tv },
      { text: 'Audioqualität: Gut', icon: Volume2 },
      { text: 'Unterstützte Geräte: Alle', icon: Gauge },
      { text: '2 gleichzeitige Streams', icon: Users },
      { text: 'Ein paar Werbeunterbrechungen', icon: PlayCircle },
      { text: '2 Profile', icon: Users }
    ],
    highlight: 'Kostenlos',
    upgradeOption: {
      name: 'Basic Plus Upgrade',
      price: '4,99',
      features: [
        'Keine Werbung',
        '4 gleichzeitige Streams',
        'Alle Basic-Features inklusive'
      ]
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '14,00',
    yearlyPrice: '179,00', 
    description: 'Beste Wahl für Familien',
    icon: Crown,
    iconColor: 'text-red-400',
    features: [
      { text: 'Videoqualität: 1080p-2160p (HD-UHD)', icon: Tv },
      { text: 'Audioqualität: Top', icon: Volume2 },
      { text: 'Unterstützte Geräte: Alle', icon: Gauge },
      { text: '5 gleichzeitige Streams', icon: Users },
      { text: 'Keine Werbung', icon: PlayCircle },
      { text: '5 Profile', icon: Users },
      { text: 'AutoPlay & Überspringen', icon: Zap }
    ],
    highlight: 'Sie sparen -25€ beim Jahr Plan 🎉',
    savings: 25
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '19,00',
    yearlyPrice: '239,00', 
    description: 'Ultimate Streaming-Erlebnis',
    icon: Crown,
    iconColor: 'text-purple-400',
    features: [
      { text: 'Videoqualität: 4K/UHD/HD + HDR', icon: Tv },
      { text: 'Audioqualität: Mega', icon: Volume2 },
      { text: 'Unterstützte Geräte: Alle', icon: Gauge },
      { text: '10 gleichzeitige Streams', icon: Users },
      { text: 'Keine Werbung', icon: PlayCircle },
      { text: '10 Profile', icon: Users },
      { text: 'Alle Premium Features', icon: Crown }
    ],
    highlight: 'Sie sparen -39€ beim Jahr Plan 🎉',
    savings: 39  // Add savings amount
  }
]


export default function PlanSelectionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showUpgradePayment, setShowUpgradePayment] = useState(false)
  const router = useRouter()
  const { updateUser } = useAuth()
  const { toast } = useToast()

  const handlePlanSelect = async () => {
    if (!selectedPlan) return

    if (selectedPlan === 'basic') {
      try {
        await updateUser({
          subscription: {
            plan: 'basic',
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        })
        router.push('/')
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Es gab ein Problem bei der Aktivierung. Bitte versuchen Sie es erneut.",
          variant: "destructive"
        })
      }
    } else {
      setShowPayment(true)
    }
  }

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowUpgradePayment(true)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-50" />
      
      <div className="relative min-h-screen py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Enhanced laser show background */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <LaserBeam delay={0} color1="#4F46E5" color2="#E11D48" />
            <LaserBeam delay={1} color1="#E11D48" color2="#4F46E5" />
            <LaserBeam delay={2} color1="#8B5CF6" color2="#EC4899" />
          </div>

          <div className="text-center space-y-6 relative z-10 px-4 py-8 mb-12">
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-primary to-red-500 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Wählen Sie Ihren Streaming-Plan
            </motion.h1>
            <motion.p 
              className="text-xl text-zinc-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Flexibel monatlich kündbar. Upgraden oder downgraden Sie jederzeit.
            </motion.p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 relative z-10">
            <AnimatePresence>
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ 
                    scale: plan.id === 'premium' ? 1.05 : 1.02,
                    transition: { duration: 0.3 } 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`relative h-full cursor-pointer transition-all duration-300
                      ${selectedPlan === plan.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                        : plan.id === 'premium'
                        ? 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-black/60 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60'
                      }
                    `}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                      <Badge
                        className={`text-lg py-1.5 px-6 font-semibold ${
                          plan.id === 'premium' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 animate-pulse'
                            : plan.id === 'basic' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/50 animate-pulse' 
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 animate-pulse'
                        }`}
                      >
                        {plan.highlight}
                      </Badge>
                    </div>

                    <CardHeader className="space-y-4 text-center pt-8">
                      <div className="flex justify-center">
                        <GlowingIcon icon={plan.icon} color={plan.iconColor} />
                      </div>
                      <div>
                        <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                        <CardDescription className="text-lg">{plan.description}</CardDescription>
                      </div>
                      <div className="space-y-1">
                        <div className="text-4xl font-bold">
                          {isYearly ? (
                            <>
                              {plan.yearlyPrice || plan.price} €
                              <span className="text-xl font-normal text-zinc-400">/Jahr</span>
                            </>
                          ) : (
                            <>
                              {plan.price} €
                              <span className="text-xl font-normal text-zinc-400">/Monat</span>
                            </>
                          )}
                        </div>
                        {plan.yearlyPrice && (
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsYearly(!isYearly)
                              }}
                            >
                              {isYearly ? 'Monatlich zahlen' : 'Jährlich zahlen & sparen'}
                            </Button>
                            {isYearly && plan.savings && (
                              <motion.p 
                                className="text-lg font-bold text-red-500"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                Sie sparen {plan.savings}€ im Jahr! 🎉
                              </motion.p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <FeatureRow 
                              icon={feature.icon} 
                              text={feature.text} 
                              color={plan.iconColor}
                            />
                          </motion.li>
                        ))}
                      </ul>

                      {plan.upgradeOption && (
                        <motion.div
                          className="p-4 rounded-lg border bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-500/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <h4 className="font-medium text-amber-400 mb-2">
                            Upgrade auf Basic Plus verfügbar
                          </h4>
                          <p className="text-sm text-zinc-400 mb-3">
                            Für nur {plan.upgradeOption.price}€/Monat extra:
                          </p>
                          <ul className="space-y-2">
                            {plan.upgradeOption.features.map((feature, index) => (
                              <motion.li
                                key={index}
                                className="flex items-start gap-2 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                              >
                                <Zap className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                                <span className="text-zinc-400">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-500/20"
                            onClick={handleUpgrade}
                          >
                            Jetzt auf Basic Plus upgraden
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-6 relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className={`min-w-[250px] h-14 text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:opacity-90 shadow-lg shadow-purple-500/30 ${
                  !selectedPlan && 'animate-pulse'
                }`}
                onClick={handlePlanSelect}
                disabled={!selectedPlan}
              >
                Plan auswählen
              </Button>
            </motion.div>
            
            <p className="text-sm text-zinc-400 max-w-2xl text-center">
              Die Verfügbarkeit von HD (720p), Full HD (1080p), Ultra-HD (4K) und HDR hängt von Ihrem Internetdienst und Gerät ab.
              Nicht alle Inhalte sind in allen Auflösungen verfügbar.
            </p>
          </div>
        </div>
      </div>

      <PaymentDialog 
        open={showPayment} 
        onClose={() => setShowPayment(false)}
        plan={plans.find(p => p.id === selectedPlan)}
        isYearly={isYearly}
      />

      <PaymentDialog 
        open={showUpgradePayment} 
        onClose={() => setShowUpgradePayment(false)}
        plan={{
          id: 'basicPlus',
          name: 'Basic Plus',
          price: '4.99',
          description: 'Upgrade auf werbefreies Streaming'
        }}
        isUpgrade
      />
    </div>
  )
}

