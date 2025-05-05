/**
 * Форматирование даты
 * @param {string} dateString - ISO дата
 * @returns {string} Отформатированная дата
 */
export const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString || "Не указано";
    }
  };
  
  /**
   * Расчет процента изученных слов
   * @param {Array} vocabulary - Список слов
   * @returns {number} Процент изученных слов
   */
  export const calculateProgress = (vocabulary) => {
    if (!vocabulary || vocabulary.length === 0) return 0;
    const learnedCount = vocabulary.filter(word => word.is_learned).length;
    return Math.round((learnedCount / vocabulary.length) * 100);
  };
  
  /**
   * Фильтрация словаря по поисковому запросу
   * @param {Array} vocabulary - Список слов
   * @param {string} searchTerm - Поисковый запрос
   * @returns {Array} Отфильтрованный список слов
   */
  export const filterVocabulary = (vocabulary, searchTerm) => {
    if (!searchTerm) return vocabulary;
    
    const term = searchTerm.toLowerCase().trim();
    return vocabulary.filter(word => 
      word.english_word.toLowerCase().includes(term) || 
      word.russian_translation.toLowerCase().includes(term)
    );
  };
  
  /**
   * Сортировка словаря
   * @param {Array} vocabulary - Список слов
   * @param {string} sortBy - Поле для сортировки
   * @param {string} sortOrder - Направление сортировки (asc/desc)
   * @returns {Array} Отсортированный список слов
   */
  export const sortVocabulary = (vocabulary, sortBy, sortOrder) => {
    if (!vocabulary) return [];
    
    return [...vocabulary].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'word') {
        return sortOrder === 'asc'
          ? a.english_word.localeCompare(b.english_word)
          : b.english_word.localeCompare(a.english_word);
      } else if (sortBy === 'translation') {
        return sortOrder === 'asc'
          ? a.russian_translation.localeCompare(b.russian_translation)
          : b.russian_translation.localeCompare(a.russian_translation);
      }
      return 0;
    });
  };
  
  /**
   * Перемешивание массива (для игр)
   * @param {Array} array - Исходный массив
   * @returns {Array} Перемешанный массив
   */
  export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };