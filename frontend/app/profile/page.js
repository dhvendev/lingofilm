"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import ProgressSteps from '@/components/NewProfile/NewProgress';
import { 
  Camera, 
  BookA, 
  Clock, 
  BarChart3, 
  Settings,
  CreditCard,
  Shield,
  Star,
  Crown,
  AlertCircle,
  Edit,
  LogOut,
  User,
  Mail,
  Calendar,
  MapPin,
  BookOpen,
  Sparkles, Trophy,
  Clapperboard
} from 'lucide-react';
import ProfileHeader from '@/components/NewProfile/ProfileHeader';
import ProfileCardStat from '@/components/NewProfile/ProfileCardStat';
import { Progress } from '@/components/ui/progress';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Mock данные пользователя
  const user = {
    username: 'alexgames',
    email: 'alex@email.com',
    gender: 'male',
    dateOfBirth: '1990-05-15',
    location: 'Москва, Россия',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=alex&radius=5&backgroundColor=ffdfbf',
    registerDate: '15 марта 2024',
    subscription: {
      type: 'Premium',
      expiry: '15 июня 2025',
      isActive: true,
      features: [
        'Неограниченный доступ к контенту',
        'Личный словарь без ограничений',
        'Скачивание для офлайн просмотра',
        'Приоритетная поддержка'
      ]
    },
    stats: {
      watchedMinutes: 1250,
      wordsLearned: 427,
      moviesWatched: 23,
      level: 7
    },
    paymentCards: [
      {
        id: 1,
        last4: "4444",
        expiry: "07/22",
        brand: "Visa",
        isDefault: true
      },
      {
        id: 2,
        last4: "1234",
        expiry: "12/25",
        brand: "Mastercard",
        isDefault: false
      }
    ]
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatGender = (gender) => {
    const genderMap = {
      'male': 'Мужской',
      'female': 'Женский',
      'other': 'Другой'
    };
    return genderMap[gender] || 'Не указан';
  };


  const progressSteps = [
    { 
      label: 'Шаг 1', 
      description: 'Регистрация аккаунта', 
      action: 'Успешно пройти регистрацию и подтвердить почтовый адресс'
    },
    { 
      label: 'Шаг 2', 
      description: 'Первый просмотр',
      action: 'Посмотреть первый фильм или серию на платформе'
    },
    { 
      label: 'Шаг 3', 
      description: '5 изученных слов',
      action: 'Добавить и изучить 5 новых слов в словаре'
    },
    { 
      label: 'Шаг 4', 
      description: '5 фильмов просмотрено',
      action: 'Завершить просмотр 5 различных фильмов или сериалов' 
    },
    { 
      label: 'Шаг 5', 
      description: 'Первый месяц подписки',
      action: 'Оформить месячную подписку на сервис'
    }
  ];
  
  // Текущий шаг (0-индексируемый)
  const currentStep = 3;

  return (
    <div className="container mx-auto px-4 pt-28 max-w-5xl">
        <Card className="w-full shadow-lg py-0 pb-6 border-none">

            <ProfileHeader
                avatarUrl={user.avatar}
                username={user.username}
                hasSubscription={user.subscription.isActive}
                email={user.email}
            />

        

        
        {/* Статистика */}
        <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-15">
                {/* <ProfileCardStat
                    className={"bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20"}
                    icon={<BookA className="h-6 w-6 text-green-600" />}
                    text={"Изучено слов"}
                    value={user.stats.wordsLearned}
                />
                <ProfileCardStat
                    className={"bg-gradient-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20"}
                    icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
                    text={"Просмотрено фильмов"}
                    value={user.stats.moviesWatched}
                /> */}
                {/* <ProfileCardStat
                    className={"bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20"}
                    icon={<Clock className="h-6 w-6 text-orange-600" />}
                    text={"Часы просмотра"}
                    value={Math.round(user.stats.watchedMinutes / 60)}
                /> */}
                {/* <ProfileCardStat
                    className={"bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20"}
                    icon={<Star className="h-6 w-6 text-purple-600" />}
                    text={"Уровень"}
                    value={user.stats.level}
                /> */}
                
                <ProfileCardStat
                    className={"bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20"}
                    icon={<BookA className="h-10 w-10 text-green-600" />}
                    text={"Изучено"}
                    value={user.stats.wordsLearned}
                />
                <ProfileCardStat
                    className={"bg-gradient-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20"}
                    icon={<Clapperboard className="h-10 w-10 text-rose-600" />}
                    text={"Просмотрено"}
                    value={user.stats.moviesWatched}
                />
                <ProfileCardStat
                    className={"bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20"}
                    icon={<Star className="h-10 w-10 text-indigo-600" />}
                    text={"Уровень"}
                    value={user.stats.level}
                />
            </div>
        </CardHeader>

        {/* Новый прогресс бар */}
        <CardHeader>
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-green-900/10 dark:to-green-900/10 border-green-900/50 flex flex-col justify-between">
            <ProgressSteps steps={progressSteps} currentStep={currentStep} />
          </Card>
        </CardHeader>
        
        <CardHeader>
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-green-900/10 dark:to-green-900/10 border-green-900/50">
              <CardContent >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-semibold text-lg">Путь к мастерству</h3>
                        <p className="text-sm text-muted-foreground">
                        1000 / 2000 XP до следующего уровня
                        </p>
                    </div>
                    <Badge className="bg-green-600 hover:bg-yellow-700">
                        <Trophy className="h-3 w-3 mr-1" />
                        Уровень {user.stats.level}
                    </Badge>
                  </div>
                  <Progress value={50} className="h-3" />
              </CardContent>
            </Card>
        </CardHeader>

        {/* Основной контент */}
        <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start bg-muted/30">
            <TabsTrigger value="profile">Личная информация</TabsTrigger>
            <TabsTrigger value="subscription">Подписка</TabsTrigger>
            <TabsTrigger value="payment">Оплата</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Личная информация</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Имя пользователя</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Дата рождения</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Пол</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{formatGender(user.gender)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-muted-foreground">Дата регистрации</label>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{user.registerDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                  Информация о подписке
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.subscription.isActive ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          {user.subscription.type} подписка
                          <Badge className="ml-2 bg-green-600">Активна</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Действует до {user.subscription.expiry}
                        </p>
                      </div>
                      <Badge variant="outline" className="px-3 py-1">
                        Автопродление: ON
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Включенные функции:</h4>
                      <ul className="space-y-2">
                        {user.subscription.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="h-1.5 w-1.5 bg-green-600 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline">Управлять подпиской</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Отменить подписку
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">У вас нет активной подписки</h3>
                    <p className="text-muted-foreground mb-6">
                      Получите неограниченный доступ ко всем функциям LingoFilm
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Оформить подписку
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Способы оплаты
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Добавить карту
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.paymentCards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded p-2">
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{card.brand} •••• {card.last4}</p>
                              {card.isDefault && (
                                <Badge variant="outline" size="sm">Основная</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Истекает {card.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Изменить</Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setShowDeleteDialog(true)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Достижения
                </CardTitle>
                <CardDescription>Ваши успехи в изучении языка</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      id: 1, 
                      title: 'Первый фильм', 
                      description: 'Посмотрите первый фильм на платформе',
                      icon: '🎬', 
                      unlocked: true,
                      date: 'Получено 20 марта 2024'
                    },
                    { 
                      id: 2, 
                      title: '100 слов', 
                      description: 'Изучите 100 новых слов',
                      icon: '📚', 
                      unlocked: true,
                      date: 'Получено 5 апреля 2024'
                    },
                    { 
                      id: 3, 
                      title: 'Киноман', 
                      description: 'Посмотрите 10 фильмов',
                      icon: '🍿', 
                      unlocked: true,
                      date: 'Получено 15 апреля 2024'
                    },
                    { 
                      id: 4, 
                      title: 'Словарный эксперт', 
                      description: 'Изучите 500 слов',
                      icon: '🧠', 
                      unlocked: false,
                      progress: 85
                    },
                    { 
                      id: 5, 
                      title: 'Марафонец', 
                      description: 'Посмотрите 50 фильмов',
                      icon: '🏃‍♂️', 
                      unlocked: false,
                      progress: 46
                    },
                    { 
                      id: 6, 
                      title: 'Премиум ученик', 
                      description: '30 дней подряд с подпиской',
                      icon: '👑', 
                      unlocked: false,
                      progress: 67
                    }
                  ].map((achievement) => (
                    <Card key={achievement.id} className={`relative overflow-hidden ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                        : 'border-dashed'
                    }`}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                          
                          {achievement.unlocked ? (
                            <div className="mt-3">
                              <Badge className="bg-yellow-600">
                                <Star className="h-3 w-3 mr-1" />
                                Получено
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-2">
                                {achievement.date}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {achievement.progress}% готово
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Настройки аккаунта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Безопасность</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="justify-start w-full md:w-auto">
                      <Shield className="h-4 w-4 mr-2" />
                      Изменить пароль
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-3 text-red-600">Опасная зона</h4>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти из аккаунта
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

