import Map from "@/app/components/map/map";
import Slider from "@/app/components/slider";
import { listData, userData } from "@/app/data/listData";
import Image from "next/image";
import { MdChat, MdBookmark} from "react-icons/md";

import {
  FaBus,
  FaCartShopping,
  FaEnvelope,
  FaPhone,
  FaRegCircle,
  FaSchool,
  FaTrainSubway,
  FaUtensils,
} from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";

export default function Detail({ params }: { params: { id: string } }) {
  const data = listData.find((item) => item.id === parseInt(params.id));
  const user = userData.find((user) => user.id === parseInt(params.id));

  if (!data) {
    return <div>Propriété non trouvée</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <div className="flex-1 md:flex-[3] px-2 bg-gradient-to-r from-violet-100 to-white pt-10 w-full">
        <div className="pr-4">
          <Slider
            key={data.id}
            images={data.images.map((item) => item.url) || []}
          />
          <div className="flex justify-between gap-4 mt-8 flex-col md:flex-row">
            <div className="flex flex-col items-baseline gap-4">
              <h1 className="text-xl md:text-2xl text-gray-800">
                {data.title}
              </h1>

              <div className="text-sm text-gray-500 flex flex-col gap-4">
                <div className="flex items-center gap-1 -ml-1">
                  <MdLocationOn className="text-xl text-gray-500" />
                  <p>{data.adresse}</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-gray-800 bg-violet-200 px-2 py-1 rounded-md w-fit">
                  {data.prix.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
            {user && (
              <div className="bg-violet-100 rounded-lg p-4 flex flex-col gap-2 w-full md:w-fit">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={user.img}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-lg text-gray-600" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-gray-600"
                    >
                      {user.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-lg text-gray-600" />
                    <a
                      href={`tel:${user.phone}`}
                      className="text-sm text-gray-600"
                    >
                      {user.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center max-w-lg">
            <div className="w-8 h-[1px] bg-violet-600"></div>
            <p className="text-xl text-gray-800 px-2 capitalize">Description</p>
            <div className="w-full h-[1px] bg-violet-600"></div>
          </div>
          <p className="text-sm text-gray-600">{data.description}</p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center max-w-lg">
            <div className="w-8 h-[1px] bg-violet-600"></div>
            <p className="text-xl text-gray-800 px-2 whitespace-nowrap">
              Les performances énergétiques
            </p>
            <div className="w-full h-[1px] bg-violet-600"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* DPE */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-800 font-medium mb-2">DPE</h3>
              <p className="text-sm text-gray-600 mb-4">
                Consommation : {data.energie.dpe.valeur} kWh/m²/an
              </p>
              <div className="space-y-2">
                {data.energie.dpe.echelle.map((niveau) => (
                  <div key={niveau.lettre} className="flex items-center gap-2">
                    <div className="w-8 text-sm text-gray-600">{niveau.lettre}</div>
                    <div
                      className={`flex-1 h-8 ${niveau.couleur} flex items-center px-2 text-white relative`}
                    >
                      <span>{niveau.min}</span>
                      {niveau.lettre === data.energie.dpe.score && (
                        <div className="absolute right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center text-yellow-500 text-xs font-bold">
                          ●
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GES */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-800 font-medium mb-2">GES</h3>
              <p className="text-sm text-gray-600 mb-4">
                Émissions : {data.energie.ges.valeur} kg CO₂/m²/an
              </p>
              <div className="space-y-2">
                {data.energie.ges.echelle.map((niveau) => (
                  <div key={niveau.lettre} className="flex items-center gap-2">
                    <div className="w-8 text-sm text-gray-600">{niveau.lettre}</div>
                    <div
                      className={`flex-1 h-8 ${niveau.couleur} flex items-center px-2 text-white relative`}
                    >
                      <span>{niveau.min}</span>
                      {niveau.lettre === data.energie.ges.score && (
                        <div className="absolute right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center text-yellow-500 text-xs font-bold">
                          ●
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 md:flex-[2] px-2 bg-gradient-to-b from-violet-100 to-emerald-50 pt-10 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-[1px] bg-violet-600"></div>
              <p className="text-xl text-gray-800 px-2 capitalize">Général</p>
              <div className="w-full h-[1px] bg-violet-600"></div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {data.general &&
                  data.general.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <FaRegCircle className="text-[8px] text-violet-600" />
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-[1px] bg-violet-600"></div>
              <p className="text-xl text-gray-800 px-2 capitalize">
                équipements
              </p>
              <div className="w-full h-[1px] bg-violet-600"></div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {data.equipements &&
                  data.equipements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <FaRegCircle className="text-[8px] text-violet-600" />
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-[1px] bg-violet-600"></div>
              <p className="text-xl text-gray-800 px-2 whitespace-nowrap">
                Bon à savoir
              </p>
              <div className="w-full h-[1px] bg-violet-600"></div>
            </div>
            <div className="p-4">
              {data.bonASavoir &&
                data.bonASavoir.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaSchool className="text-xl text-violet-600" />
                      <p className="text-gray-700">
                        Ecole{" "}
                        <span className="text-gray-500 font-bold">
                          {item.ecole}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaBus className="text-xl text-violet-600" />
                      <p className="text-gray-700">
                        Bus{" "}
                        <span className="text-gray-500 font-bold">
                          {item.bus}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCartShopping className="text-xl text-violet-600" />
                      <p className="text-gray-700">
                        Super Market{" "}
                        <span className="text-gray-500 font-bold">
                          {item.superMarket}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaUtensils className="text-xl text-violet-600" />
                      <p className="text-gray-700">
                        Restaurant{" "}
                        <span className="text-gray-500 font-bold">
                          {item.restaurant}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaTrainSubway className="text-xl text-violet-600" />
                      <p className="text-gray-700">
                        Métro{" "}
                        <span className="text-gray-500 font-bold">
                          {item.metro}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-[1px] bg-violet-600"></div>
              <p className="text-xl text-gray-800 px-2 capitalize">Map</p>
              <div className="w-full h-[1px] bg-violet-600"></div>
            </div>

            <div className="p-4 w-full h-[400px] rounded-lg z-10">
              {data &&
              data.latitude &&
              data.longitude &&
              typeof data.latitude === "number" &&
              typeof data.longitude === "number" ? (
                <Map
                  latitude={data.latitude}
                  longitude={data.longitude}
                  propertyId={parseInt(params.id)}
                />
              ) : (
                <p className="text-center text-gray-500">
                  Localisation non disponible
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center p-4 gap-2">
          <button
              title="Contacter"
              type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base shadow-md"
          >
            <MdChat className="flex-shrink-0 text-xl" />
            <p>Envoyer un message</p>
          </button>

          <button
              title="Mettre en favoris"
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base shadow-md"
            >
              <MdBookmark className="flex-shrink-0 text-xl" />
              <p>Mettre en favoris</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
