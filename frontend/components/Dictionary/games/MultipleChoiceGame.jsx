"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Check, 
    X, 
    ChevronRight, 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { GameSetup, GameStats, initializeGameWords } from './index';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function MultipleChoiceGame({ vocabulary, updateWordStatus, onBackToGames }) {
    // Game setup states
    const [gameSetup, setGameSetup] = useState(true);
    const [gameMode, setGameMode] = useState(null);
    const [wordCount, setWordCount] = useState(null);
    
    // Game states
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
    
    // Initialize game with selected settings
    const startGame = (mode, count) => {
        if (!mode || !count) {
            toast.error("Not enough words for the game. Add at least 4 words to your dictionary.");
            onBackToGames();
            return;
        }
        
        const selectedWords = initializeGameWords(vocabulary, mode, count);
        
        if (selectedWords.length > 0) {
            setGameWords(selectedWords);
            setGameIndex(0);
            setCurrentGameWord(selectedWords[0]);
            generateOptions(selectedWords[0], vocabulary);
            setSelectedOption(null);
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
            correct: answerIsCorrect,
            wasAlreadyLearned: currentGameWord.is_learned
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
        setOptions([]);
        setSelectedOption(null);
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
                gameTitle="Разнообразный выбор"
                minWordsForGame={4}
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
                gameTitle="Разнообразный выбор"
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
                            Multiple Choice
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {gameIndex + 1} / {gameWords.length}
                            </Badge>
                            {streak > 2 && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                                    {streak} подряд!
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