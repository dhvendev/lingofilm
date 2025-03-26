"use client"
import { SelectScrollable } from "@/components/filters/select-filter";
import { ArrowDownUp, Calendar, Earth, Film, Library } from "lucide-react";

export default function FilterBar({ setFilters, genres, years, lexicons, countries}) {
    const sortOptions = {
        "По рейтингу - возрастанию": "rating",
        "По рейтингу - убыванию": "-rating",
        "По году - возрастанию": "year",
        "По году - убыванию": "-year",
        "По лексике - возрастанию": "lexicographical",
        "По лексике - убыванию": "-lexicographical"
    };
    
    const handleSortChange = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sort: sortOptions[value] || prevFilters.sort
        }));
    };
    const handleFilterChange = (filter, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filter]: value || null,
        }));
    }

    return (
        <div className="flex flex-row w-full items-center justify-between pb-4">
            <SelectScrollable title={'Жанры'} icon={<Film color="#00e663" strokeWidth={2.5} size={16} />} options={genres} onChange={(value) => handleFilterChange("genre", value)}/>
            <SelectScrollable title={'Год'} icon={<Calendar color="#00e663" strokeWidth={2.5} size={16} />} options={years} onChange={(value) => handleFilterChange("year", value)}/>
            <SelectScrollable title={'Лексика'} icon={<Library color="#00e663" strokeWidth={2.5} size={16} />} options={lexicons} onChange={(value) => handleFilterChange("lexicon", value)}/>
            <SelectScrollable title={'Страна'} icon={<Earth color="#00e663" strokeWidth={2.5} size={16} />} options={countries} onChange={(value) => handleFilterChange("country", value)}/>
            <SelectScrollable title={'Сортировка'} icon={<ArrowDownUp color="#00e663" strokeWidth={2.5} size={16} />} options={Object.keys(sortOptions)} onChange={(value) => handleSortChange(value)}/>
        </div>
    );
}