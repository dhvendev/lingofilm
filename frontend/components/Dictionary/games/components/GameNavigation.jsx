import { X, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

export function GameNavigation({ 
    isAnswered, 
    onBackToGames, 
    onNextWord, 
    isLastWord, 
}) {
    return (
        <CardFooter className="flex justify-between">
            <Button 
                variant="outline" 
                onClick={onBackToGames}
            >
                <X className="h-4 w-4 mr-2" />
                Выйти из игры
            </Button>
            {isAnswered && (
                <Button 
                    onClick={onNextWord}
                    className="bg-primary"
                >
                    {!isLastWord ? (
                        <>
                            Следующее слово
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                    ) : (
                        <>
                            Показать результат
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            )}
        </CardFooter>
    );
}