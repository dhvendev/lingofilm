import MainSlider from "@/components/MainSlider";
import TopSlider from "@/components/TopSlider";
import { getMovies } from "@/services/axiosMethods";

export default async function Home() {
  const movies = await getMovies()
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MainSlider movies={movies} />
      <TopSlider movies={movies}/>
    </main>
  );
}
