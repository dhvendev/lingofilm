import { shuffleArray } from '@/utils/vocabularyUtils';

export const GAME_MODES = {
    LEARN: 'learn',             // Учить (не изученные)
    REVIEW: 'review',           // Повторять (изученные)
    MIXED: 'mixed',             // В перемешку
    PROGRESSIVE: 'progressive'  // Прогрессивный режим
};

export const initializeGameWords = (vocabulary, gameMode, wordCount) => {
    let selectedWords = [];
    
    switch (gameMode) {
        case GAME_MODES.LEARN:
            // Получает только изученные слова
            selectedWords = vocabulary.filter(item => !item.is_learned).slice(0, wordCount);
            break;
            
        case GAME_MODES.REVIEW:
            // Получает только не изученные слова
            selectedWords = vocabulary.filter(item => item.is_learned).slice(0, wordCount);
            break;
            
        case GAME_MODES.MIXED:
            // Получим слова и разделим на 2 категории (изученные и не изученные)
            const unlearned = vocabulary.filter(item => !item.is_learned);
            const learnedWords = vocabulary.filter(item => item.is_learned);
            
            // Рассчитаем целевое количество слов из каждой категории (примерно 50/50)
            const targetUnlearnedCount = Math.floor(wordCount / 2);
            const targetLearnedCount = wordCount - targetUnlearnedCount;
            
            // Возьмем столько, сколько можем из каждой категории
            let mixedUnlearned = unlearned.slice(0, targetUnlearnedCount);
            let mixedLearned = learnedWords.slice(0, targetLearnedCount);
            
            // Если не хватает слов в одной из категорий, добавим из другой
            const missingUnlearnedCount = targetUnlearnedCount - mixedUnlearned.length;
            const missingLearnedCount = targetLearnedCount - mixedLearned.length;
            
            if (missingUnlearnedCount > 0) {
                // Добавим недостающие слова из категории выученных
                const additionalLearned = learnedWords.slice(mixedLearned.length, mixedLearned.length + missingUnlearnedCount);
                mixedLearned = [...mixedLearned, ...additionalLearned];
            } else if (missingLearnedCount > 0) {
                // Добавим недостающие слова из категории невыученных
                const additionalUnlearned = unlearned.slice(mixedUnlearned.length, mixedUnlearned.length + missingLearnedCount);
                mixedUnlearned = [...mixedUnlearned, ...additionalUnlearned];
            }
            
            selectedWords = [...mixedUnlearned, ...mixedLearned];
            break;
            
        case GAME_MODES.PROGRESSIVE:
            // 50% самых старых не выученных слов (чтобы освоить то, что давно ожидает изучения)
            // 30% недавно выученных слов (для закрепления свежих знаний)
            // 20% слов, выученных давно (для поддержания долгосрочной памяти)
            const unlearnedWords = vocabulary
                .filter(item => !item.is_learned)
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            
            const recentlyLearnedWords = vocabulary
                .filter(item => item.is_learned && item.learned_at)
                .sort((a, b) => new Date(b.learned_at) - new Date(a.learned_at));
            
            const oldLearnedWords = vocabulary
                .filter(item => item.is_learned && item.learned_at)
                .sort((a, b) => new Date(a.learned_at) - new Date(b.learned_at));
            
            
            const newWordsCount = Math.ceil(wordCount * 0.5);
            const recentLearnedCount = Math.ceil(wordCount * 0.3);
            const oldLearnedCount = wordCount - Math.min(newWordsCount, unlearnedWords.length) 
                                     - Math.min(recentLearnedCount, recentlyLearnedWords.length);
            
            const selectedUnlearned = unlearnedWords.slice(0, newWordsCount);
            const selectedRecentLearned = recentlyLearnedWords.slice(0, recentLearnedCount);
            const selectedOldLearned = oldLearnedWords.slice(0, oldLearnedCount);
            
            selectedWords = [...selectedUnlearned, ...selectedRecentLearned, ...selectedOldLearned];
            break;
    }
    
    // Return shuffled selected words
    return shuffleArray(selectedWords);
};