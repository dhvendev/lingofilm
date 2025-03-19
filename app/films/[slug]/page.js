import { notFound } from "next/navigation";
import { getMovie } from "@/services/axiosMethods";
import Film from "@/components/films/Film";

export default async function Page({ params }) {
    const { slug } = params
    const film = await getMovie(slug)
    if (!film) {
        notFound()
    }

    return (
        <Film data={film}></Film>
    );
}