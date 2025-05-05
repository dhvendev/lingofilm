"use client"
import { formatDate,  filterVocabulary, sortVocabulary, } from '@/utils/vocabularyUtils';
import { useState, useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc, Film, Calendar, ChevronRight, ChevronLeft, MoreVerticalIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DialogDeleteWord from './DialogDeleteWord';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


export default function DictionaryView({vocabulary, updateWordStatus, deleteWord, addWord}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteWordId, setDeleteWordId] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");

    const filteredWords = useMemo(() => 
        filterVocabulary(vocabulary, searchTerm),
        [vocabulary, searchTerm]
    );

    const sortedWords = useMemo(() => 
        sortVocabulary(filteredWords, sortBy, sortOrder),
        [filteredWords, sortBy, sortOrder]
    );

    

    // Расчет общего количества страниц
    const totalPages = useMemo(() => 
        Math.max(1, Math.ceil(sortedWords.length / itemsPerPage)),
        [sortedWords, itemsPerPage]
        );
    
        // Получение элементов текущей страницы
        const currentPageItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedWords.slice(startIndex, endIndex);
        }, [sortedWords, currentPage, itemsPerPage]);
    
        const handleSort = (column) => {
            if (sortBy === column) {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
                setSortBy(column);
                setSortOrder("asc");
            }
            };
        
            // Обработка переключения статуса слова
            const handleToggleStatus = async (id, currentStatus) => {
            try {
                await updateWordStatus(id, !currentStatus);
            } catch (error) {
                console.error("Ошибка при изменении статуса:", error);
            }
            };
        
            // Подтверждение удаления
            const confirmDeleteWord = (id) => {
            setDeleteWordId(id);
            setShowDeleteDialog(true);
            };

    const handleDeleteWord = async () => {
        if (!deleteWordId) return;
    
        try {
            await deleteWord(deleteWordId);
        } catch (error) {
            console.error("Ошибка при удалении слова:", error);
        } finally {
            setDeleteWordId(null);
            setShowDeleteDialog(false);
        }
        };

    return (
        <>
        <TabsContent value="dictionary">
                <div className="space-y-4 mt-4">
                <Card>
                    <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>Мои слова</CardTitle>
                        <Button variant="outline" onClick={() => {
                        setSelectedWord("");
                        setShowPopup(true);
                        }}>
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
                    {sortedWords.length > 0 ? (
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
                            Найдено: {sortedWords.length} слов
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
                                <TableHead className="cursor-pointer" onClick={() => handleSort("translation")}>
                                <div className="flex items-center">
                                    Перевод
                                    {sortBy === "translation" && (
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
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {currentPageItems.map((item) => (
                                <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.english_word}</TableCell>
                                <TableCell>{item.russian_translation}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {formatDate(item.created_at)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                    <Button 
                                        variant={item.is_learned ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleToggleStatus(item.id, item.is_learned)}
                                        className="rounded-sm"
                                    >
                                        {item.is_learned ? "Изучено" : "Не изучено"}
                                    </Button>
                                    
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                                            size="icon"
                                        >
                                            <MoreVerticalIcon />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem>Исправить</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => confirmDeleteWord(item.id)}>Удалить</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </div>
                                </TableCell>
                                <TableCell>
                                
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
                                // Логика для отображения страниц с центрированием текущей
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
                        <p className="text-muted-foreground">
                            {searchTerm ? "Слова не найдены" : "Ваш словарь пуст. Добавьте слова для изучения!"}
                        </p>
                        {searchTerm && (
                            <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setSearchTerm("")}
                            >
                            Сбросить поиск
                            </Button>
                        )}
                        </div>
                    )}
                    </CardContent>
                </Card>
                </div>
            </TabsContent>
            <DialogDeleteWord isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onClick={handleDeleteWord}/>
        </>
    )
}