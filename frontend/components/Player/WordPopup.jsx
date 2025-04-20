import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { X, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const fakeFetchTranslateApi = (word) => {
  // Имитируем задержку API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(word + " (перевод слова)");
    }, 1500); // 1.5 секунды задержки для демонстрации Skeleton
  });
};

// Компонент для отображения всплывающего окна
export default function WordPopup({ word, onClose }) {
  const popupRef = useRef(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка перевода
  useEffect(() => {
    setLoading(true);
    fakeFetchTranslateApi(word)
      .then((result) => {
        setTranslation(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка перевода:", error);
        setLoading(false);
      });
  }, [word]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="w-80 bg-zinc-900 text-white rounded-lg shadow-xl p-4 text-lg relative border border-zinc-700"
      >
        {/* Кнопка закрытия в правом верхнем углу */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-zinc-400 hover:text-white hover:bg-zinc-800" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
        
        {/* Заголовок и выбранное слово */}
        <div className="mb-4 mt-1">
          <div className="text-lg font-bold text-zinc-200 mb-1">Слово:</div>
          <div className="text-xl font-semibold text-white">{word}</div>
        </div>
        
        {/* Перевод с анимацией загрузки */}
        <div className="mb-6">
          <div className="text-lg font-bold text-zinc-200 mb-1">Перевод:</div>
          {loading ? (
            <>
              <Skeleton className="h-6 w-3/4 bg-zinc-800" />
            </>
          ) : (
            <div className="text-white">{translation}</div>
          )}
        </div>
        
        {/* Кнопка добавления в словарь */}
        <Button 
          className="w-full primary1 text-black flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Добавить в словарь</span>
        </Button>
      </div>
    </div>
  );
}