import Link from "next/link";
import { SquarePlay, LibraryBig, Captions, Clock9, Disc} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { getFeaturedContent} from "@/services/axiosMethods";

export default async function MainSlider() {
    const movies = await getFeaturedContent()
    movies?.forEach((movie) => {
        const subtitleLanguages = movie.subtitles?.map(sub => sub.language) || [];
        
        const hasRussian = subtitleLanguages.includes("rus");
        const hasEnglish = subtitleLanguages.includes("eng");
    
        if (hasRussian && hasEnglish) {
            movie.subtitleText = "Русский, aнглийский, двойные";
        } else if (hasRussian) {
            movie.subtitleText = "Русский";
        } else if (hasEnglish) {
            movie.subtitleText = "Английский";
        } else {
            movie.subtitleText = "Нет субтитров";
        }
    });

    function truncateToSentence(text, limit = 50) {
        if (text.length <= limit) return text;
      
        const truncated = text.slice(0, limit);
        const remaining = text.slice(limit);
      
        const match = remaining.match(/([.!?])/);
        if (match) {
          const endIndex = match.index + 1;
          return truncated + remaining.slice(0, endIndex) + '...';
        }
      
        return truncated + '...';
      }

    return (
            <Carousel className="w-full h-[100vh] mx-auto">
                <CarouselContent className={"h-[100vh] relative"}>
                    {movies && movies.map((movie) => (
                        <CarouselItem key={movie.id} className="flex flex-col justify-center items-center relative w-full h-[100vh]">
                            <div className="flex flex-col relative z-10 w-[95vw] md:w-[90vw] lg:w-[80vw]">
                            <div className="flex flex-col gap-2 p-4 min-h-[35vh] rounded-lg w-full lg:w-1/2 bg-black bg-opacity-60">
                                    <h2 className="text-4xl md:text-5xl font-bold pt-3">{movie.title}<span className="text-base">{movie.year}</span></h2>
                                        <span className="flex items-center py-1"><Clock9 size={20} color="#FFFFFF" strokeWidth={1.5} className="my-auto mr-2"/>{movie.duration} минут</span>
                                        <span className="flex items-center py-1"><Disc size={20} color="#FFFFFF" strokeWidth={1.5} className="my-auto mr-2"/>{movie.genres.map(g => g).join(", ")}</span>
                                    <p className="flex items-center py-1"><span><LibraryBig size={24} color="#FFFFFF" strokeWidth={1.5} className="my-auto mr-2"/></span>Средняя сложность</p>
                                    <p className="flex items-center py-1"><span><Captions size={24} color="#FFFFFF" strokeWidth={1.5} className="my-auto mr-2"/></span>{movie.subtitleText}</p>
                                    <p>{truncateToSentence(movie.description)}</p>
                                    <div className="flex items-center">
                                        <Link href={`/films/${movie.slug}`}> 
                                            <Button className="primary1 rounded">
                                                <SquarePlay size={50} color="black" strokeWidth={2.5} />
                                                <span className="ml-2 text-md">Смотреть сейчас</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {movie.cover_url && <div className="absolute top-0 left-0 w-full h-full z-0">
                                <Image
                                    src={movie.cover_url}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>}
                            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[rgba(10,10,10,0.7)] via-[rgba(10,10,10,0.3)] to-transparent z-10"></div>
                            <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[rgba(10,10,10,1)] via-[rgba(10,10,10,0.7)] to-transparent z-10"></div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>


//         <div className="flex flex-col">
//             <p>main slider</p>
// {movies && movies.map((movie) => (
// <div key={movie.id}>
// <Link href={`/films/${movie.slug}`}>{movie.title}</Link>
// </div>
// ))}
//         </div>
    );
}