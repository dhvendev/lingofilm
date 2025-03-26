"use client"
import { useState, useEffect } from "react";
import FilterBar from "@/components/filters/filter-bar";
import MovieCard from "@/components/movie-card";
import { getMovies } from "@/services/axiosMethods";


export default function Films({ genres, years, lexicons, countries }) {
    const [filters, setFilters] = useState({
        genre: null,
        year: null,
        lexicon: null,
        country: null,
        sort: null
    });
    const [movies, setMovies] = useState([]);

    const fetchMoviesWithFilters = async () => {
        const response = await getMovies();
        setMovies(response);
    };

    useEffect(() => {
        fetchMoviesWithFilters();
    }, [filters]);


    console.log(movies);
    console.log(filters);

    return (
        <>
            <FilterBar setFilters={setFilters} genres={genres} years={years} lexicons={lexicons} countries={countries}/>
            <div className="grid grid-cols-8 gap-4">
                {movies.map((movie, index) => (<MovieCard key={movie.id} movie={movie} index={index} />))}
            </div>
        </>
    );
}