"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { shuffleArray } from '@/utils/vocabularyUtils';
import { GameSetup, GameStats, initializeGameWords } from './index';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import GameSetupComponent from "./GameSetup";
import { AnswerFeedback } from "./AnswerFeedback";
import { GameNavigation } from "./GameNavigation";
import { Check, X } from 'lucide-react';
import ProgressInGameHeader from "./ProgressInGameHeader";

export default function MultipleChoiceGame({ vocabulary, updateWordStatus, onBackToGames, gameTitle, minCountWord}) {
    // Game setup states
    const [gameSetup, setGameSetup] = useState(true);
    const [gameSettings, setGameSettings] = useState(null);
    
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
            generateOptions(selectedWords[0], vocabulary);
            setSelectedOption(null);
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
        
        const gameItem = { 
            word: currentGameWord,
            questionWord: currentGameWord.english_word,
            userAnswer: option,
            correctWord: currentGameWord.russian_translation,
            correct: answerIsCorrect,
            wasAlreadyLearned: currentGameWord.is_learned
        };
        
        setGameHistory([...gameHistory, gameItem]);

        if (answerIsCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setLongestStreak(Math.max(longestStreak, newStreak));
            setGameScore(gameScore + 1);
            
            // If answer is correct and word is not marked as learned, mark it
            if (!currentGameWord.is_learned) {
                await updateWordStatus(currentGameWord.id, true);
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

    // Game setup screen
    if (gameSetup) {
        return (
            <GameSetup
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
        const tableHeaders = ['English Word', 'Your Answer', 'Correct Answer', 'Result'];
        
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
                                <AnswerFeedback 
                                    isCorrect={isCorrect} 
                                    correctAnswer={currentGameWord?.russian_translation}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
                
                <GameNavigation 
                    isAnswered={selectedOption !== null}
                    onBackToGames={onBackToGames}
                    onNextWord={handleNextWord}
                    isLastWord={gameIndex >= gameWords.length - 1}
                />
            </Card>
        </div>
    );
}