"use client";

import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";

const types = ["acheter", "louer"];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState({
    type: types[0],
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (value: string) => {
    setQuery((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);

    const searchParams = new URLSearchParams({
      type: query.type,
      location: query.location,
      minPrice: query.minPrice.toString(),
      maxPrice: query.maxPrice.toString(),
    });

    router.push(`/list?${searchParams.toString()}`);
  };

  return (
    <div className="w-full pr-0 md:pr-12 lg:pr-12 xl:pr-24 flex flex-col gap-1 md:gap-0">
      <div className="flex gap-1 md:gap-0">
        {types.map((type, index) => (
          <button
            key={index}
            onClick={() => switchType(type)}
            type="button"
            className={`${
              query.type === type
                ? "active bg-gray-900 text-white"
                : "bg-white text-gray-900"
            } rounded-t-md p-2 flex items-center gap-2 px-8 py-4 transition-all duration-200 shadow-md`}
          >
            {type}
          </button>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap md:border border-gray-900 text-gray-900 rounded-b-md rounded-tr-md gap-1 md:gap-0"
      >
        <input
          type="text"
          name="location"
          placeholder="Localisation en ville"
          className="w-full md:w-[40%] py-4 px-2 md:rounded-bl-md md:rounded-tr-md focus:outline-1 focus:outline-gray-900 md:border-none rounded-none border-b-[1px] border-gray-900"
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={1000000}
          placeholder="Prix Min"
          className="w-full md:w-[25%] py-4 px-2 focus:outline-1 focus:outline-gray-900 md:border-none border-b-[1px] border-gray-900"
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={1000000}
          placeholder="Prix Max"
          className="w-full md:w-[25%] py-4 px-2 focus:outline-1 focus:outline-gray-900 md:border-none border-b-[1px] border-gray-900"
        />
        <button
          type="submit"
          className="w-full md:w-[10%] bg-violet-500 hover:bg-violet-600 text-white py-4 px-2 flex items-center justify-center gap-2 rounded-b-md md:rounded-b-none md:rounded-r-md shadow-lg"
        >
          <MdSearch className="w-7 h-7" />
          <span className="md:hidden">Rechercher</span>
        </button>
      </form>
    </div>
  );
}
