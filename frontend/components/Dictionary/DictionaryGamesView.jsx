"use client"

import { useState} from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
    GraduationCap, 
    GamepadIcon, 
    Brain,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

import TranslateWordGame from "./games/TranslateWordGame";
import GuessWordGame from "./games/GuessWordGame";
import MultipleChoiceGame from "./games/MultipleChoiceGame";

export default function DictionaryGamesView({ vocabulary, updateWordStatus }) {
    const [gameMode, setGameMode] = useState(""); // "translate", "guessWord", "multipleChoice"

    return (
        <TabsContent value="games">
            {gameMode === "" ? (
                // Экран выбора игр
                <div className="space-y-4 mt-4">
                    <Card className="border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GamepadIcon className="h-5 w-5 text-primary" />
                                Обучающие игры
                            </CardTitle>
                            <CardDescription>
                                Выбери игру и практикуй свои слова
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {/* Игра: перевод слова */}
                                <Card 
                                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                                    onClick={() => {
                                        if (vocabulary.length > 0) {
                                            setGameMode("translate");
                                        } else {
                                            toast.error("Для игры требуется минимум 1 добавленное слово");
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                                            Перевод слова
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Вы увидите слово. Справитесь с переводом?
                                        </p>
                                    </CardContent>
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Brain className="h-4 w-4 mr-1" />
                                            <span>Сложность: Средняя</span>
                                        </div>
                                    </div>
                                </Card>
                                
                                {/* Игра: Угадай слово */}
                                <Card 
                                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                                    onClick={() => {
                                        if (vocabulary.length > 0) {
                                            setGameMode("guessWord");
                                        } else {
                                            toast.error("Для игры требуется минимум 1 добавленное слово");
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
                                            Вы увидите перевод слов. Укажите оригинальное английское слово.
                                        </p>
                                    </CardContent>
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Brain className="h-4 w-4 mr-1" />
                                            <span>СЛожность: Высокая</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Игра: разнообразный выбор */}
                                <Card 
                                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                                    onClick={() => {
                                        if (vocabulary.length >= 4) {
                                            setGameMode("multipleChoice");
                                        } else {
                                            toast.error("Для игры вам требуется иметь более 4 слов в словаре!");
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                                            Разнообразный выбор
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Выберите правильный перевод из 4 вариантов.
                                        </p>
                                    </CardContent>
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Brain className="h-4 w-4 mr-1" />
                                            <span>Сложность: Легкая</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : gameMode === "translate" ? (
                <TranslateWordGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                />
            ) : gameMode === "guessWord" ? (
                <GuessWordGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                />
            ) : gameMode === "multipleChoice" ? (
                <MultipleChoiceGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                />
            ) : null}
        </TabsContent>
    );
}