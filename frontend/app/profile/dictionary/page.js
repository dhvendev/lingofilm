"use client"

import { useUser } from "@/context/userContext";
import { useState} from "react";
import { redirect } from "next/navigation";
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useVocabulary from '@/hooks/useVocabulary';
import DictionaryHeader from "@/components/Dictionary/DictionaryHeader";
import DictionaryInfo from "@/components/Dictionary/DictionaryInfo";
import DictionaryView from "@/components/Dictionary/DictionaryView";
import GamesView from "@/components/Dictionary/DictionaryGamesView";


export default function DictionaryPage() {
    const userContext = useUser();
    const { 
        vocabulary, isLoading, error, 
        addWord, updateWordStatus, deleteWord, 
        translateWord } = useVocabulary();

    const [activeTab, setActiveTab] = useState("dictionary");

    if (!userContext.user) {
        return redirect("/");
    }



    // Отображение загрузки
    if (isLoading) {
    return (
        <div className="container mx-auto px-4 pt-28 max-w-4xl">
        <Card className="w-full shadow-lg py-0 pb-6">
            <div className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-t-lg"></div>
            <div className="absolute bottom-4 left-8 flex items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="ml-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
                </div>
            </div>
            </div>
            
            <CardHeader className="pt-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            
            <CardContent>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-60 w-full mt-4" />
            </CardContent>
        </Card>
        </div>
    );
    }

    // Отображение ошибки
    if (error) {
    return (
        <div className="container mx-auto px-4 pt-28 max-w-4xl">
            <Card className="w-full shadow-lg py-0 pb-6">
                <CardHeader>
                    <CardTitle className="pt-4">Ошибка загрузки словаря</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-red-500">{error}</p>
                    <Button className="mt-4 mx-auto block" onClick={() => window.location.reload()}>
                        Попробовать снова
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
    }

    // Доступ к данным пользователя после проверки
    const user = userContext.user;

    return (
    <div className="container mx-auto px-4 pt-28 max-w-4xl">
        <Card className="w-full shadow-lg py-0 pb-6">
        {/* Шапка словаря */}
        <DictionaryHeader/>
        
        {/* Информация о словаре */}
        <DictionaryInfo username={user.username} vocabulary={vocabulary}/>
        
        {/* Вкладки для навигации */}
        <CardContent>
            <Tabs defaultValue="dictionary" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dictionary">Словарь</TabsTrigger>
                <TabsTrigger value="games">Игры для заучивания</TabsTrigger>
            </TabsList>
            
            {/* Содержимое вкладки словаря */}
            {activeTab === "dictionary" ? (
                <DictionaryView 
                    vocabulary={vocabulary}
                    updateWordStatus={updateWordStatus}
                    deleteWord={deleteWord}
                    addWord={addWord}
                />
            ) : (
              <GamesView 
                vocabulary={vocabulary}
                updateWordStatus={updateWordStatus}
              />
            )}
            
            {/* Содержимое вкладки игр */}
            
            </Tabs>
        </CardContent>
        </Card>

        
    </div>
    );
    }