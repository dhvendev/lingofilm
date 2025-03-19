import MainSlider from "@/components/MainSlider";
import { getMovies } from "@/services/axiosMethods";

export default  async function Home() {
  const movies = await getMovies()
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MainSlider movies={movies} />
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </main>
  );
}
