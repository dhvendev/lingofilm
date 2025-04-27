"use client"

import { useUser } from "@/context/userContext"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TopInfo from "./TopInfo"
import ProfileTab from "./ProfileTab"
import SubscriptionTab from "./SubscriptionTab"
import ActivityTab from "./ActivityTab"
import { getSubscriptionStatus } from '@/utils/formatUtils'

export default function Profile() {
  const { user, setUser } = useUser();

  if (!user) {
    return redirect("/");
  }
  

  const subscriptionStatus = getSubscriptionStatus(user.subscription?.is_active);
  const subscriptionBadge = (
    <Badge className={subscriptionStatus.className}>{subscriptionStatus.text}</Badge>
  );

  return (
    <div className="container mx-auto px-4 pt-28 max-w-5xl">
      <Card className="w-full shadow-lg py-0 pb-6">
        <div className="relative">
          <TopInfo user={user} onUserUpdate={setUser}/>
        </div>
        

        <CardHeader className="pt-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">{user.email}</CardDescription>
            </div>
            {subscriptionBadge}
          </div>
        </CardHeader>
        

        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="subscription">Подписка</TabsTrigger>
              <TabsTrigger value="activity">Активность</TabsTrigger>
            </TabsList>
            

            <TabsContent value="profile">
              <ProfileTab user={user} />
            </TabsContent>
            
            
            <TabsContent value="subscription">
              <SubscriptionTab user={user} />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}