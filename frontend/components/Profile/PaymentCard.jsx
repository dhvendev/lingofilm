import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, AlertCircle } from 'lucide-react'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { useState } from 'react'

export default function PaymentCard({ paymentData, onUnlinkCard }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  if (!paymentData) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Платежная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет привязанной карты</h3>
            <p className="text-muted-foreground mb-4">
              Привяжите карту для удобства оплаты сервиса
            </p>
            <Button>Привязать карту</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 w-full md:w-1/2">
      <CardHeader>
        <CardTitle>Платежная информация</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div className="text-xl font-bold">{paymentData.title || `${paymentData.issuer_name} карта`}</div>
            <div><CreditCard className="h-5 w-5" /></div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm opacity-75">Номер карты</div>
              <div className="font-mono text-lg">•••• •••• •••• {paymentData.last4}</div>
            </div>
            
            <div className="flex justify-between">
              <div className="mr-6">
                <div className="text-sm opacity-75">Срок действия</div>
                <div>{paymentData.expiry_month}/{paymentData.expiry_year.substring(2)}</div>
              </div>
              
              <div>
                <div className="text-sm opacity-75">Банк</div>
                <div>{paymentData.issuer_name}</div>
              </div>
              
              <div>
                <div className="text-sm opacity-75">Тип</div>
                <div>{paymentData.card_type}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
              Отвязать карту
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Отвязать карту</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите отвязать карту {paymentData.title || `*${paymentData.last4}`}? 
                После этого вам потребуется заново привязать карту для оплаты сервиса.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (onUnlinkCard) onUnlinkCard();
                  setIsDialogOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Отвязать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}