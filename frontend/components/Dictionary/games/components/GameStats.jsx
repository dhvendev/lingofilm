// GameStats.jsx - Общий компонент результатов игры
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, BarChart, BookMarked, GamepadIcon, Sparkles, RotateCcw, Check, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import GameHistoryTable from "./GameHistoryTable";

export default function GameStats({ 
    gameHistory, 
    gameScore, 
    totalWords, 
    longestStreak, 
    onBackToGames, 
    onRestartGame, 
    gameTitle
}) {
    
    // Calculate game stats
    const calculateAccuracy = () => {
        if (gameHistory.length === 0) return 0;
        const correctAnswers = gameHistory.filter(item => item.correct).length;
        return Math.round((correctAnswers / gameHistory.length) * 100);
    };
    
    // Custom rendering for table cells based on header
    const renderTableCell = (item, header) => {
        switch (header) {
            case 'Result':
                return item.correct ? (
                    <Check className="h-5 w-5 text-green-600" />
                ) : (
                    <X className="h-5 w-5 text-red-600" />
                );
            case 'English Word':
                return <span className="font-medium">{item.word.english_word}</span>;
            case 'Translation':
                return <span className="font-medium">{item.word.russian_translation}</span>;
            case 'Your Answer':
                return item.userAnswer;
            case 'Correct Answer':
                // For GuessWordGame - show English word if wrong
                if (header === 'Correct Answer' && item.word.english_word && !item.correct) {
                    return <strong>{item.word.english_word}</strong>;
                }
                // For TranslateWordGame and MultipleChoiceGame - show Russian translation if wrong
                if (header === 'Correct Answer' && !item.correct) {
                    return <strong>{item.word.russian_translation}</strong>;
                }
                return null;
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Результаты игры
                        </CardTitle>
                        <Badge 
                            className={calculateAccuracy() >= 70 ? "bg-green-600" : calculateAccuracy() >= 40 ? "bg-yellow-500" : "bg-red-500"}
                        >
                            {calculateAccuracy()}% Точность
                        </Badge>
                    </div>
                    <CardDescription>
                        {gameTitle} - {gameScore}/{totalWords} правильных
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Game stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center">
                                        <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                                        Счет
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{gameScore}/{totalWords}</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center">
                                        <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                                        Самая длинная серия
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{longestStreak}</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2 text-green-500" />
                                        Слов выучено
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {gameHistory.filter(item => item.correct && !item.wasAlreadyLearned).length}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Game history */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <BookMarked className="h-4 w-4 mr-2" />
                                Обзор ответов
                            </h3>
                            <div className="rounded-md border overflow-hidden">
                                <GameHistoryTable gameHistory={gameHistory}/>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={onBackToGames}>
                        <GamepadIcon className="h-4 w-4 mr-2" />
                        Выбрать другую игру
                    </Button>
                    <Button onClick={onRestartGame} className="bg-primary">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Играть снова
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}