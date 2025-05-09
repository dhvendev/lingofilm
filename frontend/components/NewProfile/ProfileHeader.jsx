import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProfileHeader({avatarUrl, username, hasSubscription, email}) {
    return (
        <div className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-green-700 to-green-950 rounded-t-lg"></div>
            <div className="absolute bottom-4 left-8 flex items-center">
                <div className="h-24 w-24 bg-black rounded-full flex items-center justify-center relative group">
                    <Avatar className="h-24 w-24 border-4 border-black rounded-lg bg-black">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-white">
                        {username}
                        {hasSubscription && (
                            <Badge className="ml-3 bg-yellow-500/90 text-black rounded-sm">
                                <Crown className="h-3 w-3 mr-1" />
                                Подписка
                            </Badge>
                        )}
                    </h1>
                    <p className="text-white opacity-90">{email}</p>
                </div>
            </div>
            <div className="absolute bottom-4 right-6">
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800 rounded-sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Изменить фото
                    </Button>
            </div>
        </div>
    )
}