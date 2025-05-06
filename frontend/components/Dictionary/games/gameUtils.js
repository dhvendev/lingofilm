import { shuffleArray } from '@/utils/vocabularyUtils';

export const GAME_MODES = {
    LEARN: 'learn',
    REVIEW: 'review',
    MIXED: 'mixed'
};

export const initializeGameWords = (vocabulary, gameMode, wordCount) => {
    let selectedWords = [];
    
    switch (gameMode) {
        case GAME_MODES.LEARN:
            selectedWords = vocabulary.filter(item => !item.is_learned).slice(0, wordCount);
            break;
        case GAME_MODES.REVIEW:
            selectedWords = vocabulary.filter(item => item.is_learned).slice(0, wordCount);
            break;
        case GAME_MODES.MIXED:
            const unlearned = vocabulary.filter(item => !item.is_learned);
            const learned = vocabulary.filter(item => item.is_learned);
            const halfCount = Math.floor(wordCount / 2);
            
            const selectedUnlearned = unlearned.slice(0, halfCount);
            const remainingCount = wordCount - selectedUnlearned.length;
            const selectedLearned = learned.slice(0, remainingCount);
            
            selectedWords = [...selectedUnlearned, ...selectedLearned];
            break;
    }
    
    return shuffleArray(selectedWords);
};