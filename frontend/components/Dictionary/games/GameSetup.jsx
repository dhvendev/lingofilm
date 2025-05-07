// GameSetup2.jsx - Улучшенный компонент настроек игры
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, RotateCcw, GamepadIcon, ArrowLeft, ChevronRight, Info, AlertCircle, BookOpen, Target } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { GAME_MODES } from "./gameUtils";


export default function GameSetupComponent({ vocabulary, onBackToGames, onStartGame, gameTitle, minCountWord = 1 }) {
    const [gameMode, setGameMode] = useState(GAME_MODES.LEARN);
    const [wordCount, setWordCount] = useState(minCountWord);

    // Мемоизация подсчета доступных слов для оптимизации
    const wordStats = useMemo(() => {
        const learnCount = vocabulary.filter(item => !item.is_learned).length;
        const reviewCount = vocabulary.filter(item => item.is_learned).length;
        const totalCount = vocabulary.length;
        
        return {
            [GAME_MODES.LEARN]: learnCount,
            [GAME_MODES.REVIEW]: reviewCount,
            [GAME_MODES.MIXED]: totalCount,
            [GAME_MODES.PROGRESSIVE]: totalCount,
        };
    }, [vocabulary]);

    const availableWordsCount = wordStats[gameMode];
    const maxWordCount = availableWordsCount;

    // Автоматическая установка количества слов при изменении режима
    useEffect(() => {
        const newAvailableCount = wordStats[gameMode];
        
        if (wordCount > newAvailableCount || wordCount === 0) {
            const defaultCount = Math.min(minCountWord, newAvailableCount);
            setWordCount(defaultCount);
        }
    }, [gameMode, wordStats]);

    // Проверка достаточности слов для выбранного режима
    const hasEnoughWords = useMemo(() => {
        return availableWordsCount >= wordCount && wordCount >= minCountWord;
    }, [availableWordsCount, wordCount, minCountWord]);

    // Подтверждение запуска игры
    const handleStartGame = () => {
        if (!hasEnoughWords) {
            toast.error(`Недостаточно слов для выбранного режима. Доступно: ${availableWordsCount}`);
            return;
        }

        const gameSettings = {
            mode: gameMode,
            wordCount: wordCount,
        };

        onStartGame(gameSettings);
        toast.success(`Игра "${gameTitle}" началась с ${wordCount} словами!`);
    };

    // Получение информации о режиме игры
    const getModeInfo = (mode) => {
        switch (mode) {
            case GAME_MODES.LEARN:
                return {
                    icon: <Sparkles className="h-4 w-4 text-green-500" />,
                    label: "Учить новые слова",
                    description: "Изучайте неизученные слова",
                    color: "text-green-700 dark:text-green-400"
                };
            case GAME_MODES.REVIEW:
                return {
                    icon: <RotateCcw className="h-4 w-4 text-blue-500" />,
                    label: "Повторить пройденное",
                    description: "Закрепите выученные слова",
                    color: "text-blue-700 dark:text-blue-400"
                };
            case GAME_MODES.MIXED:
                return {
                    icon: <GamepadIcon className="h-4 w-4 text-purple-500" />,
                    label: "Смешанный режим",
                    description: "Все слова вперемешку",
                    color: "text-purple-700 dark:text-purple-400"
                };
            case GAME_MODES.PROGRESSIVE:
                return {
                    icon: <Target className="h-4 w-4 text-orange-500" />,
                    label: "Прогрессивный режим",
                    description: "Новые слова с повторением",
                    color: "text-orange-700 dark:text-orange-400"
                };
        }
    };

    return (
        <div className="space-y-4 mt-4">
            <Card className="border-none">
                <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-3">
                        <Settings className="h-6 w-6 text-primary" />
                        <span>{gameTitle} - Настройки игры</span>
                    </CardTitle>
                    <CardDescription className="text-base">Настройте параметры игры под свои предпочтения</CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Статистика словаря */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="bg-green-50 dark:bg-green-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Новые слова</p>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                            {wordStats[GAME_MODES.LEARN]}
                                        </p>
                                    </div>
                                    <BookOpen className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-blue-50 dark:bg-blue-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Выученные</p>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                            {wordStats[GAME_MODES.REVIEW]}
                                        </p>
                                    </div>
                                    <RotateCcw className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-purple-50 dark:bg-purple-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Всего слов</p>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                            {wordStats[GAME_MODES.MIXED]}
                                        </p>
                                    </div>
                                    <GamepadIcon className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Выбор режима игры */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-lg font-semibold">Игровой режим</Label>
                            <Badge variant="outline" className="text-xs">Шаг 1</Badge>
                        </div>
                        
                        <RadioGroup value={gameMode} onValueChange={setGameMode} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.values(GAME_MODES).map(mode => {
                                const info = getModeInfo(mode);
                                const isDisabled = wordStats[mode] < minCountWord;
                                
                                return (
                                    <div key={mode} className="relative">
                                        <label
                                            htmlFor={mode}
                                            className={`block cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Card className={`p-4 transition-all ${gameMode === mode ? 'border-primary bg-primary/5' : 'hover:border-primary/50'} ${isDisabled ? 'border-muted' : ''}`}>
                                                <div className="flex items-start space-x-3">
                                                    <RadioGroupItem value={mode} id={mode} disabled={isDisabled} className="mt-1" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {info.icon}
                                                            <h3 className="font-semibold">{info.label}</h3>
                                                            <Badge variant="secondary">
                                                                {wordStats[mode]} слов
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{info.description}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* Количество слов */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label className="text-lg font-semibold">Количество слов</Label>
                                <Badge variant="outline" className="text-xs">Шаг 2</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                Доступно: <span className="font-medium">{availableWordsCount}</span>
                            </span>
                        </div>

                        <div className="px-4">
                            <Slider
                                value={[wordCount]}
                                onValueChange={(value) => setWordCount(value[0])}
                                max={maxWordCount}
                                min={minCountWord}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{minCountWord} слов</span>
                            <div className="text-center">
                                <span className="text-2xl font-bold text-primary">{wordCount}</span>
                                <span className="text-muted-foreground ml-1">
                                    {wordCount === 1 ? 'слово' : wordCount > 1 && wordCount < 5 ? 'слова' : 'слов'}
                                </span>
                            </div>
                            <span className="text-muted-foreground">{maxWordCount} слов</span>
                        </div>
                    </div>


                    {wordCount < minCountWord && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                Минимальное количество слов для игры: {minCountWord}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between pt-6">
                    <Button 
                        variant="outline" 
                        onClick={onBackToGames}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Обратно к играм
                    </Button>
                    
                    <Button 
                        onClick={handleStartGame}
                        disabled={!hasEnoughWords}
                        className= "bg-primary flex items-center gap-2"
                    >
                        <span>Начать игру</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Инфо панель */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold mb-1">Советы для эффективного обучения</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Начните с 10-15 слов, чтобы не перегружаться</li>
                                <li>• Используйте режим "Учить" для новых слов</li>
                                <li>• Регулярно повторяйте выученные слова</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}