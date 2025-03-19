import Image from "next/image";

export default function Film({data}) {
    console.log(data);
    const cover = data.media.find(item => item.type === "cover")?.url;
    const thumbnail = data.media.find(item => item.type === "thumbnail")?.url;
    const video_480 = data.media.find(item => item.type === "video_480  ")?.url;
    return (
        <div className="flex flex-col">
            <p>{data.title}</p>
            <p>{data.year}</p>
            <p>{data.duration}</p>
            <p>{data.description}</p>
            <p>{data.genres.map(g => g.name).join(", ")}</p>
            <p>{data.actors.map(a => a.name).join(", ")}</p>
            {cover && <Image src={cover} alt={data.title} width={500} height={500} />}
            {thumbnail && <Image src={thumbnail} alt={data.title} width={500} height={500}/>}
        </div>
    );
}