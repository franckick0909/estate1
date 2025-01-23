"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MdBathroom,
  MdBed,
  MdChat,
  MdLocationOn,
  MdOutlineBookmarkBorder,
  MdVisibility,
} from "react-icons/md";

interface CardProps {
  title: string;
  images: { id: string; url: string }[];
  chambres: number;
  salleDeBain: number;
  prix: number;
  type: string;
  ville: string;
  adresse: string;
  description: string;
  id: number;
}

export default function Card({
  images,
  title,
  description,
  prix,
  adresse,
  type,
  chambres,
  salleDeBain,
  id,
}: CardProps) {

  return (
    <div className="flex flex-col md:flex-row rounded-xl overflow-hidden w-full bg-white p-1">
      {/* Section Image */}
      <div className="relative w-full md:max-w-[350px] h-full">
        <Link href={`/list/detail/${id}`}>
          <Image
            key={images[0].id}
            src={images[0].url}
            alt={title}
            width={500}
            height={500}
            className="object-cover h-full max-h-[250px] md:max-h-full w-full rounded-lg"
            priority
          />
        </Link>
        <div className="absolute top-4 right-4">
          <button
            title="Ajouter à mes favoris"
            type="button"
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <MdOutlineBookmarkBorder size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Section Contenu */}
      <div className="flex-1 px-2 pb-4 md:pb-6 w-full min-w-48">
        <div className="flex flex-wrap md:flex-row justify-between items-start sm:items-center gap-2 my-4 md:my-0">
          <Link href={`/list/detail/${id}`} className="relative">
            <h1
              title={title}
              className="text-lg md:text-xl font-semibold text-gray-800 before:content-[''] before:absolute before:w-full before:h-[1px] before:bottom-0 before:left-0 
                          before:bg-black before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100
                          before:transition-transform before:duration-300 before:ease-in-out"
            >
              {title}
            </h1>
          </Link>
          <p className="text-lg md:text-xl font-bold text-gray-800 bg-violet-50 px-2 py-1 rounded-md border border-violet-100">
            {prix.toLocaleString("fr-FR")} €
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-4 text-sm md:text-base">
          <MdLocationOn className="mr-2 flex-shrink-0" />
          <p className="line-clamp-1">{adresse}</p>
        </div>



        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          <span className="inline-flex items-center text-gray-700 text-sm md:text-base">
            <MdBed className="mr-2" /> {chambres} ch.
          </span>
          <span className="inline-flex items-center text-gray-700 text-sm md:text-base">
            <MdBathroom className="mr-2" /> {salleDeBain} sdb.
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs md:text-sm">
            {type}
          </span>
        </div>

        <p className="text-gray-500 mb-4 text-sm md:text-md line-clamp-2">
          {description}
        </p>

        <div className="flex justify-end mt-4 gap-2">
          <Link href={`/list/detail/${id}`}>
            <button
              title="Voir la fiche"
              type="button"
              className="sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base shadow-md"
            >
              <MdVisibility className="flex-shrink-0 text-xl" />
            </button>
          </Link>
          <button
              title="Contacter"
              type="button"
            className="sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base shadow-md"
          >
            <MdChat className="flex-shrink-0 text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
