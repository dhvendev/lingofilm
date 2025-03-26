import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "./movie-card-top-slide";

export default function TopSlider({ movies }) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <h2 className="ml-[10vw] font-semibold text-2xl">Топ за неделю</h2>
            <Carousel opts={{ align: "start" }} className="w-[78vw] mx-auto">
                <CarouselContent>
                    {movies.map((movie, index) => (
                        <CarouselItem key={index} className="basis-1/1 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex flex-col py-6 gap-4">
                            <MovieCard movie={movie} index={index} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-black/80 text-white hover:bg-black" />
                <CarouselNext className="bg-black/80 text-white hover:bg-black" />
            </Carousel>
        </div>
    );
}
