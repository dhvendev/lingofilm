"use client"
import { useState, useEffect, useCallback } from "react";
import api from "@/services/axiosConfig";
import { toast } from "sonner";

/**
    * Хук для работы со словарем пользователя
    * @returns {Object} Состояние и методы для работы со словарем
*/

export default function useVocabulary() {
    const [vocabulary, setVocabulary] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Метод запроса словаря пользователя
    const getVocabulary = useCallback(async(isLearned=null) => {
        try {
            setIsLoading(true);
            const params = isLearned !== null ? `?is_learned=${isLearned}` : '';
            const response = await api.get(`/api/vocabulary/getVocabulary${params}`, { withCredentials: true });
            setVocabulary(response.data || []);
            setError(null);
            return response.data || []
        } catch(err) {
            console.error('Ошибка получения словаря с API:', err)
            setError('Не удалось загрузить словарь. Попробуйте позже.')
            toast.error("Не удалось загрузить словарь. Попробуйте позже.")
            return []
        } finally {
            setIsLoading(false);
        }
    }, [])

    // Метод добавления слова в словарь
    const addWord = useCallback(async(word) => {
        try {
            const response = await api.post('/api/vocabulary/addWord', { word }, { withCredentials: true });
            setVocabulary(prev => [...prev, response.data]);
            toast.success('Cлово успешно добавлено в словарь.');
            return response.data
        } catch(err) {
            console.error('Ошибка при добавлении слова:', err);
            toast.error('Не удалось добавить слово в словарь');
            throw err;
        }
    },[])

    // Метод обновления слова в словаре (is_learned)
    const updateWordStatus = useCallback(async (wordId, isLearned) => {
        try {
            const response = await api.put('/api/vocabulary/updateWordStatus', { word_id: wordId, is_learned: isLearned }, { withCredentials: true });
            setVocabulary(prev => prev.map(word => word.id === wordId ? response.data : word));
            toast.success(isLearned ? 'Слово отмечено как изученное' : 'Слово отмечено как неизученное');
            return response.data;
        } catch (err) {
            console.error('Ошибка при обновлении статуса слова:', err);
            toast.error('Не удалось обновить статус слова');
            throw err;
        }
    }, []);

    // Метод удаления слова из словаря
    const deleteWord = useCallback(async (wordId) => {
        try {
            await api.delete(`/api/vocabulary/deleteWord/${wordId}`, { withCredentials: true });
            setVocabulary(prev => prev.filter(word => word.id !== wordId));
            toast.success('Слово успешно удалено из словаря');
            return true;
        } catch (err) {
            console.error('Ошибка при удалении слова:', err);
            toast.error('Не удалось удалить слово');
            throw err;
        }
    }, []);

    // Метод перевода слова на стороне API
    const translateWord = useCallback(async (word) => {
        try {
            const response = await api.post('/api/users/translateWord', { word }, { withCredentials: true });
            return response.data;
        } catch (err) {
            console.error('Ошибка при переводе слова:', err);
            throw err;
        }
    }, []);


    useEffect(() => {
        getVocabulary();
      }, [getVocabulary]);

    return {vocabulary, isLoading, error, getVocabulary, addWord, updateWordStatus, deleteWord, translateWord}
}