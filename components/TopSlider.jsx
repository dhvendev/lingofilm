import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel" 
  import Link from "next/link";

  import Image from "next/image";
  import { LibraryBig, Star, ChartNoAxesColumnDecreasing } from "lucide-react";

export default function TopSlider({movies}) {
    return (
        <div className="flex flex-col gap-5 w-full">
            <h2 className="ml-[10vw] font-semibold text-2xl">Топ за неделю</h2>
            <Carousel opts={{align: "start",}} className="w-[78vw] mx-auto" >
                <CarouselContent>
                    {movies.map((movie, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                        <Link href="#" className="flex flex-row gap-5 w-full">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-7xl font-extrabold transform rotate-[5deg] duration-200">{index + 1}</h1>
                            </div>
                            <div className="w-[150px] h-[200px] relative">
                                <Image src={movie.thumbnail_url ? movie.thumbnail_url : "/3.jpg"} fill alt="poster" className="object-cover rounded-md" />
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <p><span className="rounded bg-gray-200 px-2 text-black text-sm">{movie.type}</span></p>
                                <h2 className="text-xl font-bold">{movie.title}</h2>
                                <p className="text-[12px]">{movie.genre?.slice(0, 2).join(', ')}</p>
                                <p className="flex flex-row items-center text-sm"><span><ChartNoAxesColumnDecreasing size={16} color="#22c55e" strokeWidth={3}  className="my-auto mr-1"/></span> asdf</p>
                                <p className="flex flex-row items-center text-sm"><span><Star size={16} color="#22c55e" strokeWidth={3} className="my-auto mr-1"/></span> 23423</p>
                            </div>
                            
                            
                        </Link>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-black"/>
                <CarouselNext className="bg-black"/>
            </Carousel>
        </div>
    );
            
}