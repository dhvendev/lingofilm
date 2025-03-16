import { getMovies } from "@/services/axiosMethods";
import Link from "next/link";

export default  async function Home() {
  const movies = await getMovies()
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Главная страница</h1>
      {movies && movies.map((movie) => (
          <div key={movie.id}>
            <Link href={`/films/${movie.slug}`}>{movie.title}</Link>
          </div>
      ))}
    </main>
  );
}
