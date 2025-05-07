// index.js - Общий файл экспорта для игровых компонентов
export { default as GameSetupComponent } from './components/GameSetupComponent';
export { default as GameStats } from './components/GameStats';
export { GAME_MODES, initializeGameWords } from './utils/gameUtils';
export { default as GuessWordGame } from './types/GuessWordGame';
export { default as MultipleChoiceGame } from './types/MultipleChoiceGame';
export { default as TranslateWordGame } from './types/TranslateWordGame';
