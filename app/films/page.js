import Films from "@/components/films/films";
import { getGenres, getCountries } from "@/services/axiosMethods";

export default async function Page() {
    const genres = await getGenres();
    const countries = await getCountries();
    const years = Array.from({ length: new Date().getFullYear() - 1998 + 1 }, (_, index) => new Date().getFullYear() - index);
    const lexicons = ["Легкая", "Средняя", "Сложная" ];

    return (
        <main className="flex min-h-screen flex-col items-center pt-24 w-[95vw] md:w-[90vw] lg:w-[80vw] mx-auto">
            <div className="flex flex-row gap-4 w-full items-center justify-center md:justify-start pt-4">
                <h1 className="text-3xl font-bold mb-4 align-left">Фильмы</h1>
            </div>
            <Films genres={genres} years={years} lexicons={lexicons} countries={countries} />
        </main>
    );
}