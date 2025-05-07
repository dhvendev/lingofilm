"use client"

import { useState} from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { GamepadIcon } from 'lucide-react';

import TranslateWordGame from "./games/TranslateWordGame";
import GuessWordGame from "./games/GuessWordGame";
import MultipleChoiceGame from "./games/MultipleChoiceGame";
import CardGame from "./CardGame";

export default function DictionaryGamesView({ vocabulary, updateWordStatus }) {
    const [gameMode, setGameMode] = useState(""); // "translate", "guessWord", "multipleChoice"
    // TODO В дальнейшем можно переделать вывод карточек в массив и вывести через map

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
                                <CardGame
                                    gameTitle={"Перевод слова"}
                                    gameDifficult={"Средняя"} 
                                    gameDescription={"Вы увидите слово. Справитесь с переводом?"}
                                    onClick={() => setGameMode("translate")}
                                    colorIcon={"text-purple-600"}
                                />
                                <CardGame
                                    gameTitle={"Угадай слово"}
                                    gameDifficult={"Высокая"} 
                                    gameDescription={"Вы увидите перевод слов. Укажите оригинальное английское слово."}
                                    onClick={() => setGameMode("guessWord")}
                                    colorIcon={"text-blue-600"}
                                />
                                <CardGame
                                    gameTitle={"Разнообразный выбор"}
                                    gameDifficult={"Легкая"} 
                                    gameDescription={"Выберите правильный перевод из 4 вариантов."}
                                    onClick={() => setGameMode("multipleChoice")}
                                    colorIcon={"text-green-600"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : gameMode === "translate" ? (
                <TranslateWordGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                    gameTitle={'Перевод слова'}
                    minCountWord={1}
                />
            ) : gameMode === "guessWord" ? (
                <GuessWordGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                    gameTitle={'Угадай слово'}
                    minCountWord={1}
                />
            ) : gameMode === "multipleChoice" ? (
                <MultipleChoiceGame
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    onBackToGames={() => setGameMode("")}
                    gameTitle={'Разнообразный выбор'}
                    minCountWord={4}
                />
            ) : null}
        </TabsContent>
    );
}