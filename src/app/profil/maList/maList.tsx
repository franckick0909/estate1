import Card from "@/app/components/card";
import { listData } from "@/app/data/listData";




export default function maList() {
    return (
        <div className="flex flex-col gap-6">
            {listData.map((item) => (
                <Card key={item.id}
                {...item}
                images={item.images.map((image) => ({
                    id: image.id,
                    url: image.url,
                  }))}
                  />
            ))}
        </div>
    )
}
