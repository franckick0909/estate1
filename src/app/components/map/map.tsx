"use client";

import { listData } from "@/app/data/listData";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Pin from "./pin";

interface MapProps {
  latitude: number;
  longitude: number;
  propertyId?: number; // Optionnel : si non fourni, affiche tous les pins
  showAllPins?: boolean; // Nouvelle prop pour contrôler l'affichage
}

export default function Map({
  latitude,
  longitude,
  propertyId,
  showAllPins = false,
}: MapProps) {
  // Si showAllPins est true OU si propertyId n'est pas fourni, on affiche tous les pins
  const pinsToShow =
    showAllPins || !propertyId
      ? listData
      : listData.filter((item) => item.id === propertyId);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-[100%] w-full rounded-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinsToShow.map((item) => (
          <Pin
            key={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            img={item.images[0].url}
            title={item.title}
            id={item.id}
            chambres={item.chambres}
            salleDeBain={item.salleDeBain}
            prix={item.prix}
          />
        ))}
      </MapContainer>
    </div>
  );
}
