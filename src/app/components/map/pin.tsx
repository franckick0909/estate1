import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { Marker, Popup } from "react-leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Pin({
  latitude,
  longitude,
  img,
  title,
  id,
  chambres,
  salleDeBain,
  prix,
}: {
  latitude: number;
  longitude: number;
  img: string;
  title: string;
  id: number;
  chambres: number;
  salleDeBain: number;
  prix: number;
}) {
  return (
    <Marker position={[latitude, longitude]} icon={icon}>
      <Popup>
        <div className="grid grid-cols-2 gap-2 min-w-[200px]">
          <div className="flex justify-center items-center w-full h-full rounded-lg relative">
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/list/detail/${id}`}>{title}</Link>
            <span>{chambres} chambres</span>
            <span>{salleDeBain} salle de bain</span>
            <span>{prix} €</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
