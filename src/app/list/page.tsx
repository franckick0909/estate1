import Card from "../components/card";
import Filter from "../components/filter";
import Map from "../components/map/map";
import { listData } from "../data/listData";

export default function List() {
  const data = listData;

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <div className="flex-1 md:flex-[3] px-2 bg-gradient-to-r from-violet-100 to-white pt-10 w-full">
        <div className="flex flex-col gap-4 w-full h-full pr-0 md:pr-4 md:h-[calc(100vh-100px)] md:pb-14 md:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-violet-50 hover:scrollbar-thumb-violet-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <Filter />
          <div className="flex flex-col gap-8 mt-8">
            {data?.map((item) => (
              <Card
                key={item.id}
                {...item}
                images={item.images.map((image) => ({
                  id: image.id,
                  url: image.url,
                }))}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-[2] bg-gradient-to-b from-violet-100 to-emerald-50 px-2 pt-10">
        <div className="h-[400px] md:h-[calc(100vh-100px)]">
          {data?.slice(0, 1).map((item) => (
            <Map
              key={item.id}
              latitude={item.latitude}
              longitude={item.longitude}
              propertyId={item.id}
              showAllPins={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
