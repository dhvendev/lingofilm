import { useEffect, useState, useCallback, useRef } from "react";
import WordPopup from "./WordPopup";

// Компонент для отдельного слова субтитров
const SubtitleWord = ({ word, onWordClick }) => {
  // Очистка слова от знаков пунктуации
  const cleanWord = word.replace(/[.,!?;:]/g, "");
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWordClick(cleanWord, e);
  };

  return (
    <span 
      className="subtitle-word hover:bg-black hover:bg-opacity-40 rounded px-1 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      {word}
    </span>
  );
};



// Компонент для линии субтитров (русский или английский)
const SubtitleLine = ({ text, onWordClick, style }) => {
  if (!text) return null;
  
  const words = text.split(" ");
  
  return (
    <div className="subtitle-line" style={style}>
      {words.map((word, index) => (
        <SubtitleWord 
          key={`word-${index}`}
          word={word}
          onWordClick={onWordClick}
        />
      ))}
    </div>
  );
};

export default function Subtitles({ subtitles, currentSubtitles, currentTime }) {
  const [currentRusText, setCurrentRusText] = useState("");
  const [currentEngText, setCurrentEngText] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);;
  
  // Ref для отслеживания последнего клика
  const lastClickTimeRef = useRef(0);

  // Обработчик клика по слову с мемоизацией
  const handleWordClick = useCallback((word, event) => {
    // Устанавливаем время последнего клика
    lastClickTimeRef.current = Date.now();
    
    // Устанавливаем выбранное слово
    setSelectedWord({
      text: word
    });
  }, []);
  
  // Обработчик закрытия всплывающего окна
  const handleClosePopup = useCallback(() => {
    return setSelectedWord(null)
  }, []);

  // Обновляем отображаемые субтитры на основе текущего времени
  useEffect(() => {
    if (!currentTime) return;

    // Поиск и отображение текущих русских субтитров
    if (subtitles.rus || subtitles.dual) {
      const currentRusSub = currentSubtitles.rus?.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      
      setCurrentRusText(currentRusSub ? currentRusSub.text : "");
    }

    // Поиск и отображение текущих английских субтитров
    if (subtitles.eng || subtitles.dual) {
      const currentEngSub = currentSubtitles.eng?.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      
      setCurrentEngText(currentEngSub ? currentEngSub.text : "");
    }
  }, [currentSubtitles, currentTime, subtitles]);

  return (
    <>
      {/* Контейнеры для субтитров - показываем только при наличии контента */}
      {(subtitles.rus || subtitles.dual) && currentRusText && (
        <div
          className={`absolute ${
            subtitles.dual ? "top-8" : "bottom-24"
          } left-0 right-0 flex justify-center text-center text-2xl text-white font-semibold`}
        >
          <div className="inline-block bg-black bg-opacity-30 px-4 py-2 rounded-lg">
            <SubtitleLine 
              text={currentRusText}
              language="rus"
              onWordClick={handleWordClick}
              style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.8)" }}
            />
          </div>
        </div>
      )}

      {(subtitles.eng || subtitles.dual) && currentEngText && (
        <div
          className="absolute bottom-24 left-0 right-0 flex justify-center text-center text-2xl text-white font-semibold"
        >
          <div className="inline-block bg-black bg-opacity-30 px-4 py-2 rounded-lg">
            <SubtitleLine 
              text={currentEngText}
              language="eng"
              onWordClick={handleWordClick}
              style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.8)" }}
            />
          </div>
        </div>
      )}

      {/* Всплывающее окно с выбранным словом */}
      {selectedWord && (
        <WordPopup
          word={selectedWord.text}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}