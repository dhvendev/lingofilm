import MainSlider from "@/components/MainSlider";
import Slider from "@/components/Slider";
import TopSlider from "@/components/TopSlider";
import { getMovies } from "@/services/axiosMethods";
import Link from "next/link";

export default async function Home() {
  const movies = await getMovies()
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MainSlider movies={movies} />
      <TopSlider movies={movies}/>
      <div className="w-[80vw] flex justify-between ">
        <h2 className="font-semibold text-2xl">Новинки</h2>
      </div>
      <Slider />

      <div className="w-[80vw] flex justify-between ">
        <Link href="/films"><h2 className="font-semibold text-2xl">Фильмы</h2></Link>
      </div>
      <Slider />

      <div className="w-[80vw] flex justify-between ">
        <Link href="/films"><h2 className="font-semibold text-2xl">Сериалы</h2></Link>
      </div>
      <Slider />

    </main>
  );
}
