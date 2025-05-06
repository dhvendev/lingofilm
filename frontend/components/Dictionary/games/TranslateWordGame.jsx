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
    Sparkles,
    Settings,
    ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const GAME_MODES = {
    LEARN: 'learn',    // Учить (не изученные)
    REVIEW: 'review',  // Повторять (изученные)
    MIXED: 'mixed'     // В перемешку
};

const WORD_COUNTS = [10, 20, 30, 40, 50];

export default function TranslateWordGame({ vocabulary, updateWordStatus, onBackToGames }) {
    // Game setup states
    const [gameSetup, setGameSetup] = useState(true);
    const [gameMode, setGameMode] = useState(GAME_MODES.LEARN);
    const [wordCount, setWordCount] = useState(10);
    
    // Game states
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
        return availableWords >= wordCount;
    };
    
    // Initialize game with selected settings
    const startGame = () => {
        if (!checkAvailableWords()) {
            const availableWords = gameMode === GAME_MODES.LEARN 
                ? vocabulary.filter(item => !item.is_learned).length
                : gameMode === GAME_MODES.REVIEW
                    ? vocabulary.filter(item => item.is_learned).length
                    : vocabulary.length;
            
            toast.error(`Not enough words for this mode. Available: ${availableWords}`);
            return;
        }
        
        let selectedWords = [];
        
        switch (gameMode) {
            case GAME_MODES.LEARN:
                selectedWords = vocabulary.filter(item => !item.is_learned).slice(0, wordCount);
                break;
            case GAME_MODES.REVIEW:
                selectedWords = vocabulary.filter(item => item.is_learned).slice(0, wordCount);
                break;
            case GAME_MODES.MIXED:
                // Get half learned and half unlearned, or as close as possible
                const unlearned = vocabulary.filter(item => !item.is_learned);
                const learned = vocabulary.filter(item => item.is_learned);
                const halfCount = Math.floor(wordCount / 2);
                
                const selectedUnlearned = unlearned.slice(0, halfCount);
                const remainingCount = wordCount - selectedUnlearned.length;
                const selectedLearned = learned.slice(0, remainingCount);
                
                selectedWords = [...selectedUnlearned, ...selectedLearned];
                break;
        }
        
        if (selectedWords.length > 0) {
            const shuffled = shuffleArray(selectedWords);
            setGameWords(shuffled);
            setGameIndex(0);
            setCurrentGameWord(shuffled[0]);
            setUserAnswer("");
            setIsCorrect(null);
            setGameScore(0);
            setStreak(0);
            setGameHistory([]);
            setShowStats(false);
            setGameSetup(false);
        } else {
            toast.error("No words available for game.");
        }
    };

    // Handle game answer
    const handleGameAnswer = async () => {
        if (!currentGameWord || !userAnswer.trim()) return;

        const normalizedUserAnswer = userAnswer.toLowerCase().trim();
        const normalizedTranslation = currentGameWord.russian_translation.toLowerCase().trim();
        const answerIsCorrect = normalizedUserAnswer === normalizedTranslation;

        const gameItem = { 
            word: currentGameWord, 
            userAnswer: userAnswer,
            correct: answerIsCorrect,
            wasAlreadyLearned: currentGameWord.is_learned
        };

        setIsCorrect(answerIsCorrect);
        setGameHistory([...gameHistory, gameItem]);

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

    // Restart game (go back to setup)
    const restartGame = () => {
        setGameSetup(true);
        setGameScore(0);
        setStreak(0);
        setLongestStreak(0);
        setGameHistory([]);
        setShowStats(false);
        setGameIndex(0);
        setCurrentGameWord(null);
        setUserAnswer("");
        setIsCorrect(null);
    };

    // Calculate game stats
    const calculateAccuracy = () => {
        if (gameHistory.length === 0) return 0;
        const correctAnswers = gameHistory.filter(item => item.correct).length;
        return Math.round((correctAnswers / gameHistory.length) * 100);
    };

    // Game setup screen
    if (gameSetup) {
        const availableWordsCount = gameMode === GAME_MODES.LEARN 
            ? vocabulary.filter(item => !item.is_learned).length
            : gameMode === GAME_MODES.REVIEW
                ? vocabulary.filter(item => item.is_learned).length
                : vocabulary.length;
        
        return (
            <div className="space-y-4 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Game Setup
                        </CardTitle>
                        <CardDescription>
                            Configure your translation game before starting
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Game Mode Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Game Mode</Label>
                            <RadioGroup value={gameMode} onValueChange={setGameMode}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={GAME_MODES.LEARN} id="learn" />
                                    <Label htmlFor="learn" className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-green-500" />
                                            Учить (не изученные) 
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
                                            Повторять (изученные)
                                            <Badge variant="secondary">
                                                {vocabulary.filter(item => item.is_learned).length} слов
                                            </Badge>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={GAME_MODES.MIXED} id="mixed" />
                                    <Label htmlFor="mixed" className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <GamepadIcon className="h-4 w-4 text-purple-500" />
                                            В перемешку
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
                                <Label className="text-base font-semibold">Number of Words</Label>
                                <span className="text-sm text-muted-foreground">
                                    Available: {availableWordsCount}
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
                                            {count} words
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Warning if not enough words */}
                        {!checkAvailableWords() && (
                            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    ⚠️ Not enough words available for {wordCount} words in this mode.
                                    Available: {availableWordsCount} words
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
                            Back to Games
                        </Button>
                        <Button 
                            onClick={startGame}
                            disabled={!checkAvailableWords()}
                            className="bg-primary"
                        >
                            Start Game
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Game stats screen
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
                            Word Translation Game - {gameScore}/{gameWords.length} correct
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
                                            {gameHistory.filter(item => item.correct && !item.wasAlreadyLearned).length}
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

    // Game playing screen
    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Translate Word
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
                                    {currentGameWord.english_word}
                                </p>
                            </div>
                            
                            <div>
                                <Label htmlFor="answer" className="text-base">
                                    Enter translation:
                                </Label>
                                <div className="flex mt-2">
                                    <Input 
                                        id="answer"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Translation..."
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
                                                Correct answer: <strong>{currentGameWord.russian_translation}</strong>
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
                        onClick={onBackToGames}
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
    );
}