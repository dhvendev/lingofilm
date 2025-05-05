import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent,  CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, Film, Calendar, GraduationCap, GamepadIcon, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function GamesView({vocabulary, updateWordStatus}) {
    const [gameMode, setGameMode] = useState(""); // "translate", "guessWord"
        const [gameWords, setGameWords] = useState([]);
        const [gameIndex, setGameIndex] = useState(0);
        const [currentGameWord, setCurrentGameWord] = useState(null);
        const [userAnswer, setUserAnswer] = useState("");
        const [isCorrect, setIsCorrect] = useState(null);
        const [gameScore, setGameScore] = useState(0);
    // Инициализация игры при смене режима
    useEffect(() => {
        if (gameMode && vocabulary.length > 0) {
            // Выбираем слова для игры (предпочтительно неизученные)
            const unlearned = vocabulary.filter(item => !item.is_learned);
            const wordsForGame = unlearned.length >= 10 
            ? unlearned.slice(0, 10) 
            : [...unlearned, ...vocabulary.filter(item => item.is_learned).slice(0, 10 - unlearned.length)];
            
            if (wordsForGame.length > 0) {
            const shuffled = shuffleArray(wordsForGame);
            setGameWords(shuffled);
            setGameIndex(0);
            setCurrentGameWord(shuffled[0]);
            setUserAnswer("");
            setIsCorrect(null);
            setGameScore(0);
            } else {
            toast.error("Недостаточно слов для игры. Добавьте хотя бы одно слово в словарь.");
            setGameMode("");
            }
        }
    }, [gameMode, vocabulary]);

    // Обработка ответа в игре
    const handleGameAnswer = async () => {
    if (!currentGameWord || !userAnswer.trim()) return;

    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    let answerIsCorrect = false;

    if (gameMode === "translate") {
        // Сравнение с русским переводом
        const normalizedTranslation = currentGameWord.russian_translation.toLowerCase().trim();
        answerIsCorrect = normalizedUserAnswer === normalizedTranslation;
    } else if (gameMode === "guessWord") {
        // Сравнение с английским словом
        const normalizedWord = currentGameWord.english_word.toLowerCase().trim();
        answerIsCorrect = normalizedUserAnswer === normalizedWord;
    }

    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
        setGameScore(gameScore + 1);
        
        // Если ответ верный и слово не отмечено как изученное, отмечаем его
        if (!currentGameWord.is_learned) {
        try {
            await updateWordStatus(currentGameWord.id, true);
        } catch (error) {
            console.error("Ошибка при обновлении статуса слова:", error);
        }
        }
    }

    // Переход к следующему слову после задержки
    setTimeout(() => {
        if (gameIndex < gameWords.length - 1) {
        setGameIndex(gameIndex + 1);
        setCurrentGameWord(gameWords[gameIndex + 1]);
        setUserAnswer("");
        setIsCorrect(null);
        } else {
        // Игра завершена
        toast.success(`Игра завершена! Ваш результат: ${gameScore + (answerIsCorrect ? 1 : 0)}/${gameWords.length}`);
        setGameMode("");
        }
    }, 1500);
    };

    // Обработка нажатия Enter в игре
    const handleKeyDown = (e) => {
    if (e.key === "Enter" && userAnswer.trim() && isCorrect === null) {
        handleGameAnswer();
    }
    };

    // Обработка добавления слова из попапа
    const handleAddWord = async (word) => {
    await addWord(word);
    };
    return (
        <TabsContent value="games">
                {gameMode === "" ? (
                <div className="space-y-4 mt-4">
                    <Card>
                    <CardHeader>
                        <CardTitle>Игры для заучивания слов</CardTitle>
                        <CardDescription>
                        Выберите игру, чтобы закрепить изученные слова
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card 
                            className="cursor-pointer hover:shadow-md transition-shadow" 
                            onClick={() => {
                            if (vocabulary.length > 0) {
                                setGameMode("translate");
                            } else {
                                toast.error("Добавьте слова в словарь, чтобы начать игру");
                            }
                            }}
                        >
                            <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                                <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                                Переведи слово
                            </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Вам будет показано слово на английском. Необходимо указать его перевод.
                            </p>
                            </CardContent>
                        </Card>
                        
                        <Card 
                            className="cursor-pointer hover:shadow-md transition-shadow" 
                            onClick={() => {
                            if (vocabulary.length > 0) {
                                setGameMode("guessWord");
                            } else {
                                toast.error("Добавьте слова в словарь, чтобы начать игру");
                            }
                            }}
                        >
                            <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                                <GamepadIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Угадай слово
                            </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Вам будет показан перевод. Необходимо указать слово на английском.
                            </p>
                            </CardContent>
                        </Card>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                ) : (
                <div className="space-y-4 mt-4">
                    <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                        <CardTitle>
                            {gameMode === "translate" ? "Переведи слово" : "Угадай слово"}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                            {gameIndex + 1} / {gameWords.length}
                            </span>
                        </div>
                        </div>
                        <CardDescription>
                        <div className="flex items-center mt-1">
                            <span>Счет: {gameScore}</span>
                            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {gameIndex > 0 
                                ? Math.round(gameScore / (gameIndex) * 100) 
                                : 0}%
                            </span>
                        </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentGameWord && (
                        <div className="space-y-6">
                            <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800 text-center">
                            <p className="font-bold text-2xl mb-4">
                                {gameMode === "translate" 
                                ? currentGameWord.english_word 
                                : currentGameWord.russian_translation}
                            </p>
                            </div>
                            
                            <div>
                            <Label htmlFor="answer">
                                {gameMode === "translate" 
                                ? "Введите перевод:" 
                                : "Введите слово на английском:"}
                            </Label>
                            <div className="flex mt-2">
                                <Input 
                                id="answer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder={gameMode === "translate" ? "Перевод..." : "Слово..."}
                                className={isCorrect === null ? "" : isCorrect ? "border-green-500" : "border-red-500"}
                                disabled={isCorrect !== null}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                />
                                <Button 
                                className="ml-2" 
                                onClick={handleGameAnswer}
                                disabled={!userAnswer.trim() || isCorrect !== null}
                                >
                                Проверить
                                </Button>
                            </div>
                            
                            {isCorrect !== null && (
                                <div className={`mt-4 p-3 rounded-md ${isCorrect ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                                <div className="flex items-center">
                                    {isCorrect ? (
                                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                    ) : (
                                    <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                                    )}
                                    <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                    {isCorrect ? "Правильно!" : "Неправильно!"}
                                    </span>
                                </div>
                                {!isCorrect && (
                                    <p className="mt-1 text-sm">
                                    Правильный ответ: <strong>{gameMode === "translate" ? currentGameWord.russian_translation : currentGameWord.english_word}</strong>
                                    </p>
                                )}
                                </div>
                            )}
                            </div>
                        </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button 
                        variant="outline" 
                        onClick={() => setGameMode("")}
                        >
                        <X className="h-4 w-4 mr-2" />
                        Завершить игру
                        </Button>
                        {isCorrect !== null && gameIndex < gameWords.length - 1 && (
                        <Button 
                            onClick={() => {
                            setGameIndex(gameIndex + 1);
                            setCurrentGameWord(gameWords[gameIndex + 1]);
                            setUserAnswer("");
                            setIsCorrect(null);
                            }}
                        >
                            Следующее слово
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                        )}
                    </CardFooter>
                    </Card>
                </div>
                )}
            </TabsContent>
    )
}