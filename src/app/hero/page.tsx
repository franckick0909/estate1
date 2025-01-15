import Image from "next/image";
import SearchBar from "../components/searchBar/searchBar";
export default function Hero() {
  return (
    <div className="min-h-screen w-full flex relative">
      <div className="flex-1 md:flex-[3] bg-gradient-to-r from-violet-100 to-white flex flex-col justify-center items-center gap-8 px-2 md:pl-2 pt-10">
        <div className="text-gray-900 flex flex-col gap-8 pr-0 md:pr-12 lg:pr-12 xl:pr-24">
          <h1 className="text-4xl font-bold text-balance">
            Trouvez un bien immobilier & obtenez l&apos;endroit de vos rêves
          </h1>
          <p className="text-base text-balance">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Repellendus eum culpa excepturi deserunt quod non rem ullam numquam!
            Est placeat voluptatem iusto ipsam maxime corporis, aliquid aut quos
            incidunt assumenda illo modi, facilis ea error velit sint
            consectetur deserunt illum itaque nobis soluta in. Possimus eaque
            unde culpa facere provident.
          </p>
        </div>

        <SearchBar />

        <div className="flex items-center justify-center text-gray-900 w-full pr-0 md:pr-12 lg:pr-12 xl:pr-24 text-balance">
          <div className="flex flex-col flex-wrap items-center justify-center text-center gap-2 p-2 flex-grow-0 w-full h-full border-r border-gray-900">
            <h2 className="text-3xl font-bold">16+</h2>
            <p className="text-base">Années d&apos;expérience</p>
          </div>
          <div className="flex flex-col flex-wrap items-center text-center justify-center gap-2 p-2 flex-grow-0 w-full h-full">
            <h2 className="text-3xl font-bold">200</h2>
            <p className="text-base">Agences partenaires</p>
          </div>
          <div className="flex flex-col flex-wrap items-center text-center justify-center gap-2 p-2 flex-grow-0 w-full h-full border-l border-gray-900">
            <h2 className="text-3xl font-bold">1200+</h2>
            <p className="text-base">Propriétés vendues</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-[2] bg-gradient-to-b from-violet-100 to-emerald-50 relative px-2">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vw] h-[25vw] bg-white rounded-full shadow-2xl shadow-amber-200/30"></span>

        <div className="absolute bottom-28 right-4 w-[20vw] lg:w-[15vw] h-[25vw] lg:h-[20vw] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/bureau.jpg"
            alt="Hero"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="absolute top-20 right-[10%] w-[20vw] lg:w-[15vw] h-[20vw] lg:h-[15vw] rounded-full overflow-hidden shadow-lg">
          <Image
            src="/villa1.jpg"
            alt="Hero"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-[20vw] lg:w-[17vw] h-[25vw] lg:h-[20vw] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/immeuble.jpg"
            alt="Hero"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
