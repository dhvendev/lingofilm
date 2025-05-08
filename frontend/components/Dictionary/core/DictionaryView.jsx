"use client"
import { formatDate, filterVocabulary, sortVocabulary } from '@/utils/vocabularyUtils';
import { useState, useMemo, useRef, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardFooter, 
    CardDescription 
} from "@/components/ui/card";
import {Sparkles, 
    Brain, X,
    FileText,
    Trash2, PlusCircle, Search, SortDesc, Calendar, MoreHorizontal, ChevronLeft, ChevronRight, SortAsc
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DialogDeleteWord from './DictionaryDeleteAlert';

export default function DictionaryView({ vocabulary, updateWordStatus,
     deleteWord,
     addWord,
     hasSubscription,
     maxWords, editWord}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteWordId, setDeleteWordId] = useState(null);
    const [showAddWordDialog, setShowAddWordDialog] = useState(false);
    const [newWord, setNewWord] = useState({ english: "", translation: "" });
    const [showEditWordDialog, setShowEditWordDialog] = useState(false);
    const [editedWord, setEditedWord] = useState({ word_id: null, translation: "" });
    const searchInputRef = useRef(null);

    const wordsRemaining = maxWords - vocabulary.length;
    const hasReachedLimit = !hasSubscription && vocabulary.length >= maxWords;

    const filteredWords = useMemo(() => 
        filterVocabulary(vocabulary, searchTerm),
        [vocabulary, searchTerm]
    );

    const sortedWords = useMemo(() => 
        sortVocabulary(filteredWords, sortBy, sortOrder),
        [filteredWords, sortBy, sortOrder]
    );

    // Подсчет кол-ва страниц
    const totalPages = useMemo(() => 
        Math.max(1, Math.ceil(sortedWords.length / itemsPerPage)),
        [sortedWords, itemsPerPage]
    );
    
    // Получить слова страницы
    const currentPageItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedWords.slice(startIndex, endIndex);
    }, [sortedWords, currentPage, itemsPerPage]);

    // Сортировка в колонках таблицы
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };
    
    // Установить изучено/неизучено
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await updateWordStatus(id, !currentStatus);
            toast.success(!currentStatus ? "Слово помечено как изученное" : "Слово помечено как неизученное");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update word status");
        }
    };
    
    // Подтверждение удаления слова
    const confirmDeleteWord = (id) => {
        setDeleteWordId(id);
        setShowDeleteDialog(true);
    };

    // Подтверждение удаления слова
    const confirmEditWord = (id) => {
        setEditedWord({...editedWord, word_id: id})
        setShowEditWordDialog(true);
    };

    // Удаление слова
    const handleDeleteWord = async () => {
        if (!deleteWordId) return;
    
        try {
            await deleteWord(deleteWordId);
            toast.success("Слово успешно удалено!");
        } catch (error) {
            console.error("Error deleting word:", error);
            toast.error("Failed to delete word");
        } finally {
            setDeleteWordId(null);
            setShowDeleteDialog(false);
        }
    };
    
    // Добавить новое слова
    const handleAddWord = async () => {
        if (!newWord.english || !newWord.translation) {
            toast.error("Пожалуйста заполните все поля");
            return;
        }
        
        try {
            await addWord({
                word: newWord.english,
                translation: newWord.translation
            });
            
            setNewWord({ english: "", translation: "" });
            setShowAddWordDialog(false);
        } catch (error) {
            console.error("Error adding word:", error);
            toast.error("Failed to add word");
        }
    };

    const handleEditWord = async () => {
        console.log(editedWord)
        if (!editedWord.word_id || !editedWord.translation) {
            toast.error("Пожалуйста заполните все поля");
            return;
        }
        
        try {
            await editWord(editedWord.word_id, editedWord.translation);
            setNewWord({ word_id: null, translation: "" });
            setShowEditWordDialog(false);
        } catch (error) {
            console.error("Error adding word:", error);
        }
    };

    // Очистить поиск
    const clearSearch = () => {
        setSearchTerm("");
        searchInputRef.current?.focus();
    };

    return (
        <>
            <Card className="border-none shadow-md bg-card/50">
                <CardHeader className="pb-2">
                    <div className="flex flex-row justify-between md:items-center gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Мои слова
                        </CardTitle>
                        
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowAddWordDialog(true)}
                                        className="gap-1"
                                        disabled={hasReachedLimit}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span className="hidden md:inline">
                                            {hasReachedLimit ? 'Лимит достигнут' : 'Добавить слово'}
                                        </span>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Добавьте любое новое слово</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            ref={searchInputRef}
                            placeholder="Найдите слово или перевод по словарю" 
                            className="pl-10 pr-10" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-2 top-1.5 h-6 w-6 p-0 rounded-full"
                                onClick={clearSearch}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent>
                    {sortedWords.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <span className="text-sm text-muted-foreground mr-2">Показывать по:</span>
                                    <Select 
                                        value={String(itemsPerPage)} 
                                        onValueChange={(value) => {
                                            setItemsPerPage(Number(value));
                                            setCurrentPage(1); // Reset to first page
                                        }}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue>{itemsPerPage}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                    Найдено: {sortedWords.length} слов/а
                                </div>
                            </div>
                            
                            <div className="rounded-md border overflow-hidden">
                                <Table className="min-w-full">
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort("word")}>
                                                <div className="flex items-center">
                                                    Слово
                                                    {sortBy === "word" && (
                                                        sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer" onClick={() => handleSort("translation")}>
                                                <div className="flex items-center">
                                                    Перевод
                                                    {sortBy === "translation" && (
                                                        sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("date")}>
                                                <div className="flex items-center">
                                                    Дата добавления
                                                    {sortBy === "date" && (
                                                        sortOrder === "asc" ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right">Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentPageItems.map((item) => (
                                            <TableRow key={item.id} className="transition-colors hover:bg-muted/30">
                                                <TableCell className="font-medium">{item.english_word}</TableCell>
                                                <TableCell>{item.russian_translation}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5 mr-2" />
                                                        {formatDate(item.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button 
                                                                        variant={item.is_learned ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => handleToggleStatus(item.id, item.is_learned)}
                                                                        className={`rounded-sm ${item.is_learned ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                                    >
                                                                        {item.is_learned ? (
                                                                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                                                                        ) : (
                                                                            <Brain className="h-3.5 w-3.5 mr-1" />
                                                                        )}
                                                                        <span className="hidden md:inline">{item.is_learned ? "Изучено" : "Не изучено"}</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{item.is_learned ? "Слово отмечено как неизученное" : "Слово отмечено как изученное"}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0"
                                                                    size="sm"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                                <DropdownMenuItem
                                                                    onClick={() => confirmEditWord(item.id)}
                                                                >
                                                                    Изменить
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem 
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() => confirmDeleteWord(item.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Удалить
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Старница {currentPage} из {totalPages}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className="hidden md:flex"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Первая
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden md:inline">Предыдущая</span>
                                        </Button>
                                        
                                        <div className="hidden md:flex items-center">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                // Logic for displaying pages with centering the current
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
                                                        size="sm"
                                                        onClick={() => setCurrentPage(pageToShow)}
                                                        className="mx-0.5 h-8 w-8 p-0"
                                                    >
                                                        {pageToShow}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <span className="hidden md:inline">Следующая</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className="hidden md:flex"
                                        >
                                            Последняя
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 border rounded-md bg-card/50">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                {searchTerm ? "Слов не найдено" : "В вашем словаре отсутствуют слова"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                {searchTerm 
                                 ? "Попробуйте изменить поисковый запрос" 
                                 : "Добавьте первые слова, нажав на слово в субтритрах нужного фильма или воспользуйтесь кнопкой ниже"}
                            </p>
                            {searchTerm ? (
                                <Button 
                                    variant="outline" 
                                    className="mt-2"
                                    onClick={clearSearch}
                                >
                                    Очистить поиск
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowAddWordDialog(true)}
                                    className="gap-1"
                                    disabled={hasReachedLimit}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="hidden md:inline">
                                        {hasReachedLimit ? 'Лимит достигнут' : 'Добавить слово'}
                                    </span>
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Удалить слово */}
            <DialogDeleteWord isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onClick={handleDeleteWord}/>

            {/* Добавить новое слова */}
            <AlertDialog open={showAddWordDialog} onOpenChange={setShowAddWordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Добавление нового слова</AlertDialogTitle>
                        <AlertDialogDescription>
                            Введите слово и его перевод
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="english" className="text-sm font-medium">
                                Слово на английском
                            </label>
                            <Input
                                id="english"
                                value={newWord.english}
                                onChange={(e) => setNewWord({...newWord, english: e.target.value})}
                                placeholder="Введите слово"
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="translation" className="text-sm font-medium">
                                Перевод слова
                            </label>
                            <Input
                                id="translation"
                                value={newWord.translation}
                                onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                                placeholder="Введите перевод"
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleAddWord}
                            className="bg-primary"
                        >
                            Добавить слово
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* изменить перевод слова */}
            <AlertDialog open={showEditWordDialog} onOpenChange={setShowEditWordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Изменение перевода слова слова</AlertDialogTitle>
                        <AlertDialogDescription>
                            Введите новый перевод для слова
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="translation" className="text-sm font-medium">
                                Перевод слова
                            </label>
                            <Input
                                id="translation"
                                value={editedWord.translation}
                                onChange={(e) => setEditedWord({...editedWord, translation: e.target.value})}
                                placeholder="Введите перевод"
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleEditWord}
                            className="bg-primary"
                        >
                            Изменить слово
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}