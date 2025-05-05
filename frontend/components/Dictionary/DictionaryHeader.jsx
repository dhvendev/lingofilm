import { BookOpen } from "lucide-react"

export default function DictionaryHeader() {
    return (
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
    )
}