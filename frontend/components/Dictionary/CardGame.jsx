import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { GamepadIcon, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function CardGame({gameTitle,  gameDescription, gameDifficult, onClick, colorIcon}) {
    return (
        <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary flex flex-col justify-between"
            onClick={onClick}
        >
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