import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { GamepadIcon, Brain, Lock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function DictionaryPreviewGame({gameTitle,  gameDescription,
    gameDifficult, onClick,
    colorIcon, disabled, premiumRequired }) {
    return (
        <Card 
            className={`relative cursor-pointer hover:shadow-md transition-shadow border-2  flex flex-col justify-between ${disabled ? 'opacity-60' : 'hover:border-primary'}`}
            onClick={disabled ? undefined : onClick}
        >
            {premiumRequired && (
                <div className="absolute top-1 right-2 z-50">
                    <Badge className="bg-green-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Для пользователей с подпиской
                    </Badge>
                </div>
            )}
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    <GamepadIcon className={cn("h-5 w-5 mr-2", colorIcon)} />
                    {gameTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {gameDescription}
                </p>
            </CardContent>
            <CardFooter>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 mr-1" />
                    <span>Сложность: {gameDifficult}</span>
                </div>
                </CardFooter>
        </Card>
    )
}