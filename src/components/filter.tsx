import { MdFilterList } from "react-icons/md";

export default function Filter() {
  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full">
      <h1 className="text-gray-700 text-2xl font-bold">
        Résultat de recherche pour <b>Londres</b>
      </h1>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:gap-1">
          <label htmlFor="type" className="text-gray-700 text-sm">
            Emplacement
          </label>
          <input
            title="Emplacement"
            type="text"
            id="city"
            name="city"
            placeholder="Entrez votre ville"
            className="border border-gray-300 rounded-md px-2 py-[10px] text-gray-700 text-sm md:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 items-start">
        <div className="flex flex-col md:gap-1">
          <label htmlFor="type" className="text-gray-700 text-sm">
            Type de bien
          </label>
          <select
            title="Type de bien"
            id="type"
            name="type"
            className="w-full border border-gray-300 rounded-md px-2 py-[10px] text-gray-700 text-sm md:text-base"
          >
            <option value="">Tous</option>
            <option value="achat">Achat</option>
            <option value="vente">Vente</option>
          </select>
        </div>
        <div className="flex flex-col md:gap-1">
          <label htmlFor="type" className="text-gray-700 text-sm">
            Propriété
          </label>
          <select
            title="Propriété"
            id="property"
            name="property"
            className="w-full border border-gray-300 rounded-md px-2 py-[10px] text-gray-700 text-sm"
          >
            <option value="">Tous</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
        <div className="flex flex-col md:gap-1">
          <label htmlFor="minPrice" className="text-gray-700 text-sm">
            Prix min
          </label>
          <input
            title="Prix minimum"
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Tous"
            className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-700 text-gray-700 text-sm md:text-base"
          />
        </div>
        <div className="flex flex-col md:gap-1">
          <label htmlFor="maxPrice" className="text-gray-700 text-sm">
            Prix max
          </label>
          <input
            title="Prix max"
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Tous"
            className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-700 text-gray-700 text-sm md:text-base"
          />
        </div>
        <div className="flex flex-col md:gap-1">
          <label htmlFor="bedrooms" className="text-gray-700 text-sm">
            Chambres
          </label>
          <input
            title="Nombre de chambres"
            type="text"
            id="bedrooms"
            name="bedrooms"
            placeholder="Tous"
            className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-700 text-gray-700 text-sm md:text-base"
          />
        </div>
        <button
          type="button"
          className="col-span-2 md:col-span-1 justify-center bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mt-6"
        >
          <MdFilterList />
          Filtrer
        </button>
      </div>
    </div>
  );
}
