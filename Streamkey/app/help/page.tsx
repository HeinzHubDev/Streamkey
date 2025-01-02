'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { Button } from '@/app/components/ui/button'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      question: 'Wie kann ich mein Abonnement verwalten?',
      answer: 'Sie können Ihr Abonnement in den Kontoeinstellungen verwalten. Gehen Sie dazu auf "Konto" und dann auf "Abo verwalten".'
    },
    {
      question: 'Wie kann ich mein Passwort zurücksetzen?',
      answer: 'Klicken Sie auf der Login-Seite auf "Passwort vergessen" und folgen Sie den Anweisungen in der E-Mail, die Sie erhalten.'
    },
    {
      question: 'Wie füge ich Titel zu meiner Liste hinzu?',
      answer: 'Klicken Sie bei jedem Titel auf das Plus-Symbol oder den "Zu Meiner Liste hinzufügen" Button.'
    },
    {
      question: 'Welche Videoqualität ist verfügbar?',
      answer: 'Je nach Abonnement können Sie Videos in SD, HD oder 4K Qualität streamen. Die Qualität kann in den Einstellungen angepasst werden.'
    },
    {
      question: 'Kann ich mehrere Profile erstellen?',
      answer: 'Ja, abhängig von Ihrem Abonnement können Sie mehrere Profile für verschiedene Familienmitglieder erstellen.'
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="netflix-card">
          <CardHeader>
            <CardTitle className="text-2xl">Hilfe & FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-lg font-medium mb-4">Noch Fragen?</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="netflix-button">
                  <Link href="mailto:support@streamkey.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Kontakt aufnehmen
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/contact">
                    Live Chat
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

