"use client"

import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    GraduationCap, 
    GamepadIcon, 
    Check, 
    X, 
    ChevronRight, 
    ChevronLeft,
    RotateCcw,
    Brain,
    Sparkles,
    Trophy,
    BarChart,
    BookMarked
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function DictionaryGamesView({ vocabulary, updateWordStatus }) {
    const [gameMode, setGameMode] = useState(""); // "translate", "guessWord"
    const [gameWords, setGameWords] = useState([]);
    const [gameIndex, setGameIndex] = useState(0);
    const [currentGameWord, setCurrentGameWord] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameScore, setGameScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);
    const [showStats, setShowStats] = useState(false);
    
    // Initialize game when mode changes
    useEffect(() => {
        if (gameMode && vocabulary.length > 0) {
            // Select words for game (preferably unlearned ones)
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
                setStreak(0);
                setGameHistory([]);
                setShowStats(false);
            } else {
                toast.error("Not enough words for the game. Add at least one word to your dictionary.");
                setGameMode("");
            }
        }
    }, [gameMode, vocabulary]);

    // Handle game answer
    const handleGameAnswer = async () => {
        if (!currentGameWord || !userAnswer.trim()) return;

        const normalizedUserAnswer = userAnswer.toLowerCase().trim();
        let answerIsCorrect = false;

        if (gameMode === "translate") {
            // Compare with Russian translation
            const normalizedTranslation = currentGameWord.russian_translation.toLowerCase().trim();
            answerIsCorrect = normalizedUserAnswer === normalizedTranslation;
        } else if (gameMode === "guessWord") {
            // Compare with English word
            const normalizedWord = currentGameWord.english_word.toLowerCase().trim();
            answerIsCorrect = normalizedUserAnswer === normalizedWord;
        }

        setIsCorrect(answerIsCorrect);
        setGameHistory([...gameHistory, { 
            word: currentGameWord, 
            userAnswer: userAnswer,
            correct: answerIsCorrect 
        }]);

        if (answerIsCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setLongestStreak(Math.max(longestStreak, newStreak));
            setGameScore(gameScore + 1);
            
            // If answer is correct and word is not marked as learned, mark it
            if (!currentGameWord.is_learned) {
                try {
                    await updateWordStatus(currentGameWord.id, true);
                    toast.success("Word marked as learned!");
                } catch (error) {
                    console.error("Error updating word status:", error);
                }
            }
        } else {
            // Reset streak on wrong answer
            setStreak(0);
        }
    };

    // Progress to next word or show results
    const handleNextWord = () => {
        if (gameIndex < gameWords.length - 1) {
            setGameIndex(gameIndex + 1);
            setCurrentGameWord(gameWords[gameIndex + 1]);
            setUserAnswer("");
            setIsCorrect(null);
        } else {
            // Game is completed - show stats
            setShowStats(true);
        }
    };

    // Handle Enter key in game
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (userAnswer.trim() && isCorrect === null) {
                handleGameAnswer();
            } else if (isCorrect !== null && gameIndex < gameWords.length - 1) {
                handleNextWord();
            } else if (isCorrect !== null) {
                setShowStats(true);
            }
        }
    };

    // Restart game with same mode
    const restartGame = () => {
        if (gameMode) {
            const mode = gameMode;
            setGameMode("");
            setTimeout(() => setGameMode(mode), 10);
        }
    };

    // Calculate game stats
    const calculateAccuracy = () => {
        if (gameHistory.length === 0) return 0;
        const correctAnswers = gameHistory.filter(item => item.correct).length;
        return Math.round((correctAnswers / gameHistory.length) * 100);
    };

    return (
        <TabsContent value="games">
            {gameMode === "" ? (
                // Game selection screen
                <div className="space-y-4 mt-4">
                    <Card className="border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GamepadIcon className="h-5 w-5 text-primary" />
                                Learning Games
                            </CardTitle>
                            <CardDescription>
                                Choose a game to practice your vocabulary
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Translation Game Card */}
                                <Card 
                                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                                    onClick={() => {
                                        if (vocabulary.length > 0) {
                                            setGameMode("translate");
                                        } else {
                                            toast.error("Add words to your dictionary first");
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                                            Translate Word
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            You'll see a word in English. Provide its translation.
                                        </p>
                                    </CardContent>
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Brain className="h-4 w-4 mr-1" />
                                            <span>Difficulty: Medium</span>
                                        </div>
                                    </div>
                                </Card>
                                
                                {/* Guess Word Game Card */}
                                <Card 
                                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                                    onClick={() => {
                                        if (vocabulary.length > 0) {
                                            setGameMode("guessWord");
                                        } else {
                                            toast.error("Add words to your dictionary first");
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <GamepadIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Guess Word
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            You'll see a translation. Provide the original English word.
                                        </p>
                                    </CardContent>
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Brain className="h-4 w-4 mr-1" />
                                            <span>Difficulty: Hard</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : showStats ? (
                // Game results screen
                <div className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Game Results
                                </CardTitle>
                                <Badge 
                                    className={calculateAccuracy() >= 70 ? "bg-green-600" : calculateAccuracy() >= 40 ? "bg-yellow-500" : "bg-red-500"}
                                >
                                    {calculateAccuracy()}% Accuracy
                                </Badge>
                            </div>
                            <CardDescription>
                                {gameMode === "translate" ? "Word Translation Game" : "Word Guessing Game"} - {gameScore}/{gameWords.length} correct
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
                                                Score
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">{gameScore}/{gameWords.length}</p>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="bg-muted/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm flex items-center">
                                                <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                                                Longest Streak
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
                                                Words Learned
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {gameHistory.filter(item => item.correct && !item.word.is_learned).length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                {/* Game history */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <BookMarked className="h-4 w-4 mr-2" />
                                        Answers Review
                                    </h3>
                                    <div className="rounded-md border overflow-hidden">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {gameMode === "translate" ? "English Word" : "Translation"}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Your Answer
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Correct Answer
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Result
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-card divide-y divide-border">
                                                {gameHistory.map((item, index) => (
                                                    <tr key={index} className={item.correct ? "bg-green-500/10" : "bg-red-500/10"}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {gameMode === "translate" ? item.word.english_word : item.word.russian_translation}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {item.userAnswer}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {gameMode === "translate" ? item.word.russian_translation : item.word.english_word}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {item.correct ? (
                                                                <Check className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-600" />
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button 
                                variant="outline" 
                                onClick={() => setGameMode("")}
                            >
                                <GamepadIcon className="h-4 w-4 mr-2" />
                                Choose Another Game
                            </Button>
                            <Button 
                                onClick={restartGame}
                                className="bg-primary"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Play Again
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                // Game playing screen
                <div className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>
                                    {gameMode === "translate" ? "Translate Word" : "Guess Word"}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {gameIndex + 1} / {gameWords.length}
                                    </Badge>
                                    {streak > 2 && (
                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                                            {streak} streak!
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <CardDescription>
                                <div className="mt-2">
                                    <Progress value={(gameIndex / gameWords.length) * 100} className="h-2" />
                                </div>
                                <div className="flex items-center mt-2 justify-between">
                                    <span>Score: {gameScore}</span>
                                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                        {gameIndex > 0 
                                            ? Math.round(gameScore / gameIndex * 100) 
                                            : 0}%
                                    </span>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {currentGameWord && (
                                <div className="space-y-6">
                                    <div className="border rounded-lg p-8 bg-card/50 shadow-sm text-center">
                                        <p className="font-bold text-3xl mb-2 text-primary">
                                            {gameMode === "translate" 
                                                ? currentGameWord.english_word 
                                                : currentGameWord.russian_translation}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="answer" className="text-base">
                                            {gameMode === "translate" 
                                                ? "Enter translation:" 
                                                : "Enter English word:"}
                                        </Label>
                                        <div className="flex mt-2">
                                            <Input 
                                                id="answer"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                placeholder={gameMode === "translate" ? "Translation..." : "Word..."}
                                                className={isCorrect === null 
                                                    ? "" 
                                                    : isCorrect 
                                                        ? "border-green-500 focus-visible:ring-green-500/20" 
                                                        : "border-red-500 focus-visible:ring-red-500/20"
                                                }
                                                disabled={isCorrect !== null}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                            />
                                            <Button 
                                                className="ml-2 bg-primary" 
                                                onClick={handleGameAnswer}
                                                disabled={!userAnswer.trim() || isCorrect !== null}
                                            >
                                                Check
                                            </Button>
                                        </div>
                                        
                                        {isCorrect !== null && (
                                            <div className={`mt-4 p-4 rounded-md ${
                                                isCorrect 
                                                    ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                                                    : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    {isCorrect ? (
                                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                                                    )}
                                                    <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                                        {isCorrect ? "Correct!" : "Incorrect!"}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                        Correct answer: <strong>{gameMode === "translate" ? currentGameWord.russian_translation : currentGameWord.english_word}</strong>
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
                                Quit Game
                            </Button>
                            {isCorrect !== null && (
                                <Button 
                                    onClick={handleNextWord}
                                    className="bg-primary"
                                >
                                    {gameIndex < gameWords.length - 1 ? (
                                        <>
                                            Next Word
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            See Results
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            )}
        </TabsContent>
    );
}