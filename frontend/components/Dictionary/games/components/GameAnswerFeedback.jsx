import { Check, X } from 'lucide-react';

export function GameAnswerFeedback({ isCorrect, correctAnswer }) {
    if (isCorrect === null) return null;
    
    return (
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
                    {isCorrect ? "Верно!" : "Неверно!"}
                </span>
            </div>
            {!isCorrect && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Правильный ответ: <strong>{correctAnswer}</strong>
                </p>
            )}
        </div>
    );
}