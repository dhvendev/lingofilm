"use client"
import { useState, useEffect } from "react";
import FilterBar from "@/components/filters/filter-bar";
import MovieCard from "@/components/movie-card";
import { getMoviesByFilter } from "@/services/axiosMethods";


export default function Films({ genres, years, lexicons, countries }) {
    const [filters, setFilters] = useState({
        genre: null,
        year: null,
        difficulty: null,
        country: null,
        sort: null
    });
    const [movies, setMovies] = useState([]);

    const fetchMoviesWithFilters = async () => {
        console.log('Ыутв', filters);
        const response = await getMoviesByFilter(filters);
        setMovies(response);
    };

    useEffect(() => {
        fetchMoviesWithFilters();
    }, [filters]);


    console.log(movies);
    console.log(filters);

    return (
        <>
            <FilterBar filters={filters} setFilters={setFilters} genres={genres} years={years} lexicons={lexicons} countries={countries}/>

            {movies && movies.length ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
                {movies.map((movie, index) => (<MovieCard key={movie.id} movie={movie} index={index} />))}
            </div> : <div>Ничего не найдено.</div>}
        </>
    );
}