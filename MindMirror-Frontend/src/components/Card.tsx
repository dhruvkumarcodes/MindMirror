import { ShareIcon } from "../icons/ShareIcon";
import { getYouTubeEmbedUrl } from "./YoutubeUrl";

interface CardProps {
    title: string;
    link: string;
    type?: "video" | "tweet" | "article";
}
export function Card({ title, link, type }: CardProps) {
    const videoEmbedUrl = getYouTubeEmbedUrl(link);
    return (
        <div>
            <div className=" bg-white  rounded-md border-gray-200  p-8 border max-w-72">
                <div className="flex justify-between ">
                    <div className="flex items-center text-md font-semibold">
                        <div className="text-gray-500 items-center pr-4">
                            <ShareIcon size="md" />
                        </div>
                        {title}
                    </div>

                    <div className="flex">
                        <div className="pr-2 text-gray-500">
                            <a href={link} target="-blank">
                                <ShareIcon size="md" />
                            </a>
                        </div>

                        <div className="text-gray-500">
                            <ShareIcon size="md" />
                        </div>
                    </div>
                </div>
                <div className="pt-4">

                    {type === "video" && videoEmbedUrl && (
                        <iframe
                            className="w-full aspect-video"
                            src={videoEmbedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    )}


                    {type === "tweet" && <blockquote className="twitter-tweet"><a href={link.replace("x.com", "twitter.com")}></a></blockquote>}

                </div>
            </div>

        </div>
    );
}