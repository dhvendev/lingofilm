import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatGender } from '@/utils/formatUtils'
import PaymentCard from './PaymentCard'

export default function ProfileTab({ user }) {
  const dateOfBirth = formatDate(user.date_of_birth);
  const createdAt = formatDate(user.created_at);

  const handleUnlinkCard = () => {
    // Здесь будет логика для отвязки карты
    console.log("Карта отвязана");
  };

  const demoCard = {
    "last4": "4444",
    "expiry_month": "07",
    "expiry_year": "2022",
    "card_type": "Mir",
    "issuer_country": "RU",
    "issuer_name": "Sberbank",
    "title": "Bank card *4444"}

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Имя пользователя</dt>
              <dd className="mt-1">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Пол</dt>
              <dd className="mt-1">{formatGender(user.gender)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Дата рождения</dt>
              <dd className="mt-1">{dateOfBirth}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Дата регистрации</dt>
              <dd className="mt-1">{createdAt}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Редактировать информацию</Button>
        </CardFooter>
      </Card>
      
      <PaymentCard 
        paymentData={demoCard || null} 
        onUnlinkCard={handleUnlinkCard} 
      />
    </div>
  );
}