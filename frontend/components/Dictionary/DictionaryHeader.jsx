import { BookOpen, Sparkles } from "lucide-react";

export default function DictionaryHeader() {
    return (
        <div className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-green-900 via-green-700 to-green-500 rounded-t-lg"></div>
            <div className="absolute bottom-4 left-8 flex items-center">
                <div className="h-24 w-24 bg-black rounded-full flex items-center justify-center relative group">
                    <BookOpen className="h-12 w-12 text-white transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-1 rounded-full">
                        <Sparkles className="h-4 w-4" />
                    </div>
                </div>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-white">Мой словарь</h1>
                    <p className="text-white opacity-90">Учите слова из ваших любимых фильмов и шоу.</p>
                </div>
            </div>
        </div>
    );
}