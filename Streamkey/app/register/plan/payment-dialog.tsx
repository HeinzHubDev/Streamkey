'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface PaymentDialogProps {
  open: boolean
  onClose: () => void
  plan: any
  isYearly?: boolean
  isUpgrade?: boolean
}

export function PaymentDialog({ open, onClose, plan, isYearly, isUpgrade }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { updateUser } = useAuth()
  const { toast } = useToast()

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Zahlungsmethode aus.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      await updateUser({
        subscription: {
          plan: plan.id,
          status: 'active',
          isYearly,
          expiresAt: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        }
      })

      toast({
        title: "Zahlung erfolgreich",
        description: isUpgrade 
          ? "Ihr Upgrade wurde erfolgreich aktiviert."
          : "Ihr Abonnement wurde erfolgreich eingerichtet.",
      })

      onClose()
      router.push('/')
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Zahlung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!plan) return null

  const calculateYearlyAmount = () => {
    if (!isYearly) return parseFloat(plan.price)
    
    const baseAmount = parseFloat(plan.yearlyPrice)
    const savings = plan.id === 'premium' ? 39 : plan.id === 'standard' ? 25 : 0
    return baseAmount - savings
  }

  const amount = calculateYearlyAmount()
  const originalAmount = isYearly ? parseFloat(plan.yearlyPrice) : parseFloat(plan.price)
  const savings = isYearly ? (plan.id === 'premium' ? 39 : plan.id === 'standard' ? 25 : 0) : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Zahlungsmethode auswählen</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Zu zahlender Betrag:</h3>
            <div className="space-y-2">
              {savings > 0 ? (
                <>
                  <p className="text-2xl line-through text-zinc-500">
                    {originalAmount.toFixed(2)} €
                    <span className="text-sm font-normal text-zinc-400">
                      {isYearly ? '/Jahr' : '/Monat'}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-red-500">
                      {amount.toFixed(2)} €
                      <span className="text-sm font-normal text-zinc-400">
                        {isYearly ? '/Jahr' : '/Monat'}
                      </span>
                    </p>
                    <span className="text-red-500 font-medium">
                      (-{savings}€)
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-2xl font-bold">
                  {amount.toFixed(2)} €
                  <span className="text-sm font-normal text-zinc-400">
                    {isYearly ? '/Jahr' : '/Monat'}
                  </span>
                </p>
              )}
            </div>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span>PayPal</span>
                  <Image 
                    src="/paypal-logo.png" 
                    alt="PayPal" 
                    width={60} 
                    height={20}
                  />
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <RadioGroupItem value="klarna" id="klarna" />
              <Label htmlFor="klarna" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span>Klarna</span>
                  <Image 
                    src="/klarna-logo.png" 
                    alt="Klarna" 
                    width={60} 
                    height={20}
                  />
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button 
            onClick={handlePayment}
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Wird verarbeitet...' : 'Jetzt bezahlen'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

