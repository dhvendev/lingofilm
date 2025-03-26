import Link from "next/link";
import Image from "next/image";
import { Calendar, Library, ThumbsUp } from "lucide-react";

export default function MovieCard({movie, index}) {
    return (
        <Link href="#" className="flex flex-row gap-4 w-full items-center justify-center">
            <div className="relative flex items-center justify-center">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-300 transform rotate-[5deg] transition-transform duration-300 group-hover:rotate-0">
                    {index + 1}
                </h1>
            </div>
            <div className="relative group">
                <Image
                    src={movie.thumbnail_url || "/placeholder.jpg"}
                    alt={movie.title}
                    width={200}
                    height={140}
                    className="rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
                <div className="absolute inset-0 z-10 flex flex-col space-y-2 p-2 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg items-start will-change-opacity">
                    <span className="text-white text-xs font-semibold flex items-center gap-2">
                        <Calendar color="#00e663" strokeWidth={2.5} size={16} />
                        {movie.year}
                    </span>
                    <span className="text-white text-xs font-semibold flex items-center gap-2">
                        <Library color="#00e663" strokeWidth={2.5} size={16} />
                        Лексика - средняя
                    </span>
                    <span className="text-white text-xs font-semibold flex items-center gap-2">
                        <ThumbsUp color="#00e663" strokeWidth={2.5} size={16} />
                        {movie.statistics?.likes || 0}
                    </span>
                    <span 
                        className="text-white text-md font-semibold flex items-center gap-2 mt-auto" 
                        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}
                    >
                        {movie.title}
                    </span>
                </div>
            </div>
        </Link>
    );
};