import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatUtils'

export default function SubscriptionTab({ user }) {
  const expireDate = user.subscription ? formatDate(user.subscription.expire) : "-";

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Информация о подписке</CardTitle>
        </CardHeader>
        <CardContent>
          {user.subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Статус подписки:</span>
                {user.subscription.is_active ? (
                  <Badge className="bg-green-600">Активна</Badge>
                ) : (
                  <Badge variant="outline">Не активна</Badge>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Тип подписки</h4>
                <p className="mt-1">{user.subscription.sub_type || "Отсутствует"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Действует до</h4>
                <p className="mt-1">{expireDate || "Отсутствует"}</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex flex-col gap-2">
                  {!user.subscription.is_active && (
                    <Button className="w-full">Возобновить подписку</Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">У вас пока нет подписки</h3>
              <p className="text-muted-foreground mb-6">
                Оформите подписку, чтобы получить доступ ко всем возможностям сервиса
              </p>
              <Button>Оформить подписку</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}