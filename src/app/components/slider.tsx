"use client";

import Image from "next/image";
import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdClose } from "react-icons/md";

export default function Slider({ images }: { images: string[] }) {
  const [imageSlider, setImageSlider] = useState<number | null>(null);

  const handlePrevious = () => {
    if (imageSlider === null) return;
    setImageSlider(imageSlider === 0 ? images.length - 1 : imageSlider - 1);
  };

  const handleNext = () => {
    if (imageSlider === null) return;
    setImageSlider(imageSlider === images.length - 1 ? 0 : imageSlider + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full h-full">
      {imageSlider !== null && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40 w-full h-auto overflow-hidden">
          <div className="relative max-w-screen-2xl mx-auto w-full h-full max-h-screen overflow-hidden">
            <Image
              src={images[imageSlider]}
              alt="image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute max-w-full max-h-full top-6 left-6 sm:top-6 sm:right-6 flex items-center justify-end">
            <button
              title="Fermer"
              type="button"
              className="bg-black rounded-full p-3 text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 z-50"
              onClick={() => setImageSlider(null)}
            >
              <MdClose className="text-white md:text-2xl" />
            </button>
          </div>

          <div className="absolute flex items-center justify-between w-full h-full px-4">
            <button
              title="Précédent"
              type="button"
              className="bg-black/50 rounded-full p-4 flex items-center justify-center z-50"
              onClick={handlePrevious}
            >
              <MdArrowBack className="text-white md:text-2xl" />
            </button>
            <button
              title="Suivant"
              type="button"
              className="bg-black/50 rounded-full p-4 flex items-center justify-center z-50"
              onClick={handleNext}
            >
              <MdArrowForward className="text-white md:text-2xl" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-[3]">
        <Image
          src={images[0]}
          alt="image"
          width={500}
          height={500}
          className="object-cover rounded-lg h-full w-full cursor-pointer"
          priority
          onClick={() => setImageSlider(0)}
        />
      </div>
      <div className="gap-2 flex-1 flex flex-row md:flex-col justify-between items-center h-auto w-full">
        {images.slice(1).map((image, index) => (
          <Image
            src={image}
            alt="image"
            width={300}
            height={300}
            key={index}
            className="object-cover rounded-lg min-h-[100px] min-w-[100px] md:h-full md:w-full cursor-pointer"
            priority
            onClick={() => setImageSlider(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}
