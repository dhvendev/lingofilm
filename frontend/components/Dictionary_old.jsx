"use client"

import { useUser } from "@/context/userContext"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  Search, 
  SortAsc, 
  SortDesc, 
  Film, 
  Calendar, 
  GraduationCap, 
  GamepadIcon, 
  Check, 
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Dictionary() {
  const userContext = useUser();
  const user = userContext.user;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("dictionary");
  const [gameMode, setGameMode] = useState(""); // "translate", "guessWord"
  const [currentGameWord, setCurrentGameWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameWords, setGameWords] = useState([]);
  const [gameIndex, setGameIndex] = useState(0);
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Пример данных для словаря - упрощенная структура без контекста
  // В реальном приложении эти данные будут загружаться из API
  const [dictionary, setDictionary] = useState([
    {
      id: 1,
      word: "persistence",
      translation: "настойчивость",
      movie: "The Pursuit of Happyness",
      added_date: "2025-03-15",
      learned: false
    },
    {
      id: 2,
      word: "endeavor",
      translation: "стремление",
      movie: "La La Land",
      added_date: "2025-04-01",
      learned: false
    },
    {
      id: 3,
      word: "ambiguous",
      translation: "двусмысленный",
      movie: "Inception",
      added_date: "2025-04-10",
      learned: true
    },
    {
      id: 4,
      word: "inevitable",
      translation: "неизбежный",
      movie: "The Matrix",
      added_date: "2025-02-22",
      learned: false
    },
    {
      id: 5,
      word: "quintessential",
      translation: "типичный",
      movie: "The Wolf of Wall Street",
      added_date: "2025-03-28",
      learned: false
    }
  ]);

  // Создадим больше тестовых данных для демонстрации пагинации
  useEffect(() => {
    // В реальном приложении этот код будет заменен на запрос к API
    const generateMoreWords = () => {
      const additionalWords = [
        { word: "serendipity", translation: "случайность" },
        { word: "eloquent", translation: "красноречивый" },
        { word: "profound", translation: "глубокий" },
        { word: "omniscient", translation: "всезнающий" },
        { word: "meticulous", translation: "скрупулезный" },
        { word: "enigma", translation: "загадка" },
        { word: "nostalgia", translation: "тоска" },
        { word: "tenacious", translation: "упорный" },
        { word: "whimsical", translation: "причудливый" },
        { word: "melancholy", translation: "меланхолия" },
        { word: "arduous", translation: "трудный" },
        { word: "elucidate", translation: "разъяснять" },
        { word: "euphoria", translation: "эйфория" },
        { word: "nebulous", translation: "туманный" },
        { word: "pragmatic", translation: "прагматичный" }
      ];
      
      const movies = [
        "Inception", "The Matrix", "Interstellar", "The Godfather", 
        "Pulp Fiction", "The Shawshank Redemption", "Fight Club"
      ];
      
      const newWords = [];
      
      for (let i = 6; i <= 100; i++) {
        const randomWord = additionalWords[Math.floor(Math.random() * additionalWords.length)];
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const randomDate = new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1);
        
        newWords.push({
          id: i,
          word: `${randomWord.word}_${i}`,
          translation: randomWord.translation,
          movie: randomMovie,
          added_date: randomDate.toISOString().split('T')[0],
          learned: Math.random() > 0.7 // 30% слов будут помечены как изученные
        });
      }
      
      setDictionary(prev => [...prev, ...newWords]);
    };
    
    generateMoreWords();
  }, []);

  if (!user) {
    return redirect("/");
  }

  useEffect(() => {
    if (gameMode && dictionary.length > 0) {
      // Выбираем слова для игры (неизученные)
      const wordsForGame = dictionary.filter(item => !item.learned).slice(0, 10);
      if (wordsForGame.length > 0) {
        setGameWords(shuffleArray(wordsForGame));
        setGameIndex(0);
        setCurrentGameWord(wordsForGame[0]);
        setUserAnswer("");
        setIsCorrect(null);
        setGameScore(0);
      } else {
        // Если нет неизученных слов, используем все слова
        setGameWords(shuffleArray([...dictionary].slice(0, 10)));
        setGameIndex(0);
        setCurrentGameWord(dictionary[0]);
        setUserAnswer("");
        setIsCorrect(null);
        setGameScore(0);
      }
    }
  }, [gameMode]);

  // Перемешивание массива (для игрового режима)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Форматируем даты для отображения
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // Обработка сортировки
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Сортировка словаря
  const sortedDictionary = [...dictionary].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc" 
        ? new Date(a.added_date) - new Date(b.added_date)
        : new Date(b.added_date) - new Date(a.added_date);
    } else if (sortBy === "word") {
      return sortOrder === "asc"
        ? a.word.localeCompare(b.word)
        : b.word.localeCompare(a.word);
    } else if (sortBy === "movie") {
      return sortOrder === "asc"
        ? a.movie.localeCompare(b.movie)
        : b.movie.localeCompare(a.movie);
    }
    return 0;
  });

  // Фильтрация по поисковому запросу
  const filteredDictionary = sortedDictionary.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Вычисление пагинации
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDictionary.length / itemsPerPage));
    if (currentPage > Math.ceil(filteredDictionary.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredDictionary, itemsPerPage]);

  // Получение текущей страницы
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDictionary.slice(startIndex, endIndex);
  };

  // Отметить слово как изученное/неизученное
  const toggleLearnedStatus = (id) => {
    setDictionary(dictionary.map(item => 
      item.id === id ? { ...item, learned: !item.learned } : item
    ));
  };

  // Обработка ответа в игре
  const handleGameAnswer = () => {
    if (!currentGameWord) return;
    
    let correct = false;
    if (gameMode === "translate") {
      // Более точная проверка перевода
      const normalizedUserAnswer = userAnswer.toLowerCase().trim();
      const normalizedTranslation = currentGameWord.translation.toLowerCase().trim();
      correct = normalizedUserAnswer === normalizedTranslation;
    } else if (gameMode === "guessWord") {
      // Проверяем, правильно ли угадано слово
      const normalizedUserAnswer = userAnswer.toLowerCase().trim();
      const normalizedWord = currentGameWord.word.toLowerCase().trim();
      correct = normalizedUserAnswer === normalizedWord;
    }
    
    setIsCorrect(correct);
    
    if (correct) {
      setGameScore(gameScore + 1);
      // Если правильно, помечаем слово как изученное
      toggleLearnedStatus(currentGameWord.id);
    }
    
    // Переход к следующему слову через 1.5 секунды
    setTimeout(() => {
      if (gameIndex < gameWords.length - 1) {
        setGameIndex(gameIndex + 1);
        setCurrentGameWord(gameWords[gameIndex + 1]);
        setUserAnswer("");
        setIsCorrect(null);
      } else {
        // Игра закончена
        setGameMode("");
        setActiveTab("dictionary");
      }
    }, 1500);
  };

  // Обработка нажатия Enter в поле ввода
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userAnswer && isCorrect === null) {
      handleGameAnswer();
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 max-w-4xl">
      <Card className="w-full shadow-lg py-0 pb-6">
        {/* Шапка словаря */}
        <div className="relative">
          <div className="h-48 w-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-t-lg"></div>
          <div className="absolute bottom-4 left-8 flex items-center">
            <div className="h-24 w-24 bg-black rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">Мой словарь</h1>
              <p className="text-white opacity-90">Изучайте слова из любимых фильмов</p>
            </div>
          </div>
        </div>
        
        {/* Информация словаря */}
        <CardHeader className="pt-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="text-2xl">Словарь {user.username}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Всего слов: {dictionary.length} / Изучено: {dictionary.filter(item => item.learned).length}
              </CardDescription>
            </div>
            <Badge className="bg-blue-600">{Math.round(dictionary.filter(item => item.learned).length / dictionary.length * 100)}% изучено</Badge>
          </div>
        </CardHeader>
        
        {/* Табы для навигации */}
        <CardContent>
          <Tabs defaultValue="dictionary" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dictionary">Словарь</TabsTrigger>
              <TabsTrigger value="games">Игры для заучивания</TabsTrigger>
            </TabsList>
            
            {/* Содержимое таба Словарь */}
            <TabsContent value="dictionary">
              <div className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Мои слова</CardTitle>
                      <Button variant="outline">
                        <Film className="h-4 w-4 mr-2" />
                        Добавить слово
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Поиск слов..." 
                          className="pl-8" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredDictionary.length > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">Показывать по:</span>
                            <Select 
                              value={String(itemsPerPage)} 
                              onValueChange={(value) => setItemsPerPage(Number(value))}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue>{itemsPerPage}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Найдено: {filteredDictionary.length} слов
                          </div>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort("word")}>
                                <div className="flex items-center">
                                  Слово
                                  {sortBy === "word" && (
                                    sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead>Перевод</TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("movie")}>
                                <div className="flex items-center">
                                  Фильм
                                  {sortBy === "movie" && (
                                    sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                <div className="flex items-center">
                                  Дата
                                  {sortBy === "date" && (
                                    sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right">Статус</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getCurrentPageItems().map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.word}</TableCell>
                                <TableCell>{item.translation}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Film className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {item.movie}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {formatDate(item.added_date)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant={item.learned ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleLearnedStatus(item.id)}
                                  >
                                    {item.learned ? "Изучено" : "Не изучено"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Пагинация */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Страница {currentPage} из {totalPages}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <ChevronLeft className="h-4 w-4 -ml-2" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Логика отображения страниц: центрируем текущую страницу
                                let pageToShow;
                                if (totalPages <= 5) {
                                  pageToShow = i + 1;
                                } else if (currentPage <= 3) {
                                  pageToShow = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageToShow = totalPages - 4 + i;
                                } else {
                                  pageToShow = currentPage - 2 + i;
                                }
                                
                                return (
                                  <Button
                                    key={i}
                                    variant={currentPage === pageToShow ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(pageToShow)}
                                    className="mx-0.5 h-8 w-8"
                                  >
                                    {pageToShow}
                                  </Button>
                                );
                              })}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                              <ChevronRight className="h-4 w-4 -ml-2" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Слова не найдены</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Содержимое таба Игры */}
            <TabsContent value="games">
              {gameMode === "" ? (
                <div className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Игры для заучивания слов</CardTitle>
                      <CardDescription>
                        Выберите игру, чтобы закрепить изученные слова
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setGameMode("translate")}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                              Переведи слово
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Вам будет показано слово на английском. Необходимо указать его перевод.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setGameMode("guessWord")}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <GamepadIcon className="h-5 w-5 mr-2 text-blue-600" />
                              Угадай слово
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Вам будет показан перевод. Необходимо указать слово на английском.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>
                          {gameMode === "translate" ? "Переведи слово" : "Угадай слово"}
                        </CardTitle>
                        <Badge variant="outline">
                          {gameIndex + 1} / {gameWords.length}
                        </Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <span>Счет: {gameScore}</span>
                          <Badge className="ml-2 bg-blue-600">{Math.round(gameScore / (gameIndex > 0 ? gameIndex : 1) * 100)}%</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentGameWord && (
                        <div className="space-y-6">
                          <div className="border rounded-lg p-6 bg-gray-50 text-center">
                            <div className="flex items-center justify-center mb-4">
                              <Film className="h-5 w-5 mr-2 text-blue-600" color="gray"/>
                              <span className="text-sm font-medium text-gray-400">{currentGameWord.movie}</span>
                            </div>
                            
                            {gameMode === "translate" ? (
                              <p className="font-bold text-2xl mb-4 text-gray-600">
                                {currentGameWord.word}
                              </p>
                            ) : (
                              <p className="font-bold text-2xl mb-4">
                                {currentGameWord.translation}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="answer">
                              {gameMode === "translate" 
                                ? "Введите перевод одним словом:" 
                                : "Введите слово на английском:"}
                            </Label>
                            <div className="flex mt-2">
                              <Input 
                                id="answer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder={gameMode === "translate" ? "Перевод..." : "Слово..."}
                                className={isCorrect === null ? "" : isCorrect ? "border-green-500" : "border-red-500"}
                                disabled={isCorrect !== null}
                                onKeyDown={handleKeyDown}
                                autoFocus
                              />
                              <Button 
                                className="ml-2" 
                                onClick={handleGameAnswer}
                                disabled={!userAnswer || isCorrect !== null}
                              >
                                Проверить
                              </Button>
                            </div>
                            
                            {isCorrect !== null && (
                              <div className={`mt-4 p-3 rounded-md ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                                <div className="flex items-center">
                                  {isCorrect ? (
                                    <Check className="h-5 w-5 text-green-600 mr-2" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-600 mr-2" />
                                  )}
                                  <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                    {isCorrect ? "Правильно!" : "Неправильно!"}
                                  </span>
                                </div>
                                {!isCorrect && (
                                  <p className="mt-1 text-sm">
                                    Правильный ответ: <strong>{gameMode === "translate" ? currentGameWord.translation : currentGameWord.word}</strong>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setGameMode("");
                          setActiveTab("dictionary");
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Завершить игру
                      </Button>
                      {isCorrect !== null && gameIndex < gameWords.length - 1 && (
                        <Button 
                          onClick={() => {
                            setGameIndex(gameIndex + 1);
                            setCurrentGameWord(gameWords[gameIndex + 1]);
                            setUserAnswer("");
                            setIsCorrect(null);
                          }}
                        >
                          Следующее слово
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}