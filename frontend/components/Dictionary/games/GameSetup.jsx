// GameSetup.jsx - Общий компонент настроек игры
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, RotateCcw, GamepadIcon, ArrowLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const GAME_MODES = {
    LEARN: 'learn',    // Учить (не изученные)
    REVIEW: 'review',  // Повторять (изученные)
    MIXED: 'mixed'     // В перемешку
};

const WORD_COUNTS = [10, 20, 30, 40, 50];

export default function GameSetup({ vocabulary, onBackToGames, onStartGame, gameTitle, minWordsForGame = 1 }) {
    const [gameMode, setGameMode] = useState(GAME_MODES.LEARN);
    const [wordCount, setWordCount] = useState(10);
    
    // Check if we have enough words for the selected mode and count
    const checkAvailableWords = () => {
        let availableWords = 0;
        switch (gameMode) {
            case GAME_MODES.LEARN:
                availableWords = vocabulary.filter(item => !item.is_learned).length;
                break;
            case GAME_MODES.REVIEW:
                availableWords = vocabulary.filter(item => item.is_learned).length;
                break;
            case GAME_MODES.MIXED:
                availableWords = vocabulary.length;
                break;
        }
        return availableWords >= Math.max(wordCount, minWordsForGame);
    };
    
    const availableWordsCount = gameMode === GAME_MODES.LEARN 
        ? vocabulary.filter(item => !item.is_learned).length
        : gameMode === GAME_MODES.REVIEW
            ? vocabulary.filter(item => item.is_learned).length
            : vocabulary.length;
    
    const handleStartGame = () => {
        if (!checkAvailableWords()) {
            toast.error(`Недостаточно слов для выбранного режима. Доступно: ${availableWordsCount}`);
            return;
        }
        onStartGame(gameMode, wordCount);
    };
    
    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        {gameTitle} - Игровые настройки
                    </CardTitle>
                    <CardDescription>
                        Настрой свою игру перед стартом
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Game Mode Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Игровой режим</Label>
                        <RadioGroup value={gameMode} onValueChange={setGameMode}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={GAME_MODES.LEARN} id="learn" />
                                <Label htmlFor="learn" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-green-500" />
                                        Учить (невыученные слова)
                                        <Badge variant="secondary">
                                            {vocabulary.filter(item => !item.is_learned).length} слов
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={GAME_MODES.REVIEW} id="review" />
                                <Label htmlFor="review" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw className="h-4 w-4 text-blue-500" />
                                        Повторить (выученные слова)
                                        <Badge variant="secondary">
                                            {vocabulary.filter(item => item.is_learned).length} words
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={GAME_MODES.MIXED} id="mixed" />
                                <Label htmlFor="mixed" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <GamepadIcon className="h-4 w-4 text-purple-500" />
                                        Вперемешку
                                        <Badge variant="secondary">
                                            {vocabulary.length} слов
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    {/* Word Count Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-base font-semibold">Выбери количество слов</Label>
                            <span className="text-sm text-muted-foreground">
                                Доступно: {availableWordsCount}
                            </span>
                        </div>
                        <Select value={wordCount.toString()} onValueChange={(value) => setWordCount(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select word count" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORD_COUNTS.map(count => (
                                    <SelectItem 
                                        key={count} 
                                        value={count.toString()}
                                        disabled={count > availableWordsCount}
                                    >
                                        {count} слов
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Warning if not enough words */}
                    {!checkAvailableWords() && (
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ⚠️ Для выбранного режима недостаточно доступных слов. Требуется {wordCount}. Доступно: {availableWordsCount} слов
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button 
                        variant="outline" 
                        onClick={onBackToGames}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Вернуться к играм
                    </Button>
                    <Button 
                        onClick={handleStartGame}
                        disabled={!checkAvailableWords()}
                        className="bg-primary"
                    >
                        Начать игру
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}