"use client"

import { useUser } from "@/context/userContext"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MessageSquare, UserIcon, Settings, Camera, Mail, MapPin, Briefcase, Heart, Gift } from 'lucide-react'

export default function Profile() {
  const userContext = useUser();
  const user = userContext.user;

  if (!user) {
    return redirect("/");
  }
  
  // Определяем статус подписки
  const subscriptionBadge = user.subscription?.is_active ? (
    <Badge className="bg-green-600">Активная подписка</Badge>
  ) : (
    <Badge variant="outline">Нет активной подписки</Badge>
  );

  // Форматируем даты для отображения
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const formatGender = (gender) => {
    switch (gender) {
      case "male":
        return "Мужчина";
      case "female":
        return "Женщина";
      default:
        return "Не указано";
    }
  };

  const createdAt = formatDate(user.created_at);
  const dateOfBirth = formatDate(user.date_of_birth);
  const expireDate = user.subscription ? formatDate(user.subscription.expire) : "-";

  return (
    <div className="container mx-auto px-4 pt-28 max-w-4xl">
      <Card className="w-full shadow-lg py-0 pb-6">
        {/* Шапка профиля */}
        <div className="relative">
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
          <div className="absolute bottom-4 left-8">
            <Avatar className="h-24 w-24 border-4 border-black rounded-lg bg-black">
              <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/webp?seed=${user.username}?eyes=default`} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button variant="outline" className="bg-black text-white">
              <Camera className="h-4 w-4 mr-2" />
              Изменить фото
            </Button>
          </div>
        </div>
        
        {/* Информация профиля */}
        <CardHeader className="pt-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">{user.email}</CardDescription>
            </div>
              {subscriptionBadge}
          </div>
          
        </CardHeader>
        
        {/* Табы для навигации */}
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="subscription">Подписка</TabsTrigger>
              <TabsTrigger value="activity">Активность</TabsTrigger>
            </TabsList>
            
            {/* Содержимое таба Профиль */}
            <TabsContent value="profile">
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
              </div>
            </TabsContent>
            
            {/* Содержимое таба Подписка */}
            <TabsContent value="subscription">
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
            </TabsContent>
            
            {/* Содержимое таба Активность */}
            <TabsContent value="activity">
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Последняя активность</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Информация об активности будет отображаться здесь</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}