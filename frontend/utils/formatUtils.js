/**
 * Форматирует дату
 * @param {string} dateString - строка с датой
 * @returns {string} - отформатированная дата
 */
export const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString || "Не указано";
    }
};

/**
 * Форматирует пол пользователя
 * @param {string} gender - пол пользователя (male/female)
 * @returns {string} - локализованное значение пола
 */
export const formatGender = (gender) => {
    switch (gender) {
        case "male":
        return "Мужчина";
        case "female":
        return "Женщина";
        default:
        return "Не указано";
    }
};

/**
 * Возвращает правильный компонент Badge для статуса подписки
 * @param {boolean} isActive - активна ли подписка
 * @returns {object} - объект с классом и текстом для Badge
 */
export const getSubscriptionStatus = (isActive) => {
    return {
        className: isActive ? "bg-green-600" : "variant-outline",
        text: isActive ? "Активная подписка" : "Нет активной подписки"
    };
};