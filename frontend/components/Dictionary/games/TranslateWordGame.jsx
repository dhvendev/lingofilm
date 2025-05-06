"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Check, 
    X, 
    ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { GameSetup, GameStats, initializeGameWords } from './index';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function TranslateWordGame({ vocabulary, updateWordStatus, onBackToGames, gameTitle }) {
    // Game setup states
    const [gameSetup, setGameSetup] = useState(true);
    const [gameMode, setGameMode] = useState(null);
    const [wordCount, setWordCount] = useState(null);
    
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
    
    // Initialize game with selected settings
    const startGame = (mode, count) => {
        if (!mode || !count) {
            toast.error("Not enough words for the game. Add at least one word to your dictionary.");
            onBackToGames();
            return;
        }
        
        const selectedWords = initializeGameWords(vocabulary, mode, count);
        
        if (selectedWords.length > 0) {
            setGameWords(selectedWords);
            setGameIndex(0);
            setCurrentGameWord(selectedWords[0]);
            setUserAnswer("");
            setIsCorrect(null);
            setGameScore(0);
            setStreak(0);
            setGameHistory([]);
            setShowStats(false);
            setGameSetup(false);
            setGameMode(mode);
            setWordCount(count);
        } else {
            toast.error("No words available for game.");
            onBackToGames();
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
        setGameMode(null);
        setWordCount(null);
    };

    // Game setup screen
    if (gameSetup) {
        return (
            <GameSetup
                vocabulary={vocabulary}
                onBackToGames={onBackToGames}
                onStartGame={startGame}
                gameTitle={gameTitle}
                minWordsForGame={1}
            />
        );
    }

    // Game stats screen
    if (showStats) {
        const tableHeaders = ['English Word', 'Your Answer', 'Correct Answer', 'Result'];
        
        return (
            <GameStats
                gameHistory={gameHistory}
                gameScore={gameScore}
                totalWords={gameWords.length}
                longestStreak={longestStreak}
                onBackToGames={onBackToGames}
                onRestartGame={restartGame}
                gameTitle={gameTitle}
                tableHeaders={tableHeaders}
            />
        );
    }

    // Game playing screen
    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {gameTitle}
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
                                    ? Math.round(gameScore / (gameIndex + 1) * 100) 
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