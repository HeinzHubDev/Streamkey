import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md mx-auto p-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold mb-2 text-white">
          Ein Fehler ist aufgetreten
        </h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="netflix-button"
          >
            Erneut versuchen
          </Button>
        )}
      </div>
    </div>
  )
}

