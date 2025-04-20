import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "./movie-card";
import { getMovies } from "@/services/axiosMethods";
import Link from "next/link";
import { Popcorn } from "lucide-react";

export default async function Slider() {
    const movies = await getMovies();
    return (
        <div className="flex flex-col gap-6 w-full">
            <Carousel opts={{ align: "start" }} className="w-[78vw] mx-auto">
                <CarouselContent>
                    {movies.map((movie, index) => (
                        <CarouselItem key={index} className="basis-1/1 md:basis-1/3 lg:basis-1/4 xl:basis-1/7 flex flex-col py-6 gap-4">
                            <MovieCard movie={movie} index={index} />
                        </CarouselItem>
                    ))}
                    <CarouselItem className="basis-1/1 md:basis-1/3 lg:basis-1/4 xl:basis-1/7 flex flex-col py-6 gap-4">
                        <Link href="/films" className="flex flex-col gap-2 items-center  border border-green-500 h-full rounded-lg justify-center">
                            <Popcorn size={35} className="mx-auto" />
                            <span className="text-center">Все фильмы</span>
                        
                        </Link>
                    </CarouselItem>

                </CarouselContent>
                <CarouselPrevious className="bg-black/80 text-white hover:bg-black" />
                <CarouselNext className="bg-black/80 text-white hover:bg-black" />
            </Carousel>
        </div>
    );
}
