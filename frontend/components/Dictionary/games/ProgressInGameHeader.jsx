import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function ProgressInGameHeader({gameTitle, gameWords, gameIndex, gameScore, streak}) {
    return (
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>
                    {gameTitle}
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {gameIndex + 1} / {gameWords.length}
                    </Badge>
                    {streak > 2 && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                            {streak} подряд!
                        </Badge>
                    )}
                </div>
            </div>
            <CardDescription>
                <div className="mt-2">
                    <Progress value={(gameIndex / gameWords.length) * 100} className="h-2" />
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <span>Текущий счет: {gameScore}</span>
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {gameIndex > 0 
                            ? Math.round((gameIndex ) / gameWords.length * 100) 
                            : 0}%
                    </span>
                </div>
            </CardDescription>
        </CardHeader>
    )
}