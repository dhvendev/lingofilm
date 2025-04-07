import Link from "next/link";
import { TvMinimalPlay } from "lucide-react";

export default function Footer() {
    return (
        <div className="flex flex-col justify-between">
            <div>
                <h1 className="flex flex-row font-bold text-4xl"><TvMinimalPlay size={50} className="mr-2"/>Lingo<span className="text-green-500">Film</span></h1>
                <p className="text-sm text-gray-400 pt-2">Смотри фильмы и сериалы в оригинале — изучай английский легко!</p>   
                <p className="text-sm text-gray-400 pt-2">Учись понимать живую речь. Используй доступные интерактивные субтитры на русском, английском или оба языка одновременно.</p> 
                <p className="text-sm text-gray-400 pt-2">Материалы предоставляются исключительно для ознакомления. © 2021–2024 LingoFilm 18+</p>    
            </div>
            <nav className="pt-5 flex flex-col md:flex-row lg:flex-row xl:flex-row  justify-start gap-5">
                <Link href={'/copyright#header'}>Правообладателям</Link>
                <Link href={'/#'}>Пользовательское соглашение</Link>
                <Link href={'/#'}>Политика конфиденциальности</Link>
                <Link href={'/#'}>Помощь</Link>
            </nav>
        </div>
    );
}