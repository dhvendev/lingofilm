"use client"

import { useUser } from "@/context/userContext";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Lock} from 'lucide-react'
import useVocabulary from '@/hooks/useVocabulary';
import DictionaryHeader from "@/components/Dictionary/core/DictionaryHeader";
import DictionaryInfo from "@/components/Dictionary/core/DictionaryInfo";
import DictionaryView from "@/components/Dictionary/core/DictionaryView";
import DictionaryGames from "@/components/Dictionary/core/DictionaryGames";
import DictionarySkeleton from "@/components/Dictionary/core/DictionarySkeleton";
import DictionaryError from "@/components/Dictionary/core/DictionaryError";

export default function Page() {
    const userContext = useUser();
    const { 
        vocabulary, isLoading, error, 
        addWord, updateWordStatus, deleteWord, 
        translateWord 
    } = useVocabulary();

    const [activeTab, setActiveTab] = useState("dictionary");

    if (!userContext.user) {
        return redirect("/");
    }

    // Скелетон для загрузки
    if (isLoading) {
        return <DictionarySkeleton/>
    }

    // Display error state
    if (error) {
        return <DictionaryError/>
    }

    // Access user data after verification
    const user = userContext.user;

    return (
        <div className="container mx-auto px-4 pt-28 max-w-5xl">
            <Card className="w-full shadow-lg py-0 pb-6 border-none">
                {/* Шапка словаря */}
                <DictionaryHeader />
                
                {/* Прогресс пользователя */}
                <DictionaryInfo  vocabulary={vocabulary} />

                {/* Если нет подписки */}
                <div className="bg-gradient-to-l from-green-600 rounded-lg p-6 text-white text-center mx-5">
                    <div className="flex justify-center mb-4">
                        <Lock className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Разблокируйте полный функционал словаря</h3>
                    <p className="mb-4">Подписка открывает доступ к расширенным функциям, неограниченному количеству слов и игр</p>
                    <button className="bg-white text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Оформить подписку
                    </button>
                </div>

                {/* Панель навигации и контент словаря */}
                <CardContent>
                    <Tabs defaultValue="dictionary" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="dictionary">Словарь</TabsTrigger>
                            <TabsTrigger value="games">Обучающие мини-игры</TabsTrigger>
                        </TabsList>
                        
                        {/* Контент словаря */}
                        {activeTab === "dictionary" ? (
                            <DictionaryView 
                                vocabulary={vocabulary}
                                updateWordStatus={updateWordStatus}
                                deleteWord={deleteWord}
                                addWord={addWord}
                            />
                        ) : (
                            <DictionaryGames
                                vocabulary={vocabulary}
                                updateWordStatus={updateWordStatus}
                            />
                        )}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}