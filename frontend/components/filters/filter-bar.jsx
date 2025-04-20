"use client"
import { SelectScrollable } from "@/components/filters/select-filter";
import { ArrowDownUp, Calendar, Earth, Film, Library, Undo2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FilterBar({ filters, setFilters, genres, years, lexicons, countries}) {
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

    const handleReset = () => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            genre: null,
            year: null,
            difficulty: null,
            country: null,
            sort: null
        }));
    }

    const [isOpen, setIsOpen] = useState(false);

    const getKeyByValue = (value) => {
        return Object.keys(sortOptions).find(key => sortOptions[key] === value);
    };

    return (
        <>
            <div className="flex justify-end md:hidden items-center pb-4">
                <Button variant="outline" className={"bg-popover text-muted-foreground text-sm"}  onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={35} color="#00e663"/>
                    <span>Настроить фильтр</span>
                </Button>
            </div>
            <div className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row w-full items-center justify-between pb-4 gap-2`}>
                <SelectScrollable title={'Жанры'} icon={<Film color="#00e663" strokeWidth={2.5} size={16} />} options={genres} onChange={(value) => handleFilterChange("genre", value)} value={filters.genre}/>
                <SelectScrollable title={'Год'} icon={<Calendar color="#00e663" strokeWidth={2.5} size={16} />} options={years} onChange={(value) => handleFilterChange("year", value)} value={filters.year}/>
                <SelectScrollable title={'Лексика'} icon={<Library color="#00e663" strokeWidth={2.5} size={16} />} options={lexicons} onChange={(value) => handleFilterChange("difficulty", value)} value={filters.difficulty}/>
                <SelectScrollable title={'Страна'} icon={<Earth color="#00e663" strokeWidth={2.5} size={16} />} options={countries} onChange={(value) => handleFilterChange("country", value)} value={filters.country}/>
                <SelectScrollable title={'Сортировка'} icon={<ArrowDownUp color="#00e663" strokeWidth={2.5} size={16} />} options={Object.keys(sortOptions)} onChange={(value) => handleSortChange(value)} value={getKeyByValue(filters.sort)}/>
                <Button variant={"outline"} size={"icon"}  className={"bg-popover"} onClick={handleReset}>
                    <Undo2 color="#00e663" strokeWidth={2.5} size={16} />
                    </Button>
            </div>
        </>
    );
}