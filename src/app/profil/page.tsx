import { FaEdit, FaPlus } from "react-icons/fa";
import Image from "next/image";
import MaList from "./maList/maList";
import Chat from "../components/chat";

export default function Profil() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full h-full md:h-screen">
      <div className="flex-1 md:flex-[3] flex flex-col gap-4 px-2 bg-gradient-to-r from-violet-100 to-indigo-50 pt-10 w-full  md:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-violet-50 hover:scrollbar-thumb-violet-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full h-[calc(100%-0px)] pb-14 ">

        <div className="flex flex-col pr-4 rounded-md p-4">
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-[1px] bg-violet-600"></div>
            <h2 className="text-xl text-gray-800 px-2 whitespace-nowrap">
              Informations utilisateur
            </h2>
            <div className="w-full h-[1px] bg-violet-600"></div>
            <button
              title="Modifier"
              type="button"
              className="bg-violet-500 text-white px-4 py-2 rounded-md ml-2 flex items-center gap-2 hover:bg-transparent hover:text-violet-600 border border-violet-600 transition-colors"
            >
              <FaEdit />
              Modifier
            </button>
          </div>
        

        <div className="flex flex-col gap-4 text-gray-800 mt-8 px-1">
          <div className="flex items-center gap-2">
            <p>Avatar :</p>
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
              <Image
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="user"
                width={50}
                height={50}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p>Pseudonyme :</p>
            <p>
              <b>Jane Doe</b>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p>Email :</p>
            <p>
              <b>jane.doe@example.com</b>
            </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pr-4 rounded-md p-4 ">
          <div className="flex items-center justify-between w-full mb-8">
            <div className="w-8 h-[1px] bg-violet-600"></div>
            <h2 className="text-xl text-gray-800 px-2 whitespace-nowrap">
              Ma liste
            </h2>
            <div className="w-full h-[1px] bg-violet-600"></div>
            <button
              title="Modifier"
              type="button"
              className="bg-violet-500 text-white px-4 py-2 rounded-md ml-2 flex items-center gap-2 hover:bg-transparent hover:text-violet-600 border border-violet-600 transition-colors"
            >
              <FaPlus />
              Message
            </button>
          </div>
          <MaList />
        </div>
        <div className="flex flex-col gap-4 pr-4 mt-8 rounded-md p-4">
          <div className="flex items-center justify-between w-full mb-8">
            <div className="w-8 h-[1px] bg-violet-600"></div>
            <h2 className="text-xl text-gray-800 px-2 whitespace-nowrap">
              Liste de favoris
            </h2>
            <div className="w-full h-[1px] bg-violet-600"></div>
          </div>
          <MaList />
        </div>
      </div>

      <div className="flex-1 md:flex-[2] px-2 bg-gradient-to-b from-violet-100 to-indigo-50 pt-0 w-full">
        <Chat />
      </div>
    </div>
  );
}
