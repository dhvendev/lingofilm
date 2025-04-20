import Image from "next/image";
import { Button } from "../ui/button";
import { Calendar, Clock, Tag, User, ThumbsUp, Library } from "lucide-react";
import Slider from "../Slider";
import Player from "../Player";

export default function Film({ data }) {
  const movie = data;

  return (
    <div className="w-[80vw] mx-auto pt-24">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/5 flex justify-start">
          <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-xl">
            {movie.thumbnail_url ? (
              <Image 
                src={movie.thumbnail_url} 
                alt={movie.title} 
                layout="fill"
                objectFit="cover"
                className="transition-transform hover:scale-105 duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No Image</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-4/5">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>{movie.year}</span>
            </div>
            
            {movie.duration && (
              <div className="flex items-center gap-1">
                <Clock size={18} />
                <span>{movie.duration} мин</span>
              </div>
            )}
            
            {movie.rating && (
              <div className="flex items-center gap-1">
                <ThumbsUp size={18} />
                <span>{movie.rating}/10</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Описание</h2>
            <p className="text-gray-600 leading-relaxed">{movie.description}</p>
          </div>

            {movie.difficulty && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Library size={18} />
                  <h2 className="text-xl font-semibold">Лексика</h2>
                </div>
                <p className="text-gray-600">Сложность лексики - {movie.difficulty}</p>
              </div>
            )}
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={18} />
                <h2 className="text-xl font-semibold">Жанры</h2>
              </div>
              <p className="text-gray-600">
                {movie.genres.map(g => g).join(", ")}
              </p>
            </div>
          )}
          
          {movie.actors && movie.actors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User size={18} />
                <h2 className="text-xl font-semibold">Актеры</h2>
              </div>
              <p className="text-gray-600">
                {movie.actors.map(a => a).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4 justify-start mt-8">
        <Player />
        <Button variant="outline" className="px-6">
          Посмотреть позже
        </Button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Рекомендации</h2>
        <Slider />
      </div>
    </div>
  );
}