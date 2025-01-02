'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CreditCard, AlertCircle } from 'lucide-react'
import { PaymentDialog } from './payment-dialog'

const plans = [
  { id: 'basic', name: 'Basic', price: '0,00' },
  { id: 'basicPlus', name: 'Basic Plus', price: '4,99' },
  { id: 'standard', name: 'Standard', price: '14,99' },
  { id: 'premium', name: 'Premium', price: '19,99' }
]

export default function SubscriptionPage() {
  const { user, updateUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [isDowngrade, setIsDowngrade] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user?.subscription?.plan) {
      setSelectedPlan(user.subscription.plan)
    }
  }, [user])

  const currentPlan = plans.find(p => p.id === user?.subscription?.plan)
  const newPlan = plans.find(p => p.id === selectedPlan)
  const isDowngrading = newPlan && currentPlan && 
    plans.indexOf(newPlan) < plans.indexOf(currentPlan)

  const handlePlanChange = () => {
    if (!selectedPlan || selectedPlan === user?.subscription?.plan) return

    if (selectedPlan === 'basic') {
      setIsDowngrade(true)
      setShowConfirmation(true)
    } else if (isDowngrading) {
      setIsDowngrade(true)
      setShowConfirmation(true)
    } else {
      setShowPayment(true)
    }
  }

  const confirmPlanChange = async () => {
    try {
      const nextBillingDate = new Date()
      nextBillingDate.setDate(1) // Set to first of next month
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

      await updateUser({
        subscription: {
          plan: selectedPlan,
          status: 'active',
          expiresAt: nextBillingDate.toISOString(),
          previousPlan: user?.subscription?.plan
        }
      })

      toast({
        title: "Plan geändert",
        description: isDowngrade 
          ? "Ihr Plan wird am Ende der Abrechnungsperiode geändert."
          : "Ihr Plan wurde erfolgreich aktualisiert.",
      })

      // Send notification to admin
      await fetch('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({
          type: 'subscription_change',
          userId: user?.id,
          oldPlan: user?.subscription?.plan,
          newPlan: selectedPlan
        })
      })

    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Ändern Ihres Plans.",
        variant: "destructive"
      })
    }
  }

  // Calculate days until expiration
  const daysUntilExpiration = user?.subscription?.expiresAt
    ? Math.ceil((new Date(user.subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Abonnement
              </CardTitle>
              <Badge 
                variant={user?.subscription?.status === 'active' ? 'default' : 'secondary'}
                className="bg-green-500/10 text-green-500"
              >
                Aktiv
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-zinc-400">Aktueller Plan</h3>
              <p className="text-2xl font-bold">{currentPlan?.name || 'Kein Plan'}</p>
              <p className="text-sm text-zinc-400">
                Nächste Abrechnung: {new Date(user?.subscription?.expiresAt || '').toLocaleDateString('de-DE')}
              </p>
            </div>

            {daysUntilExpiration <= 7 && daysUntilExpiration > 0 && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-yellow-500/10 text-yellow-500">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Abonnement läuft bald ab</p>
                  <p className="text-sm">
                    Ihr Abonnement läuft in {daysUntilExpiration} Tagen aus. 
                    Bitte verlängern Sie es, um keine Unterbrechung zu erleben.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400">Plan ändern</h3>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Plan auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - {plan.price}€/Monat
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handlePlanChange}
                disabled={!selectedPlan || selectedPlan === user?.subscription?.plan}
                className="w-full"
              >
                Plan ändern
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Plan ändern bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              {isDowngrade ? (
                <>
                  Sie können den aktuellen Plan noch bis zum Ende der Abrechnungsperiode nutzen. 
                  Danach wird Ihr Plan auf {newPlan?.name} geändert.
                </>
              ) : (
                'Möchten Sie wirklich Ihren Plan ändern?'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPlanChange}>
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentDialog 
        open={showPayment} 
        onClose={() => setShowPayment(false)}
        plan={plans.find(p => p.id === selectedPlan)}
      />
    </div>
  )
}

