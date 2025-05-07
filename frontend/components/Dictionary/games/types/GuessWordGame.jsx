"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { GameSetup, GameStats, initializeGameWords } from '../index';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import GameSetupComponent from "../components/GameSetupComponent";
import { GameAnswerFeedback } from "../components/GameAnswerFeedback";
import { GameNavigation } from "../components/GameNavigation";
import ProgressInGameHeader from "../components/GameHeader";

export default function GuessWordGame({ vocabulary, updateWordStatus, onBackToGames, gameTitle, minCountWord}) {
    // Game setup states
    const [gameSetup, setGameSetup] = useState(true);
    const [gameSettings, setGameSettings] = useState(null);
    
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
    
    // Запуск игры
    const startGame = (settings) => {
        if (!settings) {
            toast.error("Недостаточно слов для запуска игры");
            onBackToGames();
            return;
        }
        
        const selectedWords = initializeGameWords(vocabulary, settings.mode, settings.wordCount);
        
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
            setGameSettings(settings);
        } else {
            toast.error("Недостаточно слов для запуска игры");
            onBackToGames();
        }
    };

    // Handle game answer
    const handleGameAnswer = async () => {
        if (!currentGameWord || !userAnswer.trim()) return;

        const normalizedUserAnswer = userAnswer.toLowerCase().trim();
        const normalizedWord = currentGameWord.english_word.toLowerCase().trim();
        const normalizedTranslation = currentGameWord.russian_translation.toLowerCase().trim();
        const answerIsCorrect = normalizedUserAnswer === normalizedWord;

        const gameItem = { 
            word: currentGameWord,
            questionWord: normalizedTranslation,
            userAnswer: userAnswer,
            correctWord: normalizedWord,
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

    // Game setup screen
    if (gameSetup) {
        return (
            <GameSetupComponent
                vocabulary={vocabulary}
                onBackToGames={onBackToGames}
                onStartGame={startGame}
                gameTitle={gameTitle}
                minCountWord={minCountWord}
            />
        );
    }

    // Game stats screen
    if (showStats) {
        const tableHeaders = ['Translation', 'Your Answer', 'Correct Answer', 'Result'];
        
        return (
            <GameStats
                gameHistory={gameHistory}
                gameScore={gameScore}
                totalWords={gameWords.length}
                longestStreak={longestStreak}
                onBackToGames={onBackToGames}
                onRestartGame={() => setGameSetup(true)}
                gameTitle={gameTitle}
                tableHeaders={tableHeaders}
            />
        );
    }

    // Game playing screen
    return (
        <div className="space-y-4 mt-4">
            <Card>
                <ProgressInGameHeader gameTitle={gameTitle} gameWords={gameWords} gameIndex={gameIndex} gameScore={gameScore} streak={streak}/>
                
                <CardContent>
                    {currentGameWord && (
                        <div className="space-y-6">
                            <div className="border rounded-lg p-8 bg-card/50 shadow-sm text-center">
                                <p className="font-bold text-3xl mb-2 text-primary">
                                    {currentGameWord.russian_translation}
                                </p>
                            </div>
                            
                            <div>
                                <Label htmlFor="answer" className="text-base">
                                    Enter English word:
                                </Label>
                                <div className="flex mt-2">
                                    <Input 
                                        id="answer"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Word..."
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
                                
                                <GameAnswerFeedback
                                    isCorrect={isCorrect} 
                                    correctAnswer={currentGameWord?.english_word}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
                
                <GameNavigation 
                    isAnswered={isCorrect !== null}
                    onBackToGames={onBackToGames}
                    onNextWord={handleNextWord}
                    isLastWord={gameIndex >= gameWords.length - 1}
                />
            </Card>
        </div>
    );
}