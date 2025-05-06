"use client"

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Check, 
    X, 
    ChevronRight, 
    RotateCcw,
    Trophy,
    BarChart,
    BookMarked,
    GamepadIcon,
    Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function MultipleChoiceGame({ vocabulary, updateWordStatus, onBackToGames }) {
    const [gameWords, setGameWords] = useState([]);
    const [gameIndex, setGameIndex] = useState(0);
    const [currentGameWord, setCurrentGameWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameScore, setGameScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);
    const [showStats, setShowStats] = useState(false);
    const [gameInitialized, setGameInitialized] = useState(false);
    
    // Initialize game
    useEffect(() => {
        // Only initialize game if not already initialized
        if (!gameInitialized && vocabulary.length >= 4) {
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
                generateOptions(shuffled[0], vocabulary);
                setSelectedOption(null);
                setIsCorrect(null);
                setGameScore(0);
                setStreak(0);
                setGameHistory([]);
                setShowStats(false);
                setGameInitialized(true);
            } else {
                toast.error("Not enough words for the game. Add at least 4 words to your dictionary.");
                onBackToGames();
            }
        } else if (!gameInitialized && vocabulary.length < 4) {
            toast.error("Not enough words for the game. Add at least 4 words to your dictionary.");
            onBackToGames();
        }
    }, [vocabulary, onBackToGames, gameInitialized]);

    // Generate 4 options for multiple choice
    const generateOptions = (correctWord, allWords) => {
        const allTranslations = allWords.map(word => word.russian_translation);
        const correctTranslation = correctWord.russian_translation;
        
        // Get random translations excluding the correct one
        const wrongTranslations = allTranslations
            .filter(translation => translation !== correctTranslation)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        // Combine and shuffle all options
        const allOptions = [correctTranslation, ...wrongTranslations];
        const shuffledOptions = shuffleArray(allOptions);
        
        setOptions(shuffledOptions);
    };

    const handleOptionSelect = async (option) => {
        if (selectedOption !== null) return; // Already selected
        
        setSelectedOption(option);
        const answerIsCorrect = option === currentGameWord.russian_translation;
        setIsCorrect(answerIsCorrect);
        
        setGameHistory([...gameHistory, { 
            word: currentGameWord, 
            userAnswer: option,
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
            generateOptions(gameWords[gameIndex + 1], vocabulary);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            // Game is completed - show stats
            setShowStats(true);
        }
    };

    // Restart game
    const restartGame = () => {
        const unlearned = vocabulary.filter(item => !item.is_learned);
        const wordsForGame = unlearned.length >= 10 
            ? unlearned.slice(0, 10) 
            : [...unlearned, ...vocabulary.filter(item => item.is_learned).slice(0, 10 - unlearned.length)];
        
        if (wordsForGame.length > 0) {
            const shuffled = shuffleArray(wordsForGame);
            setGameWords(shuffled);
            setGameIndex(0);
            setCurrentGameWord(shuffled[0]);
            generateOptions(shuffled[0], vocabulary);
            setSelectedOption(null);
            setIsCorrect(null);
            setGameScore(0);
            setStreak(0);
            setGameHistory([]);
            setShowStats(false);
            setGameInitialized(true);
        }
    };

    // Calculate game stats
    const calculateAccuracy = () => {
        if (gameHistory.length === 0) return 0;
        const correctAnswers = gameHistory.filter(item => item.correct).length;
        return Math.round((correctAnswers / gameHistory.length) * 100);
    };

    if (showStats) {
        return (
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
                            Multiple Choice Game - {gameScore}/{gameWords.length} correct
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
                                                    English Word
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
                                                        {item.word.english_word}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {item.userAnswer}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {item.word.russian_translation}
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
                            onClick={onBackToGames}
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
        );
    }

    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Multiple Choice
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
                                <p className="text-sm text-muted-foreground mb-2">Choose the correct translation:</p>
                                <p className="font-bold text-3xl mb-2 text-primary">
                                    {currentGameWord.english_word}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {options.map((option, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedOption === option ? (
                                            option === currentGameWord.russian_translation ? "default" : "destructive"
                                        ) : "outline"}
                                        className={`h-auto py-4 text-lg justify-center relative ${
                                            selectedOption !== null && option === currentGameWord.russian_translation && selectedOption !== option
                                                ? "border-green-500 bg-green-500/10 hover:bg-green-500/20"
                                                : ""
                                        }`}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={selectedOption !== null}
                                    >
                                        {option}
                                        {selectedOption !== null && option === currentGameWord.russian_translation && (
                                            <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                                        )}
                                        {selectedOption === option && option !== currentGameWord.russian_translation && (
                                            <X className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-600" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                            
                            {selectedOption !== null && (
                                <div className={`p-4 rounded-md ${
                                    isCorrect 
                                        ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                                        : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                    }`}
                                >
                                    <div className="flex items-center justify-center">
                                        {isCorrect ? (
                                            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                        ) : (
                                            <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                                        )}
                                        <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                            {isCorrect ? "Correct!" : "Incorrect!"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button 
                        variant="outline" 
                        onClick={onBackToGames}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Quit Game
                    </Button>
                    {selectedOption !== null && (
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
    );
}