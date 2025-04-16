"use client";

import dynamic from "next/dynamic";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import { TvMinimalPlay, Menu, X} from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "./ui/button";
import { LoginButtonsSkeleton } from "./SkeletonLoader";
import HeaderButtons from "./HeaderButtons";

const LoginForm = dynamic(() => import("./users/LoginForm"), { ssr: false, loading: () => <LoginButtonsSkeleton /> });
const ProfileBar = dynamic(() => import("./users/ProfileBar"), { ssr: false, loading: () => <LoginButtonsSkeleton /> });

export default function Header() {
    const { user } = useUser()    
    const [isOpen, setIsOpen] = useState(false);
    console.log("берется из контекста", user);
    return (
        <header className="w-[95vw] md:w-[90vw] lg:w-[80vw] absolute top-0 bg-opacity-15 py-5 md:py-10 z-10 grid grid-cols-2 md:grid-cols-3 items-center">
            <h1 className="flex font-bold text-lg items-center">
                <Link href={'/#'} className="flex flex-row">
                    <TvMinimalPlay size={30} className="mr-2"/>
                    Lingo<span className="text-green-500">Film</span>
                </Link>
            </h1>

            <div className="flex justify-end md:hidden items-center">
                <Button className="bg-green-500" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={35} color="black"/> : <Menu size={35} color="black"/>}
                </Button>
            </div>


            <ul className={`absolute md:relative top-[60px] left-0 w-full bg-black bg-opacity-90 p-5 md:static md:flex md:justify-center md:gap-5 md:bg-transparent md:p-0 items-center bg-white md:bg-opacity-0 text-black md:text-white rounded-md font-bold
                ${isOpen ? "block" : "hidden"}`}>
                <li><Link href="/" className="hover:text-green-500 duration-75 hover:border-b-2 pb-1 hover:border-green-500">Главная</Link></li>
                <li><Link href="/films" className="hover:text-green-500 duration-75 hover:border-b-2 pb-1 hover:border-green-500">Фильмы</Link></li>
                <li><Link href="/series" className="hover:text-green-500 duration-75 hover:border-b-2 pb-1 hover:border-green-500">Сериалы</Link></li>
                <li><Link href="/about" className="hover:text-green-500 duration-75 hover:border-b-2 pb-1 hover:border-green-500">О нас</Link></li>
            </ul>
            <Suspense fallback={<LoginButtonsSkeleton />}>
                <HeaderButtons />
            </Suspense>
        </header>
    );
}
