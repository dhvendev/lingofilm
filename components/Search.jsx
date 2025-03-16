"use client"
import { Heart, Search } from "lucide-react";
import { useState} from "react";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { getMovieByQuery } from "@/services/axiosMethods";

export default function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery) return;

        const fetchMovies = async () => {
            const moviesData = await getMovieByQuery(debouncedQuery);
            setMovies(moviesData);
        };

        fetchMovies();
    }, [debouncedQuery]);


    if (!isOpen) {
        return (
            <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
                 <Search className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        );
    }
    return (
        <div className="absolute bg-black opacity-80 w-[100vw] top-0 left-[-5vw] lg:left-[-10vw] h-[100vh] z-4 flex items-start justify-center" onClick={() => setIsOpen(!isOpen)}>
            <div  onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-3 mt-30 w-[50%]">
                <Input className="text-white" type="text" placeholder="Введите название фильма" onChange={(e) => setQuery(e.target.value)}/>
                <div className="w-full">
                    {movies.map((movie) => (
                        <Link href={`/films/${movie.id}`} key={movie.id} className="flex flex-col gap-4 justify-start">
                            <div className="flex gap-2 justify-between items-center">
                                <p className="text-white">{movie.title}</p>
                                <p className="text-white">{movie.year}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}